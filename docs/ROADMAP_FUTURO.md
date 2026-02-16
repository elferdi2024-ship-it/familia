# Roadmap Futuro - DominioTotal
## Plan de Mejoras a 3, 6 y 12 Meses

**Fecha:** 16 de Febrero 2026  
**Score Actual:** 8.8/10 → 9.2/10 (con fixes inmediatos)  
**Objetivo 12 meses:** 9.5/10 + Product-Market Fit

---

## 🎯 Visión General

```
Mes 1-2:  Estabilización + Beta Testing
Mes 3-4:  Optimización + Growth Inicial  
Mes 5-6:  Escalabilidad + Monetización
Mes 7-12: Expansión + Features Premium
```

---

## 📅 FASE 1: Estabilización (Mes 1-2)

### Objetivos
- Score técnico: 9.2 → 9.5
- 5 beta testers con propiedades reales
- 100+ propiedades en plataforma
- 0 bugs críticos

### Semana 1-2: Post-Launch Fixes

#### 1. Service Worker para Offline (2 horas)
```
Prioridad: 🔸 ALTA
Impacto: PWA completa, +0.2 score

Tecnología: Workbox
Implementación:
- npm install workbox-webpack-plugin
- Configurar en next.config.ts
- Cache de assets estáticos
- Cache de API responses (5 min TTL)
- Offline fallback page

Features:
✅ Funciona offline
✅ Background sync de favoritos
✅ Push notifications ready
```

**Resultado:**
- PWA: 7.0 → 9.0
- Engagement +20% (usuarios pueden navegar offline)

---

#### 2. Sentry Error Tracking (20 min)
```
Prioridad: 🔸 ALTA
Impacto: Monitoreo de errores producción

Implementación:
1. Crear cuenta Sentry.io (free tier)
2. npm install @sentry/nextjs
3. sentry.server.config.ts + sentry.client.config.ts
4. Agregar DSN a variables de entorno
5. Reemplazar console.error con Sentry.captureException

Features:
✅ Stack traces completos
✅ Source maps
✅ User context
✅ Performance monitoring
✅ Alertas por email
```

**Resultado:**
- Detectar y fixear bugs 80% más rápido
- Monitoring: 8.5 → 9.0

---

#### 3. Tests Automatizados Básicos (1 semana)
```
Prioridad: 🔸 MEDIA
Impacto: Calidad de código, +0.3 score

Stack:
- Vitest: Unit tests
- React Testing Library: Component tests
- Playwright: E2E tests

Coverage objetivo: 60%

Tests críticos:
✅ SearchFiltersSchema validación
✅ useProperties hook paginación
✅ PropertyCard rendering
✅ Lead form submission
✅ Auth flow E2E
✅ Publish wizard E2E
```

**Estructura:**
```
tests/
├── unit/
│   ├── validations.test.ts
│   ├── hooks.test.ts
│   └── utils.test.ts
├── integration/
│   ├── api-properties.test.ts
│   └── lead-submission.test.ts
└── e2e/
    ├── auth-flow.spec.ts
    ├── publish-flow.spec.ts
    └── search-flow.spec.ts
```

**Scripts NPM:**
```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:e2e": "playwright test",
  "test:coverage": "vitest --coverage"
}
```

**Resultado:**
- Mantenibilidad: 9.0 → 9.5
- Testing: 0 → 6.0

---

### Semana 3-4: Beta Testing

#### 4. Onboarding de 5 Beta Testers (1 semana)
```
Perfil:
- Agentes inmobiliarios Montevideo
- 5-20 propiedades activas
- Tech-savvy (smartphone, redes sociales)
- Dispuestos a dar feedback semanal

Proceso:
1. Identificar candidatos (networking, LinkedIn)
2. Presentación 1-on-1 (Zoom 30 min)
3. Setup: crear cuenta, publicar 1 propiedad guiada
4. Check-in semanal (Google Meet 15 min)
5. Encuesta de satisfacción (Google Forms)

Incentivos:
- Gratis durante beta (3 meses)
- Early access a features premium
- Testimonial en homepage
- 3 meses gratis después de launch

KPIs:
- 50+ propiedades publicadas
- 20+ leads generados
- NPS > 40
- 0 bugs críticos reportados
```

---

