# Mercado Pago — Descuento Fundador 30% OFF

## Cómo funciona hoy (sin crear nada en MP)

En Barrio.uy el descuento Fundador **no usa cupones de Mercado Pago**. El flujo es:

1. El usuario entra a la pricing con modo Fundador activo (`NEXT_PUBLIC_FOUNDER_MODE=active`).
2. Al hacer clic en “Activar precio Fundador”, el frontend llama a `/api/mercadopago/checkout` con `coupon: 'FUNDADOR30'`.
3. El backend aplica el 30% de descuento al monto y crea la suscripción (preapproval) con **ese monto ya descontado**.
4. Mercado Pago solo ve una suscripción por un monto menor; no hay código de cupón en su sistema.

**Conclusión:** No tenés que crear ningún cupón en el panel de Mercado Pago para que el 30% funcione. Ya está resuelto en el backend.

---

## Si quisieras registrar el cupón en Mercado Pago (opcional)

Mercado Pago no tiene un “panel de cupones” para suscripciones creadas por API. Las opciones son:

### Opción A: No hacer nada (recomendado)

Dejar el flujo como está. El descuento se aplica en nuestro backend y en el reporte de MP vas a ver suscripciones con el monto ya reducido. No hay paso a paso en MP porque no hace falta.

### Opción B: Cupones con Wallet Connect (otra integración)

Si en el futuro quisieras que el usuario **ingrese un código** en el checkout de MP (por ejemplo “FUNDADOR30”), tendrías que usar la API de **promesas de descuento con cupón** (Wallet Connect). Eso implica:

1. **Crear la campaña/cupón en Mercado Pago** (vía API o el flujo que documenten para tu país).
2. **Validar el cupón** antes del pago: `POST /v2/wallet_connect/coupons` con tu Access Token, `x-payer-token` del pagador y el `id` del cupón (ej. `FUNDADOR30`).
3. **Aplicar el descuento** antes de confirmar: `POST /v2/wallet_connect/discounts` con `amount` y `coupon`.

Esa API está pensada para pagos con Wallet Connect (vinculación de cuentas, token del pagador). Para suscripciones creadas por API como las nuestras, no es la misma integración y no es necesaria para el 30% Fundador.

---

## Paso a paso resumido (tu caso)

| Paso | Acción |
|------|--------|
| 1 | No crear cupón en Mercado Pago. |
| 2 | Tener en Vercel `NEXT_PUBLIC_FOUNDER_MODE=active` para que se muestre la oferta y se envíe `coupon: 'FUNDADOR30'` al checkout. |
| 3 | El backend (`/api/mercadopago/checkout`) ya aplica el 30% cuando recibe `coupon === 'FUNDADOR30'`. |

Si más adelante Mercado Pago ofrece en el panel de vendedor una sección “Cupones para suscripciones”, se podría crear allí un cupón `FUNDADOR30` solo para tenerlo visible en el dashboard; hoy no es necesario para que el descuento funcione.
