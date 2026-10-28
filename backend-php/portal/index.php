<?php
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/docs-provider.php';

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$portalPos = strpos($requestPath, '/portal');
$path = $portalPos !== false ? substr($requestPath, $portalPos + strlen('/portal')) : $requestPath;
$path = rtrim($path, '/');
if ($path === '') $path = '/';
$method = $_SERVER['REQUEST_METHOD'];

// POST /login
if ($method === 'POST' && $path === '/login') {
    $body = read_json_body();
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';
    if (!$username || !$password) respond(['error' => 'Usuario y clave son obligatorios'], 400);

    $stmt = get_db()->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if (!$user || !verify_password($password, $user['password_hash'])) {
        respond(['error' => 'Usuario o clave incorrectos'], 401);
    }
    $token = sign_token(['id' => (int) $user['id'], 'role' => $user['role'], 'name' => $user['full_name']]);
    respond(['token' => $token, 'role' => $user['role'], 'name' => $user['full_name']]);
}

// GET /me
if ($method === 'GET' && $path === '/me') {
    $user = require_auth();
    respond(['id' => $user['id'], 'role' => $user['role'], 'name' => $user['name']]);
}

// GET /admin/users
if ($method === 'GET' && $path === '/admin/users') {
    require_auth(['admin']);
    $db = get_db();
    $users = $db->query("SELECT id, username, full_name, role, cedula, created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC")->fetchAll();
    $cedulaStmt = $db->prepare('SELECT cedula, nombre FROM company_patients WHERE company_user_id = ?');
    foreach ($users as &$u) {
        if ($u['role'] === 'company') {
            $cedulaStmt->execute([$u['id']]);
            $u['cedulas'] = $cedulaStmt->fetchAll();
        }
    }
    unset($u);
    respond(['users' => $users]);
}

// POST /admin/users/patient
if ($method === 'POST' && $path === '/admin/users/patient') {
    require_auth(['admin']);
    $body = read_json_body();
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';
    $fullName = $body['fullName'] ?? '';
    $cedula = $body['cedula'] ?? '';
    if (!$username || !$password || !$fullName || !$cedula) {
        respond(['error' => 'Faltan campos obligatorios'], 400);
    }
    try {
        $stmt = get_db()->prepare('INSERT INTO users (username, password_hash, role, full_name, cedula) VALUES (?, ?, "patient", ?, ?)');
        $stmt->execute([$username, hash_password($password), $fullName, $cedula]);
        respond(['ok' => true, 'id' => (int) get_db()->lastInsertId()]);
    } catch (Exception $e) {
        respond(['error' => 'El usuario ya existe'], 400);
    }
}

// POST /admin/users/company
if ($method === 'POST' && $path === '/admin/users/company') {
    require_auth(['admin']);
    $body = read_json_body();
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';
    $companyName = $body['companyName'] ?? '';
    $cedulas = $body['cedulas'] ?? [];
    if (!$username || !$password || !$companyName || !is_array($cedulas) || count($cedulas) === 0) {
        respond(['error' => 'Faltan campos obligatorios o no hay cédulas asociadas'], 400);
    }
    $db = get_db();
    try {
        $db->beginTransaction();
        $stmt = $db->prepare('INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, "company", ?)');
        $stmt->execute([$username, hash_password($password), $companyName]);
        $companyId = (int) $db->lastInsertId();
        $insertCedula = $db->prepare('INSERT INTO company_patients (company_user_id, cedula, nombre) VALUES (?, ?, ?)');
        foreach ($cedulas as $c) {
            if (!empty($c['cedula'])) {
                $insertCedula->execute([$companyId, $c['cedula'], $c['nombre'] ?? $c['cedula']]);
            }
        }
        $db->commit();
        respond(['ok' => true, 'id' => $companyId]);
    } catch (Exception $e) {
        $db->rollBack();
        respond(['error' => 'El usuario ya existe'], 400);
    }
}

// DELETE /admin/users/{id}
if ($method === 'DELETE' && preg_match('#^/admin/users/(\d+)$#', $path, $m)) {
    require_auth(['admin']);
    $id = (int) $m[1];
    $db = get_db();
    $db->prepare('DELETE FROM company_patients WHERE company_user_id = ?')->execute([$id]);
    $db->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'")->execute([$id]);
    respond(['ok' => true]);
}