#### 5. Feedback Loop + Iteración (2 semanas)
```
Métricas a trackear:
✅ Time to first property published
✅ Lead response time
✅ Property edit frequency
✅ Mobile vs desktop usage
✅ Drop-off points en publish wizard
✅ Most used filters

Herramientas:
- Hotjar: Heatmaps + session recordings
- Google Analytics 4: Eventos custom
- Intercom: Customer messaging

Iteraciones esperadas:
- Simplificar paso 2 del publish wizard
- Agregar templates de descripción
- Mejorar mobile UX de dashboard leads
- Notificaciones push para nuevos leads
```

---

## 📅 FASE 2: Optimización (Mes 3-4)

### Objetivos
- 50+ agentes activos
- 500+ propiedades
- 100+ leads/mes generados
- Speed Index < 2s

### Mejora 1: Algolia Instant Search (2 semanas)

```
Problema actual:
- Firestore query limit 200 docs
- Client-side filtering lento
- Sin typo tolerance
- Sin faceted search

Solución: Algolia
- <50ms de búsqueda
- Typo correction
- Facets automáticos
- Highlighting de resultados
- Geosearch avanzado

Implementación:
1. Crear cuenta Algolia (free 10K requests/mes)
2. npm install algoliasearch react-instantsearch
3. Cloud Function: Firestore → Algolia sync
4. Reemplazar SearchContent con InstantSearch components

Costo: $0-50/mes (free tier suficiente para inicio)
```

**Features nuevas:**
```typescript
✅ Búsqueda instantánea (<50ms)
✅ "Casas en Pocitos con piscina" (typo-tolerant)
✅ Facets dinámicos (departamento, tipo, precio)
✅ Geo-búsqueda avanzada (radio, polígonos)
✅ Personalización por usuario (historial)
```

**Resultado:**
- Performance: 8.5 → 9.2
- UX: 9.5 → 9.8
- Conversión +15%

---

### Mejora 2: Blog SEO (1 mes, contenido)

```
Objetivo: Capturar long-tail keywords

10 artículos iniciales:
1. "Cómo comprar tu primera vivienda en Uruguay [Guía 2026]"
2. "Vivienda Promovida: Todo lo que necesitas saber"
3. "Los 10 mejores barrios de Montevideo para familias"
4. "Guía de garantías de alquiler: ANDA vs CGN vs Porto Seguro"
5. "Cuánto necesito ahorrar para comprar casa en Montevideo"
6. "Trámites para vender una propiedad en Uruguay"
7. "Invertir en real estate uruguayo: rentabilidad 2026"
8. "Crédito hipotecario en Uruguay: comparativa bancos"
9. "Mudarse a Montevideo: todo lo que necesitas saber"
10. "Precios de alquiler por barrio: análisis 2026"

Formato:
- 1,500-2,500 palabras
- Imágenes originales
- Infografías
- Internal linking
- CTA a calculadora/búsqueda

Stack:
- MDX blog posts en /app/blog/[slug]
- Contentlayer para gestión
- Remark plugins para SEO

SEO técnico:
✅ Schema Article
✅ Table of contents
✅ Reading time
✅ Related posts
✅ Author info
```

**Resultado:**
- SEO: 9.0 → 9.5
- Tráfico orgánico +200%
- Autoridad de dominio +15

---

### Mejora 3: ISR en Propiedades (1 hora)

```typescript
// app/property/[id]/page.tsx
// Cambiar de SSR a ISR

export const revalidate = 3600 // 1 hora

export async function generateStaticParams() {
  // Pre-render top 100 propiedades
  const topProperties = await getTopProperties(100)
  return topProperties.map(p => ({ id: p.id }))
}
```

**Beneficio:**
- LCP: 2.5s → 0.8s
- Server load -80%
- Costos Firebase -50%

**Resultado:**
- Performance: 9.2 → 9.5
- Core Web Vitals: todas verde

---

## 📅 FASE 3: Escalabilidad (Mes 5-6)

### Objetivos
- 200+ agentes
- 2,000+ propiedades
- $2,000 MRR
- Infraestructura lista para 10K+ propiedades

### Mejora 1: Plan Premium para Agentes ($40/mes)

