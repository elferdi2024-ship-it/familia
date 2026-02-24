# Barrio.uy - Plataforma Inmobiliaria Uruguay

**La mejor experiencia mobile-first para buscar, publicar y gestionar propiedades en Uruguay.**

> **Desarrollo principal (monorepo):** La fuente de verdad para desarrollo es el monorepo Turborepo.  
> - **Código:** `turborepo/atlantida-platform/` — apps: **portal** (Barrio.uy) y **inmobiliaria** (MiBarrio.uy).  
> - **Documentación unificada:** [turborepo/atlantida-platform/docs/README.md](turborepo/atlantida-platform/docs/README.md) (índice por rol: producto, técnico, guías, deploy).

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)](https://tailwindcss.com/)

**Live:** [Barrio.uy.vercel.app](https://Barrio.uy.vercel.app)

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS + shadcn/ui | 4.0 |
| Auth | Firebase Authentication | 12.x |
| Base de Datos | Firebase Firestore | 12.x |
| Storage | Firebase Storage | 12.x |
| Email | Resend | 6.x |
| Mapas | Google Maps API | - |
| Animaciones | Framer Motion | 12.x |
| Validacion | Zod | 3.x |
| Analytics | Vercel Analytics + Speed Insights | - |
| Toasts | Sonner | - |
| Deploy | Vercel (Edge Network + CDN) | - |

---

## Inicio Rapido

### Prerrequisitos

- Node.js >= 18
- npm >= 9
- Cuenta Firebase (Auth + Firestore + Storage)
- Cuenta Vercel (deploy)

### 1. Clonar e instalar

```bash
git clone <repo-url>
cd INMOBILIARIA

# Opción A: Monorepo (recomendado)
cd turborepo/atlantida-platform
npm install
npm run dev

# Opción B: App en raíz
npm install
npm run dev
```

### 2. Variables de entorno

Crear `.env.local` en la raiz:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# Resend (Email)
RESEND_API_KEY=re_xxxxx

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaXXXXX

# PostgreSQL (opcional - Prisma)
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### 4. Build de produccion

```bash
npm run build
npm start
```

---

## Scripts Disponibles

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build optimizado para produccion |
| `npm start` | Servidor de produccion |
| `npm run lint` | Ejecutar ESLint |
| `npm run seed:generate` | Generar datos seed |
| `npm run seed:push` | Subir seeds a base de datos |
| `npm run seed:fresh` | Limpiar y re-seedear |

---

## Estructura del Proyecto

```
Barrio.uy/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── properties/route.ts   # API paginada con validacion Zod
│   │   └── search/suggestions/   # Autocomplete
│   ├── alquilar/[barrio]/        # SEO: alquileres por barrio
│   ├── comprar/[barrio]/         # SEO: compras por barrio
│   ├── property/[id]/            # Detalle de propiedad
│   ├── my-properties/            # Dashboard agente
│   │   └── leads/                # Dashboard de leads
│   ├── publish/                  # Wizard de publicacion (4 pasos)
│   ├── search/                   # Busqueda con filtros
│   ├── layout.tsx                # Layout raiz (providers, analytics)
│   ├── sitemap.ts                # Sitemap dinamico
│   └── robots.ts                 # Robots.txt
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui (15+ componentes)
│   ├── auth/                     # AuthModal
│   ├── layout/                   # Navbar, Footer, BottomTabBar
│   ├── search/                   # SearchContent
│   ├── ErrorBoundary.tsx         # Error boundary global
│   ├── PropertyCard.tsx          # Card de propiedad
│   └── NeighborhoodMap.tsx       # Mapa con POIs
│
├── contexts/                     # React Context (state management)
│   ├── AuthContext.tsx            # Autenticacion Firebase
│   ├── FavoritesContext.tsx       # Favoritos (localStorage + Firestore)
│   ├── SavedSearchesContext.tsx   # Busquedas guardadas
│   ├── PublishContext.tsx         # Wizard de publicacion
│   └── ComparisonContext.tsx      # Comparador de propiedades
│
├── hooks/                        # Custom hooks
│   ├── useProperties.ts          # Fetch con paginacion y debounce
│   └── useDebounce.ts            # Debounce generico
│
├── actions/                      # Server Actions
│   ├── notify-lead.ts            # Notificar lead (validacion Zod)
│   └── get-nearby-places.ts      # Google Places API
│
├── lib/                          # Utilidades
│   ├── validations.ts            # Schemas Zod (Lead, Property, Search)
│   ├── tracking.ts               # Event tracking tipado
│   ├── firebase.ts               # Config Firebase
│   ├── mail.ts                   # Email templates (Resend)
│   ├── analytics.ts              # Market intelligence
│   ├── seo-content.ts            # Contenido SEO por barrio
│   └── utils.ts                  # cn() helper
│
├── middleware.ts                  # Rate limiting + redirects SEO
├── firestore.rules               # Security rules de Firestore
├── firestore.indexes.json        # Indices compuestos
├── public/manifest.json          # PWA manifest
└── next.config.ts                # Config (headers seguridad, images)
```

---

## Features Principales

### Para Compradores/Inquilinos
- Busqueda con 12+ filtros (operacion, tipo, ubicacion, precio, dormitorios, amenities)
- Filtro de Vivienda Promovida Ley 18.795
- Filtro por garantia aceptada (ANDA, CGN, Porto Seguro)
- Favoritos con cloud sync (guest + user)
- Comparador de hasta 3 propiedades
- Busquedas guardadas con notificaciones
- Mapa interactivo con POIs (colegios, restaurantes, parques)

### Para Agentes/Propietarios
- Publicacion gratuita en 4 pasos
- Edicion de propiedades existentes
- Dashboard de leads con estados (Nuevo/Contactado/Calificado/Perdido)
- Email de notificacion inmediata por cada lead
- Boton de WhatsApp directo

### Tecnico
- SSR/SSG/ISR con Next.js 16 App Router
- React 19 con React Compiler habilitado
- PWA instalable (manifest.json)
- Security headers (HSTS, CSP, X-Frame-Options)
- Rate limiting en middleware
- Validacion server-side con Zod
- Analytics (Vercel Analytics + Speed Insights)
- Event tracking tipado
- Error boundaries
- Code splitting con dynamic imports
- Image optimization (AVIF/WebP)
- SEO: sitemap dinamico, metadata, JSON-LD, robots.txt

---

## Seguridad

### Headers HTTP
- `Strict-Transport-Security` (HSTS preload)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, microphone, geolocation restringidos)

### Firestore Security Rules
Las reglas estan en `firestore.rules`. Deployar con:
```bash
firebase deploy --only firestore:rules
```

### Rate Limiting
Configurado en `middleware.ts`:
- API endpoints: 30 requests/minuto por IP
- Lead endpoints: 5 requests/minuto por IP

---

## Deploy

### Vercel (Recomendado)

1. Conectar repo a Vercel
2. Configurar variables de entorno en dashboard de Vercel
3. Deploy automatico en cada push a `main`

### Firebase Rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Licencia

Proyecto privado. Todos los derechos reservados.
