# Revisión y pulido de planes Barrio.uy

## Resumen de lo que ofrecemos hoy (página `/publish/pricing`)

| Plan | Precio | Inclusiones clave |
|------|--------|-------------------|
| **Plan Base** | 0 UYU | 1 propiedad activa, Perfil Básico, Panel de publicaciones y contactos, Soporte por Email |
| **Plan Pro** | 1.600 UYU/mes (~40 USD) | Hasta 10 propiedades, Perfil Profesional, Mayor visibilidad en Feed y búsqueda, Badge Verificado Pro, Soporte Prioritario |
| **Plan Premium** | 3.600 UYU/mes (~90 USD) | Propiedades Ilimitadas, Perfil Agencia (Logo & Social), Máxima visibilidad en Feed y búsqueda, Badge Verificado Elite, Soporte 24/7, Analytics & CRM básico |

---

## Verificación función por función

### Plan Base (Free)
| Promesa | ¿Implementado? | Dónde |
|---------|----------------|-------|
| 1 propiedad activa | ✅ Sí | `PLAN_LIMITS.free = 1` en `apps/inmobiliaria/app/publish/page.tsx` y portal |
| Perfil Básico | ✅ Sí | En `my-properties`: usuarios free solo editan nombre y WhatsApp |
| Panel de publicaciones y contactos | ✅ Sí | Copy actualizado; leads y listado en my-properties (no hay dashboard “estadísticas básicas” dedicado |
| Soporte por Email | ℹ️ Operativo | No hay módulo in-app; se asume contacto externo |

### Plan Pro
| Promesa | ¿Implementado? | Notas |
|---------|----------------|-------|
| Hasta 10 propiedades | ✅ Sí | `PLAN_LIMITS.pro = 10` |
| Perfil Profesional | ✅ Sí | Solo Pro: nombre, WhatsApp, horario, bio y foto (avatar Feed). Sin página Inmobiliarias; sí destaca en el Feed. Ver "Perfil Pro vs Agencia". |
| 2x Visibilidad en búsqueda | ⚠️ No literal | En **Feed** el boost es 1.2x (`pro: 1.2` en `PLAN_BOOSTS`), no 2x. En búsqueda de **propiedades** (Algolia) el orden es `featured` + `publishedAt`; no hay multiplicador 2x por plan |
| Badge Verificado Pro | ✅ Sí | Feed muestra badge “pro”; `authorVerified` para pro/elite |
| Soporte Prioritario | ℹ️ Operativo | Sin canal in-app específico |

### Plan Premium
| Promesa | ¿Implementado? | Notas |
|---------|----------------|-------|
| Propiedades Ilimitadas | ✅ Sí | `PLAN_LIMITS.premium = 999` (prácticamente ilimitado) |
| Perfil Agencia (Logo & Social) | ✅ Sí | Mismo desbloqueo que Pro en my-properties (logo, redes, etc.). Ver "Perfil Pro vs Agencia" más abajo. |
| 4x Visibilidad máxima | ⚠️ No literal | En Feed el boost para **elite** es 1.35x (`elite: 1.35`). Además, el plan en BD es `premium` pero el ranking usa `elite`; si no se mapea, usuarios Premium no reciben ningún boost (bug) |
| Badge Verificado Elite | ⚠️ Riesgo | Si el post guarda `plan: 'premium'`, la UI del feed solo reconoce `elite` para el estilo “Elite”; conviene normalizar premium → elite |
| Soporte 24/7 | ℹ️ Operativo | Sin canal in-app |
| Analytics & CRM básico | ✅ Sí | Sección “Analytics & CRM” en my-properties solo para premium/elite: resumen por estado, leads por propiedad, export CSV. |

---

## Perfil Profesional vs Perfil Agencia (Logo & Social)

- **Plan Pro — Perfil Profesional:** En **Mi propiedades** solo ve y edita: nombre público, WhatsApp, horario, descripción/bio y **tu foto** (avatar para el Feed). No tiene página en Inmobiliarias; sí puede usar el Feed de Barrio.uy y destacar con badge Pro.
- **Plan Premium/Elite — Perfil Agencia:** En **Mi propiedades** ve y edita el perfil completo: foto de portada, logo/avatar, nombre de inmobiliaria/empresa, oficina, email, sitio web, **redes sociales** y bio. Este perfil de agencia es el que puede aparecer en el listado **Inmobiliarias** (cuando la lista sea dinámica por plan).
- **Implementación:** En `apps/portal/app/my-properties/page.tsx` se usa `isPremiumOrElite` para mostrar solo a Premium/Elite el bloque "Perfil Agencia" (cover, logo, empresa, redes, etc.). Pro tiene un bloque distinto "Perfil Profesional" (nombre, teléfono, horario, bio, avatar). El mensaje "Tu perfil de agencia aparece en Inmobiliarias" solo se muestra a Premium/Elite; a Pro se le muestra "Destacá en el Feed con tu badge Pro. Sin página en Inmobiliarias".

---

## Inconsistencias entre productos

- **Pricing de propiedades** (`/publish/pricing`): Plan Base / Pro / **Premium** (UYU, 1 / 10 / 999 propiedades).
- **Feed / PricingModal** (CreatePostModal, FeedRightSidebar): Plan Base / Pro / **Elite** (otra moneda, 5 / 50 / ilimitado publicaciones en el feed).
- **Código**: `AgentPlan` en `packages/types` es `'free' | 'pro' | 'elite'`; en Firestore y API se usa también `'premium'`. Los boosts de ranking solo tienen `free`, `pro`, `elite` → usuarios con `plan: 'premium'` no reciben el boost de “elite” si no se mapea.

---

## Tarjeta de mejora cuando el usuario free “gasta” su plan

- **Comportamiento actual**: Al intentar publicar una segunda propiedad (límite free = 1), solo aparece un **toast** con mensaje de límite y acción “Ver Planes” que lleva a `/publish/pricing`. No hay una tarjeta o bloque persistente en la página que invite a mejorar plan.
- **Dónde sí hay CTA de mejora**: En “Mi propiedades” (my-properties) hay botón “Mejorar a Pro o Premium” para usuarios free; en el Feed (portal) el sidebar tiene una tarjeta “Barrio Premium” con “Mejorar Plan” a `/publish/pricing` (siempre visible, no condicionada a haber gastado el plan).
- **Conclusión**: No existe una tarjeta específica que aparezca **cuando el usuario free ya tiene 1 propiedad y ve el límite** (solo el toast). Sería mejor añadir una tarjeta/banner en ese contexto para aumentar conversión.

---

## Ideas de mejora

1. **Unificar nomenclatura y boosts**
   - Tratar `premium` como `elite` en Feed y ranking (al guardar el post o al calcular score) para que los usuarios Premium reciban el boost 1.35x y el badge correcto.
   - Opción alternativa: en la página de pricing bajar la promesa a “Mayor visibilidad” en lugar de “2x”/“4x”, o subir los multiplicadores en código (pro 2.0, elite 4.0) si quieren mantener el copy literal.

2. **Tarjeta de upgrade al alcanzar límite free**
   - En la pantalla de publicar (paso 1), si el usuario es free y ya tiene 1 propiedad, mostrar una tarjeta destacada (no solo el toast) con: “Has alcanzado el límite del Plan Base. Desbloquea más propiedades con Pro o Premium” y botón a `/publish/pricing`.
   - Opcional: mismo mensaje en “Mi propiedades” cuando `properties.length >= 1` y `plan === 'free'`.

3. **Analytics & CRM para Premium**
   - Si se mantiene la promesa “Analytics & CRM básico”, añadir al menos: una sección en my-properties o un subdashboard con resumen de leads (por propiedad, por período, estado) y exportación básica (CSV). Si no se va a implementar pronto, quitar esta línea del plan Premium para evitar expectativas incumplidas.

4. **Visibilidad en búsqueda de propiedades**
   - Hoy la búsqueda ordena por `featured` y `publishedAt`. Para acercarse a “2x/4x visibilidad” por plan, se podría: dar más peso a propiedades de usuarios Pro/Premium en Algolia (atributo o réplica de `userPlan` en el índice) o aclarar en pricing que “mayor visibilidad” incluye el Feed y destacados, no solo el buscador.

5. **PricingModal (Feed) vs página de precios (propiedades)**
   - Unificar copy y límites entre: modal del feed (Plan Base 5 publicaciones, Pro 50, Elite ilimitado) y página de precios de propiedades (1 / 10 / 999). Definir si son el mismo producto (un solo plan da acceso a propiedades + feed) o dos productos y dejarlo explícito en la UI.

6. **Estadísticas Básicas (Plan Base)**
   - Si se promete “Estadísticas Básicas”, considerar al menos: vistas o clics por propiedad en la lista de my-properties. Si no hay datos aún, cambiar a algo como “Acceso a tu panel de publicaciones” para no prometer métricas que no existen.

---

## Checklist de acciones recomendadas

- [x] Mapear `premium` → `elite` al guardar post en el feed y/o en el cálculo de ranking para que Premium tenga el mismo boost que Elite.
- [x] Añadir tarjeta/banner de “Mejorar plan” cuando usuario free tiene ya 1 propiedad (en flujo de publicar y/o en my-properties).
- [x] Revisar copy “2x”/“4x” visibilidad: o implementar multiplicadores más altos en ranking/búsqueda o cambiar el texto a “Mayor visibilidad”.
- [x] Implementar módulo mínimo “Analytics & CRM básico” para Premium o quitar la línea del plan.
- [x] Unificar y documentar la relación entre planes de propiedades (Base/Pro/Premium) y planes del feed (Base/Pro/Elite) y reflejarlo en una sola fuente de verdad de features.

---

## Cambios implementados en esta iteración

- **Tarjeta de upgrade para usuarios Free al alcanzar el límite**  
  - En `apps/inmobiliaria/app/publish/page.tsx` se añadió un contador de propiedades del usuario (`propertyCount`) y una tarjeta visible cuando el plan es `free` y ya tiene 1 propiedad.  
  - La tarjeta muestra el mensaje “Has alcanzado el límite del Plan Base” y un botón **“Ver planes”** que lleva a `/publish/pricing`, además del toast existente al intentar avanzar.

- **Normalización de `premium` → `elite` en el Feed y en el ranking**  
  - En `apps/portal/components/feed/CreatePostModal.tsx` ahora se normaliza el plan antes de guardar el post: si el perfil tiene `plan: 'premium'`, el post se guarda con `plan: 'elite'` (mismo tier en el feed).  
  - El campo `authorVerified` considera también `premium` como verificado y el estimador de alcance trata `premium` igual que `elite` (4× sobre la base).  
  - En `apps/inmobiliaria/lib/feed/ranking.ts` y `apps/portal/lib/feed/ranking.ts` se añadió lógica para que, si un post existente tuviera `plan: 'premium'`, se use internamente el boost de `elite` al calcular el score.  
  - En `apps/inmobiliaria/functions/src/tracking.ts` se extendió `PLAN_BOOSTS` con `premium: 1.35`, asegurando que la Cloud Function aplique el mismo multiplicador que a `elite`.

- **Documento de revisión de planes**  
  - Este archivo (`docs/REVISION_PLANES_BARRIO.md`) consolida el análisis de cada plan, inconsistencias detectadas, ideas de mejora y el registro de cambios aplicados para futuras iteraciones.

---

## Cambios implementados (segunda iteración — “implementar todos”)

- **Copy en pricing**  
  - Plan Base: "Estadísticas Básicas" → "Panel de publicaciones y contactos".  
  - Plan Pro: "2x Visibilidad en búsqueda" → "Mayor visibilidad en Feed y búsqueda".  
  - Plan Premium: "4x Visibilidad máxima" → "Máxima visibilidad en Feed y búsqueda".  
  - Archivo: `apps/portal/app/publish/pricing/page.tsx`.

- **Analytics & CRM básico (Premium)**  
  - En `apps/portal/app/my-properties/page.tsx` se añadió una sección "Analytics & CRM" visible solo para `userPlan === 'premium' || userPlan === 'elite'`: resumen por estado (Nuevos / Contactados / Cerrados), tabla "Leads por propiedad" y uso del botón "Exportar" ya existente para CSV.

- **Tarjeta de upgrade en Mi propiedades**  
  - En la misma página, cuando el usuario es free y tiene al menos 1 propiedad se muestra la tarjeta "Has alcanzado el límite del Plan Base" con enlace a `/publish/pricing`.

- **Fuente única de verdad**  
  - Creado `docs/PLANES_FUENTE_VERDAD.md` con límites, inclusiones por plan, relación Premium/Elite y referencias a dónde se usa en código.

- **Portal: límites y tarjeta en publicar**  
  - En `apps/portal/app/publish/page.tsx` se añadieron: lectura del plan del usuario desde Firestore (`users/{uid}`), comprobación de límite de propiedades al avanzar (con toast y acción "Ver Planes"), y la misma tarjeta de upgrade cuando el usuario es free y ya tiene 1 propiedad.

---

## Cambios implementados (tercera iteración — Estrategia FOMO)

- **Objetivo:** Aumentar conversión Free → Pro mostrando el valor que el usuario se pierde (FOMO), sin bloquear. Configurable por `NEXT_PUBLIC_FOMO_MODE` y documentado en [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) y [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md).

- **Badge en Feed (portal):** En `FeedPostCard.tsx`, publicaciones Free muestran "Propiedad Estándar" y Pro/Premium "✨ Destacado". Solo si la táctica `badge` está activa.

- **Teaser de leads (portal e inmobiliaria):** En my-properties, usuarios Free con leads en una propiedad ven "🔒 X interesados (Oculto)" y "Ver quiénes →"; al clic, modal con blur y CTA a pricing. Táctica `teaser`.

- **Salud de la propiedad (portal e inmobiliaria):** Tarjeta por propiedad en my-properties con estado 🟢/🟡/🔴 según días desde publicación (0-3, 4-7, 8+), solo para Free. Táctica `health_card`.

- **Penalización por antigüedad en ranking (portal e inmobiliaria):** En `lib/feed/ranking.ts`, publicaciones Free pierden peso a los 4-7 días (×0,8) y 8+ días (×0,6). Táctica `ranking_penalty`.

- **Pricing "Lo que te perdés" (portal):** En `/publish/pricing`, el Plan Base muestra lista de limitaciones con ✖ (no sabés quién te contactó, desaparecés después de 7 días, sin badge, sin Analytics & CRM).

- **Oferta con timer 24h (portal e inmobiliaria):** En el paso 1 de publicar, cuando el usuario es free y ya tiene ≥ 1 propiedad, se muestra oferta "20% OFF primer mes de Pro" válida 24h (localStorage por usuario). Táctica `timer_offer`.

- **Config compartida:** `packages/lib/src/fomo-config.ts` exporta `isFOMOTacticEnabled(tactic)`; todos los componentes y el ranking condicionan su comportamiento a esta función.
