# Fase 8 — Auditor de Testing / QA

**Objetivo:** Verificar cobertura de tests, que los flujos críticos están cubiertos y que el plan de testing se cumple.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | ESTADO_ACTUAL.md | [docs/producto/ESTADO_ACTUAL.md](../../producto/ESTADO_ACTUAL.md) | Cobertura actual (58.3%), herramientas (Vitest, Playwright) |
| 2 | PRD_FINAL.md §12 | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Plan de testing, pirámide, targets de cobertura |

---

## Checklist de verificación

### Infraestructura
- [ ] Vitest configurado (unit tests)
- [ ] Playwright configurado (E2E tests)
- [ ] Cobertura ≥ 58.3% (target: 70%)

### Flujos críticos cubiertos

| Flujo | Unit | E2E |
|-------|:----:|:---:|
| Autenticación (login/logout) | [ ] | [ ] |
| Publicar propiedad (wizard 4 pasos) | [ ] | [ ] |
| Búsqueda con filtros | [ ] | [ ] |
| Enviar lead (formulario de contacto) | [ ] | [ ] |
| Pricing page (planes, CTAs, toggle) | [ ] | [ ] |
| Dashboard (mi propiedades, leads) | [ ] | [ ] |
| Feed (crear post, like, ranking) | [ ] | [ ] |
| Checkout Mercado Pago | [ ] | [ ] |

### Smoke tests manuales
- [ ] Homepage → Search → Property → Lead
- [ ] Login → Publish (4 pasos) → Success
- [ ] Favoritos: add/remove
- [ ] Comparador: 3 propiedades
- [ ] Calculadora hipoteca
- [ ] Feed: crear post, ver ranking
- [ ] Mi propiedades: ver leads, editar propiedad
- [ ] Pricing: ver planes, toggle mensual/anual, checkout

---

## Comandos

```bash
cd turborepo/atlantida-platform
npm run test            # Unit tests
npm run test:e2e        # E2E tests
npm run test:coverage   # Cobertura
```

---

**Entregable:** Reporte con cobertura y tests fallidos → guardar en `../hallazgos/`
