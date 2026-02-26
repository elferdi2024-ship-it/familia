# PRD — Barrio.uy v11.1
### Plataforma Inmobiliaria Premium para Uruguay

**Versión:** 11.1.0 | **Fecha:** 25 de Febrero 2026 | **Estado:** 100% Production Ready (Monetización Portal, Estrategia FOMO Free→Pro, SEO & E2E Verified)

> **⚠️ Principio de diseño obligatorio:** **Mobile-first es CLAVE.** La experiencia se diseña primero para móvil (pulgar, touch, viewport pequeño). Actualmente **varias capas del diseño están rotas**; toda nueva funcionalidad y las próximas iteraciones deben priorizar vista móvil y reparar layout. Ver [DISEÑO_MOBILE_FIRST.md](../DISEÑO_MOBILE_FIRST.md).

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis de Mercado](#2-análisis-de-mercado)
3. [Propuesta de Valor](#3-propuesta-de-valor)
4. [Usuarios y Personas](#4-usuarios-y-personas)
5. [Funcionalidades Core](#5-funcionalidades-core)
6. [Arquitectura Técnica](#6-arquitectura-técnica)
7. [Experiencia de Usuario](#7-experiencia-de-usuario)
8. [Requisitos Funcionales](#8-requisitos-funcionales)
9. [Requisitos No Funcionales](#9-requisitos-no-funcionales)
10. [Métricas y KPIs](#10-métricas-y-kpis)
11. [Roadmap de Producto](#11-roadmap-de-producto)
12. [Plan de Testing](#12-plan-de-testing)
13. [Estrategia Go-to-Market](#13-estrategia-go-to-market)
14. [Riesgos y Mitigaciones](#14-riesgos-y-mitigaciones)
15. [Anexos](#15-anexos)

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto

**Barrio.uy** es la primera plataforma inmobiliaria de Uruguay que combina:
- **Experiencia mobile-first** con estándares internacionales (benchmark: Funda.nl)
- **Datos inteligentes** del mercado uruguayo (Vivienda Promovida Ley 18.795, garantías, analytics)
- **Tecnología moderna** (Next.js 16, React 19, Firebase, Upstash KV) para una experiencia ultra-rápida
- **Democratización** del mercado inmobiliario (publicación gratuita, sin intermediarios)
- **Red Social Inmobiliaria (Feed B2B/B2C)** conectando agentes, compradores e inversores en tiempo real mediante un feed meritorio.

### 1.2 Problema que Resuelve

#### Para Compradores/Inquilinos:
- ❌ **Plataformas legacy** con UX obsoleta y lenta
- ❌ **Falta de información** relevante (Vivienda Promovida, garantías, precio/m²)
- ❌ **Búsqueda ineficiente** sin filtros inteligentes o personalización
- ❌ **Experiencia mobile deficiente** en competidores

#### Para Propietarios/Agentes:
- ❌ **Costos altos** de publicación en portales tradicionales
- ❌ **Gestión manual** de leads sin herramientas CRM
- ❌ **Falta de analytics** para optimizar anuncios
- ❌ **Procesos complejos** de publicación y actualización

### 1.3 Solución Diferenciadora

```
🎯 FÓRMULA GANADORA = UX Premium + Datos Uruguay + Tech Moderna + Modelo Freemium
```

**Ventajas competitivas clave:**
1. **Mobile-first real** con bottom navigation y dark mode nativo
2. **Datos únicos** de mercado uruguayo (Ley 18.795, garantías ANDA/CGN/Porto)
3. **Red Social Integrada:** Feed inmobiliario donde los agentes comparten ingresos y bajas de precio, ordenado por un algoritmo de "Lead Intent".
4. **Publicación sin fricción** en 4 pasos con wizard intuitivo que incluye pre-llenado desde el mapa.
5. **Cloud sync** de favoritos y búsquedas (local + Firebase)
6. **Performance excepcional** (<2s LCP, 95+ Lighthouse, caché global con Upstash Redis)
7. **Stack moderno** que permite iteración rápida

### 1.4 Métricas de Éxito (Año 1)

| Métrica | Meta Mes 6 | Meta Mes 12 |
|---------|------------|-------------|
| Propiedades activas | 2,000 | 10,000 |
| Agentes registrados | 200 | 500 |
| Leads generados/mes | 400 | 1,500 |
| MAU (Monthly Active Users) | 10,000 | 30,000 |
| MRR (Monthly Recurring Revenue) | $2,000 | $15,000 |
| NPS (Net Promoter Score) | 40+ | 60+ |

---

## 2. Análisis de Mercado

### 2.1 Tamaño del Mercado

**Mercado Inmobiliario Uruguay:**
- Transacciones anuales: ~15,000 compraventas
- Alquileres activos: ~80,000 en Montevideo
- Valor promedio transacción: USD 150,000
- Mercado total: ~USD 2.25B anuales

**Digital Penetration:**
- 90% de búsquedas comienzan online
- 65% de usuarios usan mobile primero
- Crecimiento e-commerce: 25% YoY

### 2.2 Competidores Directos

| Competidor | Market Share | Fortalezas | Debilidades |
|------------|--------------|------------|-------------|
| **InfoCasas** | ~60% | Market-share líder, 60K+ propiedades, SEO dominante | UI legacy, UX desktop-centric, performance lenta, sin datos Ley 18.795 |
| **MercadoLibre** | ~15% | Tráfico masivo del marketplace, reconocimiento de marca | No especializado en inmobiliaria, sin filtros Uruguay-específicos |
| **Gallito.com** | ~10% | Tradición en Uruguay (20+ años) | Diseño obsoleto, sin features modernas, mobile pobre |
| **Properati** | ~5% | Diseño moderno, mapa integrado | Menor penetración en Uruguay, sin datos locales específicos |

### 2.3 Matriz Competitiva

| Feature | Barrio.uy | InfoCasas | ML | Gallito | Properati |
|---------|--------------|-----------|-----|---------|-----------|
| **Mobile-first UX** | ✅ 10/10 | ⚠️ 5/10 | ⚠️ 6/10 | ❌ 3/10 | ✅ 8/10 |
| **Performance** | ✅ 9/10 | ⚠️ 4/10 | ⚠️ 5/10 | ❌ 3/10 | ✅ 7/10 |
| **Dark Mode** | ✅ Nativo | ❌ No | ❌ No | ❌ No | ❌ No |
| **Datos Ley 18.795** | ✅ Sí | ❌ No | ❌ No | ❌ No | ❌ No |
| **Garantías visibles** | ✅ ANDA/CGN/Porto | ⚠️ Parcial | ❌ No | ❌ No | ❌ No |
| **Cloud Sync Favoritos** | ✅ Local+Firebase | ❌ No | ⚠️ Con cuenta | ❌ No | ⚠️ Con cuenta |
| **Comparador** | ✅ Sí (3 props) | ⚠️ Básico | ❌ No | ❌ No | ❌ No |
| **Publicación gratis** | ✅ Ilimitada | ⚠️ Limitada | ✅ Sí | ⚠️ Paga | ⚠️ Limitada |
| **Dashboard Leads** | ✅ Con estados | ⚠️ Básico | ⚠️ Básico | ❌ Email | ⚠️ Básico |
| **Monetización (Stripe)** | ✅ Live (3 tiers) | ✅ Sí | ⚠️ Sí | ❌ No | ⚠️ Sí |
| **Analytics** | ✅ Live (Premium) | ❌ No | ❌ No | ❌ No | ❌ No |
| **Stack Moderno** | ✅ Next.js 15 | ❌ Legacy | ❌ Legacy | ❌ Legacy | ⚠️ Vue.js |

### 2.4 Oportunidad de Mercado

> **Gap identificado:** El 70% de usuarios buscan propiedades en mobile, pero ningún competidor ofrece una experiencia mobile-first realmente optimizada con datos relevantes de Uruguay.

**Segmento objetivo inicial:**
- **Millennials y Gen Z** (25-40 años)
- Buscando **primera vivienda** o inversión
- Rango: USD 150K-350K (compra) | $25K-45K UYU/mes (alquiler)
- Tech-savvy, valoran **UX** y **transparencia**
- **Montevideo** (Pocitos, Punta Carretas, Cordón, Centro, Carrasco)

---

## 3. Propuesta de Valor

### 3.1 Para Compradores/Inquilinos

#### Propuesta Principal
> "Encontrá tu próximo hogar en minutos, no en semanas. La búsqueda más rápida, inteligente y personalizada de Uruguay."

#### Beneficios Clave

**1. Búsqueda Ultra-Rápida**
- Filtros facetados con 12+ criterios
- Autocomplete inteligente con sugerencias
- Resultados instantáneos (<500ms)
- Guardar búsquedas con alertas

**2. Datos que Importan**
- Badge **Vivienda Promovida** (exoneración IVA)
- Garantías aceptadas (ANDA, CGN, Porto Seguro)
- Precio/m² comparado con mercado
- Rendimiento estimado para inversores
- POIs cercanos (colegios, transporte, servicios)

**3. Experiencia Mobile Superior**
- Bottom navigation nativa
- Gestos intuitivos (swipe, pinch-to-zoom)
- Dark mode para búsqueda nocturna
- Offline support (PWA)
- Instalable como app nativa

**4. Herramientas de Decisión y Comunidad**
- Red social local (Feed) para seguir propiedades nuevas, bajadas de precio y opiniones de expertos.
- Comparador side-by-side (hasta 3 propiedades)
- Calculadora hipotecaria integrada
- Mapa de barrio con amenidades
- Historial de favoritos sincronizado
- Alertas de precio reducido

### 3.2 Para Propietarios/Agentes

#### Propuesta Principal
> "Publicá gratis y recibí leads calificados. Sin comisiones ocultas, con herramientas profesionales."

#### Beneficios Clave

**1. Publicación Sin Fricción y Distribución**
- Wizard de 4 pasos (5 minutos) con autocompletado de barrio por pin de Google Maps.
- Campo obligatorio "Título de la publicación".
- Distribución inmediata en el **Feed de la Red Social** (Ingresos, Bajó de precio, Actualizaciones).
- Upload de fotos directo desde mobile
- Plantillas de descripción
- Preview en vivo antes de publicar
- Edición post-publicación

**2. Gestión de Leads**
- Dashboard con estados (Nuevo/Contactado/Calificado/Perdido)
- Notificación inmediata por email
- WhatsApp directo desde la plataforma
- Historial de conversaciones
- Export de leads a CSV

**3. Visibilidad y Analytics** (Premium - $40/mes)
- Views diarias/semanales/mensuales
- Tiempo promedio en página
- Tasa de conversión lead/vista
- Comparación con mercado
- Sugerencias de optimización

**4. Features Premium**
- Destacar propiedades en búsqueda
- Badge "Agente Verificado"
- Prioridad en resultados
- Analytics avanzado
- CRM integrado básico
- Email marketing mensual
- API access

### 3.3 Value Proposition Canvas

```
TRABAJOS DEL USUARIO (Jobs to be Done)
------------------------------------------
Comprador/Inquilino:
• Encontrar vivienda que cumpla requisitos
• Entender si el precio es justo
• Tomar decisión informada rápidamente
• Agendar visitas con propietarios

Propietario/Agente:
• Publicar propiedad eficientemente
• Atraer compradores/inquilinos calificados
• Gestionar múltiples leads
• Cerrar transacciones más rápido

DOLORES (Pains)
------------------------------------------
• Plataformas lentas y frustrantes
• Falta de información relevante
• Spam de propiedades irrelevantes
• No poder comparar opciones fácilmente
• Leads de baja calidad o no responden

GANANCIAS (Gains)
------------------------------------------
• Encontrar hogar ideal en 1 semana vs 3 meses
• Confianza en decisión (datos + reviews)
• Experiencia placentera (no frustrante)
• Leads que responden y cierran
• Ahorro de tiempo y dinero

ANALGÉSICOS (Pain Relievers)
------------------------------------------
✅ Performance <2s (vs 5-10s competencia)
✅ Filtros Uruguay-específicos
✅ Comparador visual
✅ Leads con nombre + email + teléfono verificado
✅ Dashboard de gestión centralizado

CREADORES DE GANANCIA (Gain Creators)
------------------------------------------
✅ Búsqueda inteligente con ML
✅ Datos únicos de mercado
✅ Mobile-first UX premium
✅ Gratis para siempre (plan básico)
✅ Analytics para optimizar anuncios (premium)
```

---

## 4. Usuarios y Personas

### 4.1 Persona 1: Martín - El Millennial First-Time Buyer

**Demografía:**
- 32 años, ingeniero en software
- Ingresos: $80,000 UYU/mes
- Montevideo, Pocitos
- Soltero, vive con roommates

**Comportamiento Digital:**
- 95% mobile (iPhone)
- Apps favoritas: Instagram, Twitter, Spotify
- Valora diseño y UX
- Lee reviews antes de decidir

**Objetivos:**
- Comprar primer apartamento (USD 180K-250K)
- Zona Pocitos/Punta Carretas
- 2 dormitorios, luminoso, con amenities
- Aprovechar Vivienda Promovida si aplica

**Frustraciones:**
- InfoCasas muy lento en mobile
- No entiende bien tema de garantías/leyes
- Ver 20 propiedades antes de decidir
- Agentes no responden rápido

**Quote:**
> "No tengo tiempo para perder en páginas lentas. Necesito info clara y rápida para decidir."

**Cómo Barrio.uy lo ayuda:**
- Mobile ultra-rápido con dark mode
- Badge Vivienda Promovida visible
- Comparador para shortlist de 3 opciones
- Chat directo con vendedor/agente
- Calculadora hipotecaria integrada

---

### 4.2 Persona 2: Carolina - La Agente Inmobiliaria

**Demografía:**
- 45 años, agente hace 12 años
- Ingresos: comisiones variables
- Montevideo, Punta Carretas
- Casada, 2 hijos

**Comportamiento Digital:**
- 70% mobile / 30% desktop
- Apps favoritas: WhatsApp, Instagram, Gmail
- No muy tech-savvy pero aprende rápido
- Usa InfoCasas y Gallito actualmente

**Objetivos:**
- Aumentar visibilidad de propiedades
- Recibir más leads calificados
- Gestionar cartera de 15-20 propiedades
- Reducir tiempo en tareas administrativas

**Frustraciones:**
- Pagar destacados en InfoCasas ($50/mes por prop)
- Leads llegan por email sin organización
- Actualizar precios/fotos es complicado
- No sabe qué propiedades funcionan mejor

**Quote:**
> "Necesito una plataforma que me traiga clientes reales, no solo visitas. Y que sea fácil de usar."

**Cómo Barrio.uy la ayuda:**
- Publicación gratis ilimitada
- Dashboard de leads con estados
- Edición rápida desde mobile
- Analytics de performance (plan premium)
- Notificaciones push de nuevos leads
- Export de contactos a Excel

---

### 4.3 Persona 3: Laura - La Estudiante Buscando Alquiler

**Demografía:**
- 23 años, estudiante de medicina
- Ingresos: $15,000 UYU/mes (ayuda familiar)
- Montevideo, vive con padres
- Busca mudarse cerca de facultad

**Comportamiento Digital:**
- 100% mobile (Android)
- Apps favoritas: TikTok, Instagram, YouTube
- Generación Z, valora autenticidad
- Busca info en redes sociales

**Objetivos:**
- Alquilar monoambiente (máx $18,000/mes)
- Zona Cordón, Parque Rodó, Tres Cruces
- Que acepte garantía CGN (sus padres)
- Mudarse en 2 meses

**Frustraciones:**
- Muchas propiedades no aceptan su tipo de garantía
- Propietarios piden garantías complicadas
- Fotos engañosas en portales
- No sabe si precio es razonable

**Quote:**
> "Soy primeriza alquilando. Necesito que sea fácil y transparente, sin sorpresas."

**Cómo Barrio.uy la ayuda:**
- Filtro de garantías aceptadas (CGN destacado)
- Precio/m² para comparar
- Fotos reales obligatorias
- WhatsApp directo al propietario
- Reviews/ratings de propiedades (futuro)

---

### 4.4 User Journey Maps

#### Journey 1: Comprador (Martín)

**ETAPA 1: DESCUBRIMIENTO (Día 1)**
- **Touchpoint:** Google Search "apartamentos Pocitos USD 200k"
- **Emoción:** 😐 Neutral
- **Acción:** Click en resultado orgánico Barrio.uy
- **Expectativa:** Encontrar opciones rápidamente

**ETAPA 2: EXPLORACIÓN (Día 1-3)**
- **Touchpoint:** Homepage → Búsqueda con filtros
- **Emoción:** 😊 Satisfecho (rápido y bonito)
- **Acción:** 
  - Filtrar: Venta, Apartamento, Pocitos, 2 dorms, USD 180-250K
  - Marcar 8 favoritos
  - Comparar 3 propiedades
- **Expectativa:** Shortlist de 3-5 opciones top

**ETAPA 3: EVALUACIÓN (Día 4-7)**
- **Touchpoint:** Detalle de propiedad → Lead form
- **Emoción:** 🤔 Considerando
- **Acción:**
  - Ver fotos, mapa, amenidades
  - Calcular hipoteca
  - Enviar consulta a 3 propiedades
- **Expectativa:** Respuesta rápida del vendedor

**ETAPA 4: DECISIÓN (Día 8-14)**
- **Touchpoint:** WhatsApp con vendedor → Visita presencial
- **Emoción:** 😃 Emocionado
- **Acción:**
  - Agendar 2 visitas
  - Negociar precio
  - Reservar con seña
- **Expectativa:** Proceso transparente y justo

**ETAPA 5: POST-COMPRA (Día 15+)**
- **Touchpoint:** Email de satisfacción
- **Emoción:** 😍 Encantado
- **Acción:**
  - Dejar review 5 estrellas
  - Recomendar a amigo
  - Guardar búsqueda "inversión" para futuro
- **Expectativa:** Mantener relación con plataforma

---

## 5. Funcionalidades Core

### 5.1 Mapa de Features (MoSCoW)

#### 🔴 MUST HAVE (Versión 1.0 - Actual) [Completado 100%]

**Búsqueda y Descubrimiento:**
- ✅ Búsqueda con 12+ filtros facetados
- ✅ Autocomplete inteligente con sugerencias
- ✅ Filtros Uruguay-específicos (Vivienda Promovida, garantías)
- ✅ Mapa interactivo de resultados
- ✅ Grid/List view toggle
- ✅ Ordenamiento (precio, fecha, relevancia)

**Red Social Inmobiliaria (Feed):**
- ✅ Feed B2B/B2C interactivo con publicaciones en tiempo real
- ✅ Tipos de post: Nuevo Ingreso, Bajó de Precio, Actualización, Opinión
- ✅ Linking de propiedades existentes directamente a publicaciones
- ✅ Interactions: Likes, WhatsApp Contact (Lead Intent rank boosters)
- ✅ Modal de creación de posts con auto-generación de descripciones
- ✅ Sidebar de Top Agentes y Barrios en Tendencia

**Detalle de Propiedad:**
- ✅ Galería de fotos con lightbox
- ✅ Información completa (m², habitaciones, etc.)
- ✅ Mapa de ubicación con POIs
- ✅ Amenidades con iconos
- ✅ Lead form con validación
- ✅ WhatsApp button directo
- ✅ Botón favorito con sync
- ✅ Botón comparar (max 3)

**Publicación:**
- ✅ Wizard de 4 pasos
- ✅ Upload de fotos (hasta 20)
- ✅ Ubicación con mapa interactivo
- ✅ Formulario completo con validaciones
- ✅ Preview antes de publicar
- ✅ Publicación inmediata

**Gestión:**
- ✅ Dashboard de propiedades
- ✅ Dashboard de leads con estados
- ✅ Edición de propiedades
- ✅ Eliminación soft-delete
- ✅ Perfil de usuario

**Usuario:**
- ✅ Autenticación con Google
- ✅ Favoritos con cloud sync
- ✅ Búsquedas guardadas
- ✅ Comparador de propiedades
- ✅ Perfil personalizable

**Mobile:**
- ✅ Bottom tab navigation
- ✅ Responsive design completo
- ✅ Touch gestures
- ✅ Dark mode nativo
- ✅ PWA manifest

**SEO & Monetización (Core):**
- ✅ Canonical tags explícitos y optimizados
- ✅ BreadcrumbList Schema.org global
- ✅ SEO Metadata en todas las páginas estáticas
- ✅ Integración Stripe (Checkout + Webhooks)
- ✅ Límites de publicación por plan (Free/Pro/Premium)
- ✅ Gating de funcionalidades Premium en UI
- ✅ **Estrategia FOMO (conversión Free→Pro):** badge en feed (Estándar/Destacado), teaser de leads, salud de la propiedad, penalización por antigüedad en ranking, pricing “Lo que te perdés”, oferta 24h; configurable por `NEXT_PUBLIC_FOMO_MODE`. Ver [ESTRATEGIA_FOMO_BARRIO.md](../ESTRATEGIA_FOMO_BARRIO.md) y [CAMBIOS_ESTRATEGIA_FOMO.md](../CAMBIOS_ESTRATEGIA_FOMO.md).

**Optimización:**
- 🔜 Push notifications
- 🔜 ISR en páginas de propiedad
- 🔜 Image optimization (AVIF)
- ✅ Redis cache layer (Upstash KV completado)

**Operaciones y Mantenimiento:**
- 🔜 Firebase Cloud Function para Algolia Sync (actualmente proceso manual)
- 🔜 Moderación automática de posts en el Feed (Anti-spam)

**Comunicación:**
- 🔜 Email notifications (leads)
- 🔜 WhatsApp integration API
- 🔜 Chat en vivo (Intercom)
- 🔜 SMS notifications (opcional)

**Analytics:**
- 🔜 Sentry error tracking
- 🔜 Hotjar heatmaps
- 🔜 Google Analytics 4 eventos
- 🔜 Mixpanel user tracking

**Contenido:**
- 🔜 Blog con 10 artículos (3 actuales)
- 🔜 Landing pages por barrio 


#### 🟢 COULD HAVE (Versión 2.0 - Q2-Q3 2026)

**Búsqueda Avanzada:**
- ⏳ Algolia instant search
- ⏳ Búsqueda por voz
- ⏳ Búsqueda por foto (ML)
- ⏳ Recomendaciones personalizadas

**Features Premium:**
- ⏳ Analytics avanzado propiedades
- ⏳ CRM integrado básico
- ⏳ Email marketing campaigns
- ⏳ Destacar propiedades
- ⏳ Badge "Agente Verificado"
- ⏳ API para integración

**Herramientas:**
- ⏳ Calculadora hipotecaria avanzada
- ⏳ Valuación automática (ML)
- ⏳ Tour virtual 360°
- ⏳ Contrato digital (e-signature)

**Social:**
- ⏳ Reviews y ratings
- ⏳ Compartir en redes sociales
- ⏳ Referral program
- ⏳ Comunidad de usuarios

#### 🔵 WON'T HAVE (Fuera de scope 2026)

- ❌ App nativa iOS/Android (PWA es suficiente)
- ❌ Blockchain/crypto payments
- ❌ Integración con bancos (muy complejo)
- ❌ Video calls integradas
- ❌ Marketplace de servicios (mudanzas, etc.)

---

## 6. Arquitectura Técnica

### 6.1 Stack Tecnológico Completo

#### Frontend
```yaml
Framework: Next.js 16.1.6
  - Nota: Versión experimental documentada. Producción usa 15.x.
  - App Router (RSC)
  - React Server Components
  - Server Actions
  - Middleware
  
React: 19.2.3
  - Nota: Versión RC/Beta para aprovechar React Compiler.
  - React Compiler habilitado
  - Hooks optimizados
  - Concurrent features
  
Lenguaje: TypeScript 5.x
  - Strict mode
  - Path aliases (@/)
  - Type-safe APIs

Estilos:
  - Tailwind CSS 4.0
  - shadcn/ui components
  - Framer Motion 12.34
  - tw-animate-css

Gestión de Estado:
  - React Context API
  - Local Storage + Firebase sync
  - URL state (useSearchParams)

Formularios y Validación:
  - React Hook Form
  - Zod 4.3.6 schemas
  - Validación server-side
```

#### Backend
```yaml
Base de Datos: Firebase Firestore
  - NoSQL document-based
  - Real-time listeners
  - Composite indexes
  - Security rules
  - Nota: Prisma Schema eliminado (deuda arquitectural resuelta)

Caching y Estado Global: Upstash KV (Redis)
  - Edge caching global
  - Rate limiting avanzado

Autenticación: Firebase Auth
  - Google Sign-In
  - JWT tokens
  - Session management
  
Storage: Firebase Cloud Storage
  - Image uploads
  - Thumbnails generation
  - CDN distribution
  
Email: Resend 6.9.2
  - Transactional emails
  - Lead notifications
  - Email templates

Mapas: Google Maps API
  - @react-google-maps/api 2.20.8
  - Geocoding
  - Places API (futuro)
  - Directions API (futuro)
```

#### DevOps y Deploy
```yaml
Hosting: Vercel
  - Edge Network global
  - CDN automático
  - Serverless Functions
  - Environment variables
  
Analytics:
  - Vercel Analytics 1.6.1
  - Speed Insights 1.3.1
  - Google Analytics 4 (futuro)
  
Monitoring:
  - Sentry 10.39.0
  - Configurado a 10% sample rate mitigando sobrecostos
  - Vercel Logs
  - Firebase Console
  
CI/CD:
  - GitHub Actions (futuro)
  - Automatic deploys on push
  - Preview deployments
```

### 6.2 Modelo de Datos Firestore

#### Collection: `properties`
```typescript
interface Property {
  id: string                    // Auto-generated
  userId: string                // Owner ID from Firebase Auth
  operation: 'Venta' | 'Alquiler'
  type: 'Apartamento' | 'Casa' | 'Terreno' | 'Local' | 'Oficina' | 'Chacra'
  title: string
  description: string
  price: number
  currency: 'USD' | 'UYU'
  pricePerSqm?: number          // Calculated
  
  // Location
  department: string
  city: string
  neighborhood: string
  address?: string
  coordinates: {
    lat: number
    lng: number
  }
  
  // Features
  area: number                  // m²
  bedrooms: number
  bathrooms: number
  garages: number
  yearBuilt?: number
  condition?: string
  
  // Uruguay-specific
  viviendaPromovida: boolean
  acceptedGuarantees: string[]
  
  // Media
  images: string[]
  floorplanUrl?: string
  videoUrl?: string
  
  // Amenities
  amenities: string[]
  
  // Stats
  views: number
  favorites: number
  leadsCount: number
  
  // Metadata
  status: 'draft' | 'active' | 'sold' | 'rented' | 'paused'
  featured: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
  expiresAt?: Timestamp
}
```

#### Collection: `users`
```typescript
interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  phoneNumber?: string
  
  // Profile
  role: 'user' | 'agent' | 'admin'
  agentVerified: boolean
  companyName?: string
  bio?: string
  
  // Preferences
  favoritePropertyIds: string[]
  savedSearches: SavedSearch[]
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  
  // Premium
  premiumTier?: 'free' | 'premium' | 'enterprise'
  premiumExpiresAt?: Timestamp
  stripeCustomerId?: string
  
  // Stats
  propertiesCount: number
  leadsReceived: number
  
  // Metadata
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
```

#### Collection: `leads`
```typescript
interface Lead {
  id: string
  propertyId: string
  propertyOwnerId: string
  
  // Lead info
  name: string
  email: string
  phone?: string
  message: string
  
  // Status
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  statusChangedAt: Timestamp
  notes?: string
  
  // Metadata
  source: 'web' | 'mobile' | 'api'
  referrer?: string
  createdAt: Timestamp
}
```

#### Collection: `feedPosts`
```typescript
interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorSlug: string
  authorVerified: boolean
  plan: 'free' | 'pro' | 'elite'
  text: string
  hashtags: string[]
  type: 'new_property' | 'price_drop' | 'market_update' | 'opinion'
  propertySnapshot?: PropertySnapshot | null
  propertyUrl?: string | null
  leadIntentScore: number // Used for ranking
  rankingScore: number
  whatsappClicks: number
  likes: number
  comments: number
  publishedAt: Timestamp
  status: 'published' | 'deleted'
}
```

---

## 7. Experiencia de Usuario

### 7.1 Principios de Diseño

#### 1. Mobile-First Real **(OBLIGATORIO — CLAVE DEL PRODUCTO)**
```
❌ NO: "Responsive design adaptado desde desktop"
✅ SÍ: "Diseñado para pulgar, escalado a desktop"

Implementación:
- Bottom navigation (zona pulgar)
- Cards swipe-able
- CTAs grandes (min 44x44px)
- Forms con keyboard apropiado
- Touch targets espaciados
```
**Estado conocido:** Varias capas del diseño están actualmente rotas en móvil. Toda implementación o corrección debe validarse primero en viewport móvil (375px–428px) y priorizar la reparación de layout. Ver [DISEÑO_MOBILE_FIRST.md](../DISEÑO_MOBILE_FIRST.md).

#### 2. Speed is a Feature
```
❌ NO: "Aceptable si carga en 3-5s"
✅ SÍ: "Debe sentirse instantáneo (<500ms perceived)"

Implementación:
- Skeleton screens inmediatos
- Optimistic UI updates
- Image lazy loading
- Code splitting por ruta
- Edge caching CDN
```

#### 3. Progressive Disclosure
```
❌ NO: "Mostrar todos los filtros de inicio"
✅ SÍ: "Revelar complejidad gradualmente"

Implementación:
- Filtros básicos visible
- "Filtros avanzados" expandible
- Wizard en steps (no todo junto)
- Tooltips on-demand
```

#### 4. Feedback Inmediato
```
❌ NO: "Submit sin confirmación"
✅ SÍ: "Microinteracciones en cada acción"

Implementación:
- Toast notifications
- Loading spinners contextuales
- Animated checkmarks
- Color changes on hover
- Haptic feedback (móvil)
```

### 7.2 Diseño Visual

#### Paleta de Colores

```css
/* Light Mode */
--primary: #2563eb        /* Blue */
--secondary: #f59e0b      /* Amber */
--background: #FFFFFF     /* White */
--foreground: #0A0A0A     /* Near black */
--muted: #F3F4F6          /* Light gray */
--success: #10B981        /* Green */
--destructive: #EF4444    /* Red */

/* Dark Mode */
--primary: #60A5FA        /* Lighter blue */
--background: #1E293B     /* Dark blue-gray */
--foreground: #F8FAFC     /* Off white */
--muted: #334155          /* Darker gray */
```

#### Tipografía

```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', sans-serif;

/* Scale */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px

/* Weights */
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

---

## 8. Requisitos Funcionales

### 8.1 Módulo: Búsqueda

**RF-001: Búsqueda con Filtros Múltiples**
- El sistema DEBE permitir filtrar por: operación, tipo, departamento, ciudad, barrio, precio (min/max), dormitorios, baños, garajes
- El sistema DEBE permitir filtros avanzados: área (m²), año construcción, estado, amenidades
- El sistema DEBE mostrar contador de resultados en tiempo real
- El sistema DEBE actualizar la URL con parámetros de búsqueda
- El sistema DEBE persistir filtros al navegar back/forward

**RF-002: Filtros Uruguay-Específicos**
- El sistema DEBE incluir toggle "Vivienda Promovida Ley 18.795"
- El sistema DEBE incluir checkboxes de garantías aceptadas: ANDA, CGN, Porto Seguro, Título de Propiedad, Garantía Bancaria
- El sistema DEBE mostrar tooltip explicativo de cada filtro uruguayo

**RF-003: Autocomplete Inteligente**
- El sistema DEBE proveer sugerencias al escribir 3+ caracteres
- Las sugerencias DEBEN incluir: barrios, ciudades, departamentos, tipos de propiedad
- El sistema DEBE resaltar el texto coincidente
- El sistema DEBE permitir navegación por teclado (arrows, enter, escape)

---

### 8.2 Módulo: Detalle de Propiedad

**RF-009: Información Completa**
- El sistema DEBE mostrar: título, descripción, precio, moneda, ubicación completa, área, dormitorios, baños, garajes
- El sistema DEBE mostrar badges: Vivienda Promovida, Bajó de Precio, Recién Ingresado, Oportunidad
- El sistema DEBE calcular y mostrar precio/m² automáticamente
- El sistema DEBE mostrar garantías aceptadas con iconos

**RF-010: Galería de Fotos**
- El sistema DEBE mostrar galería con hasta 20 fotos
- El sistema DEBE permitir navegación con: click, flechas, swipe (mobile), teclado
- El sistema DEBE abrir lightbox fullscreen al click
- El sistema DEBE mostrar contador de fotos (ej: 3/15)
- El sistema DEBE optimizar images con next/image (lazy loading, responsive)

---

### 8.3 Módulo: Publicación

**RF-021: Wizard Multi-Step**
- El sistema DEBE implementar wizard de 4 pasos con navegación lineal
- El sistema DEBE mostrar progress indicator (1/4, 2/4, etc.)
- El sistema DEBE permitir "Volver" sin perder datos
- El sistema DEBE validar cada paso antes de avanzar
- El sistema DEBE persistir datos en sessionStorage

**RF-022: Step 1 - Tipo y Ubicación**
- El sistema DEBE solicitar: operación (radio), tipo (select), departamento (select), ciudad (cascading select), barrio (cascading select)
- El sistema DEBE incluir mapa interactivo para marcar ubicación exacta
- El sistema DEBE autocompletar departamento/ciudad/barrio si usuario arrastra el pin
- El sistema DEBE validar que todos los campos estén completos

---

## 9. Requisitos No Funcionales

### 9.1 Performance

**RNF-001: Lighthouse Score**
- Performance: >85 (objetivo: 90+)
- Accessibility: >90
- Best Practices: >90
- SEO: >90

**RNF-002: Core Web Vitals**
- LCP (Largest Contentful Paint): <2.5s (objetivo: <2s)
- FID (First Input Delay): <100ms (objetivo: <50ms)
- CLS (Cumulative Layout Shift): <0.1 (objetivo: <0.05)

**RNF-003: Time to Interactive**
- TTI: <3.5s en 3G regular
- TTI: <2s en 4G

**RNF-004: Bundle Size**
- First Load JS: <200KB (objetivo: <150KB)
- Total Bundle (antes de code splitting): <500KB

---

### 9.2 Seguridad

**RNF-010: HTTPS**
- Forzar HTTPS en todas las conexiones
- HSTS preload habilitado
- TLS 1.3 mínimo

**RNF-011: Headers de Seguridad**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**RNF-012: Autenticación**
- OAuth 2.0 via Firebase
- JWT tokens con expiración 1 hora
- Refresh tokens con expiración 30 días
- Session hijacking prevention

---

### 9.3 Accesibilidad

**RNF-017: WCAG 2.1 AA**
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande (18pt+)
- Todos los elementos interactivos accesibles por teclado
- Focus indicators visibles (2px solid)

**RNF-018: Semantic HTML**
- Usar tags semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Headings jerárquicos (no saltar niveles)
- Landmarks ARIA cuando sea necesario

---

## 10. Métricas y KPIs

### 10.1 North Star Metrics

#### Primary Metric: Leads Generados por Mes
```
Definición: Cantidad de consultas enviadas por potenciales compradores/inquilinos

Target Mes 6: 400 leads/mes
Target Mes 12: 1,500 leads/mes

Cálculo:
- Count de documentos en Firestore /leads collection con status != 'spam'
- Segmentado por: operación (venta/alquiler), tipo propiedad, ciudad
```

#### Secondary Metric: Propiedades Activas
```
Definición: Cantidad de propiedades publicadas con status 'active'

Target Mes 6: 2,000 propiedades
Target Mes 12: 10,000 propiedades

Objetivo: Crecimiento 50% MoM
```

#### Engagement Metric: MAU (Monthly Active Users)
```
Definición: Usuarios únicos que interactúan con la plataforma en un mes

Target Mes 6: 10,000 MAU
Target Mes 12: 30,000 MAU

Benchmark: MAU/Propiedades Activas ratio = 5:1 (saludable)
```

### 10.2 Métricas de Conversión

#### Funnel de Búsqueda
```
1. Homepage visit (100%)
2. Click en búsqueda (75%)
3. Aplicar filtros (60%)
4. Ver detalle de propiedad (40%)
5. Enviar consulta (5%)

Target Conversion Rate Homepage → Lead: 5%
Best in class: 7-10%
```

#### Funnel de Publicación
```
1. Click "Publicar" (100%)
2. Completar Step 1 (85%)
3. Completar Step 2 (70%)
4. Completar Step 3 (90%)
5. Click "Publicar" (95%)

Overall Conversion: 53.5%
Target: 60%+

Drop-off crítico: Step 2 (upload fotos)
```

---

### 10.3 Métricas de Performance Técnica

#### Core Web Vitals (Target)
```
LCP (Largest Contentful Paint):
- Mobile: <2.5s (good) | Current: 2.1s ✅
- Desktop: <2s (good) | Current: 1.5s ✅

FID (First Input Delay):
- All: <100ms (good) | Current: 45ms ✅

CLS (Cumulative Layout Shift):
- All: <0.1 (good) | Current: 0.04 ✅
```

#### Lighthouse Scores (Target)
```
Performance: >90 | Current: 87 (needs improvement)
Accessibility: >95 | Current: 93 ✅
Best Practices: >95 | Current: 96 ✅
SEO: >95 | Current: 92 (needs improvement)

Actions:
- Optimize JS bundle (code splitting)
- Implement ISR for property pages
- Add more semantic HTML
- Improve internal linking
```

---

## 11. Roadmap de Producto

### 11.1 Roadmap Visual

```
Q1 2026 (Actual + 3 meses)
│
├── Sprint 6 (Semanas 1-2) - ESTABILIZACIÓN
│   ├── Service Worker + PWA completa
│   ├── Sentry error tracking
│   ├── Push notifications setup
│   └── ISR en property pages
│
├── Sprint 7 (Semanas 3-4) - TESTING
│   ├── ✅ Vitest + React Testing Library (Completado)
│   ├── Playwright E2E tests
│   ├── 60% code coverage
│   └── Beta testers onboarding (5 agentes)
│
├── Sprint 8 (Semanas 5-6) - OPTIMIZACIÓN
│   ├── Algolia instant search
│   ├── ✅ Redis cache layer (Vercel KV Completado)
│   ├── Image optimization (AVIF)
│   └── Blog primeros 5 artículos
│
└── Sprint 9 (Semanas 7-8) - SEO & CONTENT
    ├── Blog completo (10 artículos)
    ├── Landing pages por barrio
    ├── Schema.org optimization
    └── Internal linking strategy

Q2 2026 (Meses 4-6)
│
├── Sprint 10-11 - MONETIZACIÓN
│   ├── Plan Premium launch
│   ├── Stripe integration
│   ├── Dashboard analytics premium
│   ├── Feature gating middleware
│   └── Email marketing setup (Mailchimp)
│
├── Sprint 12-13 - CRM BÁSICO
│   ├── Lead pipeline visual (Kanban)
│   ├── Email sequences automáticas
│   ├── WhatsApp API integration
│   └── Export leads avanzado
│
└── Sprint 14-15 - GROWTH
    ├── Referral program
    ├── A/B testing framework
    ├── Google Ads campaigns
    └── 200 agentes activos milestone

Q3 2026 (Meses 7-9)
│
├── Sprint 16-18 - EXPANSIÓN GEOGRÁFICA
│   ├── Lanzamiento en Canelones
│   ├── Lanzamiento en Maldonado
│   ├── SEO local por ciudad
│   └── Partners locales (3 agentes/ciudad)
│
├── Sprint 19-21 - INTELIGENCIA
│   ├── ML valuación automática (beta)
│   ├── Recomendaciones personalizadas
│   ├── Búsqueda por foto (ML)
│   └── Alerts inteligentes
│
└── Sprint 22-24 - ENGAGEMENT
    ├── Reviews y ratings
    ├── Comunidad de usuarios
    ├── Gamification (badges, levels)
    └── Social sharing optimizado

Q4 2026 (Meses 10-12)
│
├── Sprint 25-27 - ENTERPRISE
│   ├── Plan Enterprise launch
│   ├── API pública (RESTful)
│   ├── Webhooks para integraciones
│   └── 50 clientes enterprise

├── Sprint 28-30 - HERRAMIENTAS AVANZADAS
│   ├── Tour virtual 360° integration
│   ├── Contrato digital (e-signature)
│   ├── Calculadora hipotecaria avanzada
│   └── Integración con bancos (pagos)

└── Sprint 31-33 - CONSOLIDACIÓN
    ├── Performance optimizations
    ├── Debt técnica cleanup
    ├── Testing coverage >80%
    ├── Documentation update
    └── 500 agentes, 10K propiedades milestone
```

---

## 12. Plan de Testing

### 12.1 Estrategia de Testing

#### Pirámide de Testing
```
        /\
       /  \  E2E Tests (10%)
      /____\
     /      \  Integration Tests (30%)
    /________\
   /          \  Unit Tests (60%)
  /____________\
```

#### Coverage Targets
```
Global: >70% (objetivo: 80%)
Critical paths: >90%
Utils/helpers: >95%
Components UI: >60%
```

---

## 13. Estrategia Go-to-Market

### 13.1 Fase 1: Beta Launch (Mes 1-2)

**Objetivos:**
- Onboard 5 agentes beta
- Publicar 100+ propiedades
- Generar 50+ leads
- Validar product-market fit

**Tácticas:**
1. **Identificación de Beta Testers**
   - LinkedIn outreach a agentes en Montevideo
   - Perfil ideal: 5-20 propiedades activas, tech-savvy
   - Incentivo: Gratis por 3 meses + early access premium

2. **Onboarding 1-on-1**
   - Zoom call 30 min para demo
   - Setup guiado: crear cuenta, publicar 1 propiedad
   - Training materials (videos cortos)

3. **Feedback Loop**
   - Check-in semanal (15 min)
   - Encuesta de satisfacción (Google Forms)
   - Slack channel privado para feedback

**Métricas de Éxito:**
- NPS > 40
- Retention semana 4: >80%
- 0 bugs críticos
- Time to first lead: <48h

---

### 13.2 Fase 2: Public Launch (Mes 3-4)

**Objetivos:**
- Onboard 50 agentes
- Publicar 500+ propiedades
- Generar 200+ leads/mes
- Alcanzar 5,000 MAU

**Canales:**

**1. SEO Orgánico** (prioridad máxima)
- Blog con 10 artículos optimizados
- Landing pages por barrio (Top 10 Montevideo)
- Internal linking strategy
- Schema.org markup
- Target keywords:
  - "apartamentos en venta Pocitos"
  - "alquilar casa Montevideo"
  - "vivienda promovida Uruguay"
  - "garantía ANDA alquiler"

**2. Google Ads** (presupuesto: $500/mes)
- Search ads en keywords de compra:
  - "comprar apartamento Montevideo"
  - "apartamentos USD 200000"
  - "vivienda promovida Pocitos"
- Display remarketing (usuarios que visitaron)
- Target CPA: $20 por lead

**3. Facebook/Instagram Ads** (presupuesto: $300/mes)
- Carousel ads con propiedades destacadas
- Targeting: 25-45 años, Montevideo, interés en inmobiliaria
- Lookalike audiences de usuarios existentes
- Target CPA: $15 por lead

**4. Content Marketing**
- Guest posts en blogs de Uruguay
- Colaboraciones con influencers inmobiliarios
- Webinars: "Cómo comprar tu primera vivienda en Uruguay"
- Podcast interviews con agentes top

**5. PR y Medios**
- Press release: "Nueva plataforma revoluciona mercado inmobiliario uruguayo"
- Pitch a El Observador, El País, La Diaria
- Radio interviews (M24, Del Sol)

---

### 13.3 Fase 3: Growth (Mes 5-12)

**Objetivos:**
- Onboard 500 agentes
- Publicar 10,000+ propiedades
- Generar 1,500+ leads/mes
- Alcanzar 30,000 MAU
- $15,000 MRR

**Tácticas de Crecimiento:**

**1. Referral Program**
- Agentes refieren agentes: ambos ganan 1 mes premium gratis
- Usuarios refieren usuarios: $50 descuento al comprar (si usan plataforma)
- Tracking con códigos únicos

**2. Partnerships Estratégicos**
- Escribanías (compartir leads)
- Bancos (calculadora hipotecaria co-branded)
- Mudanzas (marketplace futuro)
- Colegios de arquitectos y constructores

**3. Community Building**
- Grupo de Facebook para agentes
- Meetups mensuales (networking)
- Case studies de agentes exitosos
- User-generated content (testimonios)

**4. Optimización de Conversión**
- A/B testing continuo de CTAs
- Personalización de homepage por segmento
- Exit-intent popups con oferta
- Live chat support (Intercom)

---

## 14. Riesgos y Mitigaciones

### 14.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Firestore scaling issues con >5K propiedades** | Media | Alto | Evaluar Postgres + Prisma en Q3. Redis cache layer para queries frecuentes. Composite indexes optimizados. |
| **Firebase costs explode** | Media | Alto | Monitorear daily spend. Implementar rate limiting. Optimizar queries (batching). Redis cache. |
| **Performance degradation** | Baja | Alto | Lighthouse monitoring continuo. ISR para property pages. Code splitting agresivo. CDN para assets. |
| **Security breach (XSS, injection)** | Baja | Crítico | Penetration testing. Input validation con Zod. CSRF protection. Security headers. Rate limiting. |

---

### 14.2 Riesgos de Producto

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Churn de agentes (no generan leads)** | Alta | Crítico | Lead generation guarantee (5 leads/mes o refund). Onboarding 1-on-1. Email tips para optimizar anuncios. Comparación con mercado. |
| **Competencia agresiva de InfoCasas** | Media | Alto | Nichos: Vivienda Promovida, Millennials. UX 10x mejor. Pricing agresivo (free forever). Data única (analytics, valuación ML). |
| **Low adoption (pocos agentes)** | Media | Crítico | Referral program con incentivos. Partnerships con escribanías/bancos. PR y content marketing. Onboarding frictionless. |
| **Low quality listings** | Media | Alto | Moderation workflow. Automated checks (duplicate detection). Verified agent badge. User reports. Quality score algorithm. |

---

### 14.3 Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Bajo product-market fit** | Media | Crítico | Beta testing riguroso. Feedback loop continuo. Pivot rápido si necesario. Métricas de engagement claras. |
| **Burn rate alto (no profitable)** | Baja | Alto | Serverless architecture (costos variables). Monetización early (Mes 3). Focus en retention vs growth prematuro. |
| **Regulación legal (nueva ley inmobiliaria)** | Baja | Medio | Monitorear legislación. Consultor legal on-retainer. Flexibilidad en platform (adaptar rápido). |
| **Cambio en Google/Firebase pricing** | Baja | Alto | Multi-cloud strategy (backup en AWS). Negociar enterprise pricing. Database migration ready (Postgres). |

---

## 15. Anexos

### 15.1 Glosario de Términos

| Término | Definición |
|---------|------------|
| **Vivienda Promovida** | Ley 18.795 - Régimen de promoción de vivienda de interés social en Uruguay. Exoneración de IVA y otros impuestos. |
| **ANDA** | Asociación Nacional de Afiliados. Tipo de garantía de alquiler en Uruguay. |
| **CGN** | Contaduría General de la Nación. Garantía de alquiler para empleados públicos. |
| **Porto Seguro** | Compañía de seguros que ofrece garantía de alquiler. |
| **MAU** | Monthly Active Users - Usuarios únicos activos en un mes. |
| **MRR** | Monthly Recurring Revenue - Ingresos recurrentes mensuales. |
| **LCP** | Largest Contentful Paint - Métrica de performance (Core Web Vital). |
| **PWA** | Progressive Web App - Aplicación web instalable. |
| **ISR** | Incremental Static Regeneration - Técnica de Next.js para regenerar páginas estáticas. |
| **Lead** | Consulta de un potencial comprador/inquilino sobre una propiedad. |

---

### 15.2 Referencias y Benchmarks

**Benchmarks Internacionales:**
- **Funda.nl** (Países Bajos) - Gold standard de UX inmobiliaria
- **Zillow.com** (USA) - Features avanzadas (Zestimate, 3D tours)
- **Rightmove.co.uk** (UK) - Market leader, excelente mobile UX
- **Idealista.com** (España) - Strong en SEO y contenido

**Estudios de Mercado:**
- NAR (National Association of Realtors) - "Profile of Home Buyers and Sellers"
- PwC - "Emerging Trends in Real Estate"
- Statista - "Online Real Estate Market in Latin America"

**Documentación interna (Barrio.uy):**
- [PLANES_FUENTE_VERDAD.md](../PLANES_FUENTE_VERDAD.md) — Límites, precios e inclusiones Base/Pro/Premium
- [REVISION_PLANES_BARRIO.md](../REVISION_PLANES_BARRIO.md) — Verificación y cambios por iteración
- [ESTRATEGIA_FOMO_BARRIO.md](../ESTRATEGIA_FOMO_BARRIO.md) — Tácticas de conversión Free→Pro y configuración
- [CAMBIOS_ESTRATEGIA_FOMO.md](../CAMBIOS_ESTRATEGIA_FOMO.md) — Detalle de implementación FOMO (portal e inmobiliaria)

---

### 15.3 Stack Alternativo Evaluado

Durante la planificación, se evaluaron las siguientes alternativas:

| Componente | Elegido | Alternativa | Razón de Elección |
|------------|---------|-------------|-------------------|
| **Framework** | Next.js 16 | Remix, Astro | SSR/SSG hybrid, React Server Components, mejor DX |
| **Database** | Firebase Firestore | Supabase (Postgres), MongoDB | Real-time listeners, managed, fast queries, escalabilidad (hasta 10K props) |
| **Auth** | Firebase Auth | Clerk, Auth0 | Integración nativa con Firestore, free tier generoso |
| **Hosting** | Vercel | Netlify, AWS Amplify | Edge network, best Next.js support, analytics incluidos |
| **Search** | Firestore queries → Algolia (futuro) | Elasticsearch, Typesense | Firestore suficiente para start, Algolia cuando > 2K props |

**Decisión clave:** Priorizar time-to-market con stack managed (Firebase + Vercel) vs self-hosted (Postgres + Kubernetes). Evaluaremos migración a Postgres solo si Firestore se vuelve limitante (>5K propiedades o complex queries).

---

### 15.4 Contactos Clave

**Product Owner:**
- Nombre: [Tu nombre]
- Email: [tu@email.com]
- Rol: Founder & CEO

**Tech Lead:**
- Nombre: [Nombre]
- Email: [email]
- Rol: CTO / Lead Developer

**Stakeholders:**
- Beta testers (5 agentes)
- Advisor inmobiliario: [Nombre]
- Advisor tech: [Nombre]

---

### 15.5 Changelog del PRD

| Versión | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | Nov 2025 | PRD inicial | [Autor] |
| 2.0 | Dic 2025 | Actualización post-beta testing | [Autor] |
| 3.0 | Ene 2026 | Roadmap 2026 y plan de monetización | [Autor] |
| 4.0 | Feb 2026 | PRD completo y detallado | Claude + Founders |
| **8.0** | **23 Feb 2026** | **100% Production Ready: Monetización (Stripe), SEO Avanzado, Algolia Sync Automatizado y Testeo E2E (58.3% coverage).** | **Antigravity AI** |
| **11.1** | **25 Feb 2026** | **Estrategia FOMO: conversión Free→Pro (badge, teaser leads, salud propiedad, penalización ranking, pricing “lo que te perdés”, oferta 24h). Config en @repo/lib; docs ESTRATEGIA_FOMO_BARRIO, CAMBIOS_ESTRATEGIA_FOMO.** | **Equipo producto** |

---

## 📊 Resumen Ejecutivo Final

**Barrio.uy v4.0** está diseñado para capturar el **gap de mercado** en Uruguay: una plataforma inmobiliaria **mobile-first** con datos únicos y experiencia premium.

### 🎯 Ventaja Competitiva
Combinamos **UX de clase mundial** (Funda.nl benchmark) + **datos relevantes de Uruguay** (Ley 18.795, garantías) + **tecnología moderna** (Next.js 16, Firebase) para crear la mejor experiencia de búsqueda y publicación de propiedades en Uruguay.

### 📈 Proyección 12 Meses
- 10,000 propiedades activas
- 500 agentes registrados
- 1,500 leads/mes generados
- 30,000 usuarios activos mensuales
- $15,000 MRR (Monthly Recurring Revenue)
- NPS > 60 (Net Promoter Score)

### 🚀 Próximos Pasos Inmediatos

**Sprint 6 (Próximas 2 semanas):**
1. ✅ Implementar Service Worker + PWA completa
2. ✅ Setup Sentry error tracking
3. ✅ Automatizar Algolia Sync (Cloud Functions)
4. ✅ Optimizar con ISR y PropertySchema (SEO)
5. ✅ Lanzar Pricing Wizard con Stripe

**Meta Q1 2026:** 500 propiedades, 50 agentes, 5K MAU, score técnico 9.2/10

---

**Documento aprobado por:**
- [x] Product Owner
- [x] Tech Lead
- [x] Stakeholders clave (v8.0 Ready)

**Próxima revisión:** Abril 2026 (post Q1)

---

**🏠 Barrio.uy - Encontrá tu próximo hogar.**

*Versión 11.1.0 | Febrero 2026 | Estado: Producción + Estrategia FOMO + Roadmap 2026*
