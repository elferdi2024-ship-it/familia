# Fase 6 — Auditor de UX / Diseño

**Objetivo:** Verificar que la experiencia de usuario cumple los principios del PRD y que los problemas mobile-first se están atendiendo.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | DISEÑO_MOBILE_FIRST.md | [docs/DISEÑO_MOBILE_FIRST.md](../../DISEÑO_MOBILE_FIRST.md) | Principio mobile-first, capas rotas, prioridades |
| 2 | GUIA_ESTILOS.md | [docs/guias/GUIA_ESTILOS.md](../../guias/GUIA_ESTILOS.md) | Paleta, tipografía, componentes |
| 3 | PRD_FINAL.md §7 | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Principios de diseño, paleta, tipografía |

---

## Checklist de verificación

### Principios
- [ ] Mobile-first real: diseñado para pulgar, escalado a desktop
- [ ] Speed is a Feature: skeletons, optimistic UI, lazy loading
- [ ] Progressive Disclosure: filtros avanzados ocultos, wizard en steps
- [ ] Feedback inmediato: toasts, spinners, animaciones

### Mobile-first (CRÍTICO)
- [ ] Capas de diseño rotas documentadas y priorizadas
- [ ] Bottom navigation funciona (zona pulgar, sin overlap)
- [ ] CTAs ≥ 44x44px, touch targets espaciados
- [ ] Forms con keyboard correcto (email, tel, number)

### Diseño visual
- [ ] Paleta coherente (light + dark mode)
- [ ] Tipografía Inter con scale correcto
- [ ] Dark mode funcional en todas las páginas

---

## Matriz de pruebas por dispositivo

| Flujo | iPhone SE (375px) | iPhone 15 (393px) | iPad (768px) | Desktop (1920px) |
|-------|:-:|:-:|:-:|:-:|
| Homepage → Búsqueda → Detalle → Lead | [ ] | [ ] | [ ] | [ ] |
| Login → Publicar (4 pasos) → Éxito | [ ] | [ ] | [ ] | [ ] |
| Pricing → Checkout → Pago | [ ] | [ ] | [ ] | [ ] |
| Mi propiedades → Editar → Leads | [ ] | [ ] | [ ] | [ ] |
| Feed → Crear post → Like/WhatsApp | [ ] | [ ] | [ ] | [ ] |

---

**Entregable:** Bugs de UX por dispositivo con capturas → guardar en `../hallazgos/`
