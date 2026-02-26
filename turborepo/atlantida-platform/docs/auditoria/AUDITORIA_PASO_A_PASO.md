# Auditoría Integral Paso a Paso — Barrio.uy / Atlantida Platform

**Fecha:** 25 de Febrero 2026  
**Objetivo:** Protocolo de auditoría exhaustivo, organizado por roles, para verificar el estado completo de la plataforma, detectar inconsistencias y asegurar la calidad antes de escalar.

---

## Índice

1. [Mapa de documentación por rol](#1-mapa-de-documentación-por-rol)
2. [Fase 1 — Auditor de Producto](#2-fase-1--auditor-de-producto)
3. [Fase 2 — Auditor Técnico / Arquitectura](#3-fase-2--auditor-técnico--arquitectura)
4. [Fase 3 — Auditor de Seguridad](#4-fase-3--auditor-de-seguridad)
5. [Fase 4 — Auditor de Negocio y Monetización](#5-fase-4--auditor-de-negocio-y-monetización)
6. [Fase 5 — Auditor de Marketing y Comunicación](#6-fase-5--auditor-de-marketing-y-comunicación)
7. [Fase 6 — Auditor de UX / Diseño](#7-fase-6--auditor-de-ux--diseño)
8. [Fase 7 — Auditor de DevOps / Deploy](#8-fase-7--auditor-de-devops--deploy)
9. [Fase 8 — Auditor de Testing / QA](#9-fase-8--auditor-de-testing--qa)
10. [Fase 9 — Auditor de Documentación](#10-fase-9--auditor-de-documentación)
11. [Fase 10 — Auditor Legal / Compliance](#11-fase-10--auditor-legal--compliance)
12. [Resumen y matriz de hallazgos](#12-resumen-y-matriz-de-hallazgos)

---

## 1. Mapa de documentación por rol

Antes de empezar cada fase, el auditor debe leer los documentos asignados a su rol. Este mapa elimina ambigüedad sobre qué leer.

| # | Rol de auditoría | Documentos a revisar | Ubicación |
|---|------------------|----------------------|-----------|
| 1 | **Producto** | PRD_FINAL.md, ESTADO_ACTUAL.md, ROADMAP_FUTURO.md, PLANES_FUENTE_VERDAD.md, REVISION_PLANES_BARRIO.md | [01-producto/](01-producto/) |
| 2 | **Técnico / Arquitectura** | REGLAS_ARQUITECTURA_DOMINIOS.md, FIRESTORE_DATA_DICT.md, PERFORMANCE_STACK.md, MIGRACION.md | [02-tecnico/](02-tecnico/) |
| 3 | **Seguridad** | SALUD_Y_SEGURIDAD.md, firestore.rules, storage.rules, middleware.ts, next.config.ts | [03-seguridad/](03-seguridad/) |
| 4 | **Negocio / Monetización** | PLANES_FUENTE_VERDAD.md, PRICING_FUNDADORES_IMPLEMENTACION.md, MERCADOPAGO_*.md, DOCUMENTO_INTERNO_*.md | [04-negocio/](04-negocio/) |
| 5 | **Marketing / Comunicación** | GUIA_MARKETING_Y_COMUNICACION.md, PLAYBOOK_VENTAS*.md, ESTRATEGIA_FOMO*.md | [05-marketing/](05-marketing/) |
| 6 | **UX / Diseño** | DISEÑO_MOBILE_FIRST.md, GUIA_ESTILOS.md, PRD_FINAL.md §7 | [06-ux-diseno/](06-ux-diseno/) |
| 7 | **DevOps / Deploy** | DEPLOY.md, GUIA_ERRORES_DEPLOY.md (portal + inmobiliaria) | [07-devops/](07-devops/) |
| 8 | **Testing / QA** | PRD_FINAL.md §12, ESTADO_ACTUAL.md, __tests__/ en ambas apps | [08-testing/](08-testing/) |
| 9 | **Documentación** | docs/README.md, AUDITORIA_SISTEMA_2026.md, todos los docs | [09-documentacion/](09-documentacion/) |
| 10 | **Legal / Compliance** | Políticas de privacidad, términos y condiciones | [10-legal/](10-legal/) |

---

## 2. Fase 1 — Auditor de Producto

**Objetivo:** Verificar que lo que se prometió en el PRD está implementado, que los planes son coherentes y que el roadmap es realista.

### Paso 1.1 — Validar el PRD contra el estado actual

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Cada feature marcada como "✅ Completado" en PRD sección 5 realmente funciona | [PRD_FINAL.md](producto/PRD_FINAL.md) | Comparar MoSCoW MUST HAVE vs funcionalidades reales en la app |
| 2 | Features "🔜" (pendientes) no están prometidas como hechas en la web/marketing | [ESTADO_ACTUAL.md](producto/ESTADO_ACTUAL.md) | Push notifications, ISR, email notifications, WhatsApp API |
| 3 | Las personas del PRD (Martín, Carolina, Laura) se reflejan en la UX real | [PRD_FINAL.md](producto/PRD_FINAL.md) §4 | ¿El filtro de garantías funciona para Laura? ¿El dark mode funciona para Martín? |

### Paso 1.2 — Validar coherencia de planes

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Los límites de `PLAN_LIMITS` en código coinciden con lo documentado (1 / 10 / 999) | [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md) | `apps/portal/app/publish/page.tsx` y `apps/inmobiliaria/app/publish/page.tsx` |
| 2 | Las inclusiones por plan (perfil, badge, analytics) coinciden entre la web y la documentación | [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md) | Comparar copy de `/publish/pricing` con el doc |
| 3 | Premium = Elite en el feed: mapeo correcto al guardar posts | [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md) §Inconsistencias | `CreatePostModal.tsx` normaliza `premium` → `elite` |
| 4 | Boosts de ranking son coherentes (free: 1.0, pro: 1.2, elite: 1.35) | [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md) | `lib/feed/ranking.ts` en portal e inmobiliaria |
| 5 | Los precios en la web coinciden: 0 / 1.600 UYU / 3.600 UYU | [DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md](DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md) | Precio en pricing page vs docs |

### Paso 1.3 — Validar roadmap vs realidad

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Items marcados como "✅" en ROADMAP realmente están completos | [ROADMAP_FUTURO.md](producto/ROADMAP_FUTURO.md) | Validar cada fase 0-4 |
| 2 | Timeline es realista: ¿5 agentes beta en semana 2-4? ¿50 agentes mes 2? | [ROADMAP_FUTURO.md](producto/ROADMAP_FUTURO.md) | Comparar con métricas reales actuales |
| 3 | KPIs de PRD (Mes 6: 2K props, 200 agentes, $2K MRR) son alcanzables | [PRD_FINAL.md](producto/PRD_FINAL.md) §10 | Crecimiento necesario vs base actual |

**Entregable:** Lista de inconsistencias producto/código con severidad (Crítica / Alta / Media / Baja).

---

## 3. Fase 2 — Auditor Técnico / Arquitectura

**Objetivo:** Verificar la salud del stack técnico, la separación de dominios y la calidad del código.

### Paso 2.1 — Verificar arquitectura del monorepo

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Portal (Barrio.uy) y Inmobiliaria (MiBarrio.uy) no mezclan funcionalidades | [REGLAS_ARQUITECTURA_DOMINIOS.md](../REGLAS_ARQUITECTURA_DOMINIOS.md) | Feed/red social solo en portal; publicación transaccional en inmobiliaria |
| 2 | Los packages compartidos (lib, types, ui, config) están correctamente referenciados | turbo.json, package.json de cada app | Imports `@repo/types`, `@repo/lib`, `@repo/ui` |
| 3 | No hay código duplicado entre portal e inmobiliaria que debería estar en packages | Comparar archivos homólogos | `lib/feed/ranking.ts`, tipos, utilidades |

### Paso 2.2 — Verificar modelo de datos

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Las colecciones en Firestore coinciden con el diccionario | [FIRESTORE_DATA_DICT.md](tecnico/FIRESTORE_DATA_DICT.md) | `users`, `properties`, `leads`, `feedPosts`, `config`, `corporate_leads` |
| 2 | Los índices compuestos están desplegados y coinciden con las queries | [FIRESTORE_DATA_DICT.md](tecnico/FIRESTORE_DATA_DICT.md) §2 | `firestore.indexes.json` en portal e inmobiliaria |
| 3 | El tipo `Property` en código coincide con el doc | [PRD_FINAL.md](producto/PRD_FINAL.md) §6.2 | `packages/types/src/index.ts` vs Firestore Data Dict |

### Paso 2.3 — Verificar performance

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Técnicas documentadas en PERFORMANCE_STACK están aplicadas | [PERFORMANCE_STACK.md](tecnico/PERFORMANCE_STACK.md) | React Compiler, Suspense, optimizePackageImports, preconnect, Cache-Control |
| 2 | Core Web Vitals cumplen objetivos: LCP < 2.5s, FID < 100ms, CLS < 0.1 | [PRD_FINAL.md](producto/PRD_FINAL.md) §9.1 | Ejecutar Lighthouse en producción (mobile + desktop) |
| 3 | Bundle size < 200KB First Load JS | [PRD_FINAL.md](producto/PRD_FINAL.md) §9.1 | `npm run build` → revisar output |
| 4 | Upstash Redis (cache layer) está activo y sirviendo | [PERFORMANCE_STACK.md](tecnico/PERFORMANCE_STACK.md) | Verificar middleware y rate limiting |

### Paso 2.4 — Verificar stack y dependencias

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | Next.js, React, TypeScript están en versiones documentadas | package.json vs PRD §6.1 |
| 2 | No hay dependencias vulnerables | `npm audit` en raíz del monorepo |
| 3 | TypeScript strict mode está habilitado | `tsconfig.json` de cada app |
| 4 | ESLint configurado y sin errores bloqueantes | `eslint.config.mjs` de cada app |

**Entregable:** Reporte técnico con deuda técnica identificada, riesgos de escalabilidad y recomendaciones.

---

## 4. Fase 3 — Auditor de Seguridad

**Objetivo:** Verificar que todos los vectores de ataque están mitigados y que las correcciones documentadas se aplicaron.

### Paso 3.1 — Verificar correcciones aplicadas

| # | Corrección documentada | Doc de referencia | Cómo verificar |
|---|----------------------|-------------------|-----------------|
| 1 | Storage: solo el dueño de la propiedad puede subir imágenes | [SALUD_Y_SEGURIDAD.md](SALUD_Y_SEGURIDAD.md) §2.2 | Revisar `apps/portal/storage.rules` — debe tener `firestore.get(...)` |
| 2 | `getPostsToday` eliminado de reglas Firestore; límite 5/día en cliente | [SALUD_Y_SEGURIDAD.md](SALUD_Y_SEGURIDAD.md) §2.2 | Revisar reglas + `CreatePostModal.tsx` |
| 3 | Admin API: 503 en producción si no hay Firebase Admin | [SALUD_Y_SEGURIDAD.md](SALUD_Y_SEGURIDAD.md) §2.2 | Revisar `/api/admin/me` — no debe usar `getEmailFromTokenUnsafe` en prod |
| 4 | `.env.example` sin valores reales en portal y monorepo | [SALUD_Y_SEGURIDAD.md](SALUD_Y_SEGURIDAD.md) §1.2 | Verificar que existen y no contienen secrets |

### Paso 3.2 — Verificar headers y CSP

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | HSTS con preload habilitado | `next.config.ts` → headers → `Strict-Transport-Security` |
| 2 | X-Frame-Options: DENY | `next.config.ts` → headers |
| 3 | CSP definida (script-src, style-src, img-src, connect-src) | `next.config.ts` → Content-Security-Policy |
| 4 | Permissions-Policy configurada | `next.config.ts` → headers |

### Paso 3.3 — Verificar rate limiting

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | API protegida: 30 req/min | middleware.ts → Upstash Redis |
| 2 | Leads protegidos: 5 req/min | middleware.ts → rate limit para /api/leads |
| 3 | Fail-open si Redis no está disponible | middleware.ts → try/catch que permite pasar |

### Paso 3.4 — Verificar Firestore rules

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | `leads`: solo el dueño (propertyOwnerId) o admin puede leer | firestore.rules en portal e inmobiliaria |
| 2 | `properties`: solo propiedades activas son legibles por anónimos | firestore.rules → `resource.data.status == 'active'` |
| 3 | `users`: escritura solo por el dueño o admin | firestore.rules |
| 4 | `config`: lectura pública, escritura solo admin | firestore.rules |
| 5 | `corporate_leads`: creación con validación, lectura solo admin | firestore.rules |

### Paso 3.5 — Verificar autenticación

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | OAuth 2.0 via Firebase Auth (Google Sign-In) funciona | Probar login en producción |
| 2 | JWT tokens se verifican correctamente en API routes | Revisar `/api/admin/*` |
| 3 | Dominios autorizados en Firebase Auth incluyen la URL de producción | Firebase Console → Auth → Settings |

**Entregable:** Checklist de seguridad con estado (Aplicado / Pendiente / Riesgo aceptado) y severidad.

---

## 5. Fase 4 — Auditor de Negocio y Monetización

**Objetivo:** Verificar que el modelo de monetización es coherente, que Mercado Pago funciona y que la estrategia FOMO está bien implementada.

### Paso 4.1 — Verificar flujo de monetización

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Página `/publish/pricing` muestra los 3 planes correctamente | [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md) | Base (0), Pro (1.600 UYU), Premium (3.600 UYU) |
| 2 | Toggle mensual/anual funciona (-20% anual) | [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md) | Verificar en la web |
| 3 | Banner Fundadores muestra contador en tiempo real desde Firestore | [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md) | `config/launch.founderSlotsUsed` |
| 4 | Checkout aplica cupón `FUNDADOR30` (30% OFF) en backend | [MERCADOPAGO_CUPON_FUNDADOR.md](MERCADOPAGO_CUPON_FUNDADOR.md) | `apps/portal/app/api/mercadopago/checkout/route.ts` |
| 5 | Variable `NEXT_PUBLIC_FOUNDER_MODE` respeta los 3 estados | [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md) | `active` / `closed` / `disabled` |

### Paso 4.2 — Verificar Mercado Pago

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | `MP_ACCESS_TOKEN` configurado en Vercel (producción) | [MERCADOPAGO_PRODUCTION_GUIDE.md](tecnico/MERCADOPAGO_PRODUCTION_GUIDE.md) | Token `APP_USR-...` (no `TEST-...`) |
| 2 | Webhook configurado en MP para recibir notificaciones de pago | [MERCADOPAGO_PRODUCTION_GUIDE.md](tecnico/MERCADOPAGO_PRODUCTION_GUIDE.md) | URL: `https://barrio.uy/api/mercadopago/webhook` |
| 3 | Flujo de suscripción completo funciona (crear, pagar, activar plan) | Probar en sandbox | Usar tarjetas de prueba de MP |

### Paso 4.3 — Verificar estrategia FOMO

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Badge en feed: Free = "Propiedad Estándar", Pro/Premium = "✨ Destacado" | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `FeedPostCard.tsx` |
| 2 | Teaser de leads: "X interesados (Oculto)" para usuarios Free | [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md) | `my-properties/page.tsx` |
| 3 | Salud de la propiedad: 🟢/🟡/🔴 según días (solo Free) | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `PropertyHealthCard.tsx` |
| 4 | Penalización ranking: Free pierde peso día 4-7 (×0.8) y 8+ (×0.6) | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `lib/feed/ranking.ts` |
| 5 | "Lo que te perdés" en Plan Base de pricing | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `/publish/pricing` |
| 6 | Oferta 24h: 20% OFF al intentar 2.ª propiedad como Free | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `UpgradeOffer.tsx` + publish page |
| 7 | `NEXT_PUBLIC_FOMO_MODE` respeta los 4 modos | [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) | `conservative` / `balanced` / `aggressive` / `disabled` |
| 8 | Tarjeta de upgrade cuando free tiene 1 propiedad | [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md) | `publish/page.tsx` + `my-properties` |

### Paso 4.4 — Verificar plan corporativo

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Formulario corporativo funciona y guarda leads en `corporate_leads` | [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md) | `CorporatePlan.tsx` |
| 2 | WhatsApp corporativo apunta al número correcto | [DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md](DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md) | +598 98 300 491 |

**Entregable:** Reporte de monetización con flujo verificado, gaps y riesgos de revenue.

---

## 6. Fase 5 — Auditor de Marketing y Comunicación

**Objetivo:** Verificar coherencia del mensaje, tonos, plantillas y que la propuesta de valor se refleje en todos los canales.

### Paso 5.1 — Verificar coherencia del mensaje

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Elevator pitch se refleja en la home y en meta tags | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §1.1 | "La plataforma inmobiliaria más rápida de Uruguay" |
| 2 | Conceptos clave aparecen en la web: velocidad, mobile-first, gratis, datos Uruguay | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §1.2 | Revisar homepage, pricing, about |
| 3 | Palabras prohibidas no se usan: "revolucionamos", "disruptivo", "leads ilimitados" | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §1.3 | Buscar en código y textos de la app |

### Paso 5.2 — Verificar propuesta de valor por segmento

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Segmentos definidos: compradores, inquilinos, agentes, inmobiliarias, corporativo | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §2 | Cada uno tiene mensaje diferenciado |
| 2 | CTAs correctos por segmento: "Publicá gratis", "Ver planes", "Pedir demo" | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §7 | Revisar botones en la app |

### Paso 5.3 — Verificar playbooks de ventas

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Playbook B2B tiene ICP definido y embudo con métricas | [PLAYBOOK_VENTAS_B2B.md](negocio/PLAYBOOK_VENTAS_B2B.md) | 200 prospectos → 50 registrados → 30 activos |
| 2 | Manejo de objeciones actualizado (precios reales, no los antiguos) | [PLAYBOOK_VENTAS.md](negocio/PLAYBOOK_VENTAS.md) §3 | ¿Dice "gratis ilimitado" cuando ahora es 1 propiedad gratis? |
| 3 | Cold emails y WhatsApp tienen plantillas listas para usar | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §4-5 | Verificar que los links y datos son correctos |

### Paso 5.4 — Verificar coherencia FOMO en comunicación

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | El tono FOMO es "honesto": no timers falsos ni promesas inventadas | Revisar textos de oferta 24h, teaser, badge |
| 2 | "Oferta Fundadores" se comunica como cupos limitados reales (no inventados) | Banner muestra contador real de Firestore |

**Entregable:** Informe de coherencia de mensaje con discrepancias y recomendaciones de copy.

---

## 7. Fase 6 — Auditor de UX / Diseño

**Objetivo:** Verificar que la experiencia de usuario cumple los principios del PRD y que los problemas mobile-first documentados se están atendiendo.

### Paso 6.1 — Verificar principios de diseño

| # | Principio | Doc de referencia | Cómo verificar |
|---|-----------|-------------------|-----------------|
| 1 | **Mobile-first real**: diseñado para pulgar, escalado a desktop | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Probar en 375px, 393px, 768px, 1920px |
| 2 | **Speed is a Feature**: skeletons, optimistic UI, lazy loading | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Inspeccionar carga de cada página |
| 3 | **Progressive Disclosure**: filtros avanzados ocultos, wizard en steps | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Revisar UX de búsqueda y publicación |
| 4 | **Feedback Inmediato**: toasts, spinners, animaciones | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Probar acciones: publicar, enviar lead, favorito |

### Paso 6.2 — Auditar mobile-first (CRÍTICO)

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Documentar capas de diseño rotas en móvil | [DISEÑO_MOBILE_FIRST.md](DISEÑO_MOBILE_FIRST.md) | Listar cada pantalla con problemas de layout |
| 2 | Bottom navigation funciona correctamente en móvil | [PRD_FINAL.md](producto/PRD_FINAL.md) §5 | Zona pulgar, sin overlap con contenido |
| 3 | CTAs mínimo 44x44px, touch targets espaciados | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Inspeccionar con DevTools |
| 4 | Forms tienen keyboard apropiado (email, tel, number) | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.1 | Probar formulario de lead, publicación |

### Paso 6.3 — Verificar diseño visual

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Paleta de colores coherente (light y dark mode) | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.2, [GUIA_ESTILOS.md](guias/GUIA_ESTILOS.md) | Variables CSS, Tailwind config |
| 2 | Tipografía Inter con scale correcto | [PRD_FINAL.md](producto/PRD_FINAL.md) §7.2 | Revisar fuentes cargadas |
| 3 | Dark mode funcional en todas las páginas | [PRD_FINAL.md](producto/PRD_FINAL.md) §5 | Toggle dark mode y verificar contraste |

### Paso 6.4 — Probar flujos críticos en dispositivos

**Matriz de pruebas:**

| Flujo | iPhone SE (375px) | iPhone 15 (393px) | iPad (768px) | Desktop (1920px) |
|-------|-------------------|-------------------|--------------|-------------------|
| Homepage → Búsqueda → Detalle → Lead | [ ] | [ ] | [ ] | [ ] |
| Login → Publicar (4 pasos) → Éxito | [ ] | [ ] | [ ] | [ ] |
| Pricing → Checkout → Pago | [ ] | [ ] | [ ] | [ ] |
| Mi propiedades → Editar → Leads | [ ] | [ ] | [ ] | [ ] |
| Feed → Crear post → Like/WhatsApp | [ ] | [ ] | [ ] | [ ] |

**Entregable:** Lista de bugs de UX por dispositivo y severidad, con capturas.

---

## 8. Fase 7 — Auditor de DevOps / Deploy

**Objetivo:** Verificar que el pipeline de deploy es reproducible, que las variables están configuradas y que los dominios apuntan correctamente.

### Paso 7.1 — Verificar configuración de Vercel

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Dos proyectos en Vercel: portal y inmobiliaria | [DEPLOY.md](DEPLOY.md) §3 | Root directories correctos |
| 2 | Production branch = `main` en ambos proyectos | [DEPLOY.md](DEPLOY.md) §5 | Vercel → Settings → Git |
| 3 | Todas las variables de entorno configuradas | [DEPLOY.md](DEPLOY.md) §2 | Comparar con tabla de variables |
| 4 | Firebase Admin variables (3): PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY | [DEPLOY.md](DEPLOY.md) §2 | Solo en portal |

### Paso 7.2 — Verificar variables de entorno

| Variable | Portal | Inmobiliaria | Notas |
|----------|--------|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Requerido | Requerido | Público |
| `FIREBASE_PROJECT_ID` | Requerido | Opcional | Admin |
| `FIREBASE_CLIENT_EMAIL` | Requerido | Opcional | Admin |
| `FIREBASE_PRIVATE_KEY` | Requerido | Opcional | Admin |
| `CREATOR_EMAILS` | Requerido | Opcional | Admins |
| `NEXT_PUBLIC_APP_URL` | Requerido | Requerido | URL producción |
| `MP_ACCESS_TOKEN` | Si pricing | No | Mercado Pago |
| `NEXT_PUBLIC_FOUNDER_MODE` | Opcional | No | Banner |
| `NEXT_PUBLIC_FOMO_MODE` | Opcional | Opcional | Estrategia FOMO |

### Paso 7.3 — Verificar dominios y DNS

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | `barrio.uy` apunta al proyecto portal de Vercel | Vercel → Settings → Domains |
| 2 | `mibarrio.uy` apunta al proyecto inmobiliaria | Vercel → Settings → Domains |
| 3 | HTTPS forzado en ambos dominios | Verificar redirect HTTP → HTTPS |
| 4 | Dominios en Firebase Auth → Authorized domains | Firebase Console |

### Paso 7.4 — Verificar build

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | `npm run build` pasa sin errores en ambas apps | Ejecutar localmente |
| 2 | No hay warnings de TypeScript bloqueantes | Output del build |
| 3 | No hay dependencias faltantes | `npm ci` limpio desde cero |

**Entregable:** Checklist de deploy con estado de cada variable, dominio y configuración.

---

## 9. Fase 8 — Auditor de Testing / QA

**Objetivo:** Verificar la cobertura de tests, que los flujos críticos están cubiertos y que el plan de testing se cumple.

### Paso 8.1 — Verificar infraestructura de testing

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Vitest configurado para unit tests | [ESTADO_ACTUAL.md](producto/ESTADO_ACTUAL.md) | `vitest.config.ts` en ambas apps |
| 2 | Playwright configurado para E2E | [ESTADO_ACTUAL.md](producto/ESTADO_ACTUAL.md) | `playwright.config.ts` |
| 3 | Cobertura actual: ¿supera 58.3% documentado? | [ESTADO_ACTUAL.md](producto/ESTADO_ACTUAL.md) | Ejecutar `npm run test:coverage` |

### Paso 8.2 — Verificar cobertura de flujos críticos

| Flujo | Unit test | E2E test | Estado |
|-------|-----------|----------|--------|
| Autenticación (login/logout) | [ ] | [ ] | |
| Publicar propiedad (wizard 4 pasos) | [ ] | [ ] | |
| Búsqueda con filtros | [ ] | [ ] | |
| Enviar lead (formulario de contacto) | [ ] | [ ] | |
| Pricing page (planes, CTAs, toggle) | [ ] | [ ] | |
| Dashboard (mi propiedades, leads) | [ ] | [ ] | |
| Feed (crear post, like, ranking) | [ ] | [ ] | |
| Checkout Mercado Pago | [ ] | [ ] | |

### Paso 8.3 — Ejecutar suite completa

```bash
cd turborepo/atlantida-platform

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Cobertura
npm run test:coverage
```

### Paso 8.4 — Smoke tests manuales

Ejecutar los smoke tests documentados en el roadmap:

- [ ] Homepage → Search → Property → Lead
- [ ] Login → Publish (4 pasos) → Success
- [ ] Favoritos: add/remove
- [ ] Comparador: 3 propiedades
- [ ] Calculadora hipoteca
- [ ] Feed: crear post, ver ranking
- [ ] Mi propiedades: ver leads, editar propiedad
- [ ] Pricing: ver planes, toggle mensual/anual, checkout

**Entregable:** Reporte de testing con cobertura, tests fallidos y flujos sin cubrir.

---

## 10. Fase 9 — Auditor de Documentación

**Objetivo:** Verificar que la documentación está organizada, actualizada, sin duplicados y que cada rol tiene acceso rápido a lo que necesita.

### Paso 9.1 — Verificar estructura objetivo

| # | Verificación | Doc de referencia | Qué buscar |
|---|-------------|-------------------|-------------|
| 1 | Índice maestro (`docs/README.md`) tiene todos los docs actuales | [docs/README.md](README.md) | Comparar con `ls docs/` real |
| 2 | No hay duplicados de PRD fuera de `docs/producto/` | [AUDITORIA_SISTEMA_2026.md](AUDITORIA_SISTEMA_2026.md) | Verificar `apps/portal/PRD_FINAL.md`, `apps/inmobiliaria/PRD_FINAL.md` |
| 3 | Carpetas organizadas: producto/, tecnico/, guias/, negocio/, planes/ | [AUDITORIA_SISTEMA_2026.md](AUDITORIA_SISTEMA_2026.md) §6 | Listar estructura real vs objetivo |

### Paso 9.2 — Verificar actualización de documentos

| Documento | Fecha documentada | ¿Está actualizado? | Acción |
|-----------|-------------------|---------------------|--------|
| PRD_FINAL.md | 25 Feb 2026 | [ ] | |
| ESTADO_ACTUAL.md | 25 Feb 2026 | [ ] | |
| ROADMAP_FUTURO.md | 23 Feb 2026 | [ ] | |
| PLANES_FUENTE_VERDAD.md | — | [ ] | |
| DEPLOY.md | — | [ ] | |
| SALUD_Y_SEGURIDAD.md | 24 Feb 2026 | [ ] | |
| GUIA_MARKETING_Y_COMUNICACION.md | 25 Feb 2026 | [ ] | |
| PLAYBOOK_VENTAS.md | — | [ ] | |
| PLAYBOOK_VENTAS_B2B.md | 22 Feb 2026 | [ ] | |

### Paso 9.3 — Verificar consistencia entre documentos

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | Precios iguales en: PLANES_FUENTE_VERDAD, DOCUMENTO_INTERNO, pricing page, playbooks | 0 / 1.600 / 3.600 UYU |
| 2 | Nomenclatura de planes consistente: Base/Pro/Premium (no "Free/Standard/Enterprise") | Buscar variantes en todos los docs |
| 3 | Número WhatsApp corporativo igual en todos los docs | +598 98 300 491 |
| 4 | Stack tecnológico descrito igual en PRD y PERFORMANCE_STACK | Next.js version, React version |

### Paso 9.4 — Verificar archivos obsoletos

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | No hay build logs en el repo | `build.log`, `build_*.txt` |
| 2 | No hay archivos de extracción | `auditoria_extracted.txt`, `extract_docx.py` |
| 3 | `.gitignore` incluye: `testsprite_tests/tmp/`, `build.log`, `build_*.txt`, `lint_output.txt` | Verificar `.gitignore` |
| 4 | No hay .docx/.pdf versionados que deberían estar en assets externos | Buscar binarios en git |

**Entregable:** Inventario de documentación con estado (Actualizado / Obsoleto / Duplicado / Faltante).

---

## 11. Fase 10 — Auditor Legal / Compliance

**Objetivo:** Verificar que el proyecto cumple con requisitos legales de Uruguay y buenas prácticas de protección de datos.

### Paso 10.1 — Verificar políticas publicadas

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | Política de privacidad accesible en la web | `/privacidad` o equivalente |
| 2 | Términos y condiciones accesibles | `/terminos` o equivalente |
| 3 | Ambos documentos están actualizados con el modelo de negocio actual (planes, Mercado Pago) | Revisar contenido |

### Paso 10.2 — Verificar manejo de datos personales

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | Consentimiento para recopilar datos de leads (nombre, email, teléfono) | Checkbox o texto en formulario de contacto |
| 2 | Datos de pago no se almacenan localmente (Mercado Pago los gestiona) | Verificar que no se guardan tarjetas en Firestore |
| 3 | Derecho a eliminación: ¿se puede borrar un usuario y sus datos? | Revisar si existe flujo de eliminación de cuenta |

### Paso 10.3 — Verificar cumplimiento de comunicación

| # | Verificación | Qué buscar |
|---|-------------|-------------|
| 1 | Emails de marketing tienen opción de desuscripción | Si hay newsletter, verificar link unsubscribe |
| 2 | WhatsApp masivo: solo a contactos que dieron permiso | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md) §5.6 |

**Entregable:** Checklist legal con cumplimiento y gaps regulatorios.

---

## 12. Resumen y matriz de hallazgos

Al finalizar todas las fases, consolidar los hallazgos en esta matriz:

| # | Fase | Rol | Hallazgo | Severidad | Estado | Acción requerida | Responsable |
|---|------|-----|----------|-----------|--------|-------------------|-------------|
| 1 | | | | Crítica / Alta / Media / Baja | Abierto / Cerrado | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

### Clasificación de severidad

| Severidad | Definición | Plazo de resolución |
|-----------|-----------|---------------------|
| **Crítica** | Bloquea producción, riesgo de seguridad activo, pérdida de datos | < 24 horas |
| **Alta** | Feature no funciona como se prometió, inconsistencia que afecta revenue | < 1 semana |
| **Media** | Mejora necesaria, UX degradada, documentación desactualizada | < 2 semanas |
| **Baja** | Nice-to-have, optimización, cleanup de código/docs | Próximo sprint |

### Orden recomendado de ejecución

```
1. Seguridad (Fase 3)         ← Primero: asegurar que nada está expuesto
2. DevOps / Deploy (Fase 7)   ← Segundo: verificar que el entorno es correcto
3. Técnico (Fase 2)           ← Tercero: verificar arquitectura y performance
4. Producto (Fase 1)          ← Cuarto: verificar que las features existen
5. Monetización (Fase 4)      ← Quinto: verificar que el dinero fluye
6. Testing / QA (Fase 8)      ← Sexto: ejecutar suite de tests
7. UX / Diseño (Fase 6)       ← Séptimo: probar en dispositivos reales
8. Marketing (Fase 5)         ← Octavo: verificar coherencia del mensaje
9. Documentación (Fase 9)     ← Noveno: asegurar que todo está registrado
10. Legal (Fase 10)           ← Décimo: compliance y protección de datos
```

---

## Referencias rápidas

| Documento | Ruta | Contenido principal |
|-----------|------|---------------------|
| PRD_FINAL.md | `docs/producto/PRD_FINAL.md` | Visión, mercado, features, arquitectura, UX, requisitos, KPIs, roadmap, testing, GTM, riesgos |
| ESTADO_ACTUAL.md | `docs/producto/ESTADO_ACTUAL.md` | Dashboard resumen: qué está completo, scores por área |
| ROADMAP_FUTURO.md | `docs/producto/ROADMAP_FUTURO.md` | Fases 0-4, timeline, KPIs proyectados, riesgos |
| PLANES_FUENTE_VERDAD.md | `docs/PLANES_FUENTE_VERDAD.md` | Límites (1/10/999), precios, inclusiones, relación Premium/Elite |
| REVISION_PLANES_BARRIO.md | `docs/REVISION_PLANES_BARRIO.md` | Verificación función por función, inconsistencias, cambios aplicados |
| PRICING_FUNDADORES_IMPLEMENTACION.md | `docs/PRICING_FUNDADORES_IMPLEMENTACION.md` | Banner, cards, corporativo, checkout, Firestore, scripts |
| MERCADOPAGO_CUPON_FUNDADOR.md | `docs/MERCADOPAGO_CUPON_FUNDADOR.md` | Cupón FUNDADOR30: no hace falta en MP; flujo backend |
| MERCADOPAGO_PRODUCTION_GUIDE.md | `docs/tecnico/MERCADOPAGO_PRODUCTION_GUIDE.md` | Credenciales, webhooks, sandbox, variables |
| ESTRATEGIA_FOMO_BARRIO.md | `docs/ESTRATEGIA_FOMO_BARRIO.md` | 6 tácticas FOMO, configuración, modos |
| CAMBIOS_ESTRATEGIA_FOMO.md | `docs/CAMBIOS_ESTRATEGIA_FOMO.md` | Detalle de implementación de cada táctica FOMO |
| SALUD_Y_SEGURIDAD.md | `docs/SALUD_Y_SEGURIDAD.md` | Estructura, headers, rate limiting, Firestore rules, Storage |
| DEPLOY.md | `docs/DEPLOY.md` | Build, variables, Vercel, dominios, troubleshooting |
| PERFORMANCE_STACK.md | `docs/tecnico/PERFORMANCE_STACK.md` | React Compiler, Suspense, cache, ISR, optimizaciones |
| FIRESTORE_DATA_DICT.md | `docs/tecnico/FIRESTORE_DATA_DICT.md` | Colecciones, índices, reglas, rate limiting |
| GUIA_MARKETING_Y_COMUNICACION.md | `docs/GUIA_MARKETING_Y_COMUNICACION.md` | Pitch, tonos, emails, WhatsApp, CTAs, canales |
| PLAYBOOK_VENTAS.md | `docs/negocio/PLAYBOOK_VENTAS.md` | Pitch, ICP, objeciones, cold email, demo |
| PLAYBOOK_VENTAS_B2B.md | `docs/negocio/PLAYBOOK_VENTAS_B2B.md` | Embudo 200→50, ICP, secuencias, LinkedIn/IG/WA |
| DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md | `docs/DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md` | Precios, planes, frases para el equipo, dónde está cada cosa |
| DISEÑO_MOBILE_FIRST.md | `docs/DISEÑO_MOBILE_FIRST.md` | Principio mobile-first, capas rotas, prioridades |
| REGLAS_ARQUITECTURA_DOMINIOS.md | raíz monorepo | Portal vs Inmobiliaria: qué va en cada app |
| AUDITORIA_SISTEMA_2026.md | `docs/AUDITORIA_SISTEMA_2026.md` | Auditoría previa: inventario, estructura objetivo, checklist |

---

*Documento creado: 25 Febrero 2026*  
*Uso: Auditoría interna — ejecutar las 10 fases en el orden recomendado y consolidar hallazgos en la matriz final.*
