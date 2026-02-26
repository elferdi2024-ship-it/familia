# Estrategia FOMO — Barrio.uy

Implementación de tácticas de conversión Free → Pro según el documento de estrategia (versión 1.0, Feb 2026).

## Tácticas implementadas

| Táctica | Portal | Inmobiliaria | Descripción |
|--------|--------|--------------|-------------|
| **Badge Estándar / Destacado** | `FeedPostCard.tsx` | — (sin feed) | Free = "Propiedad Estándar", Pro/Premium = "✨ Destacado". |
| **Teaser de leads** | `my-properties/page.tsx` | `my-properties/page.tsx` | "X interesados (Oculto)" + modal blur + CTA a pricing. |
| **Salud de la propiedad** | `PropertyHealthCard.tsx` | `PropertyHealthCard.tsx` | 🟢/🟡/🔴 según días desde publicación (solo Free). |
| **Penalización por antigüedad** | `lib/feed/ranking.ts` | `lib/feed/ranking.ts` | Free: día 4–7 ×0.8, 8+ ×0.6 (si táctica activa). |
| **Pricing "Lo que te perdés"** | `publish/pricing/page.tsx` | — | Plan Base: lista de limitaciones con ✖. |
| **Oferta con timer 24h** | `UpgradeOffer.tsx` + publish | `UpgradeOffer.tsx` + publish | 20% OFF primer mes, válida 24h al intentar 2.ª propiedad. |

## Configuración y rollback

- **Paquete compartido:** `packages/lib/src/fomo-config.ts` (exportado en `@repo/lib`).
- **Variable de entorno:** `NEXT_PUBLIC_FOMO_MODE`
  - `conservative`: solo badge y teaser
  - `balanced`: badge, teaser, health_card, ranking_penalty (por defecto)
  - `aggressive`: incluye timer_offer
  - `disabled`: desactiva todas las tácticas FOMO

Cada componente comprueba `isFOMOTacticEnabled('táctica')` antes de mostrar la funcionalidad. Para rollback rápido: `NEXT_PUBLIC_FOMO_MODE=conservative` o `disabled`.

## Referencias

- Revisión de planes: `REVISION_PLANES_BARRIO.md`
- Fuente de verdad de planes: `PLANES_FUENTE_VERDAD.md`
- Documento original de estrategia (externo): Estrategia de Conversión con FOMO para Barrio.uy v1.0
- Detalle de cambios: [CAMBIOS_ESTRATEGIA_FOMO.md](CAMBIOS_ESTRATEGIA_FOMO.md)

---

*Última actualización: 25 Febrero 2026*
