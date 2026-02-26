# Planes Barrio.uy — Fuente única de verdad

Este documento es la referencia oficial de planes para **publicación de propiedades** en Barrio.uy. Para el Feed (publicaciones sociales) se usa la misma nomenclatura donde **Premium (propiedades) = Elite (feed)**.

---

## Límites por plan (propiedades)

| Plan     | ID en BD  | Propiedades activas | UYU/mes | USD aprox. |
|----------|-----------|----------------------|---------|------------|
| Base     | `free`    | 1                    | 0       | 0          |
| Pro      | `pro`     | 10                   | 1.600   | ~40        |
| Premium  | `premium` | 999 (ilimitado)      | 3.600   | ~90        |

- **Constante en código:** `PLAN_LIMITS` en `apps/inmobiliaria/app/publish/page.tsx` y en `apps/portal/app/publish/page.tsx` (si aplica).
- Anual: -20% sobre el mensual (cobro vía Mercado Pago).

---

## Inclusiones por plan (copy para `/publish/pricing`)

### Plan Base
- 1 Propiedad activa
- Perfil Básico
- Panel de publicaciones y contactos
- Soporte por Email

### Plan Pro
- Hasta 10 Propiedades
- Perfil Profesional
- Mayor visibilidad en Feed y búsqueda
- Badge de Verificado Pro
- Soporte Prioritario

### Plan Premium
- Propiedades Ilimitadas
- Perfil Agencia (Logo & Social)
- Máxima visibilidad en Feed y búsqueda
- Badge de Verificado Elite
- Soporte 24/7
- Analytics & CRM básico

---

## Relación con el Feed

- En **Firestore** y **API** los planes de usuario son: `free`, `pro`, `premium` (y opcionalmente `elite` para beta/creator).
- En el **Feed** y el **ranking** se usa `AgentPlan = 'free' | 'pro' | 'elite'`. El plan **Premium** de propiedades se trata como **Elite** en el feed (mismo boost y badge).
- Al guardar un post en el feed, si el usuario tiene `plan: 'premium'` se persiste como `plan: 'elite'` para consistencia de ranking y UI.

---

## Dónde se usa

- **Pricing:** `apps/portal/app/publish/pricing/page.tsx` — array `PLANS` con features y precios. Plan Base incluye lista "Lo que te perdés" (limitaciones con ✖) como parte de la estrategia FOMO. El plan actual del usuario se lee de Firestore `users/{uid}.plan` y se muestra en la página ("Tu plan actual") y en la tarjeta correspondiente ("Plan Actual") para comparar precios.
- **Dashboard (Mi propiedades):** Barra "Tu plan actual" con badge (Base/Pro/Premium) y enlace "Comparar precios" a `/publish/pricing`. Perfil Agencia (logo, portada, empresa, redes) solo para Premium/Elite; Pro tiene solo Perfil Profesional (nombre, teléfono, horario, bio, avatar). Ver [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md) sección "Perfil Profesional vs Perfil Agencia".
- **Límites al publicar:** comprobación en paso 1 de publicar (inmobiliaria y portal) con `PLAN_LIMITS` y documento `users/{uid}.plan`.
- **Tarjeta de upgrade:** cuando `plan === 'free'` y cantidad de propiedades ≥ 1, se muestra la tarjeta “Has alcanzado el límite del Plan Base” con enlace a `/publish/pricing`.
- **Analytics & CRM:** sección “Analytics & CRM” en `my-properties` solo para `userPlan === 'premium' || userPlan === 'elite'` (resumen por estado, leads por propiedad, export CSV ya existente).

---

## Conversión y estrategia FOMO

- **Visibilidad Plan Base (Free):** Las publicaciones Free en el feed pierden peso en el ranking tras 3 días (×0,8 a los 4-7 días, ×0,6 a los 8+). La UI muestra "Salud de la propiedad" en my-properties (🟢/🟡/🔴). Configurable vía `NEXT_PUBLIC_FOMO_MODE`; ver [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) y [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md).
- **Teaser de leads:** Usuarios Free ven "X interesados (Oculto)" en my-properties y un modal que invita a mejorar a Pro para ver contactos.
- **Oferta 24h:** Al intentar publicar la 2.ª propiedad, oferta de bienvenida 20% OFF primer mes de Pro, válida 24h.
