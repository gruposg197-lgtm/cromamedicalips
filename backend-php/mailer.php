<?php
if (!defined('CROMA_API')) {
    http_response_code(403);
    exit;
}

function handle_form_submission($form, $to, $requiredFields) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
        exit;
    }

    $missing = array_values(array_filter($requiredFields, function ($field) use ($data) {
        return empty($data[$field]);
    }));
    if ($missing) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan campos: ' . implode(', ', $missing)]);
        exit;
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Correo inválido']);
        exit;
    }

    $subject = '[Croma Medical] Nueva solicitud de ' . $form;

    $lines = [];
    foreach ($data as $key => $value) {
        if (is_scalar($value)) {
            $lines[] = $key . ': ' . $value;
        }
    }
    $body = implode("\n", $lines);

    $headers = implode("\r\n", [
        'From: Sitio web Croma Medical <no-reply@cromamedical.com>',
        'Reply-To: ' . $data['email'],
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    $sent = @mail($to, $subject, $body, $headers);

    if ($sent) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo enviar el correo']);
    }
}
