# Cholumusica

Aplicación web para compartir música con autenticación, subida de archivos y playlists.

## Requisitos

- Node.js 18+
- npm

## Instalación

1. Abre una terminal en la carpeta del proyecto.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

La app quedará disponible en `http://localhost:3000`.

## Variables de entorno

Configura `DATABASE_URL` y `SESSION_SECRET` en `.env` local o en las variables del servicio de Render. No subas contraseñas al repositorio.
Antes del primer arranque en una base nueva, ejecuta `npm run db:generate` y `npm run db:push` con `DATABASE_URL` apuntando a esa base.

```env
ADMIN_USERNAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Al definir las tres variables de administrador, el servidor crea esa cuenta en la base de datos configurada al iniciar. La contraseña debe tener al menos 12 caracteres y se guarda con bcrypt. En siguientes reinicios no se cambia la contraseña existente. Si la cuenta ya existe con ese nombre y correo, se asegura el rol de administrador.

En la aplicación raíz, el acceso de administrador también requiere configurar `ADMIN_CODE_HASH`, que corresponde al código de segundo paso.

## Funcionalidades principales

- Registro e inicio de sesión con sesiones.
- Subida de archivos de audio válidos con validación real del MIME.
- Biblioteca pública con reproductores de audio.
- Gestión de playlists por usuario autenticado.
- Reproducción secuencial desde una playlist.
- Eliminación segura de canciones y playlists.
- Búsqueda por título o artista.

## Estructura principal

- `server.js` — arranque del servidor y rutas principales.
- `database.js` — conexión y acceso a SQLite/Prisma.
- `routes/` — autenticación, canciones y playlists.
- `uploads/` — archivos de audio subidos.
- `views/` — plantillas EJS.