```
Features Premium:
✅ Destacar propiedades en búsqueda
✅ Analytics avanzado:
   - Views por día/semana/mes
   - Tiempo promedio en página
   - Conversión a lead (%)
   - Comparación con mercado
✅ Badge "Agente Verificado"
✅ Prioridad en resultados de búsqueda
✅ Múltiples propiedades destacadas (hasta 5)
✅ Acceso a leads 30min antes
✅ CRM integrado básico
✅ Email marketing mensual (Mailchimp integration)
✅ API access para integración con su web

Pricing:
- Free: Publicación básica, sin límite de propiedades
- Premium: $40/mes (billing anual $400, 2 meses gratis)
- Enterprise: $150/mes (agencias con 20+ propiedades)

Conversión esperada:
- 10% de free users → premium en mes 1
- 25% en mes 6
- 200 agentes * 10% = 20 premium = $800 MRR mes 1
```

**Stack:**
```typescript
// Stripe para payments
// Firestore para subscription status
// Middleware para feature gating
```

**Resultado:**
- Monetización: 0 → $2,000 MRR en mes 6
- Escalabilidad validada

---

### Mejora 2: PostgreSQL + Prisma (opcional)

```
Si Firestore se vuelve limitante:

Migración a Postgres:
- Vercel Postgres (serverless)
- Prisma ORM
- Migracion gradual (dual-write)

Ventajas:
✅ SQL complex queries
✅ Full-text search nativo
✅ Transactions
✅ Mejor cost por query

Desventajas:
❌ Más complejo
❌ Requiere migrations
❌ Menos realtime

Recomendación: Solo si >5,000 propiedades
```

---

### Mejora 3: Redis Cache Layer

```
Implementar Redis para:
- Cache de queries frecuentes (5 min TTL)
- Session storage
- Rate limiting distribuido
- Real-time counters

Stack:
- Vercel KV (Redis managed)
- @vercel/kv package
- Cache aside pattern

Ejemplo:
✅ Cache de homepage featured properties (5 min)
✅ Cache de stats por barrio (1 hora)
✅ Cache de autocomplete suggestions (10 min)
```

**Resultado:**
- Queries cached: -95% latencia
- Costos Firebase -70%
- Escalabilidad: 8.0 → 9.0

---

## 📅 FASE 4: Expansión (Mes 7-12)

### Objetivos
- 500+ agentes
- 10,000+ propiedades
- $15,000 MRR
- Expansión a Canelones, Maldonado

### Feature 1: Push Notifications

```
Stack:
- Firebase Cloud Messaging (FCM)
- Service Worker
- Web Push API

Notificaciones:
✅ Nuevo lead recibido (agente)
✅ Propiedad favorita bajó de precio (usuario)
✅ Nueva propiedad en búsqueda guardada (usuario)
✅ Lead respondió tu consulta (usuario)
✅ Propiedad pronto a vencer (agente)

Opt-in:
- Modal después de 3 interacciones
- Personalización de tipos de notificación
- Settings en perfil

Resultado:
- Engagement +40%
- Lead response time -60%
```

---

### Feature 2: ML Valuación Automática

```
Objetivo: Estimar precio de propiedades

Modelo:
- Scikit-learn (Python)
- Features: ubicación, m2, año, amenities
- Training data: propiedades vendidas (Catastro)
- Deployed en Vercel Serverless Function (Python runtime)

Accuracy objetivo: ±10%

Casos de uso:
✅ "Tu propiedad vale aprox $180,000"
✅ Alert: "Precio 20% sobre mercado"
✅ Gráfico de evolución de precios por barrio
```

**Resultado:**
- Diferenciación competitiva
- Autoridad en data
- Engagement +25%

---

### Feature 3: App Móvil Nativa

```
¿Cuándo?: Solo si >10,000 MAU

Stack:
- React Native + Expo
- Shared codebase 80% con web
- Notificaciones push nativas
- Cámara para fotos de propiedades
- GPS para búsqueda nearby

Features nativas:
✅ Mejor UX mobile (vs PWA)
✅ App Store presence
✅ Notificaciones más confiables
✅ Offline first

Costo:
- 3 meses dev
- $500/año App Store + Play Store
- $2,000/mes mantenimiento

ROI: Solo si retention mobile >50%
```

---

### Feature 4: Expansión Geográfica

```
Ciudades objetivo:
1. Canelones (Ciudad de la Costa, Las Piedras)
2. Maldonado (Punta del Este, Maldonado, San Carlos)
3. Salto
4. Paysandú

Estrategia:
- Partner con 2-3 agentes por ciudad
- SEO local (/comprar/punta-del-este)
- Campañas Facebook Ads geotargeteadas

Inversión:
- $200/mes por ciudad en ads
- 20 horas dev (nuevos departamentos en data)
```

