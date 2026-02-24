# Guía de Configuración: Mercado Pago en Producción (Uruguay) 🇺🇾💳

Para habilitar los cobros recurrentes en **Barrio.uy** usando Mercado Pago, sigue estos pasos:

## 1. Obtención de Credenciales
1. Ve a tu [Panel de Desarrollador de Mercado Pago](https://www.mercadopago.com.uy/developers/panel).
2. Crea una **Aplicación** (ej. "Barrio.uy Production").
3. Ve a **Credenciales de producción**.
4. Copia el **Access Token** (`APP_USR-...`).
5. Configúralo en Vercel como `MP_ACCESS_TOKEN`.

## 2. Configuración de Webhooks (IPN)
1. En tu aplicación de Mercado Pago, ve a **Webhooks** o **Notificaciones IPN**.
2. Configura la URL de notificación: `https://barrio.uy/api/mercadopago/webhook`.
3. Selecciona los eventos:
   - `Planes y suscripciones` (Preapproval)
   - `Pagos` (Payment)
4. Activa el modo de producción.

## 3. Modo Sandbox (Pruebas)
Para probar sin dinero real:
1. Usa tus **Credenciales de prueba** de la app: en el panel de desarrolladores → tu aplicación → **Credenciales de prueba** → copia el **Access Token** (`TEST-...`) y configúralo como `MP_ACCESS_TOKEN` en `.env.local`.
2. Usa las [Tarjetas de prueba de Mercado Pago](https://www.mercadopago.com.uy/developers/es/docs/checkout-pro/additional-content/test-cards) para simular el pago.

### Cuenta de prueba – Comprador (Uruguay)
Para completar un pago de prueba, inicia sesión en el checkout de Mercado Pago con una **cuenta de prueba Comprador** (creada en el mismo panel de desarrolladores). Ejemplo de referencia:

| Campo | Valor |
|-------|--------|
| País | Uruguay |
| User ID | (tu User ID de la cuenta de prueba) |
| Usuario | TESTUSER... (completo en el panel) |
| Contraseña | (asignada al crear la cuenta) |
| Código de verificación | (en correo o SMS de prueba) |

Guarda estas credenciales en un gestor seguro; las necesitas cada vez que quieras simular un pago como comprador en el flujo de suscripción.

## 4. Variables de Entorno Requeridas
Asegúrate de tener estas variables en Vercel:
- `MP_ACCESS_TOKEN`: Tu token de producción.
- `FIREBASE_PRIVATE_KEY`: Requerida para que el webhook actualice el plan del usuario.
- `FIREBASE_CLIENT_EMAIL`: Requerida para Firebase Admin.
- `FIREBASE_PROJECT_ID`: ID de tu proyecto Firebase.

---
> [!TIP]
> Mercado Pago en Uruguay soporta tarjetas locales y redes de cobranza (RedPagos), lo que aumenta la conversión significativamente comparado con Stripe.
