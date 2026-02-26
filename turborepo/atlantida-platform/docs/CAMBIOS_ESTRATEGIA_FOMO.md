# Documento de cambios: Estrategia FOMO para Barrio.uy

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Estado:** Implementado en portal e inmobiliaria  

Este documento describe todos los cambios realizados en la plataforma para implementar la **estrategia de conversión Free → Pro** basada en FOMO (Fear Of Missing Out), sin bloquear funcionalidad sino mostrando el valor que el usuario se pierde al permanecer en el Plan Base.

---

## 1. Objetivo y contexto

### Objetivo
- Aumentar la conversión de usuarios **Plan Base (Free)** a **Plan Pro** o **Premium**.
- Hacerlo de forma **honesta y medible**: sin timers falsos ni promesas inventadas, con tono cercano al mercado uruguayo.
- Permitir **rollback rápido** si alguna táctica genera más abandono que conversión.

### Principio rector
> No bloquear. **Iluminar el valor que ya están dejando pasar.**

### Referencias de producto
- Límites e inclusiones por plan: `docs/PLANES_FUENTE_VERDAD.md`
- Revisión de planes y consistencia: `docs/REVISION_PLANES_BARRIO.md`
- Resumen técnico de tácticas: `docs/ESTRATEGIA_FOMO_BARRIO.md`

---

## 2. Resumen de cambios por área

| Área | Cambios principales |
|------|---------------------|
| **Paquete compartido (`@repo/lib`)** | Config FOMO, eventos de analytics para FOMO. |
| **Portal** | Badge en feed, teaser de leads, salud de propiedad, penalización en ranking, pricing “lo que te perdés”, oferta con timer en publicar. |
| **Inmobiliaria** | Teaser de leads, salud de propiedad, penalización en ranking, oferta con timer en publicar. |
| **Documentación** | Este documento, actualización de `ESTRATEGIA_FOMO_BARRIO.md`. |

---

## 3. Cambios en el paquete compartido (`packages/lib`)

### 3.1 Configuración FOMO (`src/fomo-config.ts`) — **NUEVO**

- **Qué es:** Punto único de configuración para activar o desactivar cada táctica FOMO según la variable de entorno.
- **Exporta:**
  - `FOMO_MODE`: valor leído de `NEXT_PUBLIC_FOMO_MODE` (o `'balanced'` por defecto).
  - `FOMO_TACTICS`: listas de tácticas por modo (conservative, balanced, aggressive).
  - `isFOMOTacticEnabled(tactic)`: función que indica si una táctica está activa según el modo actual.

- **Modos:**
  - `conservative`: solo `badge` y `teaser`.
  - `balanced`: badge, teaser, `health_card`, `ranking_penalty` (por defecto).
  - `aggressive`: lo anterior + `timer_offer`.
  - `disabled`: ninguna táctica activa.

- **Uso en código:** Cualquier componente o módulo (portal, inmobiliaria, ranking) importa `isFOMOTacticEnabled` desde `@repo/lib` y condiciona la lógica o el render a esa función.

### 3.2 Eventos de analytics (`src/tracking.ts`) — **MODIFICADO**

Se añadieron eventos para medir la estrategia FOMO:

| Evento | Cuándo se dispara | Datos |
|--------|-------------------|--------|
| `fomo_upgrade_offer_shown` | La primera vez que se muestra la oferta de 24h al usuario free con 1 propiedad. | `userId`, `source: 'publish_limit'` |
| `fomo_upgrade_offer_clicked` | El usuario hace clic en “Activar ahora” de la oferta. | `userId`, `discount`, `source` |
| `fomo_badge_viewed` | Se muestra el badge “Propiedad Estándar” en el feed (solo publicaciones de plan free). | `propertyId`, `userPlan`, `location: 'feed'` |
| `fomo_teaser_clicked` | El usuario free hace clic en “Ver quiénes” del teaser de leads. | `propertyId`, `leadsCount`, `userPlan` |
| `fomo_health_card_viewed` | Se muestra la tarjeta de “Salud de la propiedad” en my-properties. | `propertyId`, `status` (good/warning/critical), `userPlan` |

