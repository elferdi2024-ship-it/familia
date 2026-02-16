# Changelog

Todos los cambios notables de DominioTotal.

## [3.1.0] - 2026-02-16

### Seguridad
- **Nuevo:** Security headers en next.config.ts (HSTS, X-Frame-Options, X-Content-Type-Options, XSS-Protection, Referrer-Policy, Permissions-Policy)
- **Nuevo:** Middleware con rate limiting por IP (30 req/min API, 5 req/min leads)
- **Nuevo:** Redirect 301 de /properties/[id] a /property/[id] para SEO
- **Nuevo:** Validacion server-side con Zod en todos los server actions
- **Nuevo:** Schemas tipados: LeadSchema, PropertySchema, SearchFiltersSchema, NearbyPlacesSchema
- **Nuevo:** Firestore Security Rules completas (firestore.rules)
- **Nuevo:** Firestore composite indexes (firestore.indexes.json)

### Performance
- **Mejorado:** API /api/properties con paginacion server-side y filtros Firestore
- **Nuevo:** Custom hook useProperties con debounce, abort controller, paginacion
- **Nuevo:** Custom hook useDebounce
- **Mejorado:** Dynamic imports para NeighborhoodMap (ssr: false) y FloorplanViewer
- **Mejorado:** Image optimization: formatos AVIF/WebP, device sizes, cache TTL 60s
- **Mejorado:** Dominios de imagen adicionales (Firebase Storage, Vercel Storage)

### Monitoring y Analytics
- **Nuevo:** Vercel Analytics integrado
- **Nuevo:** Vercel Speed Insights para Core Web Vitals
- **Nuevo:** Event tracking tipado (lib/tracking.ts)
- **Nuevo:** Error Boundary global con UI de recovery en espanol

### SEO
- **Mejorado:** Sitemap dinamico con propiedades de Firestore + 20 barrios
- **Mejorado:** Robots.txt con rutas privadas bloqueadas y regla Googlebot
- **Corregido:** Suspense boundaries en paginas SSG
- **Corregido:** Params async para Next.js 16 compatibility

### UX/UI
- **Nuevo:** Sistema de toast (Sonner) reemplaza alert() nativos
- **Nuevo:** Dashboard de leads para agentes (/my-properties/leads)
- **Nuevo:** Skip link para accesibilidad
- **Mejorado:** Aria labels en botones (favoritos, comparacion, menu)
- **Mejorado:** Aria-expanded y aria-controls en menu movil
- **Mejorado:** Template de email profesional con branding y WhatsApp CTA

### PWA
- **Nuevo:** manifest.json con iconos, shortcuts, categorias
- **Nuevo:** Meta tags PWA en layout (theme-color, apple-mobile-web-app)

### Bug Fixes
- **Corregido:** Race condition en AuthContext (cancelled flag en onAuthStateChanged)
- **Corregido:** Error handling en localStorage (QuotaExceededError)
- **Corregido:** Contenido duplicado SEO (/properties/ -> /property/ redirect)

### Dependencias
- **Nuevo:** zod (validacion)
- **Nuevo:** @vercel/analytics
- **Nuevo:** @vercel/speed-insights
- **Nuevo:** sonner (toasts)

---

## [3.0.0] - 2026-02-15

### Features
- Homepage con hero search y featured properties
- Busqueda con 12+ filtros
- Detalle de propiedad con galeria, mapa, lead form
- Publicacion wizard (4 pasos)
- Autenticacion (Google + Email)
- Favoritos con cloud sync
- Busquedas guardadas
- Comparador de propiedades
- Dashboard mis propiedades
- Paginas SEO por barrio (/comprar/, /alquilar/)

### Stack
- Next.js 16.1.6, React 19.2.3, TypeScript 5
- Tailwind CSS 4, shadcn/ui
- Firebase (Auth + Firestore + Storage)
- Framer Motion, Lucide React
- Resend (email), Google Maps API