**Resultado:**
- TAM 3x (de Montevideo a Uruguay)
- Propiedades: 10K → 30K
- Agentes: 500 → 1,500

---

## 📊 Proyección de KPIs

### Usuarios y Propiedades
```
Mes 1:   100 propiedades, 5 agentes, 500 users
Mes 3:   500 propiedades, 50 agentes, 3K users
Mes 6:   2K propiedades, 200 agentes, 10K users
Mes 12:  10K propiedades, 500 agentes, 30K users
```

### Leads Generados
```
Mes 1:   20 leads
Mes 3:   100 leads
Mes 6:   400 leads
Mes 12:  1,500 leads/mes
```

### Revenue (MRR)
```
Mes 1-2:  $0 (beta)
Mes 3:    $200 (5 premium)
Mes 6:    $2,000 (50 premium)
Mes 12:   $15,000 (300 premium + 50 enterprise)
```

### Costos Infraestructura
```
Mes 1:   $30/mes (Vercel + Firebase + Resend)
Mes 3:   $100/mes (+Algolia)
Mes 6:   $300/mes (+Redis, más Firebase usage)
Mes 12:  $1,000/mes (+CDN, más escala)
```

### Margen
```
Mes 6:   $2,000 MRR - $300 costos = $1,700 profit (85%)
Mes 12:  $15,000 MRR - $1,000 costos = $14,000 profit (93%)
```

---

## 🎯 Score Técnico Proyectado

```
Actual:  8.8/10
Mes 2:   9.2/10 (service worker, Sentry, tests)
Mes 4:   9.5/10 (Algolia, blog SEO, ISR)
Mes 6:   9.5/10 (mantener calidad con escala)
Mes 12:  9.7/10 (Redis, ML, push notifications)
```

---

## ⚠️ Riesgos y Mitigaciones

### Riesgo 1: Churn de Agentes
```
Problema: Agentes se van si no generan leads
Mitigación:
- Garantía: mínimo 5 leads en primer mes o reembolso
- Onboarding personal 1-on-1
- Email marketing tips para mejorar propiedades
- Comparación con mercado (tu propiedad tiene 50% menos views que similar)
```

### Riesgo 2: Competencia de InfoCasas
```
Problema: InfoCasas domina mercado
Mitigación:
- Nichos: Vivienda Promovida, Millennials first-home
- UX mobile 10x mejor
- Datos únicos (valuación ML, analytics)
- Pricing agresivo (free forever básico)
```

### Riesgo 3: Scaling Costs
```
Problema: Costos Firebase/Algolia explotan
Mitigación:
- Redis cache layer (Mes 6)
- Evaluar Postgres (si >5K propiedades)
- Negociar pricing con Algolia (enterprise plan)
- CDN propio para images (Cloudflare R2)
```

---

## 📅 Calendario de Entregas

### Q1 2026 (Actual + 3 meses)
- ✅ Mes 1: Fixes inmediatos + Service Worker + Sentry
- ✅ Mes 2: Tests básicos + 5 beta testers
- ✅ Mes 3: Algolia + Blog (5 artículos)

### Q2 2026 (Meses 4-6)
- ✅ Mes 4: ISR + Blog completo (10 art)
- ✅ Mes 5: Plan Premium lanzamiento
- ✅ Mes 6: Redis cache + 200 agentes

### Q3-Q4 2026 (Meses 7-12)
- Mes 7: Push notifications
- Mes 8: Expansión Canelones
- Mes 9: ML valuación beta
- Mes 10: Expansión Maldonado
- Mes 11: Optimizaciones finales
- Mes 12: 500 agentes, $15K MRR

---

## ✅ Conclusión

**Roadmap es ambicioso pero realista:**
- Tech stack sólido (Next.js 16 + Firebase + Vercel)
- Mejoras incrementales (no rewrites)
- Validación antes de features costosas
- Focus en retention antes que growth

**Próximos pasos:**
1. Implementar 4 fixes inmediatos (<1 hora)
2. Service Worker (2 horas)
3. Onboarding 5 beta testers (1 semana)
4. Iterar basado en feedback real

**Score final esperado:** 9.5/10 (top 5% de apps React)
