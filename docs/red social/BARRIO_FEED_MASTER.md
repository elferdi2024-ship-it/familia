

---

Markdown  
\# 🏠 BARRIO\_FEED\_MASTER.md — ENGINEERING & PRODUCT SPEC

\*\*Versión:\*\* 11.0 — Final Master (Go-To-Market)    
\*\*Estado:\*\* Documentación Técnica, Código y Plan de Ejecución Integrado

\---

\#\# 1️⃣ VISIÓN Y VALOR ESTRATÉGICO  
Barrio Feed no es una red social de vanidad; es un \*\*motor de captura de intención inmobiliaria\*\*. Transforma la búsqueda pasiva en una experiencia dinámica que retiene al usuario y genera leads de alta calidad para los agentes en Uruguay.

\* \*\*KPI Maestro:\*\* WhatsApp Leads (Conversión Directa).  
\* \*\*Diferenciador:\*\* Algoritmo de relevancia basado en el mercado local uruguayo (Ley 18.795, Garantías, Barrios).

\---

\#\# 2️⃣ ARQUITECTURA TÉCNICA (STACK v16/v19)  
\* \*\*Frontend:\*\* Next.js 16.1.6 (App Router) y React 19\.  
\* \*\*Backend:\*\* Firebase Firestore (NoSQL) y Cloud Functions (v2).  
\* \*\*Performance:\*\* LCP \< 2s, ISR con revalidación de 1 hora para posts.

\#\#\# 2.1 Modelo de Datos: El "Property Snapshot"  
Para evitar lecturas costosas a la colección principal, cada post del feed contiene un "snapshot" inmutable de la propiedad.

