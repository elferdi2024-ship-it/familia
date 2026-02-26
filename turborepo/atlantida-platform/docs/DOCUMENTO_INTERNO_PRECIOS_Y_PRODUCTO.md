# Documento interno — Precios y qué vendemos

**Uso:** Solo equipo interno. Referencia rápida para ventas, soporte y comunicación.  
**Fecha:** 25 Febrero 2026  
**Fuente de verdad de planes:** [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md)

---

## 1. Qué vendemos (resumen)

Vendemos **suscripciones para publicar propiedades** en Barrio.uy (portal marketplace). El usuario paga por **capacidad de publicación** y **herramientas** (visibilidad, leads, analytics, soporte).

- **Producto:** Acceso a la plataforma Barrio.uy para listar propiedades, recibir y gestionar leads, y (en planes superiores) mayor visibilidad y analytics.
- **No vendemos:** Leads sueltos, publicidad display ni integraciones custom como producto estándar (corporativo es a medida).

---

## 2. Planes y precios (lista)

| Plan    | Propiedades activas | Precio mensual | Precio anual   | A quién va dirigido        |
|---------|----------------------|----------------|----------------|----------------------------|
| **Base**   | 1                    | **$ 0**        | $ 0            | Propietarios, prueba       |
| **Pro**    | 10                   | **$ 1.600 UYU** (~40 USD) | −20% sobre mensual | Agentes, pequeños portfolios |
| **Premium**| Ilimitado (999)      | **$ 3.600 UYU** (~90 USD) | −20% sobre mensual | Agencias, muchos avisos     |

- **Cobro:** Mercado Pago (suscripción recurrente). Precios en UYU; USD es referencia.
- **Anual:** 20% de descuento sobre el precio mensual (ej. Pro anual = 12 × 1.600 × 0,8).

---

## 3. Oferta Fundadores (vigente)

- **Qué es:** 30% de descuento sobre el precio del plan (Pro o Premium) para los primeros usuarios.
- **Cupón:** `FUNDADOR30` (aplicado en checkout; no se crea cupón en Mercado Pago).
- **Cupos:** Limitados (contador en banner en la web; dato en Firestore `config/launch.founderSlotsUsed`).
- **Dónde se ve:** Banner en la página de precios del Portal; precios con badge “−30% Fundador”.
- **Variable:** `NEXT_PUBLIC_FOUNDER_MODE` = `active` | `closed` | `disabled`.

**Precios con Fundador (referencia):**
- Pro: ~30% menos de 1.600 UYU/mes.
- Premium: ~30% menos de 3.600 UYU/mes.

---

## 4. Qué incluye cada plan (para el equipo)

| Inclusión              | Base | Pro | Premium |
|------------------------|------|-----|---------|
| Propiedades activas    | 1    | 10  | Ilimitado |
| Perfil                 | Básico | Profesional (nombre, bio, foto; sin página Inmobiliarias) | Agencia (logo, redes, portada; página en Inmobiliarias) |
| Visibilidad en feed/búsqueda | Estándar | Mayor | Máxima |
| Badge                  | —    | Verificado Pro | Verificado Elite |
| Panel publicaciones y contactos | Sí | Sí | Sí |
| Soporte                | Email | Prioritario | 24/7 |
| Analytics y CRM básico | No   | No  | Sí |

- **Plan Base:** Incluye lista “Lo que te perdés” en la web (limitaciones) como parte de la estrategia FOMO.
- **Conversión:** Oferta 24h (20% OFF primer mes de Pro) al intentar publicar la 2.ª propiedad (plan Free).

---

## 5. Corporativo (lo que no está en la tabla de planes)

- **A quién:** Quienes manejan **más de ~1.000 propiedades** o necesitan solución a medida/integración.
- **Qué ofrecemos:** Solución a medida; no hay precio fijo en web. Contacto por formulario en la página de precios y/o WhatsApp.
- **Contacto corporativo:** **+598 98 300 491** (mensaje pre-cargado en la web).
- **Leads:** Se guardan en Firestore en la colección `corporate_leads`.

---

## 6. Cómo decirlo en una frase (para el equipo)

- **Base:** “Una propiedad siempre gratis; el resto de herramientas podés sumarlas con Pro o Premium.”
- **Pro:** “Hasta 10 propiedades, más visibilidad y badge Pro. Ideal para agentes con varios avisos.”
- **Premium:** “Ilimitado, perfil agencia, máxima visibilidad y analytics. Para inmobiliarias.”
- **Fundadores:** “Los primeros tienen 30% OFF con cupón Fundador; cupos limitados.”
- **Corporativo:** “Para carteras muy grandes tenemos solución a medida; contacto por WhatsApp o formulario.”

---

## 7. Dónde está cada cosa (técnico)

- **Precios y límites en código:** `PLAN_LIMITS` en `apps/portal/app/publish/page.tsx` y `apps/inmobiliaria/app/publish/page.tsx`.
- **Página de precios (Portal):** `apps/portal/app/publish/pricing/page.tsx` (Banner Fundadores + cards + bloque corporativo). El plan actual del usuario se lee de Firestore y se muestra ("Tu plan actual" + tarjeta "Plan Actual") para comparar.
- **Dashboard (Mi propiedades):** `apps/portal/app/my-properties/page.tsx` — barra "Tu plan actual" y enlace "Comparar precios". Perfil Agencia (logo, redes, portada) solo para Premium; Pro solo tiene Perfil Profesional.
- **Checkout y cupón:** `apps/portal/app/api/mercadopago/checkout/route.ts` (acepta `coupon: FUNDADOR30`).

---

*Documento interno. No publicar. Última actualización: 25 Febrero 2026.*
