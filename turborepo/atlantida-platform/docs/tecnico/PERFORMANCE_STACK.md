TE# Pila de rendimiento – Barrio.uy (Portal)

Resumen de las técnicas y configuraciones aplicadas para rendimiento muy por encima de la media.

---

## 1. Next.js y compilación

- **React Compiler** (`reactCompiler: true`): memoización automática, menos re-renders.
- **Streaming con Suspense** en la página de propiedad: shell (skeleton) + contenido dinámico en streaming (PPR/Cache Components requiere migración a `"use cache"` en Next 16, por ahora se usa Suspense clásico).
- **optimizePackageImports**: tree-shaking de `framer-motion`, `lucide-react`, Radix UI para reducir el bundle inicial.
- **removeConsole** en producción: se eliminan `console.log` (se mantienen `error` y `warn`) para menos peso y ruido.

---

## 2. Carga de recursos críticos (layout)

- **preconnect** a `fonts.googleapis.com`, `fonts.gstatic.com`, Firestore y Firebase Storage para reducir latencia del primer request.
- **dns-prefetch** a Google Tag Manager y Algolia.
- **preload** de la imagen LCP de la home (`/portada.webp`).
- **Fuentes Material (Icons / Symbols)** cargadas de forma no bloqueante (`media="print"` + `onLoad="this.media='all'"`) para no retrasar el LCP.
- **Geist** mediante `next/font` (optimización y subset automáticos).

---

## 3. Caché y CDN

- **Cache-Control** por ruta:
  - `/property/*`: `s-maxage=3600, stale-while-revalidate=7200`
  - `/search`: `s-maxage=300, stale-while-revalidate=600`
  - `/`: `s-maxage=60, stale-while-revalidate=300`
- **ISR** en propiedad: `revalidate = 3600`.
- **PWA / Service Worker** (next-pwa): estrategias StaleWhileRevalidate para propiedades y CacheFirst para imágenes.

---

## 4. Página de propiedad

- **Streaming con Suspense**: shell (skeleton) se envía de inmediato; el contenido real llega en streaming (`PropertyContent` async).
- **PPR**: `experimental_ppr = true` en la página para combinar shell estático y bloques dinámicos.
- **NeighborhoodMap** cargado con `dynamic(..., { ssr: false })` y placeholder para no bloquear el primer paint ni el bundle inicial.

---

## 5. Home

- **Componentes de animación en chunks separados**: `MagneticWrapper`, `RevealText`, `TiltCard` se cargan con `dynamic()` y `ssr: true` para mejorar LCP y TTI manteniendo el contenido en el HTML.
- **Imagen hero**: `priority` (Next/Image) + preload en `<head>` para LCP óptimo.
- **Imágenes**: `sizes` explícitos y formatos AVIF/WebP vía `next.config` images.

---

## 6. Scripts de terceros

- **ContentSquare**: `strategy="lazyOnLoad"` para no competir con el hilo principal en la carga inicial.
- **Vercel Analytics / Speed Insights**: se cargan después del contenido crítico.

---

## 7. Firestore

- **Índices compuestos** para consultas habituales: `status + operation + publishedAt`, `status + price`, etc., para reducir lecturas y latencia.

---

## Cómo medir

```bash
# Build de producción
npm run build && npm run start

# Lighthouse (Chrome DevTools o CLI)
npx lighthouse https://localhost:3000 --view --preset=desktop
npx lighthouse https://localhost:3000 --view --preset=mobile
```

Objetivos orientativos: LCP &lt; 2.5s, FID &lt; 100 ms, CLS &lt; 0.1, Performance score &gt; 90.

---

## Próximas mejoras (opcionales)

- **Cloudflare Images** o similar: transformaciones y formatos modernos en el edge (con costo).
- **Prefetch en hover** en tarjetas de propiedad (Next.js `Link` ya hace prefetch por defecto).
- **Lighthouse CI** en GitHub Actions para no bajar umbrales de rendimiento en cada PR.
