<?php
require_once __DIR__ . '/config.php';

function list_latest_documents($cedula, $limit = 5) {
    if (DOC_PROVIDER === 'graph') {
        return list_graph_documents($cedula, $limit);
    }
    return list_mock_documents($cedula, $limit);
}

function list_mock_documents($cedula, $limit) {
    $folder = __DIR__ . '/mock-sgd/' . basename($cedula);
    if (!is_dir($folder)) return [];
    $files = array_values(array_filter(scandir($folder), function ($f) {
        return $f !== '.' && $f !== '..';
    }));
    $docs = array_map(function ($name) use ($folder) {
        $path = $folder . '/' . $name;
        return [
            'id' => $name,
            'name' => $name,
            'modifiedAt' => date('c', filemtime($path)),
            'sizeKb' => max(1, (int) round(filesize($path) / 1024)),
        ];
    }, $files);
    usort($docs, function ($a, $b) {
        return strcmp($b['modifiedAt'], $a['modifiedAt']);
    });
    return array_slice($docs, 0, $limit);
}

// --- Microsoft Graph (SharePoint Online) ---
function get_graph_token() {
    static $cache = null;
    if ($cache && $cache['expires'] > time() + 30) {
        return $cache['token'];
    }
    $ch = curl_init('https://login.microsoftonline.com/' . MS_TENANT_ID . '/oauth2/v2.0/token');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'client_id' => MS_CLIENT_ID,
            'client_secret' => MS_CLIENT_SECRET,
            'scope' => 'https://graph.microsoft.com/.default',
            'grant_type' => 'client_credentials',
        ]),
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status >= 300) {
        throw new Exception('No se pudo autenticar con Microsoft Graph: ' . $response);
    }
    $data = json_decode($response, true);
    $cache = ['token' => $data['access_token'], 'expires' => time() + $data['expires_in']];
    return $cache['token'];
}

function graph_get($url, $token) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Authorization: Bearer $token"],
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, json_decode($response, true)];
}

function graph_post($url, $token, $body = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_HTTPHEADER => ["Authorization: Bearer $token", 'Content-Type: application/json'],
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, json_decode($response, true)];
}

function get_site_drive_id($token) {
    static $driveId = null;
    if ($driveId) return $driveId;

    $hostname = MS_SITE_HOSTNAME;
    $sitePath = MS_SITE_PATH;
    [$status, $site] = graph_get("https://graph.microsoft.com/v1.0/sites/$hostname:$sitePath", $token);
    if ($status >= 300) throw new Exception('No se pudo resolver el sitio de SharePoint');

    [$status, $drives] = graph_get("https://graph.microsoft.com/v1.0/sites/{$site['id']}/drives", $token);
    if ($status >= 300) throw new Exception('No se pudieron listar las bibliotecas del sitio');

    $libraryName = defined('MS_LIBRARY_NAME') ? MS_LIBRARY_NAME : 'Documents';
    $drive = null;
    foreach ($drives['value'] as $d) {
        if ($d['name'] === $libraryName) {
            $drive = $d;
            break;
        }
    }
    $drive = $drive ?: ($drives['value'][0] ?? null);
    if (!$drive) throw new Exception('No se encontró la biblioteca de documentos indicada');

    $driveId = $drive['id'];
    return $driveId;
}

function get_base_folder_id($token, $driveId) {
    static $baseFolderId = null;
    if ($baseFolderId) return $baseFolderId;

    $basePath = defined('MS_BASE_FOLDER_PATH') ? MS_BASE_FOLDER_PATH : '';
    $encodedPath = implode('/', array_map('rawurlencode', explode('/', trim($basePath, '/'))));
    [$status, $item] = graph_get("https://graph.microsoft.com/v1.0/drives/$driveId/root:/$encodedPath", $token);
    if ($status >= 300) throw new Exception('No se pudo resolver la carpeta base');

    $baseFolderId = $item['id'];
    return $baseFolderId;
}

function map_file_item($item) {
    return [
        'id' => $item['id'],
        'name' => $item['name'],
        'modifiedAt' => $item['lastModifiedDateTime'],
        'sizeKb' => max(1, (int) round($item['size'] / 1024)),
        'viewUrl' => $item['webUrl'] ?? null,
        'downloadUrl' => $item['@microsoft.graph.downloadUrl'] ?? null,
    ];
}

// Extracción ligera de texto de PDF (sin librerías externas): descomprime los streams
// FlateDecode y recupera los fragmentos entre paréntesis de los operadores Tj/TJ.
function extract_text_from_pdf($bytes) {
    $text = '';
    if (preg_match_all('/stream\r?\n(.*?)endstream/s', $bytes, $matches)) {
        foreach ($matches[1] as $stream) {
            $decoded = @gzuncompress(rtrim($stream, "\r\n"));
            if ($decoded === false) continue;
            if (preg_match_all('/\((?:[^()\\\\]|\\\\.)*\)/', $decoded, $parts)) {
                foreach ($parts[0] as $part) {
                    $clean = substr($part, 1, -1);
                    $clean = str_replace(['\\(', '\\)', '\\\\'], ['(', ')', '\\'], $clean);
                    $text .= $clean . ' ';
                }
            }
        }
    }
    return $text;
}

