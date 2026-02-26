# Fase 1 — Auditor de Producto

**Objetivo:** Verificar que lo prometido en el PRD está implementado, que los planes son coherentes y que el roadmap es realista.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | PRD_FINAL.md | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Visión, mercado, features (MoSCoW), arquitectura, UX, requisitos, KPIs, roadmap, testing, GTM, riesgos |
| 2 | ESTADO_ACTUAL.md | [docs/producto/ESTADO_ACTUAL.md](../../producto/ESTADO_ACTUAL.md) | Dashboard resumen: qué está completo, scores por área, últimas mejoras |
| 3 | ROADMAP_FUTURO.md | [docs/producto/ROADMAP_FUTURO.md](../../producto/ROADMAP_FUTURO.md) | Fases 0-4, timeline, KPIs proyectados, riesgos |
| 4 | PLANES_FUENTE_VERDAD.md | [docs/PLANES_FUENTE_VERDAD.md](../../PLANES_FUENTE_VERDAD.md) | Límites por plan (1/10/999), precios, inclusiones, relación Premium/Elite en feed |
| 5 | REVISION_PLANES_BARRIO.md | [docs/REVISION_PLANES_BARRIO.md](../../REVISION_PLANES_BARRIO.md) | Verificación función por función, inconsistencias detectadas, cambios aplicados |

---

## Checklist de verificación

- [ ] Cada feature "✅ Completado" en PRD §5 realmente funciona en la app
- [ ] Features "🔜" (pendientes) no están prometidas como hechas en marketing
- [ ] Personas del PRD (Martín, Carolina, Laura) se reflejan en la UX real
- [ ] `PLAN_LIMITS` en código = documentación (1 / 10 / 999)
- [ ] Inclusiones por plan coinciden entre web y documentación
- [ ] Mapeo Premium → Elite correcto al guardar posts en feed
- [ ] Boosts de ranking coherentes (free: 1.0, pro: 1.2, elite: 1.35)
- [ ] Precios en web = docs: 0 / 1.600 / 3.600 UYU
- [ ] Items "✅" en ROADMAP realmente están completos
- [ ] KPIs del PRD son alcanzables (Mes 6: 2K props, 200 agentes, $2K MRR)

---

## Archivos de código a inspeccionar

- `apps/portal/app/publish/page.tsx` — PLAN_LIMITS
- `apps/inmobiliaria/app/publish/page.tsx` — PLAN_LIMITS
- `apps/portal/components/feed/CreatePostModal.tsx` — mapeo premium → elite
- `apps/portal/lib/feed/ranking.ts` — boosts
- `apps/inmobiliaria/lib/feed/ranking.ts` — boosts
- `apps/portal/app/publish/pricing/page.tsx` — precios, copy

---

**Entregable:** Lista de inconsistencias producto/código con severidad → guardar en `../hallazgos/`