- **Uso:** Dashboards y análisis de conversión (por ejemplo: embudo desde teaser → pricing → upgrade).

### 3.3 Export en el paquete (`src/index.ts`) — **MODIFICADO**

- Se añadió `export * from './fomo-config'` para que `isFOMOTacticEnabled` y el resto de la config FOMO estén disponibles al importar `@repo/lib`.

---

## 4. Cambios en la app Portal

### 4.1 Feed: badge de estatus (`components/feed/FeedPostCard.tsx`)

- **Qué hace:** En cada publicación del feed se muestra un badge según el plan del autor:
  - **Plan Free:** “Propiedad Estándar” (gris), con tooltip: “Mejorá tu plan para destacar tu propiedad en el Feed”.
  - **Plan Pro o Premium/Elite:** “✨ Destacado” (azul).
- **Condición:** Solo si `isFOMOTacticEnabled('badge')` es verdadero.
- **Analytics:** Se envía `fomo_badge_viewed` cuando el badge se muestra para una publicación de plan free (una vez por post al montar la tarjeta).

### 4.2 My Properties: teaser de leads (`app/my-properties/page.tsx`)

- **Qué hace:** Para usuarios **Free** que tienen al menos un lead en una propiedad:
  - Se muestra el texto “🔒 X interesado(s) (Oculto)” y el enlace “Ver quiénes →”.
  - Al hacer clic se abre un **modal** con nombres de ejemplo en blur y el mensaje: “Desbloqueá el contacto directo con tus interesados mejorando a Pro”, con botón “Ver planes y desbloquear” y “Tal vez después”.
- **Condición:** Solo si `isFOMOTacticEnabled('teaser')` y el usuario tiene plan free y esa propiedad tiene leads.
- **Analytics:** Al hacer clic en “Ver quiénes” se envía `fomo_teaser_clicked` con `propertyId`, `leadsCount` y `userPlan`.

### 4.3 My Properties: salud de la propiedad (`components/PropertyHealthCard.tsx` + página)

- **Qué hace:** En la lista de propiedades de my-properties, por cada propiedad se muestra una tarjeta “Salud de [nombre]”:
  - **Usuario Pro/Premium:** “✓ Visibilidad Máxima activa (Plan X)”.
  - **Usuario Free:**
    - 0–3 días: “🟢 Visibilidad: Buena (Estándar)”.
    - 4–7 días: “🟡 Visibilidad: Media (perdiendo posición)”.
    - 8+ días: “🔴 Visibilidad: Baja (aparecés después de las Pro)” y enlace “Recuperar visibilidad máxima →” a `/publish/pricing`.
- **Condición:** Solo si `isFOMOTacticEnabled('health_card')`.
- **Analytics:** Al montar la tarjeta se envía `fomo_health_card_viewed` con `propertyId`, `status` y `userPlan`.
- **Helper:** Se creó `lib/getDaysDifference.ts` para calcular días entre fechas (usado por la salud y por el ranking).

### 4.4 Ranking del feed: penalización por antigüedad (`lib/feed/ranking.ts`)

- **Qué hace:** En el cálculo del score de ranking, **solo para publicaciones de plan Free**:
  - Días 0–3: sin penalización (factor 1).
  - Días 4–7: score multiplicado por **0,8** (−20%).
  - Días 8 en adelante: score multiplicado por **0,6** (−40%).
- **Condición:** Solo si `isFOMOTacticEnabled('ranking_penalty')`.
- **Export:** Se exporta `getFreeAgePenalty(publishedMs, nowMs)` para tests.
- **Tests:** En `__tests__/ranking.test.ts` se añadió un test que verifica los factores 1, 0,8 y 0,6 según los días.

### 4.5 Página de precios: “Lo que te perdés” (`app/publish/pricing/page.tsx`)

