#!/usr/bin/env bash
# ==============================================================================
# Archivo de Configuración y Automatización de Despliegue: deploy.sh
# Proyecto: Calendario de Eventos y Registro Histórico 2026
# Descripción: Automatiza la validación, compilación optimizada para producción,
#              subida de cambios al repositorio de GitHub mediante comandos git
#              y publicación en GitHub Pages (compatible con Google Sites).
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# 1. CONFIGURACIÓN GENERAL (Editable o configurable por variables de entorno)
# ------------------------------------------------------------------------------
DEFAULT_BRANCH="${DEPLOY_BRANCH:-main}"
GH_PAGES_BRANCH="${GH_PAGES_BRANCH:-gh-pages}"
REMOTE_NAME="${GIT_REMOTE:-origin}"
REMOTE_URL="${GIT_REPO_URL:-}"
BUILD_DIR="dist"
PUBLISH_GH_PAGES_BRANCH="${PUBLISH_GH_PAGES_BRANCH:-true}"

# Colores para la salida en terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# ------------------------------------------------------------------------------
# 2. PROCESAMIENTO DE ARGUMENTOS
# ------------------------------------------------------------------------------
COMMIT_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      COMMIT_MSG="$2"
      shift 2
      ;;
    -r|--repo)
      REMOTE_URL="$2"
      shift 2
      ;;
    -b|--branch)
      DEFAULT_BRANCH="$2"
      shift 2
      ;;
    --gh-pages)
      PUBLISH_GH_PAGES_BRANCH="true"
      shift
      ;;
    --no-gh-pages)
      PUBLISH_GH_PAGES_BRANCH="false"
      shift
      ;;
    -h|--help)
      echo "Uso: ./deploy.sh [opciones] [mensaje_de_commit]"
      echo ""
      echo "Opciones:"
      echo "  -m, --message <texto>   Mensaje personalizado para el commit de Git"
      echo "  -r, --repo <url>        URL del repositorio remoto de GitHub (ej. https://github.com/usuario/repo.git)"
      echo "  -b, --branch <rama>     Rama principal de código (por defecto: main)"
      echo "  --gh-pages              Despliega también la carpeta dist/ en la rama gh-pages (activo por defecto)"
      echo "  --no-gh-pages           Solo sube el código fuente a la rama principal (GitHub Actions hará el deploy)"
      echo "  -h, --help              Muestra esta ayuda"
      exit 0
      ;;
    *)
      if [[ -z "$COMMIT_MSG" ]]; then
        COMMIT_MSG="$1"
      fi
      shift
      ;;
  esac
done

if [[ -z "$COMMIT_MSG" ]]; then
  TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')
  COMMIT_MSG="chore(deploy): actualización del Calendario de Eventos 2026 [$TIMESTAMP]"
fi

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}  Iniciando despliegue automatizado a GitHub y GitHub Pages                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# ------------------------------------------------------------------------------
# 3. VERIFICACIÓN E INICIALIZACIÓN DE GIT
# ------------------------------------------------------------------------------
if ! command -v git &> /dev/null; then
  echo -e "${RED}[ERROR] Git no está instalado en el sistema.${NC}"
  exit 1
fi

if [[ ! -d ".git" ]]; then
  echo -e "${YELLOW}[INFO] Inicializando repositorio Git local...${NC}"
  git init
  git branch -M "$DEFAULT_BRANCH"
fi

# Configurar repositorio remoto si se proporcionó una URL
if [[ -n "$REMOTE_URL" ]]; then
  if git remote get-url "$REMOTE_NAME" &> /dev/null; then
    echo -e "${BLUE}[GIT] Actualizando URL del remoto '$REMOTE_NAME' -> $REMOTE_URL${NC}"
    git remote set-url "$REMOTE_NAME" "$REMOTE_URL"
  else
    echo -e "${BLUE}[GIT] Agregando remoto '$REMOTE_NAME' -> $REMOTE_URL${NC}"
    git remote add "$REMOTE_NAME" "$REMOTE_URL"
  fi
fi

# ------------------------------------------------------------------------------
# 4. COMPILACIÓN OPTIMIZADA PARA GITHUB PAGES Y GOOGLE SITES
# ------------------------------------------------------------------------------
echo -e "${BLUE}[BUILD] Verificando tipos de TypeScript...${NC}"
npm run lint

