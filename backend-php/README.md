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

---

## Portal (admin, pacientes y empresas) — carpeta `portal/`

Es el backend del Portal de pacientes: login, administrador global que crea usuarios de
pacientes/empresas, y listado de los últimos conceptos médicos buscados por número de cédula
(nombre de carpeta) en la biblioteca documental de SharePoint ("SGD GRUPO SG").

### 1. Base de datos

En el cPanel, crea la única base de datos MySQL disponible en el plan (phpMyAdmin → "Bases de
datos" → MySQL), impórtale `portal/schema.sql`, y anota usuario/clave/nombre de la base de datos.

### 2. Configuración

1. Copia `portal/config.sample.php` a `portal/config.php` (este archivo NO se sube a git).
2. Completa `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` con los datos de phpMyAdmin.
3. Genera una cadena aleatoria larga para `JWT_SECRET` y otra distinta para `SETUP_KEY`.
4. Deja `DOC_PROVIDER` en `'mock'` hasta tener las credenciales de Microsoft Graph (ver abajo);
   mientras tanto puedes usar la carpeta `portal/mock-sgd/<cedula>/archivo.pdf` de ejemplo
   (misma estructura que `backend/mock-sgd` del backend de prueba local).

### 3. Subir y crear el administrador

1. Sube toda la carpeta `backend-php/portal/` al hosting, por ejemplo a `public_html/api/portal/`.
2. Visita una sola vez, reemplazando los valores:
   ```
   https://cromamedical.com/api/portal/seed-admin.php?key=TU_SETUP_KEY&username=admin&password=TuClaveSegura
   ```
3. **Borra `seed-admin.php` del servidor inmediatamente después** (o al menos cambia `SETUP_KEY`),
   para que nadie más pueda crear administradores.
4. Verifica que `https://cromamedical.com/api/portal/` responda (requiere el `.htaccess` incluido,
   que depende de `mod_rewrite` — está activo por defecto en cPanel).

### 4. Variables del frontend

En `.env.production` del proyecto React:
```
VITE_PORTAL_API=https://cromamedical.com/api/portal
```
Vuelve a correr `npm run build`.

### 5. Conectar SharePoint real (Microsoft Graph) — cuando tengas acceso a Azure AD

1. Entra a **Azure Portal → Microsoft Entra ID → Registros de aplicaciones → Nuevo registro**.
   Dale un nombre (ej. "Croma Medical Portal") y crea el registro.
2. Copia el **Tenant ID** (ID de directorio) y el **Client ID** (ID de aplicación) que aparecen
   en la página de resumen → van en `MS_TENANT_ID` y `MS_CLIENT_ID`.
3. Ve a **Certificados y secretos → Nuevo secreto de cliente**, créalo y copia el **valor** (solo
   se muestra una vez) → va en `MS_CLIENT_SECRET`.
4. Ve a **Permisos de API → Agregar un permiso → Microsoft Graph → Permisos de aplicación** y
   agrega `Sites.Read.All`. Luego pulsa **"Conceder consentimiento de administrador"** (necesitas
   ser administrador global o de aplicaciones del tenant de Microsoft 365).
5. Completa en `config.php`:
   - `MS_SITE_HOSTNAME`: el dominio de SharePoint, ej. `gruposg197.sharepoint.com`
   - `MS_SITE_PATH`: la ruta del sitio, ej. `/sites/SGDGRUPOSG`
   - `MS_LIBRARY_NAME`: el nombre de la biblioteca de documentos, normalmente `Documentos`
   - `MS_BASE_FOLDER_PATH`: `01.CROMA_MEDICAL/B_LINEAS_DE_NEGOCIO/14_Croma_Medical-IPS`
6. Cambia `DOC_PROVIDER` a `'graph'`.

Con `Sites.Read.All` la aplicación puede leer **todos** los sitios de SharePoint del tenant (de
solo lectura). Si más adelante quieres restringirla a un único sitio (más seguro), se usa el
permiso `Sites.Selected` más un paso adicional de autorización por sitio vía Graph API o
PowerShell — avísame si quieres que lo configuremos así.

### Cómo funciona la búsqueda por cédula

Dentro de `MS_BASE_FOLDER_PATH` las carpetas de cada paciente siguen el patrón real usado en SGD:
**`CC {cédula} - {nombre}`** (ej. `CC 1007106612 BRIGITH TATIANA LUGO TELLEZ`), anidadas en
cualquier nivel de la estructura (aseguradora/programa/año/mes). Por eso el sistema no asume una
ruta fija: usa la búsqueda recursiva de Microsoft Graph para encontrar, en todo el árbol de esa
carpeta base, cualquier carpeta cuyo nombre empiece por "CC" y contenga la cédula exacta del
paciente (la misma que registra el administrador al crear el usuario). Puede haber varias
carpetas para la misma persona (una por caso/episodio); se reúnen los archivos de todas, se
eliminan duplicados y se ordenan por fecha de modificación, mostrando los más recientes primero.
