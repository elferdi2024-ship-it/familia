# Auditoría — Barrio.uy / Atlantida Platform

Hub central de la auditoría integral. Desde aquí se accede a cada fase, a los documentos de soporte y a los hallazgos.

---

## Protocolo

| Documento | Descripción |
|-----------|-------------|
| [AUDITORIA_PASO_A_PASO.md](AUDITORIA_PASO_A_PASO.md) | Guía completa con las 10 fases, checks por rol y matriz de hallazgos |
| [AUDITORIA_SISTEMA_2026.md](AUDITORIA_SISTEMA_2026.md) | Auditoría previa: inventario de archivos, estructura objetivo, checklist de limpieza |

---

## Fases (orden recomendado de ejecución)

| # | Fase | Carpeta | Rol |
|---|------|---------|-----|
| 1 | Seguridad | [03-seguridad/](03-seguridad/) | Auditor de Seguridad |
| 2 | DevOps / Deploy | [07-devops/](07-devops/) | Auditor DevOps |
| 3 | Técnico / Arquitectura | [02-tecnico/](02-tecnico/) | Auditor Técnico |
| 4 | Producto | [01-producto/](01-producto/) | Auditor de Producto |
| 5 | Negocio / Monetización | [04-negocio/](04-negocio/) | Auditor de Negocio |
| 6 | Testing / QA | [08-testing/](08-testing/) | Auditor QA |
| 7 | UX / Diseño | [06-ux-diseno/](06-ux-diseno/) | Auditor UX |
| 8 | Marketing / Comunicación | [05-marketing/](05-marketing/) | Auditor Marketing |
| 9 | Documentación | [09-documentacion/](09-documentacion/) | Auditor de Docs |
| 10 | Legal / Compliance | [10-legal/](10-legal/) | Auditor Legal |

---

## Hallazgos

La carpeta [hallazgos/](hallazgos/) contiene los reportes generados al ejecutar cada fase. Usar la plantilla `PLANTILLA_HALLAZGOS.md` dentro de esa carpeta.

---

## Estructura

```
docs/auditoria/
├── README.md                    ← Estás aquí (hub)
├── AUDITORIA_PASO_A_PASO.md    # Protocolo completo (10 fases)
├── AUDITORIA_SISTEMA_2026.md   # Auditoría previa (inventario y limpieza)
├── 01-producto/                # Fase: Producto
├── 02-tecnico/                 # Fase: Técnico / Arquitectura
├── 03-seguridad/               # Fase: Seguridad
├── 04-negocio/                 # Fase: Negocio / Monetización
├── 05-marketing/               # Fase: Marketing / Comunicación
├── 06-ux-diseno/               # Fase: UX / Diseño
├── 07-devops/                  # Fase: DevOps / Deploy
├── 08-testing/                 # Fase: Testing / QA
├── 09-documentacion/           # Fase: Documentación
├── 10-legal/                   # Fase: Legal / Compliance
└── hallazgos/                  # Reportes de hallazgos por fase
```

---

*Última actualización: 25 Febrero 2026*