echo -e "${BLUE}[BUILD] Generando paquete optimizado de producción en ./${BUILD_DIR}...${NC}"
npm run build

# Garantizar archivos esenciales para GitHub Pages (.nojekyll y 404.html SPA fallback)
touch "${BUILD_DIR}/.nojekyll"
if [[ -f "${BUILD_DIR}/index.html" ]]; then
  cp "${BUILD_DIR}/index.html" "${BUILD_DIR}/404.html"
fi

echo -e "${GREEN}[OK] Compilación finalizada correctamente (.nojekyll y 404.html generados).${NC}"

# ------------------------------------------------------------------------------
# 5. SUBIDA DE CAMBIOS DEL CÓDIGO FUENTE A GITHUB
# ------------------------------------------------------------------------------
echo -e "${BLUE}[GIT] Preparando archivos del proyecto para commit...${NC}"
git add -A

if [[ -n "$(git status --porcelain)" ]]; then
  echo -e "${BLUE}[GIT] Creando commit: \"${COMMIT_MSG}\"${NC}"
  git commit -m "$COMMIT_MSG"
else
  echo -e "${YELLOW}[GIT] No hay cambios nuevos pendientes de commit en el código fuente.${NC}"
fi

# Verificar si existe el remoto configurado antes de hacer push
if git remote get-url "$REMOTE_NAME" &> /dev/null; then
  CURRENT_REMOTE_URL=$(git remote get-url "$REMOTE_NAME")
  echo -e "${BLUE}[GIT] Subiendo rama '${DEFAULT_BRANCH}' a ${CURRENT_REMOTE_URL}...${NC}"
  git branch -M "$DEFAULT_BRANCH"
  git push -u "$REMOTE_NAME" "$DEFAULT_BRANCH"
  echo -e "${GREEN}[OK] Código fuente sincronizado exitosamente en '${DEFAULT_BRANCH}'.${NC}"

  # ----------------------------------------------------------------------------
  # 6. DESPLIEGUE DIRECTO DEL BUILD A LA RAMA gh-pages (OPCIONAL / ACTIVO)
  # ----------------------------------------------------------------------------
  if [[ "$PUBLISH_GH_PAGES_BRANCH" == "true" ]]; then
    echo -e "${BLUE}[PAGES] Publicando paquete compilado (${BUILD_DIR}/) en la rama '${GH_PAGES_BRANCH}'...${NC}"
    (
      cd "$BUILD_DIR"
      rm -rf .git
      git init
      git checkout -b "$GH_PAGES_BRANCH"
      git add -A
      git commit -m "deploy(gh-pages): build optimizado [$COMMIT_MSG]"
      git push -f "$CURRENT_REMOTE_URL" "HEAD:${GH_PAGES_BRANCH}"
      rm -rf .git
    )
    echo -e "${GREEN}[OK] Rama '${GH_PAGES_BRANCH}' actualizada con la versión lista para producción.${NC}"
  fi

  echo -e "${GREEN}==============================================================================${NC}"
  echo -e "${GREEN}  ¡Despliegue completado con éxito!                                           ${NC}"
  echo -e "${GREEN}  - Rama principal subida: ${DEFAULT_BRANCH} (activa GitHub Actions)          ${NC}"
  if [[ "$PUBLISH_GH_PAGES_BRANCH" == "true" ]]; then
    echo -e "${GREEN}  - Rama de publicación:   ${GH_PAGES_BRANCH} (lista para GitHub Pages)       ${NC}"
  fi
  echo -e "${GREEN}==============================================================================${NC}"
else
  echo -e "${YELLOW}==============================================================================${NC}"
  echo -e "${YELLOW}  [AVISO] Los cambios fueron compilados y confirmados localmente en Git,      ${NC}"
  echo -e "${YELLOW}  pero aún no se ha configurado la URL del repositorio remoto de GitHub.      ${NC}"
  echo -e "${YELLOW}                                                                              ${NC}"
  echo -e "${YELLOW}  Para vincular tu repositorio y subir los cambios, ejecuta:                  ${NC}"
  echo -e "${YELLOW}    ./deploy.sh --repo https://github.com/TU_USUARIO/TU_REPOSITORIO.git       ${NC}"
  echo -e "${YELLOW}==============================================================================${NC}"
fi