\`\`\`typescript  
// lib/feed/types.ts  
export interface PropertySnapshot {  
  id: string;  
  slug: string;  
  price: number;  
  currency: 'USD' | 'UYU';  
  neighborhood: string;  
  viviendaPromovida: boolean; // Ley 18.795  
  acceptedGuarantees: string\[\]; // ANDA, CGN, Porto  
  mainImage: string;  
  bedrooms: number;  
  area: number;  
}

export interface FeedPost {  
  id: string;  
  authorId: string;  
  authorSlug: string;  
  authorVerified: boolean;  
  plan: 'free' | 'pro' | 'elite'; // Para VerifiedBoost  
  text: string;  
  hashtags: string\[\];  
  type: 'new\_property' | 'price\_drop' | 'market\_update' | 'opinion';  
  propertySnapshot: PropertySnapshot | null;  
  leadIntentScore: number;  
  rankingScore: number;  
  publishedAt: Date | any;  
  status: 'published' | 'hidden' | 'deleted';  
}

---

## **3️⃣ MOTOR DE RANKING Y PESOS (THE BRAIN)**

El sistema utiliza **Gravedad Temporal** para asegurar que el contenido nuevo y relevante siempre esté arriba.

### **3.1 Pesos de Intención (Lead Intent)**

* **WhatsApp Click:** \+12 puntos (Señal máxima de compra).  
* **Property Detail Click:** \+6 puntos.  
* **Comment:** \+3 puntos.  
* **Like:** \+1 punto.

### **3.2 Lógica de Cálculo**

TypeScript  
// lib/feed/ranking.ts  
export const calculateRankingScore \= (post: FeedPost, zonaWeight \= 1\) \=\> {  
  const hoursSince \= (Date.now() \- post.publishedAt.getTime()) / (1000 \* 60 \* 60);  
    
  // Multiplicadores  
  const typeWeights \= { price\_drop: 1.5, new\_property: 1.3, market\_update: 1.2, opinion: 1.0 };  
  const planBoosts \= { free: 1.0, pro: 1.2, elite: 1.35 };

  const relevance \= (post.leadIntentScore \* zonaWeight \* typeWeights\[post.type\] \* planBoosts\[post.plan\]);  
    
  // Fórmula de Decaimiento (Power Law Decay)  
  return relevance / Math.pow(hoursSince \+ 2, 1.35);  
};

---

## **4️⃣ BACKEND: CLOUD FUNCTIONS Y SEGURIDAD**

### **4.1 Transacción de Lead Intent (WhatsApp)**

Fundamental para evitar condiciones de carrera en los contadores.

TypeScript  
// functions/src/tracking.ts  
export const onWhatsAppClick \= onCall(async (request) \=\> {  
  const { postId } \= request.data;  
  const postRef \= db.collection('feedPosts').doc(postId);

  return db.runTransaction(async (transaction) \=\> {  
    const postDoc \= await transaction.get(postRef);  
    const data \= postDoc.data();  
      
    const newIntentScore \= data.leadIntentScore \+ 12; // Peso WhatsApp  
    const newRanking \= calculateRankingScore({ ...data, leadIntentScore: newIntentScore });

    transaction.update(postRef, {  
      leadIntentScore: newIntentScore,  
      rankingScore: newRanking,  
      whatsappClicks: FieldValue.increment(1)  
    });  
  });  
});

### **4.2 Reglas de Firestore**

Protegen la integridad del ranking contra manipulaciones desde el cliente.

JavaScript  
match /feedPosts/{postId} {  
  allow read: if resource.data.status \== 'published';  
  // Solo el servidor (Cloud Functions) puede actualizar scores.  
  // El cliente solo puede hacer soft-delete (status \= 'deleted') de sus propios posts.  
  allow update: if request.auth.uid \== resource.data.authorId   
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(\['status'\]);  
}

---

## **5️⃣ UX/UI: EL "FEEL" DE BARRIO FEED**

Basado en los principios de diseño de **Funda.nl** y adaptado a Uruguay.

* **Mobile-First:** Navegación inferior (Bottom Tab Bar) para acceso rápido al Feed.  
* **Visuales:** Imagen de propiedad ocupando el 60% de la tarjeta.  
* **Micro-interacciones:** Badge de "BAJÓ DE PRECIO" con animación sutil y contador de interesados "🔥".  
* **React 19:** Uso de `useOptimistic` para que los likes y comentarios se sientan instantáneos.

---

## **🗓️ CHECKLIST DE SPRINT 1 — EJECUCIÓN (7 DÍAS)**

### **Día 1-2: Core Data & Auth**

* \[ \] Configurar Firebase Auth (Google Login).  
* \[ \] Crear colecciones `feedPosts` y `feedAgentProfiles` en Firestore.  
* \[ \] Configurar **Índices Compuestos** en Firestore: `status: ASC, rankingScore: DESC`.

### **Día 3-4: El Motor de Ranking**

* \[ \] Desplegar Cloud Functions transaccionales para clics de WhatsApp.  
* \[ \] Implementar `lib/feed/ranking.ts` y validar con tests unitarios.

### **Día 5-6: UI & PWA**

* \[ \] Maquetar `FeedPostCard` optimizada para conversión móvil.  
* \[ \] Configurar Service Worker y Manifiesto para instalación PWA.  
* \[ \] Integrar **Algolia Search** para búsqueda instantánea de hashtags.

### **Día 7: QA & Soft Launch**

* \[ \] Validar que el `rankingScore` disminuya correctamente con el tiempo.  
* \[ \] Onboarding de los primeros 5 agentes beta.

---

## **🚀 SYSTEM PROMPT PARA ANTIGRAVITY**

*"Actúa como Senior Product Engineer de Barrio.uy. Implementa el Feed Engine siguiendo este documento Maestro. Tu prioridad es la conversión a WhatsApp (+12 pts) y el ranking meritocrático. Asegura que los Property Snapshots incluyan datos de Ley 18.795 y garantías uruguayas. Usa React 19 y Next.js 16 para maximizar el performance (LCP \< 2s). No permitas que el cliente actualice los scores directamente; toda lógica de ranking debe estar protegida."*

---

**🏠 Barrio.uy \- La red social del mercado inmobiliario uruguayo.**

