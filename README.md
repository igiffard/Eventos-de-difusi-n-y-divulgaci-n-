# Calendario de Eventos y Registro Histórico 2026

Aplicación web interactiva para la gestión de invitaciones, convocatorias científicas y académicas, registro histórico de asistencia, métricas institucionales, recordatorios y búsqueda avanzada por actividad y fechas.

## Automatización de Subida a GitHub y Despliegue en GitHub Pages (`deploy.sh`)

El proyecto incluye en el directorio raíz el script **`deploy.sh`**, el cual automatiza la verificación de tipos, la compilación optimizada de producción (`dist/`), el control de versiones con `git` y la publicación tanto en la rama principal (`main`) como en la rama `gh-pages`.

### Uso rápido de `deploy.sh`

1. **Vincular tu repositorio remoto y desplegar por primera vez:**
   ```bash
   ./deploy.sh --repo https://github.com/<usuario>/<repositorio>.git "feat: despliegue inicial del calendario 2026"
   ```

2. **Subir nuevas actualizaciones con un solo comando:**
   ```bash
   ./deploy.sh "actualización de eventos y registro histórico"
   ```
   O bien mediante `npm`:
   ```bash
   npm run deploy
   ```

3. **Solo subir a la rama principal (delegando la publicación a GitHub Actions):**
   ```bash
   ./deploy.sh --no-gh-pages "actualización de actividades"
   ```

### Optimizaciones incluidas para GitHub Pages y Google Sites
- **Rutas relativas (`base: './'` en `vite.config.ts`) y división de paquetes (`manualChunks`)**: Carga rápida de recursos desde subrutas (`https://<usuario>.github.io/<repositorio>/`) y compatibilidad total dentro de `iframe` en Google Sites.
- **Archivos `.nojekyll` y `404.html` automáticos**: Evitan el procesamiento Jekyll y aseguran que cualquier recarga o ruta funcione sin errores 404 en GitHub Pages.
- **Doble soporte de publicación en GitHub Pages**:
  - **Por GitHub Actions (`.github/workflows/deploy.yml`)**: Se ejecuta automáticamente en cada `git push` a `main` o `master`.
  - **Por rama `gh-pages` (`./deploy.sh`)**: Empaqueta y sube el contenido compilado de `dist/` directamente a la rama `gh-pages`.

### Presentación en Google Sites
1. Una vez ejecutado `./deploy.sh`, copia la URL pública de GitHub Pages (`https://<usuario>.github.io/<repositorio>/`).
2. En **Google Sites**, abre tu sitio, selecciona **Insertar > Por URL** (o agrega una **Página completa incorporada**) y pega la URL.
