# Fase 7 — Auditor de DevOps / Deploy

**Objetivo:** Verificar que el pipeline de deploy es reproducible, las variables están configuradas y los dominios apuntan correctamente.

**Prioridad:** SEGUNDA FASE A EJECUTAR

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | DEPLOY.md | [docs/DEPLOY.md](../../DEPLOY.md) | Build, variables, Vercel, dominios, troubleshooting |
| 2 | GUIA_ERRORES_DEPLOY.md (portal) | [apps/portal/GUIA_ERRORES_DEPLOY.md](../../../apps/portal/GUIA_ERRORES_DEPLOY.md) | Errores frecuentes en deploy del portal |
| 3 | GUIA_ERRORES_DEPLOY.md (inmobiliaria) | [apps/inmobiliaria/GUIA_ERRORES_DEPLOY.md](../../../apps/inmobiliaria/GUIA_ERRORES_DEPLOY.md) | Errores frecuentes en deploy de inmobiliaria |

---

## Checklist de verificación

### Vercel
- [ ] Dos proyectos: portal e inmobiliaria con root directories correctos
- [ ] Production branch = `main` en ambos
- [ ] Todas las variables de entorno configuradas

### Variables de entorno

| Variable | Portal | Inmobiliaria |
|----------|:------:|:------------:|
| `NEXT_PUBLIC_FIREBASE_*` (6) | Requerido | Requerido |
| `FIREBASE_PROJECT_ID` | Requerido | Opcional |
| `FIREBASE_CLIENT_EMAIL` | Requerido | Opcional |
| `FIREBASE_PRIVATE_KEY` | Requerido | Opcional |
| `CREATOR_EMAILS` | Requerido | Opcional |
| `NEXT_PUBLIC_APP_URL` | Requerido | Requerido |
| `MP_ACCESS_TOKEN` | Si pricing | No |
| `NEXT_PUBLIC_FOUNDER_MODE` | Opcional | No |
| `NEXT_PUBLIC_FOMO_MODE` | Opcional | Opcional |

### Dominios
- [ ] `barrio.uy` → portal en Vercel
- [ ] `mibarrio.uy` → inmobiliaria en Vercel
- [ ] HTTPS forzado en ambos
- [ ] Dominios en Firebase Auth → Authorized domains

### Build
- [ ] `npm run build` sin errores en ambas apps
- [ ] Sin warnings TypeScript bloqueantes
- [ ] `npm ci` limpio desde cero

---

**Entregable:** Checklist de deploy con estado → guardar en `../hallazgos/`
