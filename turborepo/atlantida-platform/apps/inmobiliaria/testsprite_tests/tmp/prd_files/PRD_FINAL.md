# PRD AUDITADO & MEJORADO — MiBarrio.uy v3.5
### Plataforma Inmobiliaria de Nueva Generación (Uruguay)
**Versión:** 3.5.0 · **Fecha:** 15 Feb 2026 · **Estado:** Auditoría Técnica & Roadmap Estratégico

---

## 1. Resumen Ejecutivo & Visión
**MiBarrio.uy** se posiciona como el desafiante tecnológico en el mercado inmobiliario uruguayo. Mientras competidores como **InfoCasas** dominan por volumen y **Gallito** por tradición, MiBarrio.uy gana por **experiencia de usuario (UX)**, **velocidad** y **datos estructurados** específicos para el mercado local (Ley de Vivienda Promovida).

Esta auditoría revela una base técnica sólida (Next.js 16, React 19) con una implementación de UI/UX de nivel "A", pero identifica brechas críticas en la capa de datos dinámicos (Search & Maps) que deben cerrarse para competir realmente.

> [!IMPORTANT]
> **Diagnóstico Principal:** El frontend es "World Class", pero funcionalidades clave (`SmartSearch`, `Mapas`) operan actualmente con *mock data* (datos simulados). La prioridad absoluta es conectar estos componentes a servicios reales.

---

## 2. Auditoría Técnica Integral (Roles Skilled)

### 2.1 🛠️ Role: Tech Lead (Arquitectura & Código)
**Estado:** ⭐⭐⭐⭐☆ (4/5)
- **Stack:** Moderno y robusto. Next.js 16.1.6 (App Router) + React 19 + Tailwind 4 + Firebase 12.
- **Estructura de Directorios:** Limpia y escalable. Separación clara de `components/`, `contexts/` y `app/`.
- **Performance:** Uso correcto de `next/image`, fuentes optimizadas (`Geist`), y componentes de cliente (`"use client"`) aislados.
- **Deuda Técnica Identificada:**
    - **SmartSearch:** Componente funcionando con `MOCK_SUGGESTIONS` estáticos. No conecta a Firestore ni Algolia.
    - **NeighborhoodMap:** Usa coordenadas reales pero Puntos de Interés (Colegios, Restaurantes) *hardcodeados* (`MOCK_POIS`). Requiere Google Places API.
    - **Dependencias:** `package.json` limpio, sin versiones conflictivas visibles.

### 2.2 🎨 Role: Design Lead (UI/UX)
**Estado:** ⭐⭐⭐⭐⭐ (5/5)
- **Sistema de Diseño:** Consistente. Uso de `shadcn/ui` para componentes base y `Tailwind 4` para utilidades.
- **Responsividad:** Mobile-first approach verificado. `BottomTabBar` para navegación móvil y `SearchSheet` funcionan correctamente.
- **Estética:** Uso de variables CSS (`--primary`, `--radius`) permite cambios de tema fáciles. Dark mode implementado correctamente con `oklch` colors.
- **Micro-interacciones:** Feedback visual en `FavoriteButton` y transiciones suaves en navegación.

### 2.3 🔎 Role: SEO Specialist (Posicionamiento)
**Estado:** ⭐⭐⭐⭐☆ (4/5)
- **Metadatos:** `app/layout.tsx` define metadata base. `app/property/[id]/page.tsx` genera metadata dinámica pero falta validación profunda de `og:image`.
- **Datos Estructurados (Schema):** ✅ Implementado dinámicamente en páginas de propiedad (`RealEstateListing` JSON-LD).
- **Sitemap:** ✅ `app/sitemap.ts` genera sitemap dinámico consultando Firestore.
- **Robots:** ⚠️ No se encontró `app/robots.ts` o `public/robots.txt`. Debe crearse para guiar el crawling.

### 2.4 🚀 Role: Product Manager (Features vs PRD)
**Gap Analysis:**
| Feature | PRD Original | Estado Real (Auditado) | Acción Requerida |
|---|---|---|---|
| **Búsqueda Autocomplete** | "Implementado" | ⚠️ **Mock UI Only** | Conectar a índice de búsqueda (Firestore/Algolia). |
| **Mapa de Barrio** | "Google Maps real" | ⚠️ **Mock POIs** | Integrar Google Places API (Proxy server-side). |
| **Notificaciones Email** | "Cloud Functions" | ✅ **Server Actions** | Implementación moderna correcta (`notify-lead.ts`). |
| **SEO Técnico** | "JSON-LD Pending" | ✅ **Implementado** | Verificar en Google Rich Results Test. |
| **Filtros Avanzados** | "Firestore Queries" | ✅ **Implementado** | Lógica de filtrado en cliente/servidor funcional. |

---

## 3. Análisis Competitivo (Market Benchmark)

