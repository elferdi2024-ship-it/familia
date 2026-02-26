# Mobile-first: principio clave y estado del diseño

**Última actualización:** 25 Febrero 2026

---

## Principio obligatorio

> **Mobile-first es CLAVE** para Barrio.uy. El producto se diseña primero para pulgar y pantalla pequeña; desktop es extensión, no al revés.

- Diseño para **zona pulgar**, touch targets mínimos 44×44px, bottom navigation.
- **Ningún componente nuevo** debe asumir ancho desktop: siempre partir de vista móvil y escalar con `sm:`, `md:`, etc.
- Toda **revisión de UI** debe validarse primero en viewport móvil (375px–428px).

Referencia en el PRD: [Sección 7.1 Principios de Diseño](producto/PRD_FINAL.md#71-principios-de-diseño) — "Mobile-First Real".

---

## Estado conocido: capas de diseño rotas

Varias capas del diseño se han roto (layout, overflow, espaciado o jerarquía en móvil). **Debe priorizarse su reparación** en cualquier iteración de UI.

### Checklist de reparación (actualizar al corregir)

| Área / Capa | Estado | Notas |
|-------------|--------|--------|
| (Por rellenar) | 🔴 Roto | Identificar pantallas/componentes concretos y anotar aquí |
| (Por rellenar) | 🔴 Roto | |
| (Por rellenar) | 🟡 Revisar | |

Cuando se repare una capa, cambiar a ✅ y añadir fecha o commit en Notas.

### Dónde suelen romperse

- Modales y overlays (ancho fijo, overflow horizontal, botones fuera de viewport).
- Tablas en my-properties o listados (sin scroll horizontal o cards apiladas en móvil).
- Cards de propiedad (grid que no colapsa bien, texto que no trunca).
- Formularios (inputs o CTAs que se salen en viewport pequeño).
- Barras de acción fijas (que tapen contenido o no respeten safe area).
- Componentes añadidos recientemente (FOMO: UpgradeOffer, PropertyHealthCard, modal de leads, pricing "Lo que te perdés") — verificar en 320px y 375px.

---

## Criterios de aceptación móvil

Antes de dar por cerrado cualquier cambio de UI:

1. **Viewport:** Probado al menos en 375px y 428px de ancho.
2. **Touch:** Botones y enlaces con área mínima 44×44px; espacio entre targets.
3. **Scroll:** Sin overflow horizontal no deseado; modales con scroll interno si el contenido es largo.
4. **Legibilidad:** Tamaños de fuente y contraste adecuados sin zoom.
5. **Navegación:** Bottom nav (si aplica) accesible y no cubierta por teclado o safe area.

---

## Referencias

- PRD: [producto/PRD_FINAL.md](producto/PRD_FINAL.md) — §7 Experiencia de Usuario, §8 Requisitos funcionales (galería, wizard, etc.).
- Si existe DESIGN.md o sistema de diseño en el repo, seguir sus breakpoints y componentes.
