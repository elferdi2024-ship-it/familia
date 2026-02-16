# Guía de Despliegue y Resolución de Errores - DominioTotal

**Fecha de Actualización:** 16 de Febrero 2026
**Versión de Next.js:** 16.1.6

---

## 🚨 Lecciones Críticas de Deploy (LEER ANTES DE DEPLOYAR)

### 1. Conflicto Middleware vs Proxy
**Error:** `Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.`
**Causa:** Next.js 16+ no permite tener ambos archivos en la raíz. `proxy.ts` es el nuevo estándar y actúa como middleware.
**Solución:**
- ✅ **MANTENER:** `proxy.ts` (contiene la lógica de rate limiting y redirecciones).
- ❌ **ELIMINAR:** `middleware.ts`.
- **Nota:** Si `middleware.ts` se vuelve a generar, eliminarlo antes del build.

### 2. Despliegue de Firestore Rules
**Error:** Las reglas de seguridad no se despliegan automáticamente con Vercel.
**Solución:**
Se requiere un paso manual. Hemos creado un script para facilitar esto:
```bash
npm run deploy:firestore
```
*Si falla por autenticación:*
```bash
npx firebase-tools login
npx firebase-tools use --add  # Seleccionar 'familiainmo-6fec6'
npm run deploy:firestore
```

### 3. PWA Icons
**Problema:** La PWA no es instalable si faltan los iconos.
**Solución:**
- Los iconos NO se generan automáticamente.
- Deben colocarse manualmente en `public/icons/`.
- Ver instrucciones en `public/icons/README.txt`.

---

## 🛠️ Comandos Útiles

| Acción | Comando |
|--------|---------|
| **Build Local** | `npm run build` |
| **Deploy Firestore** | `npm run deploy:firestore` |
| **Verificar Lint** | `npm run lint` |
| **Generar Seeds** | `npm run seed:generate` |

---

## 📝 Checklist Pre-Deploy

1. [ ] Verificar que NO existe `middleware.ts` en la raíz.
2. [ ] Correr `npm run build` localmente para asegurar consistencia.
3. [ ] Si se cambiaron reglas de seguridad, correr `npm run deploy:firestore`.
4. [ ] Verificar que `next.config.ts` tiene los headers CSP actualizados.

---

## 🔍 Log de Cambios Recientes

- **Fix Build:** Eliminado `middleware.ts` redundante.
- **Seguridad:** Agregado CSP header en `next.config.ts`.
- **Seguridad:** Rate limiting activo vía `proxy.ts`.
- **DX:** Agregado script `deploy:firestore`.
