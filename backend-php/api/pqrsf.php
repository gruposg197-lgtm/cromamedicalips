<?php
define('CROMA_API', true);
require __DIR__ . '/../mailer.php';

handle_form_submission('PQRSF', 'calidad@cromamedical.com', ['name', 'doc', 'phone', 'email', 'tipo', 'message']);