// PUT /admin/users/{id}
if ($method === 'PUT' && preg_match('#^/admin/users/(\d+)$#', $path, $m)) {
    require_auth(['admin']);
    $id = (int) $m[1];
    $db = get_db();

    $stmt = $db->prepare("SELECT * FROM users WHERE id = ? AND role != 'admin'");
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    if (!$user) respond(['error' => 'Usuario no encontrado'], 404);

    $body = read_json_body();

    if ($user['role'] === 'patient') {
        $fullName = $body['fullName'] ?? '';
        $cedula = $body['cedula'] ?? '';
        if (!$fullName || !$cedula) respond(['error' => 'Faltan campos obligatorios'], 400);
        $db->prepare('UPDATE users SET full_name = ?, cedula = ? WHERE id = ?')->execute([$fullName, $cedula, $id]);
    } else {
        $companyName = $body['companyName'] ?? '';
        $cedulas = $body['cedulas'] ?? [];
        if (!$companyName || !is_array($cedulas) || count($cedulas) === 0) {
            respond(['error' => 'Faltan campos obligatorios o no hay cédulas asociadas'], 400);
        }
        $db->prepare('UPDATE users SET full_name = ? WHERE id = ?')->execute([$companyName, $id]);
        $db->prepare('DELETE FROM company_patients WHERE company_user_id = ?')->execute([$id]);
        $insertCedula = $db->prepare('INSERT INTO company_patients (company_user_id, cedula, nombre) VALUES (?, ?, ?)');
        foreach ($cedulas as $c) {
            if (!empty($c['cedula'])) {
                $insertCedula->execute([$id, $c['cedula'], $c['nombre'] ?? $c['cedula']]);
            }
        }
    }
    respond(['ok' => true]);
}

// POST /admin/users/{id}/reset-password
if ($method === 'POST' && preg_match('#^/admin/users/(\d+)/reset-password$#', $path, $m)) {
    require_auth(['admin']);
    $id = (int) $m[1];
    $body = read_json_body();
    $password = $body['password'] ?? '';
    if (!$password || strlen($password) < 6) {
        respond(['error' => 'La clave debe tener al menos 6 caracteres'], 400);
    }
    $db = get_db();
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ? AND role != 'admin'");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) respond(['error' => 'Usuario no encontrado'], 404);

    $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([hash_password($password), $id]);
    respond(['ok' => true]);
}

// GET /patient/documents
if ($method === 'GET' && $path === '/patient/documents') {
    $user = require_auth(['patient']);
    $stmt = get_db()->prepare('SELECT cedula FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();
    try {
        $documents = list_latest_documents($row['cedula'], 10);
        respond(['cedula' => $row['cedula'], 'documents' => $documents]);
    } catch (Exception $e) {
        respond(['error' => 'No se pudieron cargar los documentos'], 500);
    }
}

// GET /company/documents
if ($method === 'GET' && $path === '/company/documents') {
    $user = require_auth(['company']);
    $stmt = get_db()->prepare('SELECT cedula, nombre FROM company_patients WHERE company_user_id = ?');
    $stmt->execute([$user['id']]);
    $rows = $stmt->fetchAll();
    try {
        $employees = [];
        foreach ($rows as $r) {
            $employees[] = [
                'cedula' => $r['cedula'],
                'nombre' => $r['nombre'],
                'documents' => list_latest_documents($r['cedula'], 5),
            ];
        }
        respond(['employees' => $employees]);
    } catch (Exception $e) {
        respond(['error' => 'No se pudieron cargar los documentos'], 500);
    }
}

// POST /patient/documents/preview
if ($method === 'POST' && $path === '/patient/documents/preview') {
    $user = require_auth(['patient']);
    $body = read_json_body();
    $documentId = $body['documentId'] ?? '';
    if (!$documentId) respond(['error' => 'Falta documentId'], 400);

    $stmt = get_db()->prepare('SELECT cedula FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();
    try {
        respond(get_document_preview($row['cedula'], $documentId));
    } catch (Exception $e) {
        respond(['error' => $e->getMessage() ?: 'No se pudo generar la vista previa'], 500);
    }
}

// POST /company/documents/preview
if ($method === 'POST' && $path === '/company/documents/preview') {
    $user = require_auth(['company']);
    $body = read_json_body();
    $cedula = $body['cedula'] ?? '';
    $documentId = $body['documentId'] ?? '';
    if (!$cedula || !$documentId) respond(['error' => 'Faltan datos'], 400);

    $stmt = get_db()->prepare('SELECT 1 FROM company_patients WHERE company_user_id = ? AND cedula = ?');
    $stmt->execute([$user['id'], $cedula]);
    if (!$stmt->fetch()) respond(['error' => 'No autorizado'], 403);

    try {
        respond(get_document_preview($cedula, $documentId));
    } catch (Exception $e) {
        respond(['error' => $e->getMessage() ?: 'No se pudo generar la vista previa'], 500);
    }
}

respond(['error' => 'Ruta no encontrada'], 404);
