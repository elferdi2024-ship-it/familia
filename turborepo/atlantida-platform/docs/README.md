# Documentación — Atlantida Platform (Barrio.uy / MiBarrio.uy)

Índice maestro de toda la documentación del monorepo. Única referencia para roles y ubicación de documentos.

---

## Por rol

| Rol | Documentos principales |
|-----|------------------------|
| **Desarrollador** | [README monorepo](../README.md), [DEPLOY.md](DEPLOY.md), [REGLAS_ARQUITECTURA_DOMINIOS.md](../REGLAS_ARQUITECTURA_DOMINIOS.md), [tecnico/](tecnico/) |
| **Producto** | [producto/PRD_FINAL.md](producto/PRD_FINAL.md), [producto/ROADMAP_FUTURO.md](producto/ROADMAP_FUTURO.md), [producto/ESTADO_ACTUAL.md](producto/ESTADO_ACTUAL.md), [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md), [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md), [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md), [MERCADOPAGO_CUPON_FUNDADOR.md](MERCADOPAGO_CUPON_FUNDADOR.md), [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md), [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md), [DISEÑO_MOBILE_FIRST.md](DISEÑO_MOBILE_FIRST.md) |
| **Agente / Beta** | [guias/MANUAL_AGENTE_BETA.md](guias/MANUAL_AGENTE_BETA.md) |
| **Ventas / B2B / Marketing** | [GUIA_MARKETING_Y_COMUNICACION.md](GUIA_MARKETING_Y_COMUNICACION.md), [DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md](DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md), [negocio/PLAYBOOK_VENTAS.md](negocio/PLAYBOOK_VENTAS.md), [negocio/PLAYBOOK_VENTAS_B2B.md](negocio/PLAYBOOK_VENTAS_B2B.md) |
| **DevOps / Deploy** | [DEPLOY.md](DEPLOY.md) |
| **Auditoría / Organización** | [auditoria/](auditoria/) — Hub: [README](auditoria/README.md), [Paso a paso](auditoria/AUDITORIA_PASO_A_PASO.md), [Sistema 2026](auditoria/AUDITORIA_SISTEMA_2026.md) |
| **Salud y seguridad** | [SALUD_Y_SEGURIDAD.md](SALUD_Y_SEGURIDAD.md) |

---

## Estructura

```
docs/
├── README.md                 ← Estás aquí (índice)
├── auditoria/                # Auditoría integral (hub, fases, hallazgos)
│   ├── README.md             # Hub central
│   ├── AUDITORIA_PASO_A_PASO.md  # Protocolo completo (10 fases)
│   ├── AUDITORIA_SISTEMA_2026.md # Organización y limpieza 2026
│   ├── 01-producto/ … 10-legal/  # Carpeta por fase con README y checklist
│   └── hallazgos/            # Reportes generados
├── SALUD_Y_SEGURIDAD.md      # Evaluación estructura + seguridad
├── DEPLOY.md                 # Despliegue (Vercel, env, Firebase)
├── MIGRACION.md              # Migración monolito → Turborepo
├── PLANES_FUENTE_VERDAD.md   # Planes Base/Pro/Premium — límites, precios, inclusiones
├── REVISION_PLANES_BARRIO.md   # Revisión de planes, verificación y cambios aplicados
├── PRICING_FUNDADORES_IMPLEMENTACION.md  # Resumen: pricing, banner Fundadores, CorporatePlan, Firestore, Mercado Pago
├── MERCADOPAGO_CUPON_FUNDADOR.md        # Cupón FUNDADOR30: no hace falta en MP; flujo backend
├── ESTRATEGIA_FOMO_BARRIO.md   # Resumen tácticas FOMO y configuración
├── CAMBIOS_ESTRATEGIA_FOMO.md  # Documento detallado de cambios FOMO (implementación)
├── DISEÑO_MOBILE_FIRST.md      # Mobile-first obligatorio; capas de diseño rotas a reparar
├── GUIA_MARKETING_Y_COMUNICACION.md  # Marketing, tonos, correos, WhatsApp, conceptos, CTAs
├── DOCUMENTO_INTERNO_PRECIOS_Y_PRODUCTO.md  # Uso interno: precios, planes, qué vendemos, corporativo
├── producto/                  # PRD, Roadmap, Estado
├── tecnico/                   # Performance, Mercado Pago, Firestore
├── guias/                    # Guías rápidas, estilos, manual agente
├── negocio/                  # Playbooks ventas
└── planes/                   # Planes de optimización
```

---

## Enlaces rápidos

- **Arquitectura (Barrio.uy vs MiBarrio.uy):** [REGLAS_ARQUITECTURA_DOMINIOS.md](../REGLAS_ARQUITECTURA_DOMINIOS.md)
- **Deploy:** [DEPLOY.md](DEPLOY.md)
- **PRD:** [producto/PRD_FINAL.md](producto/PRD_FINAL.md)
- **Roadmap:** [producto/ROADMAP_FUTURO.md](producto/ROADMAP_FUTURO.md)
- **Planes (Base/Pro/Premium):** [PLANES_FUENTE_VERDAD.md](PLANES_FUENTE_VERDAD.md) · [REVISION_PLANES_BARRIO.md](REVISION_PLANES_BARRIO.md)
- **Pricing y Fundadores:** [PRICING_FUNDADORES_IMPLEMENTACION.md](PRICING_FUNDADORES_IMPLEMENTACION.md) · [MERCADOPAGO_CUPON_FUNDADOR.md](MERCADOPAGO_CUPON_FUNDADOR.md)
- **Estrategia FOMO (conversión Free→Pro):** [ESTRATEGIA_FOMO_BARRIO.md](ESTRATEGIA_FOMO_BARRIO.md) · [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md)
- **Diseño (mobile-first obligatorio, capas rotas):** [DISEÑO_MOBILE_FIRST.md](DISEÑO_MOBILE_FIRST.md)

---

*Última actualización: 25 Febrero 2026 — Pricing Fundadores y documentación actualizada.*