- **Qué hace:** En el **Plan Base** se añadió una lista de limitaciones con icono ✖ en rojo:
  - No sabés quién te contactó  
  - Desaparecés después de 7 días  
  - Sin badge de confianza  
  - Sin Analytics & CRM  
- **Objetivo:** Contraste visual entre lo que tiene el plan actual y lo que obtendría con Pro/Premium.

### 4.6 Publicar: oferta con timer de 24h (`components/publish/UpgradeOffer.tsx` + `app/publish/page.tsx`)

- **Qué hace:** Cuando el usuario tiene plan **Free** y **ya tiene al menos 1 propiedad** y entra al paso 1 de publicar:
  - Se muestra un bloque con “Oferta de bienvenida: 20% OFF en tu primer mes de Pro”, con countdown en horas y minutos (24 horas desde la primera vez que vio la oferta) y botón “Activar ahora” que lleva a `/publish/pricing?offer=welcome20`.
  - El timer se guarda en `localStorage` por usuario (`upgrade_offer_{userId}`); tras 24h la oferta deja de mostrarse pero la tarjeta “Has alcanzado el límite del Plan Base” sigue visible.
- **Condición:** Solo si `isFOMOTacticEnabled('timer_offer')` y el usuario es free con ≥ 1 propiedad.
- **Analytics:** `fomo_upgrade_offer_shown` al mostrar la oferta por primera vez; `fomo_upgrade_offer_clicked` al hacer clic en “Activar ahora”.

---

## 5. Cambios en la app Inmobiliaria

La app Inmobiliaria **no tiene feed de publicaciones sociales**; el resto de tácticas se replicaron donde aplica.

### 5.1 My Properties: userPlan, teaser y salud

- **`app/my-properties/page.tsx`:**
  - Se añade estado `userPlan` (leído de `users/{uid}.plan`) y `showLeadsModal`.
  - Misma lógica que en portal: teaser “X interesados (Oculto)” + modal blur para usuarios free cuando la propiedad tiene leads, y tarjeta de “Salud de la propiedad” por propiedad.
  - Condicionado por `isFOMOTacticEnabled('teaser')` e `isFOMOTacticEnabled('health_card')`.
  - Mismos eventos: `fomo_teaser_clicked` y `fomo_health_card_viewed`.

### 5.2 Componentes nuevos en Inmobiliaria

- **`lib/getDaysDifference.ts`:** Misma función que en portal para días entre fechas.
- **`components/PropertyHealthCard.tsx`:** Mismo comportamiento que en portal (salud 🟢/🟡/🔴, enlace a pricing, analytics y comprobación de `health_card`).
- **`components/publish/UpgradeOffer.tsx`:** Misma oferta de 24h y misma comprobación de `timer_offer`.

### 5.3 Publicar: oferta y tarjeta de límite

- **`app/publish/page.tsx`:**
  - Se importa y muestra `UpgradeOffer` cuando el usuario es free y tiene ≥ 1 propiedad (junto con la tarjeta “Has alcanzado el límite del Plan Base” y el enlace a “Ver planes”).

### 5.4 Ranking del feed (`lib/feed/ranking.ts`)

- **Qué hace:** Misma penalización por antigüedad que en portal (0,8 a los 4–7 días, 0,6 a los 8+ para plan free).
- **Condición:** Solo si `isFOMOTacticEnabled('ranking_penalty')`.

### 5.5 Pricing en Inmobiliaria

- La app Inmobiliaria **no incluye** la página `/publish/pricing` en este cambio. Los enlaces “Ver planes” y “Recuperar visibilidad máxima” apuntan a `/publish/pricing`; si esa ruta no existe en la app, habrá que añadirla o redirigir al portal según el despliegue.

---

## 6. Configuración y rollback

### Variable de entorno

- **Nombre:** `NEXT_PUBLIC_FOMO_MODE`
- **Valores:** `conservative` | `balanced` | `aggressive` | `disabled`
- **Por defecto (si no se define):** `balanced`

### Comportamiento por modo

