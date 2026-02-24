# Salud del sistema y seguridad — Evaluación

**Fecha:** 24 Febrero 2026  
**Ámbito:** Estructura de archivos/carpetas, funcionamiento y seguridad (Portal + Inmobiliaria).

---

## 1. Estructura y archivos — ¿Óptimo?

### 1.1 Lo que está bien

| Aspecto | Estado |
|---------|--------|
| **Monorepo** | Clara separación `apps/portal` (Barrio.uy) y `apps/inmobiliaria` (MiBarrio.uy) con `REGLAS_ARQUITECTURA_DOMINIOS.md`. |
| **Documentación** | Unificada en `docs/` con índice por rol (`docs/README.md`), producto, técnico, guías, deploy. |
| **Configuración por app** | Cada app tiene su `next.config.ts`, `firestore.rules`, `middleware.ts` sin mezclar responsabilidades. |
| **Secrets** | `.env*` en `.gitignore`; DEPLOY.md indica no subir JSON de cuenta de servicio. |
| **Build artifacts** | `build.log`, `build_*.txt`, `**/testsprite_tests/tmp/` en `.gitignore`. |

### 1.2 Mejoras recomendadas (estructura)

- **Raíz del repo:** Existe app Next.js en raíz (paralela al monorepo). Definir explícitamente si la raíz es solo legacy o se mantiene; si todo el desarrollo es en monorepo, considerar reducir duplicación (p. ej. un solo `CONTRIBUTING.md`/`CHANGELOG.md` que referencie el monorepo).
- **Duplicación de PRD/README:** En cada app siguen existiendo `PRD_FINAL.md`, `README.md`. Está bien para onboarding por app, pero conviene que apunten a la fuente única en `docs/producto/` y `docs/README.md`.
- **`.env.example`:** ✅ Añadidos `apps/portal/.env.example` y raíz del monorepo `.env.example` con placeholders (sin valores reales). Ver DEPLOY.md para descripción de cada variable.

---

## 2. Seguridad — Estado actual

### 2.1 Puntos fuertes

| Capa | Implementación |
|------|----------------|
| **Headers HTTP** | HSTS (preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP. |
| **CSP** | Content-Security-Policy definida en `next.config.ts` (script, style, img, connect, frame, object-src 'none', upgrade-insecure-requests). |
| **Rate limiting** | Upstash Redis en middleware: 30 req/min API, 5 req/min leads; fail-open si Redis no está (evita caída total). |
| **Firestore (portal)** | Lectura de leads solo para agente dueño o admin; creación de leads con validación de nombre, email y mensaje; propiedades con validación de título, precio e imágenes; usuarios solo escritura por dueño. |
| **Firestore (inmobiliaria)** | Variante más restrictiva: lectura de usuarios solo si autenticado; feedPosts solo lectura publicada y actualización limitada (solo `status` por autor). |
| **API admin** | Rutas `/api/admin/*` protegen con Bearer JWT y verificación con Firebase Admin (o en dev con CREATOR_EMAILS); no se confía solo en el payload sin verificar en producción. |
| **Storage (portal)** | Límite 5MB por archivo y solo `contentType` imagen en `properties/` y `users/`. |

### 2.2 Riesgos y mejoras

#### Crítico: Storage — propiedad de la carpeta ✅ APLICADO

- **Problema:** En `storage.rules`, cualquier usuario autenticado podía escribir en `properties/{propertyId}/{fileName}`.
- **Solución aplicada:** En `apps/portal/storage.rules` la escritura exige `firestore.get(.../properties/$(propertyId)).data.userId == request.auth.uid`. Solo el dueño de la propiedad puede subir imágenes a esa ruta.

#### Alto: Firestore — helper `getPostsToday` (portal e inmobiliaria) ✅ APLICADO

- **Problema:** Se usaba `getAfter(colección).where(...).size()` en reglas; en Firestore `getAfter()` es para documentos, no para queries.
- **Solución aplicada:**  
  - Se eliminó el helper `getPostsToday` de las reglas en portal e inmobiliaria.  
  - En portal, `feedPosts` permite `create` si `isAuthenticated()` y `authorId == request.auth.uid`.  
  - El límite de 5 posts/día se aplica en el cliente en `CreatePostModal`: antes de `addDoc` se consulta `feedPosts` con `authorId` y `publishedAt >= inicio del día` y si `size >= 5` se muestra toast y no se publica.  
  - Añadido índice compuesto `feedPosts` (authorId, publishedAt) en `firestore.indexes.json`.

#### Medio: CSP — `unsafe-inline` / `unsafe-eval`

- **Estado:** `script-src` incluye `'unsafe-eval'` y `'unsafe-inline'` (habitual con Next.js y algunas libs).
- **Recomendación:** A medio plazo valorar nonces o hashes para scripts (cuando Next.js y las dependencias lo permitan) para endurecer CSP sin romper la app.

#### Medio: Admin API — fallback “Unsafe” en dev ✅ APLICADO

- **Estado:** En `/api/admin/me` existía fallback que decodificaba el JWT sin verificar firma cuando no hay Firebase Admin.
- **Solución aplicada:** Comentario explícito de que `getEmailFromTokenUnsafe` es SOLO desarrollo. En producción (`NODE_ENV === 'production'`) si no hay `adminAuth`/`adminDb` se devuelve **503** (Servicio no disponible) y no se usa el fallback inseguro.

#### Bajo: Lectura de usuarios (portal)

- **Estado:** `users/{userId}` con `allow read: if true` (perfil público).
- **Comentario:** Puede ser intencional (perfiles de agentes visibles). Si hubiera datos sensibles (email, teléfono estricto), considerar restringir a `isAuthenticated()` o a campos no sensibles en una subcolección pública.

---

## 3. Resumen ejecutivo

| Área | Salud | Acción prioritaria |
|------|--------|---------------------|
| Estructura / carpetas | Buena | Mantener docs unificados; opcional: un solo CHANGELOG/CONTRIBUTING y `.env.example`. |
| Headers y CSP | Buena | Mantener; a futuro endurecer CSP (nonces/hashes). |
| Rate limiting | Buena | Sin cambios urgentes. |
| Firestore (reglas) | Aplicado | Eliminado `getPostsToday` inválido; límite 5/día en CreatePostModal + índice feedPosts. |
| Storage | Aplicado | Escritura en `properties/*` solo si dueño (firestore.get + userId). |
| Secrets y deploy | Aplicado | `.env.example` en portal y monorepo; no subir JSON ni `.env`; DEPLOY.md. |

En conjunto, el sistema está en **buen estado de salud** y con **seguridad sólida** en red, headers y control de acceso en Firestore/API. Las mejoras de SALUD_Y_SEGURIDAD aplicadas en código son: **(1) Storage: solo el dueño de la propiedad puede subir imágenes**, **(2) Firestore: eliminado getPostsToday inválido; límite 5 posts/día en cliente + índice**, **(3) Admin API: 503 en producción si no hay Firebase Admin**, **(4) .env.example en portal y monorepo**.

---

*Documento vivo: conviene revisar tras cada cambio relevante en reglas, middleware o configuración de seguridad.*

**Última aplicación de mejoras:** 24 Feb 2026 — Storage (propiedad), Firestore getPostsToday (reglas + cliente), Admin API 503 en prod, .env.example.
