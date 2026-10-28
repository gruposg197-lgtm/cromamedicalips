<?php
define('CROMA_API', true);
require __DIR__ . '/../mailer.php';

handle_form_submission('contacto', 'direccion.medica@cromamedical.com', ['name', 'doc', 'phone', 'email', 'program', 'message']);
