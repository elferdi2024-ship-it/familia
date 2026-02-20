#!/bin/bash

# ============================================
# ATLANTIDA PLATFORM - SCRIPT DE MIGRACIÓN
# Convierte familia-main a Turborepo Monorepo
# ============================================

set -e  # Detener en cualquier error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  MIGRACIÓN A TURBOREPO - MiBarrio.uy  ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# ============================================
# CONFIGURACIÓN - EDITAR ESTA SECCIÓN
# ============================================

# Ruta a tu proyecto actual (familia-main)
SOURCE_PROJECT="${1:-../familia-main}"

# Nombre del nuevo monorepo
MONOREPO_NAME="atlantida-platform"

# ============================================
# VALIDACIONES
# ============================================

echo -e "${YELLOW}[1/8] Validando proyecto fuente...${NC}"

if [ ! -d "$SOURCE_PROJECT" ]; then
    echo -e "${RED}ERROR: No se encontró el proyecto en: $SOURCE_PROJECT${NC}"
    echo -e "${YELLOW}Uso: ./migrate.sh /ruta/a/familia-main${NC}"
    exit 1
fi

if [ ! -f "$SOURCE_PROJECT/package.json" ]; then
    echo -e "${RED}ERROR: No es un proyecto Node.js válido (falta package.json)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Proyecto fuente válido: $SOURCE_PROJECT${NC}"

# ============================================
# CREAR ESTRUCTURA
# ============================================

echo -e "${YELLOW}[2/8] Creando estructura de directorios...${NC}"

mkdir -p apps/portal
mkdir -p apps/inmobiliaria
mkdir -p packages/ui/src
mkdir -p packages/lib/src
mkdir -p packages/types/src
mkdir -p packages/config

echo -e "${GREEN}✓ Estructura creada${NC}"

# ============================================
# COPIAR PROYECTO A APPS
# ============================================

echo -e "${YELLOW}[3/8] Copiando proyecto a apps/portal...${NC}"

# Copiar todo excepto node_modules y .next
rsync -av --progress "$SOURCE_PROJECT/" apps/portal/ \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'package-lock.json'

echo -e "${GREEN}✓ Portal copiado${NC}"

echo -e "${YELLOW}[4/8] Copiando proyecto a apps/inmobiliaria...${NC}"

rsync -av --progress "$SOURCE_PROJECT/" apps/inmobiliaria/ \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'package-lock.json'

echo -e "${GREEN}✓ Inmobiliaria copiada${NC}"

# ============================================
# COPIAR COMPONENTES UI A PACKAGE
# ============================================

echo -e "${YELLOW}[5/8] Extrayendo componentes compartidos...${NC}"

# UI Components
if [ -d "$SOURCE_PROJECT/components/ui" ]; then
    cp -r "$SOURCE_PROJECT/components/ui/"* packages/ui/src/
    echo -e "${GREEN}✓ UI components copiados${NC}"
fi

# Lib files
if [ -d "$SOURCE_PROJECT/lib" ]; then
    cp "$SOURCE_PROJECT/lib/firebase.ts" packages/lib/src/ 2>/dev/null || true
    cp "$SOURCE_PROJECT/lib/algolia.ts" packages/lib/src/ 2>/dev/null || true
    cp "$SOURCE_PROJECT/lib/tracking.ts" packages/lib/src/ 2>/dev/null || true
    cp "$SOURCE_PROJECT/lib/utils.ts" packages/lib/src/ 2>/dev/null || true
    echo -e "${GREEN}✓ Lib files copiados${NC}"
fi

# ============================================
# CREAR INDEX FILES
# ============================================

echo -e "${YELLOW}[6/8] Creando archivos index...${NC}"

# UI Index
cat > packages/ui/src/index.ts << 'EOF'
// @repo/ui - Shared UI components
export * from './button'
export * from './input'
export * from './card'
export * from './badge'
export * from './dialog'
export * from './select'
export * from './checkbox'
export * from './label'
export * from './textarea'
export * from './tooltip'
export * from './sheet'
export * from './table'
export * from './avatar'
export * from './separator'
export * from './slider'
export * from './dropdown-menu'
EOF

# Lib Index
cat > packages/lib/src/index.ts << 'EOF'
// @repo/lib - Shared utilities
export * from './firebase'
export * from './algolia'
export * from './tracking'
export * from './utils'
EOF

# Types Index
cat > packages/types/src/index.ts << 'EOF'
// @repo/types - Shared TypeScript interfaces

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'USD' | 'UYU'
  type: 'Venta' | 'Alquiler'
  propertyType: string
  bedrooms: number
  bathrooms: number
  area: number
  location: {
    city: string
    neighborhood: string
    address?: string
  }
  coordinates?: { lat: number; lng: number }
  features: string[]
  images: string[]
  agentId: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive' | 'sold' | 'rented'
  featured?: boolean
}

