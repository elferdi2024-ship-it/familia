# Changelog

Todos los cambios notables de DominioTotal.

## [5.0.0] - 2026-02-17

### Performance & Search (Algolia)
- **Nuevo:** Integración de Algolia Search v5 con búsqueda instantánea (<50ms).
- **Nuevo:** Script de sincronización Firestore -> Algolia (`scripts/sync-algolia.ts`).
- **Mejorado:** Búsqueda tolerante a errores ortográficos y con resaltado de términos.

### Gestión de Agentes (Lead Pipeline)
- **Nuevo:** Pipeline comercial en `/my-properties/leads` (Interesado -> Contactado -> Visita -> Vendido).
- **Nuevo:** Beta Tester Guide con onboarding para primeros agentes.
- **Mejorado:** Dashboards con estética premium, bento-grid stats y acciones rápidas de WhatsApp.

### Monitoring & Estabilidad
- **Nuevo:** Sentry SDK v10 configurado para monitoreo de errores en tiempo real.
- **Corregido:** Rename `middleware.ts` a `proxy.ts` para cumplir con convenciones de Next.js 16.
- **Corregido:** Fix de tipos en `useLeadSubmission` que bloqueaban el build.

### SEO & Contenido
- **Nuevo:** Blog con 3 artículos iniciales optimizados para keywords de alta intención.
- **Mejorado:** Metadata dinámica en páginas de Propiedad e ISR (Incremental Static Regeneration) cada 1 hora.

---

## [3.2.0] - 2026-02-16

### Features
- **Nuevo:** Calculadora de Hipoteca (/calculadora-hipoteca) con 5 bancos uruguayos
- **Nuevo:** Pagina 404 personalizada con CTAs a inicio y busqueda
- **Nuevo:** Hook useLeadSubmission con toast, tracking y source detection

### Seguridad
- **Mejorado:** Verificacion de email al registrarse (sendEmailVerification)
- **Limpieza:** Eliminados archivos Sentry sin dependencia instalada

### SEO
- **Mejorado:** Metadata completa con keywords, Twitter Cards, OG images
- **Mejorado:** Canonical URL en layout raiz
- **Mejorado:** Robots con directivas googleBot avanzadas

### Accesibilidad
- **Mejorado:** Labels (sr-only) en todos los inputs del lead form (desktop + mobile)
- **Mejorado:** Labels en selects de filtros de busqueda
- **Mejorado:** autoComplete en campos nombre y email

### Monitoring
- **Mejorado:** Funnel tracking completo en publish wizard (steps 1, 2, 3)

### Documentacion
- **Nuevo:** AUDITORIA_TECNICA_v3.md (score 9.1/10)
- **Nuevo:** ESTADO_ACTUAL_v2.md (plan de accion actualizado)
- **Nuevo:** PRD_v3.2_ACTUALIZADO.md (83% roadmap completado)
- **Nuevo:** ANALISIS_ESTRATEGICO_v3.md (GO para beta)

---

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