### 3.1 El Landscape Uruguayo
MiBarrio.uy compite en un océano rojo pero con nichos desatendidos: la calidad de la información y la experiencia móvil.

| Competidor | Fortaleza Principal | Debilidad Crítica | Oportunidad para MiBarrio.uy |
|---|---|---|---|
| **InfoCasas** | Tráfico Masivo (>1M visitas) | UI abrumadora, carga lenta, "Banner blindness" | Ser la alternativa **rápida y limpia**. UX "Zen". |
| **MercadoLibre** | Confianza transaccional | Filtros inmobiliarios pobres, mezcla con ecommerce | Especialización profunda en **datos inmobiliarios** (Ley 18.795). |
| **Gallito** | Marca "Top of Mind" histórica | Tecnología obsoleta, búsqueda frustrante | Capturar al usuario joven/móvil que no usa diario papel. |
| **PropTechs (Properati/Zonaprop)** | Mapa interactivo | Datos desactualizados en Uruguay | Ofrecer **datos en tiempo real** y precios precisos. |

### 3.2 Diferenciadores Clave (USP)
1.  **Mobile-Native Feel:** La `BottomTabBar` y los sheets hacen que se sienta como una app nativa, no una web responsive.
2.  **Datos de Inversión:** Cálculo automático de retorno estimado y badges de "Vivienda Promovida" (único en el mercado).
3.  **Velocidad:** Next.js SSR vs SPAs antiguas de la competencia.

---

## 4. Mapa de Evolución (Gap Analysis Map)

Este mapa muestra la trayectoria desde el inicio hasta el objetivo final.

```mermaid
graph TD
    subgraph "Punto de Partida (Legacy/Template)"
        A[Next.js Básico]
        B[Hardcoded Listings]
        C[CSS Plano]
    end

    subgraph "ESTADO ACTUAL (Auditado)"
        D[Next.js 16 + Firestore]
        E[UI Shadcn Premium]
        F[Dynamic Sitemap]
        G[Mock Search & Maps]
        H[Server Actions Email]
    end

    subgraph "Objetivo (Faltante Crítico)"
        I[Real Algolia Search]
        J[Google Places API Real]
        K[Auth Roles (Agent/User)]
        L[Dashboard Analytics]
    end

    A --> D
    B --> D
    C --> E
    D --> F
    D --> G
    D --> H
    G --> I
    G --> J
    H --> K
    K --> L
```

---

## 5. Requisitos de Producto Detallados (Roadmap Técnico)

### Fase 1: Vitalización de Mocks (Prioridad ALTA)
> Transformar componentes de UI "muertos" en funcionalidades vivas.

#### 5.1 SmartSearch Real
- **Problema:** `components/SmartSearch.tsx` usa un array estático.
- **Solución:** Crear colección `search_index` en Firestore (o usar Algolia Free Tier).
- **Implementación:**
  - Crear hook `useSearchSuggestions(query)`.
  - API Route `/api/search/suggestions?q=...`.
  - Cachear resultados comunes con `unstable_cache`.

#### 5.2 Neighborhood Map Live
- **Problema:** POIs fijos en coordenadas de ejemplo.
- **Solución:** Integrar Google Places New API.
- **Implementación:**
  - Server Action `getNearbyPlaces(lat, lng)`.
  - Filtrar por tipos: `school`, `restaurant`, `park`.
  - Cachear respuestas para no quemar cuota de API (Redis/Vercel KV).

### Fase 2: Robustez SEO & Performance (Prioridad MEDIA)

#### 5.3 Robots & Canonical
- **Problema:** Missing `robots.ts`.
- **Acción:** Crear archivo generando reglas estándar:
  ```typescript
  export default function robots(): MetadataRoute.Robots {
    return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://.../sitemap.xml' }
  }
  ```

#### 5.4 Optimización de Imágenes (LCP)
- **Problema:** `app/property/[id]/page.tsx` carga galería.
- **Acción:** Implementar `sizes` dinámicos y `BlurDataURL` generado al subir imagen para evitar layout shift.

### Fase 3: Herramientas de Agente (Prioridad BAJA/FUTURO)

#### 5.5 Analytics Dashboard
- **Feature:** Ver cuántas veces se vio una propiedad.
- **Implementación:** Incrementar contador en Firestore `viewCount` al cargar `page.tsx`. Visualizar en `/my-properties` con Recharts.

---

## 6. Conclusión de la Auditoría
El proyecto **MiBarrio.uy** está en un estado de madurez técnica **avanzado (80%)**. La infraestructura core (Next.js/Firebase) es sólida. El riesgo principal no es técnico, sino de **integración de datos**: pasar de maquetas funcionales a datos vivos en mapas y búsquedas.

**Recomendación Inmediata:**
1.  Crear `robots.ts`.
2.  Implementar lógica real en `SmartSearch`.
3.  Configurar Google Cloud Console para Places API.

---
**Firmado:** Antigravity Agent (Tech Lead & Product Auditor)
