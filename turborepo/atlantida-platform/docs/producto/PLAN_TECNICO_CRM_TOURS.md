# Plan Técnico: CRM Propio + Tours Virtuales

**Resumen ejecutivo**

---

## 1. CRM propio — $0

Se construye sobre Firestore que ya tienen. Solo dos dependencias nuevas, ambas MIT y gratuitas:

- **@hello-pangea/dnd** — Kanban drag & drop
- **react-swipeable** — Swipe táctil en los tours

### Pipeline Kanban

Etapas: **Nuevo → Contactado → Negociando → Cerrado**

- Ubicación: tab **CRM** dentro de `my-properties`
- Notas e historial de conversaciones: bloqueadas para **Base** (blur + CTA), desbloqueadas en **Pro** y **Premium**

### Nuevas colecciones Firestore

- `lead_notes`
- `lead_messages`

---

## 2. Tours virtuales — $0

### Enfoque principal: recorrido guiado por habitaciones

Con fotos normales del teléfono no se puede hacer 360° real, así que la propuesta es más inteligente:

- **Componente:** `PropertyTour.tsx`
- **Funcionamiento:** El agente nombra cada foto ("Living", "Cocina", "Dormitorio 1") y el tour se presenta como un **slideshow cinematográfico full-screen** con swipe táctil
- **Diferencia:** Diferencia visual enorme frente a cualquier otro portal uruguayo

### Bonus: 360° real

Si algún agente tiene **Google Camera** (gratis, cualquier Android), puede tomar fotos **Photo Sphere** y se activa **Pannellum** automáticamente para el 360° real, sin ningún costo extra.

---

## Dependencias

| Paquete | Licencia | Uso |
|---------|----------|-----|
| @hello-pangea/dnd | MIT | Kanban drag & drop |
| react-swipeable | MIT | Swipe táctil en tours |
| Pannellum | MIT | 360° Photo Sphere (opcional) |

---

## Estado de implementación

| Feature | Estado |
|---------|--------|
| **VirtualTourGuideCard** | ✅ Implementado en portal e inmobiliaria. Visible en `/my-properties` con blur+CTA para Free. **Tour guiado** activo para Pro/Premium y **360° real exclusivo de Premium**. |
| **CRM Kanban** | ✅ Implementado en portal e inmobiliaria. Pipeline: Nuevo → Contactado → Negociando → Cerrado. Drag & drop con @hello-pangea/dnd. Notas con blur para Free. |
| **PropertyTour.tsx** (recorrido guiado) | Pendiente |
| **Pannellum 360°** | Pendiente |
| **Chat interno** | ✅ Implementado en portal e inmobiliaria. Flujo completo: botón "Consultar/Chatear" en ficha, auth gate, creación de `conversations/`, mensajes en tiempo real y creación de lead en primer mensaje (`source: "chat"`). |

---

## 3. Chat interno (implementado)

- **Flujo:** Interesado clic "Consultar por este inmueble" → si no tiene cuenta, registro → conversación en Firestore → mensajes en tiempo real.
- **Schema:** `conversations/` + `conversations/{id}/messages/`.
- **CRM:** Al primer mensaje se crea lead con `source: 'chat'`. Botón "Ir al chat" en drawer del lead.
- **Planes (Portal):** Free → blur+CTA; Pro/Premium → bandeja completa. Push (FCM) pendiente.
- **Planes (Inmobiliaria):** acceso libre interno (sin blur por plan) para la bandeja de chat.

---

## Reglas de planes confirmadas (25 Feb 2026)

- **CRM (Kanban + chat de leads):** habilitado para **Pro y Premium**.
- **Tour virtual guiado por habitaciones:** habilitado para **Pro y Premium**.
- **Tour 360° real (Photo Sphere):** **exclusivo de Premium**.
- `elite` se mantiene como alias técnico heredado en algunos tipos/flujos, pero comercialmente el negocio opera con **Pro/Premium**.

---

## Cambios técnicos aplicados (última actualización)

### Portal
- Chat interno:
  - `apps/portal/lib/chat.ts`
  - `apps/portal/components/chat/ConversationThread.tsx`
  - `apps/portal/components/chat/ConversationList.tsx`
  - `apps/portal/app/property/[id]/PropertyClient.tsx`
  - `apps/portal/app/my-properties/page.tsx` (sección Mensajes + botón "Ir al chat" en lead drawer)
  - `apps/portal/firestore.rules` y `apps/portal/firestore.indexes.json` (índice `conversations: agentId ASC + lastMessageAt DESC`)
- Tours:
  - `apps/portal/components/VirtualTourGuideCard.tsx` actualizado para bloquear guía 360° en Pro y dejarla Premium-only.

### Inmobiliaria
- Chat interno:
  - `apps/inmobiliaria/lib/chat.ts`
  - `apps/inmobiliaria/components/chat/ConversationThread.tsx`
  - `apps/inmobiliaria/components/chat/ConversationList.tsx` (sin restricción por plan)
  - `apps/inmobiliaria/app/property/[id]/PropertyClient.tsx` (botón Chatear + auth + modal + lead al primer mensaje)
  - `apps/inmobiliaria/app/my-properties/page.tsx` (sección Mensajes + botón "Ir al chat")
  - `apps/inmobiliaria/components/LeadKanban.tsx` y `apps/inmobiliaria/firestore.indexes.json` (índice de conversations)
- Tours:
  - `apps/inmobiliaria/components/VirtualTourGuideCard.tsx` actualizado para bloquear guía 360° en Pro y dejarla Premium-only.

---

*Documento completo: `PLAN_TECNICO_CRM_TOURS (1).docx`*  
*Chat: `docs/plans/2025-02-25-chat-interno-design.md`*
