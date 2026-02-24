

---

# **🏠 PRD — BARRIO.UY v5.5 (FEED INTEGRATED)**

### **Plataforma Inmobiliaria Premium & Social Engine para Uruguay**

**Versión:** 5.5.0 | **Fecha:** 22 de Febrero 2026 | **Estado:** Go-To-Market (GTM)

---

## **1\. Resumen Ejecutivo**

### **1.1 Visión del Producto**

**Barrio.uy** evoluciona de un portal tradicional a un **motor de inteligencia social**. Combina la búsqueda de propiedades con un **Feed Inmobiliario** meritocrático que prioriza la frescura y la intención real de compra.

### **1.2 El Diferenciador "Barrio Feed"**

A diferencia de los portales legacy, Barrio.uy utiliza un algoritmo de ranking dinámico:

$$RankingScore \= \\frac{(LeadIntent \\cdot ZonaWeight \\cdot TypeWeight \\cdot VerifiedBoost) \+ Momentum}{(HoursSince \+ 2)^{1.35}}$$

---

## **2\. Análisis de Mercado & Oportunidad**

### **2.1 El Gap en Uruguay**

* **Competencia (InfoCasas/Gallito):** UX lenta, contenido estático y fuga de tráfico hacia Instagram/WhatsApp sin tracking.  
* **Oportunidad Barrio.uy:** Retener la interacción social dentro de la plataforma y transformar cada clic en WhatsApp en un dato de relevancia para el mercado.

---

## **3\. Funcionalidades Core**

### **3.1 Búsqueda & Descubrimiento (Must Have)**

* **Filtros Uruguay-específicos:** Vivienda Promovida (Ley 18.795), Garantías (ANDA, CGN, Porto Seguro).  
* **Algolia Instant Search:** Resultados en menos de 50ms con tolerancia a errores.

### **3.2 Barrio Feed (Social Engine)**

* **Property Snapshots:** Tarjetas inmutables con datos clave integradas en el feed social.  
* **Lead Intent Tracking:** Sistema que otorga \+12 puntos de relevancia por clic en WhatsApp.  
* **Ranking Meritocrático:** El contenido "caliente" de los barrios (Pocitos, Cordón, etc.) sube orgánicamente.

---

## **4\. Arquitectura Técnica Actualizada**

### **4.1 Tech Stack**

* **Framework:** Next.js 16.1.6 (App Router) & React 19\.  
* **Backend:** Firebase (Firestore \+ Cloud Functions Transaccionales).  
* **Estilos:** Tailwind CSS 4.0 & Framer Motion 12.34.  
* **Caché:** Redis via Vercel KV para optimización de scores.

### **4.2 Lógica de Datos**

* **Inmutabilidad:** Los posts del feed no permiten edición de datos core para proteger la integridad del histórico de precios.  
* **Seguridad:** Firestore Rules que bloquean la modificación de scores desde el cliente.

---

## **5\. Experiencia de Usuario (UX)**

### **5.1 Diseño Mobile-First**

* **Bottom Navigation:** Acceso inmediato a Home, Feed, Favoritos y Perfil.  
* **Jerarquía en Feed:** Texto emocional \> Hashtags \> Snapshot Inmobiliario \> CTA WhatsApp (Verde \#25D366).

---

## **6\. Roadmap de Producto 2026**

### **6.1 Sprint 1: Estabilización & Feed Base (Q1 2026\)**

* \[ \] Implementación del motor de ranking en lib/feed/ranking.ts.  
* \[ \] Setup de Cloud Functions para tracking de leads (WhatsApp/Property Clicks).  
* \[ \] Despliegue de PWA y Service Workers para uso offline.

### **6.2 Sprint 2: Monetización & Analytics (Q2 2026\)**

* \[ \] Integración de Stripe para planes Pro y Elite.  
* \[ \] Dashboard de Analytics para agentes (Views vs. Leads).

---

## **7\. Riesgos y Mitigaciones**

* **Riesgo:** Explosión de costos en Firebase por recálculos de ranking.  
* **Mitigación:** Implementación de lógica de caché en Redis y exportación a BigQuery para analítica pesada.

---

## **8\. Glosario Uruguay-Específico**

* **Vivienda Promovida:** Ley 18.795 con beneficios fiscales para inversores.  
* **Garantías:** ANDA, Contaduría (CGN) y seguros privados como Porto Seguro.

---

**🏠 Barrio.uy \- Encontrá tu próximo hogar.**