export interface Agent {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  avatar?: string
  company?: string
}

export interface Lead {
  id: string
  propertyId: string
  agentId: string
  name: string
  email: string
  phone?: string
  message?: string
  type: 'contact' | 'visit' | 'whatsapp'
  status: 'new' | 'contacted' | 'closed'
  createdAt: Date
}

export interface BrandConfig {
  name: string
  slug: string
  logo: string
  primaryColor: string
  secondaryColor: string
  domain: string
  contact: {
    email: string
    phone: string
    whatsapp: string
    address: string
  }
}
EOF

echo -e "${GREEN}✓ Index files creados${NC}"

# ============================================
# ACTUALIZAR PACKAGE.JSON DE APPS
# ============================================

echo -e "${YELLOW}[7/8] Actualizando package.json de apps...${NC}"

# Portal package.json - actualizar name y agregar deps
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('apps/portal/package.json', 'utf8'));
pkg.name = 'portal';
pkg.scripts.dev = 'next dev --port 3000';
pkg.dependencies['@repo/ui'] = 'workspace:*';
pkg.dependencies['@repo/lib'] = 'workspace:*';
pkg.dependencies['@repo/types'] = 'workspace:*';
fs.writeFileSync('apps/portal/package.json', JSON.stringify(pkg, null, 2));
"

# Inmobiliaria package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('apps/inmobiliaria/package.json', 'utf8'));
pkg.name = 'inmobiliaria';
pkg.scripts.dev = 'next dev --port 3001';
pkg.dependencies['@repo/ui'] = 'workspace:*';
pkg.dependencies['@repo/lib'] = 'workspace:*';
pkg.dependencies['@repo/types'] = 'workspace:*';
fs.writeFileSync('apps/inmobiliaria/package.json', JSON.stringify(pkg, null, 2));
"

echo -e "${GREEN}✓ Package.json actualizados${NC}"

# ============================================
# CREAR BRAND CONFIGS
# ============================================

echo -e "${YELLOW}[8/8] Creando configuraciones de marca...${NC}"

mkdir -p apps/portal/config
mkdir -p apps/inmobiliaria/config

# Portal brand config
cat > apps/portal/config/brand.ts << 'EOF'
// Portal Marketplace - Barrio.uy
export const brandConfig = {
  name: 'Barrio.uy',
  slug: 'Barrio.uy',
  logo: '/logo-Barrio.uy.svg',
  primaryColor: '#0066FF',
  secondaryColor: '#00D4AA',
  domain: 'Barrio.uy.uy',
  contact: {
    email: 'info@Barrio.uy.uy',
    phone: '+598 99 123 456',
    whatsapp: '59899123456',
    address: 'Montevideo, Uruguay'
  }
}

export const portalFeatures = {
  multiAgent: true,
  agentRegistration: true,
  subscription: true,
  featuredListings: true,
}
EOF

# Inmobiliaria brand config
cat > apps/inmobiliaria/config/brand.ts << 'EOF'
// Web Exclusiva - MiBarrio.uy
export const brandConfig = {
  name: 'MiBarrio.uy',
  slug: 'mibarrio',
  logo: '/logo-atlantida.svg',
  primaryColor: '#1E3A5F',
  secondaryColor: '#C9A961',
  domain: 'mibarrio.uy',
  contact: {
    email: 'contacto@mibarrio.uy',
    phone: '+598 99 888 777',
    whatsapp: '59899888777',
    address: 'Av. Brasil 2587, Montevideo'
  }
}

export const inmobiliariaFeatures = {
  multiAgent: false,
  agentRegistration: false,
  subscription: false,
  exclusiveContent: true,
  virtualTours: true,
}
EOF

echo -e "${GREEN}✓ Brand configs creados${NC}"

# ============================================
# FINALIZACIÓN
# ============================================

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  ✅ MIGRACIÓN COMPLETADA CON ÉXITO${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}Próximos pasos:${NC}"
echo ""
echo "  1. Instalar dependencias:"
echo -e "     ${YELLOW}npm install${NC}"
echo ""
echo "  2. Probar desarrollo:"
echo -e "     ${YELLOW}npm run dev${NC}"
echo ""
echo "  3. Build de producción:"
echo -e "     ${YELLOW}npm run build${NC}"
echo ""
echo -e "${BLUE}URLs de desarrollo:${NC}"
echo "  • Portal:      http://localhost:3000"
echo "  • Inmobiliaria: http://localhost:3001"
echo ""
echo -e "${YELLOW}IMPORTANTE: Actualiza los imports gradualmente de:${NC}"
echo '  @/components/ui/* → @repo/ui'
echo '  @/lib/*           → @repo/lib'
echo ""