// Los documentos clínicos de Croma Medical terminan con una línea de firma electrónica,
// p.ej.: "Firmado Electrónicamente: MD RODRIGO ALEJANDRO MÉNDEZ GUZMÁN, CC 1032395042".
function extract_professional_name($bytes) {
    $text = extract_text_from_pdf($bytes);
    if (preg_match('/Firmado\s+Electr[oó]nicamente:\s*(?:MD\s+)?([A-ZÁÉÍÓÚÑ.\s]{4,80}?)\s*,\s*CC/iu', $text, $m)) {
        return trim(preg_replace('/\s+/', ' ', $m[1]));
    }
    return null;
}

function fetch_professional_from_pdf($downloadUrl) {
    $ch = curl_init($downloadUrl);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true]);
    $bytes = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status >= 300 || !$bytes) return null;
    try {
        return extract_professional_name($bytes);
    } catch (Exception $e) {
        return null;
    }
}

// Excluye documentos administrativos (autorizaciones y hojas de asistencia) según la
// nomenclatura del instructivo de facturación: solo deben quedar los conceptos médicos
// (historias clínicas, evoluciones, actas, etc.).
function is_administrative_document($name) {
    $upper = strtoupper(trim($name));
    return strpos($upper, 'AUT') === 0 || strpos($upper, 'AS-') === 0;
}

function is_patient_folder($item, $cedula) {
    if (!isset($item['folder'])) return false;
    $name = strtoupper(trim($item['name']));
    return strpos($name, 'CC') === 0 && strpos($name, $cedula) !== false;
}

function get_children($token, $driveId, $itemId) {
    [$status, $data] = graph_get("https://graph.microsoft.com/v1.0/drives/$driveId/items/$itemId/children?\$top=200", $token);
    if ($status >= 300) throw new Exception('No se pudo listar el contenido de la carpeta');
    return $data['value'] ?? [];
}

// Las carpetas de cada paciente siguen el patrón "CC {cedula} - {nombre}" y pueden estar
// anidadas en cualquier nivel (aseguradora/programa/año/mes), así que en vez de asumir una
// ruta fija, se busca el nombre de la carpeta en todo el árbol documental.
function list_graph_documents($cedula, $limit) {
    $token = get_graph_token();
    $driveId = get_site_drive_id($token);
    $baseFolderId = get_base_folder_id($token, $driveId);

    $query = rawurlencode($cedula);
    [$status, $searchData] = graph_get(
        "https://graph.microsoft.com/v1.0/drives/$driveId/items/$baseFolderId/search(q='$query')",
        $token
    );
    if ($status >= 300) throw new Exception('No se pudo buscar la carpeta del paciente');

    $patientFolders = array_filter($searchData['value'] ?? [], function ($item) use ($cedula) {
        return is_patient_folder($item, $cedula);
    });

    $files = [];
    foreach ($patientFolders as $folder) {
        $children = get_children($token, $driveId, $folder['id']);
        foreach ($children as $child) {
            if (isset($child['file'])) {
                if (!is_administrative_document($child['name'])) $files[] = $child;
            } elseif (isset($child['folder'])) {
                $grandchildren = get_children($token, $driveId, $child['id']);
                foreach ($grandchildren as $gc) {
                    if (isset($gc['file']) && !is_administrative_document($gc['name'])) $files[] = $gc;
                }
            }
        }
    }

    $seen = [];
    $unique = [];
    foreach ($files as $f) {
        if (isset($seen[$f['id']])) continue;
        $seen[$f['id']] = true;
        $unique[] = $f;
    }

    usort($unique, function ($a, $b) {
        return strcmp($b['lastModifiedDateTime'], $a['lastModifiedDateTime']);
    });

    $limited = array_slice($unique, 0, $limit);
    $mapped = [];
    foreach ($limited as $item) {
        $doc = map_file_item($item);
        if (preg_match('/\.pdf$/i', $item['name']) && $doc['downloadUrl']) {
            $doc['medico'] = fetch_professional_from_pdf($doc['downloadUrl']);
        }
        $mapped[] = $doc;
    }
    return $mapped;
}

function get_mock_preview($cedula, $documentId) {
    $folder = realpath(__DIR__ . '/mock-sgd/' . basename($cedula));
    $filePath = $folder ? $folder . '/' . basename($documentId) : null;
    if (!$folder || !$filePath || !file_exists($filePath)) {
        throw new Exception('Documento no encontrado');
    }
    return ['kind' => 'text', 'content' => file_get_contents($filePath)];
}

function get_graph_preview($cedula, $documentId) {
    // Verifica que el documento solicitado realmente pertenezca a esta cédula antes de generar la vista previa.
    $docs = list_graph_documents($cedula, 200);
    $match = null;
    foreach ($docs as $d) {
        if ($d['id'] === $documentId) {
            $match = $d;
            break;
        }
    }
    if (!$match) throw new Exception('Documento no encontrado');

    $token = get_graph_token();
    $driveId = get_site_drive_id($token);
    [$status, $data] = graph_post("https://graph.microsoft.com/v1.0/drives/$driveId/items/$documentId/preview", $token, new stdClass());
    if ($status >= 300) throw new Exception('No se pudo generar la vista previa');

    return ['kind' => 'iframe', 'url' => $data['getUrl'] ?? null];
}

function get_document_preview($cedula, $documentId) {
    if (DOC_PROVIDER === 'graph') {
        return get_graph_preview($cedula, $documentId);
    }
    return get_mock_preview($cedula, $documentId);
}
