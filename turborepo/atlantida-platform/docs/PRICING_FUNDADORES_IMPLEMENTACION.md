# Pricing y oferta Fundadores — Resumen de implementación

**Fecha:** 25 Febrero 2026  
**Alcance:** Portal (Barrio.uy) — página de precios, banner Fundadores, plan corporativo, integración Mercado Pago.

---

## 1. Resumen ejecutivo

Se implementó la **página de pricing completa** con:

- **Banner Fundadores** con contador en tiempo real desde Firestore (cupos restantes).
- **Tres cards de planes** (Base, Pro, Premium) con subtítulos por segmento, CTAs orientados a conversión, precios animados y modo Fundador (30% OFF).
- **Bloque corporativo** con formulario y WhatsApp directo (+598 98 300 491), mensaje pre-cargado y guardado de leads en Firestore.
- **Checkout** con soporte de cupón `FUNDADOR30` (descuento aplicado en backend).
- **Firestore:** documento `config/launch`, colección `corporate_leads` y reglas de seguridad.
- **Script y despliegue:** inicialización de `config/launch`, reglas desplegadas, documentación de variables y Mercado Pago.

---

## 2. Componentes creados o modificados

| Componente | Ruta | Descripción |
|------------|------|-------------|
| **FounderBanner** | `apps/portal/components/FounderBanner.tsx` | Banner con contador en vivo (`config/launch.founderSlotsUsed`), modos `active` / `closed` / `disabled`, barra de progreso y modal "Ver condiciones". |
| **PricingPlans** | `apps/portal/components/PricingPlans.tsx` | Cards Base/Pro/Premium con segmentos ("Para propietarios", "Para profesionales", "Para agencias"), CTAs ("Empezar a crecer →", "Activar mi Agencia →"), toggle mensual/anual, precios con animación ScrollingNumber, badge −30% Fundador y "Lo que te perdés" en Plan Base. |
| **CorporatePlan** | `apps/portal/components/CorporatePlan.tsx` | Bloque "¿Manejás más de 1.000 propiedades?" con tabs Formulario / WhatsApp, validación, éxito y guardado en `corporate_leads` (o `onFormSubmit` custom). WhatsApp: +598 98 300 491 con mensaje pre-cargado. |
| **Pricing page** | `apps/portal/app/publish/pricing/page.tsx` | Orquesta: `FounderBanner` (30 cupos) → `PricingPlans` → `CorporatePlan`. Lee `NEXT_PUBLIC_FOUNDER_MODE`, envía `coupon: FUNDADOR30` al checkout cuando aplica. |
| **API checkout** | `apps/portal/app/api/mercadopago/checkout/route.ts` | Acepta `coupon`; si `coupon === 'FUNDADOR30'` aplica 30% al monto antes de crear la preapproval. |

---

## 3. Firestore

- **Documento:** `config/launch` con campo `founderSlotsUsed` (number). Lectura pública para el banner; escritura solo admin.
- **Colección:** `corporate_leads` para leads del formulario corporativo (nombre, email, empresa, rango de propiedades, mensaje). Creación con validación; lectura/escritura admin.
- **Reglas:** Actualizadas en `apps/portal/firestore.rules` y desplegadas al proyecto Firebase.

---

## 4. Scripts y comandos

| Comando | Uso |
|---------|-----|
| `npm run founder:init` | Desde `apps/portal`. Crea o actualiza `config/launch` con `founderSlotsUsed: 0`. Requiere `.env.local` con Firebase Admin. |
| `firebase deploy --only firestore` | Desde `apps/portal`. Despliega reglas e índices de Firestore. |

**Estado:** Script `founder:init` y despliegue de reglas ya ejecutados (config/launch creado, reglas en producción).

---

## 5. Variables de entorno

| Variable | Dónde | Valores | Efecto |
|----------|-------|---------|--------|
| `NEXT_PUBLIC_FOUNDER_MODE` | Vercel (portal) | `active` \| `closed` \| `disabled` | `active`: muestra banner y precios con −30%; `closed`: mensaje cupos agotados; `disabled`: no muestra banner. |

**Cómo agregar en Vercel:** Settings → Environment Variables → Key: `NEXT_PUBLIC_FOUNDER_MODE`, Value: `active` → Save → Redeploy.

---

## 6. Mercado Pago

- **Cupón en MP:** No es necesario crear cupón en el panel de Mercado Pago. El descuento se aplica en el backend al crear la suscripción (monto ya reducido).
- **Detalle:** Ver [MERCADOPAGO_CUPON_FUNDADOR.md](MERCADOPAGO_CUPON_FUNDADOR.md).

---

## 7. Tests

- Tests de la pricing page actualizados en `apps/portal/__tests__/PricingPage.test.tsx`: planes, segmentos, CTAs, toggle mensual/anual, redirect a checkout sin login / con login, sección corporativa. FounderBanner y CorporatePlan mockeados para no depender de Firestore en tests.

---

## 8. Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [DEPLOY.md](DEPLOY.md) | Variables de entorno, sección 3.1 Pricing y oferta Fundadores (script, Vercel, reglas). |
| [MERCADOPAGO_CUPON_FUNDADOR.md](MERCADOPAGO_CUPON_FUNDADOR.md) | Por qué no hace falta cupón en MP y opciones alternativas. |
| [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md) | Definición de planes Base/Pro/Premium. |

---

## 9. Checklist post-deploy

- [x] Documento `config/launch` en Firestore (`founderSlotsUsed: 0`).
- [x] Reglas Firestore desplegadas (`config`, `corporate_leads`).
- [ ] Variable `NEXT_PUBLIC_FOUNDER_MODE=active` en Vercel (y redeploy).
- [ ] Webhook o flujo post-pago para incrementar `founderSlotsUsed` cuando un usuario active plan Fundador (opcional; si no se incrementa, el banner no bajará el contador).

---

*Última actualización: 25 Febrero 2026*
