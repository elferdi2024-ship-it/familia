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
- **`.env.example`:** Tener en el monorepo (o por app) un `.env.example` sin valores reales ayuda a que nuevos devs no dejen variables sensibles por error. Actualmente solo se documentan en DEPLOY.md.

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

#### Crítico: Storage — propiedad de la carpeta

- **Problema:** En `storage.rules`, cualquier usuario autenticado puede escribir en `properties/{propertyId}/{fileName}`. No se comprueba que `propertyId` sea de una propiedad del usuario.
- **Riesgo:** Un usuario podría subir imágenes a rutas de propiedades ajenas (sobrescribir o abusar de almacenamiento).
- **Recomendación:** Atar la escritura al dueño de la propiedad vía Firestore, por ejemplo:

```text
match /properties/{propertyId}/{fileName} {
  allow read: if true;
  allow write: if request.auth != null
    && request.resource.size < 5 * 1024 * 1024
    && request.resource.contentType.matches('image/.*')
    && firestore.get(/databases/(default)/documents/properties/$(propertyId)).data.userId == request.auth.uid;
}
```

(Usar el mismo `database` si no es default si aplica.)

#### Alto: Firestore — helper `getPostsToday` (portal e inmobiliaria)

- **Problema:** En ambas apps se usa `getAfter(/databases/$(database)/documents/feedPosts).where(...).size()`. En las reglas de Firestore, `getAfter()` recibe una **ruta de documento**, no de colección, y no existe un “query + count” en reglas.
- **Riesgo:** Esa regla puede fallar en deploy o no aplicar el límite “5 posts por día” como se espera.
- **Recomendación:**  
  - Opción A: Quitar el límite de “5 posts/día” de las reglas y aplicar el límite en backend (Cloud Function o API que cree el post).  
  - Opción B: Mantener un documento contador por usuario/día (p. ej. `feedPostCount/{userId}_{date}`) y en la regla de `create` hacer `get()` de ese documento y comprobar que el contador &lt; 5 (actualizando el contador vía Cloud Function al publicar).

#### Medio: CSP — `unsafe-inline` / `unsafe-eval`

- **Estado:** `script-src` incluye `'unsafe-eval'` y `'unsafe-inline'` (habitual con Next.js y algunas libs).
- **Recomendación:** A medio plazo valorar nonces o hashes para scripts (cuando Next.js y las dependencias lo permitan) para endurecer CSP sin romper la app.

#### Medio: Admin API — fallback “Unsafe” en dev

- **Estado:** En `/api/admin/me` (y similares) existe `getEmailFromTokenUnsafe` que decodifica el JWT sin verificar firma cuando no hay Firebase Admin.
- **Recomendación:** Comentar claramente que es solo para desarrollo y que en producción debe existir siempre Firebase Admin; opcionalmente, en producción devolver 503 si no está configurado Admin en lugar de usar el path inseguro.

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
| Firestore (reglas) | A revisar | Corregir `getPostsToday` (getAfter/query) y/o mover límite 5 posts/día a backend. |
| Storage | A mejorar | Añadir comprobación de propiedad (Firestore) en `properties/{propertyId}/*`. |
| Secrets y deploy | Buena | No subir JSON ni `.env`; documentación clara en DEPLOY.md. |

En conjunto, el sistema está en **buen estado de salud** y con **seguridad sólida** en red, headers y control de acceso en Firestore/API. Las dos mejoras que más impacto tienen son: **(1) atar escritura en Storage a la propiedad del documento en Firestore** y **(2) corregir o reemplazar el límite de posts por día en las reglas de Firestore**.

---

*Documento vivo: conviene revisar tras cada cambio relevante en reglas, middleware o configuración de seguridad.*
