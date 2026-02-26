# Fase 3 — Auditor de Seguridad

**Objetivo:** Verificar que todos los vectores de ataque están mitigados y que las correcciones documentadas se aplicaron.

**Prioridad:** PRIMERA FASE A EJECUTAR

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | SALUD_Y_SEGURIDAD.md | [docs/SALUD_Y_SEGURIDAD.md](../../SALUD_Y_SEGURIDAD.md) | Estructura, headers, rate limiting, Firestore rules, Storage, correcciones aplicadas |
| 2 | FIRESTORE_DATA_DICT.md §3 | [docs/tecnico/FIRESTORE_DATA_DICT.md](../../tecnico/FIRESTORE_DATA_DICT.md) | Reglas de seguridad Firestore |
| 3 | PRD_FINAL.md §9.2 | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Requisitos de seguridad (HTTPS, headers, auth) |

---

## Archivos de código a inspeccionar

| Archivo | App | Qué verificar |
|---------|-----|---------------|
| `firestore.rules` | portal | Reglas de acceso por colección |
| `firestore.rules` | inmobiliaria | Reglas de acceso por colección |
| `storage.rules` | portal | Solo dueño puede subir imágenes |
| `middleware.ts` | portal | Rate limiting (30 req/min API, 5 req/min leads) |
| `middleware.ts` | inmobiliaria | Rate limiting |
| `next.config.ts` | portal | Headers de seguridad (HSTS, CSP, X-Frame-Options) |
| `next.config.ts` | inmobiliaria | Headers de seguridad |
| `app/api/admin/me/route.ts` | portal | 503 en prod si no hay Firebase Admin |
| `.env.example` | portal + monorepo | Sin valores reales |

---

## Checklist de verificación

### Correcciones documentadas
- [ ] Storage: solo dueño sube imágenes (`firestore.get(...)` en storage.rules)
- [ ] `getPostsToday` eliminado de reglas; límite 5/día en `CreatePostModal.tsx`
- [ ] Admin API: 503 en producción sin Firebase Admin
- [ ] `.env.example` sin secrets

### Headers HTTP
- [ ] HSTS con preload
- [ ] X-Frame-Options: DENY
- [ ] CSP definida (script, style, img, connect)
- [ ] Permissions-Policy configurada

### Rate limiting
- [ ] API: 30 req/min
- [ ] Leads: 5 req/min
- [ ] Fail-open si Redis no está

### Firestore rules
- [ ] `leads`: solo propertyOwnerId o admin lee
- [ ] `properties`: solo activas legibles por anónimos
- [ ] `users`: escritura solo dueño o admin
- [ ] `config`: lectura pública, escritura admin
- [ ] `corporate_leads`: creación validada, lectura admin

### Autenticación
- [ ] OAuth 2.0 via Firebase Auth funciona
- [ ] JWT se verifica en API routes
- [ ] Dominios autorizados en Firebase Auth

---

**Entregable:** Checklist con estado (Aplicado / Pendiente / Riesgo) → guardar en `../hallazgos/`
