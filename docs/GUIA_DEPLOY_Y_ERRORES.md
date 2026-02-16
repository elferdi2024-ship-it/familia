# Guía de Despliegue y Resolución de Errores - DominioTotal

**Fecha de Actualización:** 16 de Febrero 2026
**Versión de Next.js:** 16.1.6

---

## 🚨 Lecciones Críticas de Deploy (LEER ANTES DE DEPLOYAR)

### 1. Conflicto Middleware vs Proxy
**Solución:**
- ✅ **Usar:** `proxy.ts`.
- ❌ **Eliminar:** `middleware.ts`.
- **Config:** Usar matcher restrictivo para no afectar SSG/Performance:
  ```typescript
  export const config = {
    matcher: ['/api/:path*'],
  }
  ```

### 2. Content Security Policy (CSP) & Google Maps
**Solución Vital:**
En `next.config.ts`, asegurar que `script-src`, `connect-src` e `img-src` incluyan los dominios de Google Maps y Firebase.
*Nota: El error más común es olvidar `img-src` para los tiles del mapa.*

### 3. Firestore Rules
**Verificación Obligatoria:**
Antes de deployar, verificar que no existan reglas permisivas (`allow read, write: if true;`).
```bash
# Testear reglas sin aplicar cambios
npx firebase-tools deploy --only firestore:rules --dry-run

# Deploy real
npm run deploy:firestore
```

### 4. PWA Icons
**Requisitos Lighthouse:**
- `icon-192x192.png`
- `icon-512x512.png`
- `manifest.json` debe tener `"display": "standalone"`.

### 5. Variables de Entorno en Vercel (CRÍTICO)
El 60% de los errores de deploy silenciosos se deben a esto. Verificar en dashboard de Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## � Checklist Final Profesional (Versión Blindada)

**PRE-DEPLOY CHECKLIST — DominioTotal**

- [ ] No existe `middleware.ts`.
- [ ] `proxy.ts` tiene matcher mínimo necesario (`['/api/:path*']`).
- [ ] `next.config.ts` incluye redirects y headers CSP correctos.
- [ ] `img-src` configurado correctamente en CSP (incluye maps/firebase).
- [ ] Variables de entorno cargadas en Vercel.
- [ ] `npm run build` pasa sin errores localmente.
- [ ] Firestore rules no están permisivas (`--dry-run` verificado).
- [ ] PWA icons (192x192, 512x512) cargados en `public/icons/`.
