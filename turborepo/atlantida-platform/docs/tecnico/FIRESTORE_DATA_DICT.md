# Diccionario de Datos y Arquitectura Firestore
**Plataforma Barrio.uy / MiBarrio.uy v4.0**

Este documento detalla la estructura de la base de datos NoSQL (Firebase Firestore), las reglas de seguridad (*Security Rules*), y las políticas de indexación críticas para el correcto funcionamiento de las búsquedas complejas en Barrio.uy.

---

## 1. Diseño de Colecciones (Data Dictionary)

### 1.1 Colección: `users`
Almacena los perfiles de todos los usuarios registrados (buscadores, agentes, admins).

**Clave de Documento:** `UID` (Generado por Firebase Auth).

| Campo | Tipo | Descripción | Ejemplo / Opciones permitidas |
|-------|------|-------------|-------------------------------|
| `uid` | String | Identificador único | `abc123xyz` |
| `email` | String | Correo electrónico | `usuario@email.com` |
| `displayName` | String | Nombre completo | `Juan Pérez` |
| `role` | String | Rol de acceso | `'user' \| 'agent' \| 'admin'` |
| `agentVerified` | Boolean | Badge de verificación | `true` |
| `favoritePropertyIds` | Array<String> | IDs de propiedades guardadas | `['prop_1', 'prop_2']` |
| `propertiesCount` | Number | Cantidad de propiedades activas | `15` |
| `createdAt` | Timestamp | Fecha de registro | `2026-02-22T...` |

### 1.2 Colección: `properties`
Contiene todas las propiedades publicadas por los agentes. Esta es la colección de mayor tráfico de lectura.

**Clave de Documento:** `Auto - Generado por Firestore`.

| Campo | Tipo | Descripción | Ejemplo / Opciones permitidas |
|-------|------|-------------|-------------------------------|
| `userId` | String | UID del creador | `abc123xyz` |
| `operation` | String | Tipo de transacción | `'Venta' \| 'Alquiler'` |
| `type` | String | Tipo de inmueble | `'Apartamento' \| 'Casa' \| 'Terreno' \| 'Local'` |
| `price` | Number | Precio | `150000` |
| `currency` | String | Moneda | `'USD' \| 'UYU'` |
| `department` | String | Departamento (Uruguay) | `'Montevideo'` |
| `neighborhood` | String | Barrio | `'Pocitos'` |
| `location` | GeoPoint | Coordenadas exactas | `Geopoint(-34.90, -56.16)` |
| `viviendaPromovida` | Boolean | Aplica Ley 18.795 | `true` |
| `acceptedGuarantees` | Array<String> | Garantías aceptadas | `['ANDA', 'CGN']` |
| `status` | String | Estado del anuncio | `'active' \| 'draft' \| 'sold' \| 'rented'` |

### 1.3 Colección: `leads`
Consultas enviadas desde los buscadores a los agentes anunciantes.

**Clave de Documento:** `Auto - Generado por Firestore`.

| Campo | Tipo | Descripción | Ejemplo / Opciones permitidas |
|-------|------|-------------|-------------------------------|
| `propertyId` | String | ID de la propiedad consultada | `prop_123` |
| `propertyOwnerId`| String | UID del agente que recibe el Lead | `agent_xyz` |
| `name` | String | Nombre del interesado | `María Gómez` |
| `email` | String | Correo del interesado | `maria@email.com` |
| `status` | String | Estado de la negociación | `'new' \| 'contacted' \| 'qualified' \| 'lost'` |
| `createdAt` | Timestamp | Fecha de la consulta | `2026-02-23T...` |

---

## 2. Índices Compuestos (Composite Indexes)

En Firestore, cualquier consulta (query) que filtre o combine múltiples campos usando `==` combinado con `>`, `<`, o combinados con `array-contains`, requiere un índice compuesto.

### 2.1 Índices obligatorios para el Buscador de Propiedades
Dado que el motor de búsqueda en Barrio.uy es dinámico (permite múltiples filtros a la vez), **DEBEN existir los siguientes índices en Firebase Console**:

*Aplica a colección: `properties`*

1. **Búsqueda por Barrio y Precio:**
   `department` (ASC) + `neighborhood` (ASC) + `operation` (ASC) + `status` (ASC) + `price` (ASC)

2. **Filtros Uruguay-específicos (Garantías):**
   `acceptedGuarantees` (Arrays) + `operation` (ASC) + `status` (ASC) + `price` (ASC)

3. **Inversión pura (Vivienda Promovida):**
   `viviendaPromovida` (ASC) + `operation` (ASC) + `status` (ASC) + `price` (ASC)

*Aplica a colección: `leads`*
1. **Dashboard de Agente (Ordenar leads nuevos primero):**
   `propertyOwnerId` (ASC) + `createdAt` (DESC)

---

## 3. Reglas de Seguridad (Security Rules)

Las siguientes políticas controlan quién puede leer o escribir en cada colección. Todo requerimiento que no esté explícitamente permitido aquí, será denegado.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar: Verifica si está autenticado
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Función auxiliar: Verifica si es Administrador
    function isAdmin() {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ------------------------------------
    // Colección: users
    // ------------------------------------
    match /users/{userId} {
      // Cualquiera puede crear su perfil y leer perfiles públicos (ej. tarjeta de agente)
      allow read, create: if true; 
      // Sólo el dueño (o el Admin) puede editar su propio perfil
      allow update, delete: if isSignedIn() && (request.auth.uid == userId || isAdmin());
    }

    // ------------------------------------
    // Colección: properties
    // ------------------------------------
    match /properties/{propertyId} {
      // Búsqueda: Cualquiera puede ver las propiedades 'activas' (inclusive no logueados)
      allow read: if resource == null || resource.data.status == 'active';
      // Edición en Dashboard: El dueño de la publicación (o Admin) puede editar
      allow read, update, delete: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      // Creación: Sólo si está registrado (User o Agent)
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    // ------------------------------------
    // Colección: leads
    // ------------------------------------
    match /leads/{leadId} {
      // Creación: Cualquiera puede mandar un lead (inclusive incognito) desde formularios de contacto
      allow create: if true;
      // Lectura/Edición (CRM): Sólo el agente dueño (propertyOwnerId) o Administrador puede ver/modificar status
      allow read, update: if isSignedIn() && (resource.data.propertyOwnerId == request.auth.uid || isAdmin());
      // Nadie puede borrar leads manualmente por temas de integridad (soft-delete si aplica en UI)
      allow delete: if isAdmin();
    }
  }
}
```

---

## 4. Políticas de "Rate Limiting" & Facturación

Al tratarse de Firebase (plan de pago por lectura/escritura), aplicamos limitaciones para no incurrir en "Surprise Billing" (Agotar el presupuesto accidentalmente o por ataques):
* **Paginación Obligatoria:** Las queries al buscador (Lista principal) `limit(20)`. No se carga la base de datos completa jamás.
* **Escritura Autónoma:** Si un "Agente" usa scripts para auto-importar, se debe canalizar a través de una Cloud Function para aplicar un límite (Rate-limit) de creaciones simultáneas, de lo contrario lo bloqueamos en la Security Rule si sobrepasa un threshold. 
* **Edge Caching:** Las "Páginas Fijas" de inmuebles (`/propiedades/[id]`) en Vercel utilizan ISR (*Incremental Static Regeneration*). Almacenan la versión en Caché. Una visita directa desde Google no contabiliza lecturas pesadas a Firestore porque Vercel entrega el caché del HTML ya renderizado.