| Modo | Tácticas activas |
|------|-------------------|
| `conservative` | badge, teaser |
| `balanced` | badge, teaser, health_card, ranking_penalty |
| `aggressive` | badge, teaser, health_card, ranking_penalty, timer_offer |
| `disabled` | ninguna |

### Rollback rápido

- Si se detecta subida de churn o malestar:
  - **Suave:** `NEXT_PUBLIC_FOMO_MODE=conservative` (solo badge y teaser; sin penalización ni oferta con timer).
  - **Total:** `NEXT_PUBLIC_FOMO_MODE=disabled` (todas las tácticas desactivadas).

Reinicio o redespliegue necesario para que el cambio de variable tenga efecto (es variable de build en Next.js).

---

## 7. Medición recomendada

- **Conversión Free → Pro (7d / 30d):** ratio de usuarios que pasan de free a pro tras ver las tácticas.
- **CTR en teaser:** clics en “Ver quiénes” / impresiones del teaser (eventos `fomo_teaser_clicked` vs vistas en my-properties con leads).
- **CTR en oferta 24h:** clics en “Activar ahora” / ofertas mostradas (`fomo_upgrade_offer_clicked` / `fomo_upgrade_offer_shown`).
- **Visibilidad de salud:** `fomo_health_card_viewed` por estado (good / warning / critical) para ver cuántos usuarios free ven advertencia de visibilidad baja.
- **Abandono y NPS:** monitorear si aumentan bajas o quejas tras activar ranking_penalty o timer_offer; si es así, pasar a `conservative` o `disabled` y revisar copy o umbrales.

---

## 8. Archivos tocados (referencia rápida)

| App / Paquete | Archivo | Tipo de cambio |
|---------------|---------|----------------|
| **packages/lib** | `src/fomo-config.ts` | Nuevo |
| **packages/lib** | `src/index.ts` | Export fomo-config |
| **packages/lib** | `src/tracking.ts` | Eventos FOMO |
| **portal** | `components/feed/FeedPostCard.tsx` | Badge + flag + analytics |
| **portal** | `lib/getDaysDifference.ts` | Nuevo |
| **portal** | `components/PropertyHealthCard.tsx` | Nuevo |
| **portal** | `app/my-properties/page.tsx` | Teaser, modal, health, flags, analytics |
| **portal** | `lib/feed/ranking.ts` | Penalización + flag |
| **portal** | `app/publish/pricing/page.tsx` | “Lo que te perdés” Plan Base |
| **portal** | `components/publish/UpgradeOffer.tsx` | Nuevo |
| **portal** | `app/publish/page.tsx` | Uso de UpgradeOffer |
| **portal** | `__tests__/ranking.test.ts` | Test penalización |
| **inmobiliaria** | `lib/getDaysDifference.ts` | Nuevo |
| **inmobiliaria** | `components/PropertyHealthCard.tsx` | Nuevo |
| **inmobiliaria** | `components/publish/UpgradeOffer.tsx` | Nuevo |
| **inmobiliaria** | `app/my-properties/page.tsx` | userPlan, teaser, modal, health |
| **inmobiliaria** | `app/publish/page.tsx` | UpgradeOffer |
| **inmobiliaria** | `lib/feed/ranking.ts` | Penalización + flag |
| **docs** | `ESTRATEGIA_FOMO_BARRIO.md` | Actualizado |
| **docs** | `CAMBIOS_ESTRATEGIA_FOMO.md` | Nuevo (este documento) |

---

## 9. Referencias cruzadas

- **Planes y límites:** `docs/PLANES_FUENTE_VERDAD.md`
- **Revisión de planes e implementación previa:** `docs/REVISION_PLANES_BARRIO.md`
- **Resumen técnico y configuración:** `docs/ESTRATEGIA_FOMO_BARRIO.md`
- **Documento de estrategia original (externo):** Estrategia de Conversión con FOMO para Barrio.uy v1.0 (Feb 2026)

---

*Última actualización: 25 Febrero 2026*
