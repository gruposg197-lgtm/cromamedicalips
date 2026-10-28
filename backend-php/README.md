# Backend PHP (producción en cPanel)

Esta carpeta es la versión definitiva de los endpoints de los formularios, pensada para subirse
tal cual al hosting cPanel. Usa `mail()` nativo de PHP, disponible por defecto en prácticamente
todo hosting compartido — no requiere librerías externas ni credenciales SMTP.

## Despliegue

1. Sube toda la carpeta `backend-php/` al hosting, por ejemplo dentro de `public_html/api/`
   (puedes subir solo el contenido: `mailer.php`, `api/contacto.php`, `api/pqrsf.php`).
2. Verifica que la ruta final quede accesible como:
   - `https://cromamedical.com/api/contacto.php`
   - `https://cromamedical.com/api/pqrsf.php`
3. En `mailer.php`, cambia `Access-Control-Allow-Origin: *` por el dominio real del sitio
   (ej. `https://cromamedical.com`) para restringir quién puede llamar al endpoint.
4. En el proyecto del frontend, define las variables de entorno antes de compilar
   (`.env.production` en la raíz del proyecto React):
   ```
   VITE_CONTACTO_ENDPOINT=https://cromamedical.com/api/contacto.php
   VITE_PQRSF_ENDPOINT=https://cromamedical.com/api/pqrsf.php
   ```
5. Vuelve a correr `npm run build` para que el sitio apunte al backend real.

## Notas

- `mail()` en cPanel normalmente entrega bien a correos del mismo dominio (como
  `comercial@cromamedical.com` o `calidad@cromamedical.com`). Si ves que los correos llegan a
  spam o no llegan, lo más robusto es cambiar `mail()` por SMTP autenticado (PHPMailer + las
  credenciales de la cuenta de correo del hosting) — avísame si quieres que lo monte así.
- Cada formulario valida campos obligatorios y formato de correo antes de enviar.
