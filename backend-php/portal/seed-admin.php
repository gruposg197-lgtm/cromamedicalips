<?php
// Visítalo UNA SOLA VEZ para crear el administrador inicial:
//   https://tu-dominio.com/api/portal/seed-admin.php?key=TU_SETUP_KEY&username=admin&password=TuClaveSegura
// Después, BORRA este archivo del servidor.

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

header('Content-Type: text/plain; charset=utf-8');

if (!defined('SETUP_KEY') || !isset($_GET['key']) || $_GET['key'] !== SETUP_KEY) {
    http_response_code(403);
    echo "Acceso denegado.";
    exit;
}

$db = get_db();
$existing = $db->query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")->fetch();
if ($existing) {
    echo "Ya existe un administrador. Por seguridad, borra este archivo (seed-admin.php) ahora.";
    exit;
}

$username = $_GET['username'] ?? 'admin';
$password = $_GET['password'] ?? null;
if (!$password) {
    echo "Falta el parámetro 'password' en la URL.";
    exit;
}

$stmt = $db->prepare('INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, "admin", ?)');
$stmt->execute([$username, hash_password($password), 'Administrador Croma Medical']);

echo "Administrador creado: $username\n";
echo "IMPORTANTE: borra este archivo (seed-admin.php) del servidor ahora mismo.";
