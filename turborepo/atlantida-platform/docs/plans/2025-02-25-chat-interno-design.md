# Diseño: Chat Interno — Consultas en tiempo real

**Fecha:** 2025-02-25  
**Fuente:** PLAN_CHAT_INTERNO.docx (resumen validado)

---

## 1. Resumen ejecutivo

El chat interno permite que el interesado y el agente conversen en tiempo real desde la ficha de la propiedad y el dashboard, sin salir de la plataforma. Sustituye el formulario de contacto único por un hilo de mensajes persistente. Integración automática con el CRM: el primer mensaje crea el lead con `source: 'chat'` y el historial del chat es el historial del lead.

**Costo:** $0 — Firestore onSnapshot + Firebase Cloud Messaging (FCM) para push.

---

## 2. Flujo de usuario

### Interesado (no autenticado)

1. Entra a la ficha de la propiedad.
2. Hace clic en **"Consultar por este inmueble"** (o equivalente).
3. Si no tiene cuenta → se le pide **registrarse** (modal o redirect a `/auth`).
4. Tras registrarse o si ya está logueado → se abre el chat.

### Interesado (autenticado)

1. Hace clic en "Consultar por este inmueble".
2. Se crea o recupera la conversación (interesado + agente + propiedad).
3. Escribe el primer mensaje y envía.
4. Ve los mensajes en tiempo real con `onSnapshot`.

### Agente

1. Entra a `/my-properties` → sección **"Mensajes"**.
2. Ve la bandeja de conversaciones (por defecto ordenadas por último mensaje).
3. Abre una conversación.
4. Responde desde el mismo chat.
5. Mensajes en tiempo real.

### Integración CRM

- Al enviar el **primer mensaje**, se crea automáticamente un lead en `leads/` con `source: 'chat'`.
- En el lead drawer del CRM, el agente ve un botón **"Ir al chat"** que abre el hilo.
- El chat es el historial: no hay que copiar nada.

---

## 3. Schema Firestore

### Colección `conversations/`

Una conversación por par (interesado, agente, propiedad). ID único derivado de `participantIds + propertyId` para evitar duplicados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `participantIds` | string[] | `[leadId, agentId]` ordenados |
| `propertyId` | string | ID de la propiedad |
| `propertyTitle` | string | Título (cache para UI) |
| `agentId` | string | UID del agente |
| `leadId` | string | UID del interesado |
| `leadName` | string | Nombre del interesado |
| `leadEmail` | string | Email del interesado |
| `lastMessage` | string | Último mensaje (preview) |
| `lastMessageAt` | Timestamp | Timestamp del último mensaje |
| `lastMessageBy` | string | UID del autor |
| `createdAt` | Timestamp | Creación |
| `unreadByAgent` | number | Contador no leídos por agente |
| `unreadByLead` | number | Contador no leídos por interesado |

**ID sugerido:** `{agentId}_{leadId}_{propertyId}` (o hash para acortar).

### Subcolección `conversations/{id}/messages/`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `authorId` | string | UID del autor |
| `text` | string | Contenido del mensaje |
| `createdAt` | Timestamp | Creación |
| `read` | boolean | Si el destinatario lo leyó (opcional) |

---

## 4. Reglas de seguridad Firestore

```firestore
// conversations/: solo participante
match /conversations/{convId} {
  allow read: if isAuthenticated() &&
    (resource.data.agentId == request.auth.uid || resource.data.leadId == request.auth.uid);
  allow create: if isAuthenticated() &&
    request.resource.data.leadId == request.auth.uid &&
    request.resource.data.agentId is string;
  allow update: if isAuthenticated() &&
    (resource.data.agentId == request.auth.uid || resource.data.leadId == request.auth.uid);
  allow delete: if false;
}

// messages/: solo participante
match /conversations/{convId}/messages/{msgId} {
  allow read: if isAuthenticated() &&
    (get(/databases/$(database)/documents/conversations/$(convId)).data.agentId == request.auth.uid ||
     get(/databases/$(database)/documents/conversations/$(convId)).data.leadId == request.auth.uid);
  allow create: if isAuthenticated() &&
    (get(/databases/$(database)/documents/conversations/$(convId)).data.agentId == request.auth.uid ||
     get(/databases/$(database)/documents/conversations/$(convId)).data.leadId == request.auth.uid);
  allow update, delete: if false;
}
```

---

## 5. Diferenciación por plan

| Plan | Comportamiento |
|------|----------------|
| **Free** | Ve badge de mensajes sin leer con blur y CTA a Pro (FOMO). No puede abrir chat. |
| **Pro** | Bandeja de entrada completa, tiempo real, badge de no leídos. |
| **Premium** | Todo lo anterior + push notifications en el browser cuando llega un mensaje aunque el dashboard esté cerrado (FCM). |

---

## 6. Componentes y rutas

### Nuevos componentes

- `ConversationList.tsx` — Bandeja de conversaciones (agente).
- `ConversationThread.tsx` — Hilo de mensajes (chat).
- `ChatButton.tsx` — Botón "Consultar por este inmueble" en ficha de propiedad (con gate de auth).
- `UnreadBadge.tsx` — Badge de no leídos (blur para Free).

### Rutas

- `/my-properties` — Nueva sección "Mensajes" (tab o bloque).
- `/property/[id]` — Chat inline o modal al hacer clic en "Consultar por este inmueble".

### Integración CRM

- En `LeadDrawer` o modal de lead: botón "Ir al chat" que enlaza a la conversación por `leadId + agentId + propertyId`.

---

## 7. Creación de lead al primer mensaje

Cuando el interesado envía el **primer mensaje** de una conversación:

1. Crear documento en `leads/` con:
   - `source: 'chat'`
   - `propertyId`, `propertyTitle`, `agentId`
   - `leadName`, `leadEmail` (del usuario autenticado)
   - `leadMessage`: texto del primer mensaje
   - `status: 'new'`
   - `conversationId`: ID de la conversación (para enlace rápido)

2. Crear o actualizar la conversación en `conversations/`.

3. Crear el mensaje en `conversations/{id}/messages/`.

---

## 8. Push notifications (Premium)

- Firebase Cloud Messaging (FCM) para web.
- Cloud Function: `onMessageCreated` → envía push al agente si `user.plan === 'premium'` y `user.fcmToken` existe.
- El agente registra el token en `users/{uid}.fcmToken` al aceptar notificaciones.

---

## 9. Orden de implementación sugerido

1. Schema Firestore + reglas.
2. `ConversationThread` + `onSnapshot` para mensajes.
3. Creación de conversación desde ficha de propiedad (con gate de auth).
4. Creación de lead al primer mensaje.
5. Integración en CRM: botón "Ir al chat" en el drawer del lead.
6. Sección "Mensajes" en `/my-properties`, diferenciación por plan.
7. Push notifications (Premium).

---

## 10. Referencias

- `PLAN_TECNICO_CRM_TOURS.md` — CRM ya implementado con Kanban.
- `leads/` — Colección existente.
- `lead_notes` — Ya existente para notas.
- `conversations/` y `messages/` — Nuevas para esta feature.
