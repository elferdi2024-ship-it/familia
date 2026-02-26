# Fase 4 — Auditor de Negocio y Monetización

**Objetivo:** Verificar que el modelo de monetización es coherente, que Mercado Pago funciona y que la estrategia FOMO está bien implementada.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | PLANES_FUENTE_VERDAD.md | [docs/PLANES_FUENTE_VERDAD.md](../../PLANES_FUENTE_VERDAD.md) | Límites, precios, inclusiones, relación Premium/Elite |
| 2 | PRICING_FUNDADORES_IMPLEMENTACION.md | [docs/PRICING_FUNDADORES_IMPLEMENTACION.md](../../PRICING_FUNDADORES_IMPLEMENTACION.md) | Banner, cards, corporativo, checkout, Firestore, scripts |
| 3 | MERCADOPAGO_CUPON_FUNDADOR.md | [docs/MERCADOPAGO_CUPON_FUNDADOR.md](../../MERCADOPAGO_CUPON_FUNDADOR.md) | Cupón FUNDADOR30: flujo backend |
| 4 | MERCADOPAGO_PRODUCTION_GUIDE.md | [docs/tecnico/MERCADOPAGO_PRODUCTION_GUIDE.md](../../tecnico/MERCADOPAGO_PRODUCTION_GUIDE.md) | Credenciales, webhooks, sandbox |
| 5 | DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md | [docs/DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md](../../DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md) | Precios, planes, frases para equipo |
| 6 | ESTRATEGIA_FOMO_BARRIO.md | [docs/ESTRATEGIA_FOMO_BARRIO.md](../../ESTRATEGIA_FOMO_BARRIO.md) | 6 tácticas FOMO, configuración, modos |
| 7 | CAMBIOS_ESTRATEGIA_FOMO.md | [docs/CAMBIOS_ESTRATEGIA_FOMO.md](../../CAMBIOS_ESTRATEGIA_FOMO.md) | Detalle de implementación FOMO |
| 8 | REVISION_PLANES_BARRIO.md | [docs/REVISION_PLANES_BARRIO.md](../../REVISION_PLANES_BARRIO.md) | Verificación función por función |

---

## Checklist de verificación

### Monetización
- [ ] `/publish/pricing` muestra 3 planes: Base (0), Pro (1.600 UYU), Premium (3.600 UYU)
- [ ] Toggle mensual/anual (-20%)
- [ ] Banner Fundadores con contador en tiempo real (Firestore `config/launch`)
- [ ] Checkout aplica cupón `FUNDADOR30` (30% OFF) en backend
- [ ] `NEXT_PUBLIC_FOUNDER_MODE`: active / closed / disabled

### Mercado Pago
- [ ] `MP_ACCESS_TOKEN` en Vercel (producción: `APP_USR-...`)
- [ ] Webhook: `https://barrio.uy/api/mercadopago/webhook`
- [ ] Flujo completo: crear → pagar → activar plan

### Estrategia FOMO
- [ ] Badge feed: Free = "Estándar", Pro/Premium = "✨ Destacado"
- [ ] Teaser leads: "X interesados (Oculto)" para Free
- [ ] Salud propiedad: 🟢/🟡/🔴 (solo Free)
- [ ] Penalización ranking: día 4-7 ×0.8, 8+ ×0.6
- [ ] "Lo que te perdés" en Plan Base
- [ ] Oferta 24h: 20% OFF al intentar 2.ª propiedad Free
- [ ] `NEXT_PUBLIC_FOMO_MODE`: conservative / balanced / aggressive / disabled
- [ ] Tarjeta upgrade cuando free tiene ≥ 1 propiedad

### Corporativo
- [ ] Formulario guarda en `corporate_leads`
- [ ] WhatsApp: +598 98 300 491

---

**Entregable:** Reporte de monetización con gaps y riesgos → guardar en `../hallazgos/`
