# Atlantida Platform - Monorepo

Monorepo Turborepo para las plataformas inmobiliarias de MiBarrio.uy.

## Estructura

```
atlantida-platform/
├── apps/
│   ├── portal/              # Marketplace multi-agente (Barrio.uy)
│   └── inmobiliaria/        # Web exclusiva MiBarrio.uy
├── packages/
│   ├── ui/                  # Componentes UI compartidos
│   ├── lib/                 # Librerías compartidas (Firebase, Algolia, etc.)
│   ├── types/               # TypeScript types compartidos
│   └── config/              # Configuraciones compartidas
├── turbo.json               # Configuración Turborepo
├── package.json             # Package root con workspaces
└── tsconfig.json            # TypeScript config base
```

## Inicio Rápido

### Requisitos
- Node.js >= 20
- npm >= 10

### Instalación

```bash
# Desde la raíz del monorepo
npm install
```

### Desarrollo

```bash
# Ejecutar ambas apps
npm run dev

# Solo Portal (marketplace)
npm run dev:portal

# Solo Inmobiliaria (MiBarrio.uy)
npm run dev:inmobiliaria
```

Las apps corren en:
- **Portal**: http://localhost:3000
- **Inmobiliaria**: http://localhost:3001

### Build

```bash
# Build de todas las apps
npm run build

# Build específico
npm run build:portal
npm run build:inmobiliaria
```

## Apps

### Portal (Barrio.uy)
Marketplace inmobiliario donde múltiples agentes pueden:
- Registrarse como agentes
- Publicar propiedades
- Gestionar leads
- Ver analytics de sus propiedades
- Suscribirse a planes premium

### Inmobiliaria (MiBarrio.uy)
Sitio web exclusivo de la inmobiliaria con:
- Propiedades exclusivas de MiBarrio.uy
- Branding premium personalizado
- Tours virtuales
- Contenido exclusivo
- Diseño elegante y profesional

## Packages Compartidos

### @repo/ui
Componentes UI reutilizables:
- Button, Input, Select, Checkbox
- Card, Badge, Avatar
- Dialog, Sheet, Tooltip
- Table, Dropdown

```tsx
import { Button, Card } from '@repo/ui'
```

### @repo/lib
Utilidades y servicios:
- Firebase (auth, firestore, storage)
- Algolia (búsqueda)
- Tracking (analytics)
- Utils (cn, formatters)

```tsx
import { db, auth } from '@repo/lib/firebase'
import { trackEvent } from '@repo/lib/tracking'
```

### @repo/types
Interfaces TypeScript compartidas:
- Property, Agent, Lead
- SearchFilters, BrandConfig

```tsx
import type { Property, Agent } from '@repo/types'
```

## Variables de Entorno

Cada app necesita su propio `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Resend (Email)
RESEND_API_KEY=
```

## Deploy en Vercel

### Configuración
1. Importar repositorio en Vercel
2. Vercel detectará automáticamente Turborepo
3. Crear 2 proyectos:
   - **atlantida-portal**: Root Directory = `apps/portal`
   - **atlantida-inmobiliaria**: Root Directory = `apps/inmobiliaria`

### Dominios
- Portal: `Barrio.uy.uy`
- Inmobiliaria: `mibarrio.uy`

## Scripts Útiles

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Limpiar todo
npm run clean

# Formatear código
npm run format
```

## Arquitectura de Decisiones

### ¿Por qué Turborepo?
1. **Código compartido**: 60-70% del código es reutilizable
2. **Builds paralelos**: Turborepo optimiza builds automáticamente
3. **Cache inteligente**: Solo rebuild lo que cambió
4. **Soporte Vercel nativo**: Deploy simplificado
5. **Escalabilidad**: Fácil agregar más apps/marcas

### ¿Por qué no Multi-tenant?
- Las diferencias de branding son significativas (30-40%)
- Cada app necesita deploy independiente
- Escalabilidad de equipos separados

## Próximos Pasos

1. [ ] Migrar imports de `@/components/ui` a `@repo/ui`
2. [ ] Migrar imports de `@/lib` a `@repo/lib`
3. [ ] Personalizar layouts por app
4. [ ] Configurar Sentry por app
5. [ ] Setup CI/CD en Vercel
