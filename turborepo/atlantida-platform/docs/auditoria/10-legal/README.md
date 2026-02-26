# Fase 10 — Auditor Legal / Compliance

**Objetivo:** Verificar cumplimiento de requisitos legales de Uruguay y buenas prácticas de protección de datos.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | Política de privacidad | Página web `/privacidad` o equivalente | Tratamiento de datos personales |
| 2 | Términos y condiciones | Página web `/terminos` o equivalente | Condiciones de uso del servicio |
| 3 | GUIA_MARKETING_Y_COMUNICACION.md §5.6 | [docs/GUIA_MARKETING_Y_COMUNICACION.md](../../GUIA_MARKETING_Y_COMUNICACION.md) | Buenas prácticas WhatsApp |

---

## Checklist de verificación

### Políticas publicadas
- [ ] Política de privacidad accesible en la web
- [ ] Términos y condiciones accesibles
- [ ] Ambos actualizados con modelo actual (planes, Mercado Pago)

### Datos personales
- [ ] Consentimiento para datos de leads (nombre, email, teléfono)
- [ ] Datos de pago gestionados por Mercado Pago (no en Firestore)
- [ ] Derecho a eliminación de cuenta y datos

### Comunicación
- [ ] Emails de marketing con opción de desuscripción
- [ ] WhatsApp solo a contactos con permiso

---

**Entregable:** Checklist legal con gaps → guardar en `../hallazgos/`
