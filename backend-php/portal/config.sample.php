<?php
// Copia este archivo a config.php (en la misma carpeta) y completa los valores reales.
// config.php NO debe subirse a git — ya está excluido en .gitignore.

define('DB_HOST', 'localhost');
define('DB_NAME', 'nombre_basedatos');
define('DB_USER', 'usuario_basedatos');
define('DB_PASS', 'clave_basedatos');

// Cadena larga y aleatoria, distinta en cada entorno.
define('JWT_SECRET', 'cambia-esto-por-una-cadena-larga-y-aleatoria');

// Clave de un solo uso para crear el primer administrador con seed-admin.php.
// Bórrala (o borra el archivo) después de usarla.
define('SETUP_KEY', 'cambia-esto-tambien');

// 'mock' mientras no tengas las credenciales de Microsoft Graph listas, 'graph' para producción real.
define('DOC_PROVIDER', 'mock');

// --- Microsoft Graph (SharePoint Online) ---
define('MS_TENANT_ID', '');
define('MS_CLIENT_ID', '');
define('MS_CLIENT_SECRET', '');
define('MS_SITE_HOSTNAME', '');   // ej: gruposg197.sharepoint.com
define('MS_SITE_PATH', '');      // ej: /sites/SGDGRUPOSG
define('MS_LIBRARY_NAME', 'Documentos');
define('MS_BASE_FOLDER_PATH', '01.CROMA_MEDICAL/B_LINEAS_DE_NEGOCIO/14_Croma_Medical-IPS');
