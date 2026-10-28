<?php
require_once __DIR__ . '/config.php';

function hash_password($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function sign_token($payload) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload['exp'] = time() + 8 * 60 * 60;
    $headerPart = base64url_encode(json_encode($header));
    $payloadPart = base64url_encode(json_encode($payload));
    $signature = base64url_encode(hash_hmac('sha256', "$headerPart.$payloadPart", JWT_SECRET, true));
    return "$headerPart.$payloadPart.$signature";
}

function verify_token($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$headerPart, $payloadPart, $signature] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$headerPart.$payloadPart", JWT_SECRET, true));
    if (!hash_equals($expected, $signature)) return null;
    $payload = json_decode(base64url_decode($payloadPart), true);
    if (!$payload || (isset($payload['exp']) && time() > $payload['exp'])) return null;
    return $payload;
}

function get_bearer_token() {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
    if (strpos($auth, 'Bearer ') === 0) {
        return substr($auth, 7);
    }
    return null;
}

function require_auth($allowedRoles = null) {
    $token = get_bearer_token();
    $payload = $token ? verify_token($token) : null;
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado']);
        exit;
    }
    if ($allowedRoles && !in_array($payload['role'], $allowedRoles, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }
    return $payload;
}
