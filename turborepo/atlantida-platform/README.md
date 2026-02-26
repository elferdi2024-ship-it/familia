# Atlantida Platform - Monorepo

Monorepo Turborepo para las plataformas inmobiliarias de **Barrio.uy** y **MiBarrio.uy**.

## Estructura

```
atlantida-platform/
├── apps/
│   ├── portal/              # Marketplace multi-agente (Barrio.uy)
│   └── inmobiliaria/        # Web exclusiva MiBarrio.uy
├── packages/
│   ├── ui/                  # Componentes UI compartidos (shadcn/ui + custom)
│   ├── lib/                 # Librerías compartidas (Firebase, Algolia, Mercado Pago, SEO)
│   ├── types/               # TypeScript types compartidos (Poi, Property, Agent)
│   └── config/              # Configuraciones compartidas (brand, tailwind)
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

## Apps

### Portal (Barrio.uy)
Marketplace inmobiliario robusto con:
- **Agentes**: Registro, gestión de perfil, ranking de desempeño y feed de noticias.
- **Propiedades**: Publicación paso a paso, gestión de favoritos y comparación.
- **Leads**: Gestión de contactos, integración con WhatsApp y analytics.
- **Suscripciones**: Planes Base, Pro y Premium (UYU) integrados con Mercado Pago; tarjeta de upgrade cuando el usuario free alcanza el límite; [docs/PLANES_FUENTE_VERDAD.md](docs/PLANES_FUENTE_VERDAD.md).
- **Herramientas**: Calculadora hipotecaria, mapa de servicios "En el barrio" (POIs).

### Inmobiliaria (MiBarrio.uy)
Sitio web corporativo de alta gama:
- **Exclusividad**: Solo muestra propiedades de la inmobiliaria matriz.
- **Branding Premium**: Diseño diferenciado y elegante enfocado en conversión.
- **SEO Programático**: Páginas optimizadas por barrio y tipo de operación.
- **Servicios**: Tasaciones, gestión personalizada y tours virtuales.

## Packages Compartidos

### @repo/ui
Sistema de diseño unificado:
- **Core**: Buttons, Inputs, Dialogs, Sheets (basado en radix-ui y lucide).
- **Inmobiliario**: PropertyCard, NearbyPlacesCard, LeadForm, SearchBar.
- **Layout**: Navbars, Footers y Sidebars configurables por marca.

### @repo/lib
Motor de la plataforma:
- **Servicios**: Firebase (Auth/Firestore), Algolia (Búsqueda real-time), Mercado Pago (Pagos).
- **Core**: SEO Metadata global, sistema de mails (Resend), tracking de eventos.
- **Utils**: Formateadores de moneda uruguaya, cálculo de distancias y validaciones.

### @repo/types
Definiciones estandarizadas:
- **Entidades**: `Property`, `Agent`, `Lead`, `Poi` (Points of Interest).
- **Config**: `BrandConfig`, `SearchFilters`, `PoiCategory`.

## Variables de Entorno

Copiar `.env.example` a `.env.local` en cada app.

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Búsqueda & Pago
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
MP_ACCESS_TOKEN=... (Mercado Pago Admin)

# Otros
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
RESEND_API_KEY=...
KV_REST_API_URL=... (Upstash Redis para Rate Limiting)
```

## Deploy en Vercel

### Proyectos Independientes
1. **atlantida-portal**: Root Directory = `apps/portal`
2. **atlantida-inmobiliaria**: Root Directory = `apps/inmobiliaria`

*Vercel detecta automáticamente el monorepo y aplica el caching de Turborepo.*

## Scripts Útiles

```bash
npm run typecheck    # Verificación de tipos global (Crítico para CI)
npm run lint         # Análisis estático
npm run clean        # Borrar caches y node_modules
```

## Documentación

Índice completo de documentación: **[docs/README.md](docs/README.md)**. Incluye deploy, PRD, planes (Base/Pro/Premium), guías de agente y playbooks de ventas.

## Próximos Pasos

1. [x] Centralizar tipos `Poi` y `Property` en `@repo/types`.
2. [x] Refactorizar `SearchContent` para mapeo de datos robusto.
3. [ ] Migración completa de componentes legacy a `@repo/ui`.
4. [ ] Implementación de PWA (Service Workers + Offline support).
5. [x] Planes Base/Pro/Premium documentados; Analytics & CRM básico para Premium en Mi propiedades.
6. [ ] Dashboard avanzado de estadísticas (métricas por período, etc.).
