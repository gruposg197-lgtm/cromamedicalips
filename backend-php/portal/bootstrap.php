<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function read_json_body() {
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
