# Despliegue — Barrio.uy (portal) y MiBarrio.uy (inmobiliaria)

Guía para desplegar y verificar todos los cambios en producción.

---

## 1. Verificar build en local

Desde la raíz del monorepo:

```bash
cd turborepo/atlantida-platform
npm run build
```

O solo una app:

```bash
npm run build:portal      # Barrio.uy
npm run build:inmobiliaria   # MiBarrio.uy
```

Si el build termina sin errores, puedes desplegar.

---

## 2. Variables de entorno en producción

### Barrio.uy (portal)

Configurar en el panel del hosting (Vercel → Project → Settings → Environment Variables):

| Variable | Descripción | Producción |
|----------|-------------|------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Clave API Firebase (cliente) | Sí |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | Sí |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID del proyecto | Sí |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de Storage | Sí |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Sí |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Sí |
| `FIREBASE_PROJECT_ID` | **Admin:** mismo que project_id del JSON de cuenta de servicio | Sí |
| `FIREBASE_CLIENT_EMAIL` | **Admin:** client_email del JSON | Sí |
| `FIREBASE_PRIVATE_KEY` | **Admin:** private_key del JSON (con `\n` para saltos de línea) | Sí |
| `CREATOR_EMAILS` | Emails de creadores, separados por coma | Sí |
| `NEXT_PUBLIC_APP_URL` | URL de la app (ej. `https://barrio.uy`) | Sí |
| `MP_ACCESS_TOKEN` | Mercado Pago (producción: APP_USR-...) | Si usas pricing |
| Resto (Algolia, Sentry, Resend, etc.) | Según uso | Opcional |

**Importante:** No subas el JSON de la cuenta de servicio a Git. Solo copia los 3 valores (Project ID, Client Email, Private Key) en las variables de entorno.

### MiBarrio.uy (inmobiliaria)

Mismas variables públicas de Firebase, Algolia, Sentry, etc. que uses en el portal. No necesita Firebase Admin ni CREATOR_EMAILS (salvo que agregues Panel Creador ahí).

---

## 3. Desplegar en Vercel

### Opción A: Dos proyectos en Vercel (recomendado)

1. **Barrio.uy (portal)**  
   - En [vercel.com](https://vercel.com): Add New Project → Import tu repositorio.  
   - **Root Directory:** `turborepo/atlantida-platform/apps/portal` (o `apps/portal` si el repo es solo atlantida-platform).  
   - Framework: Next.js (auto).  
   - **Build Command:** `npm run build` (Vercel ejecuta desde la raíz del repo e instala dependencias; desde `apps/portal` hace `npm run build` = `next build`).  
   - Si el repo raíz es `INMOBILIARIA`: Root Directory = `turborepo/atlantida-platform/apps/portal`. En ese caso puede hacer falta **Build Command** = `npm run build` y que en la raíz del repo exista el monorepo (o configurar "Install Command" para que instale desde la raíz del monorepo).  
   - Añadir **todas** las variables de entorno del portal (incluidas las 3 de Firebase Admin y CREATOR_EMAILS).  
   - Deploy.

2. **MiBarrio.uy (inmobiliaria)**  
   - Nuevo proyecto en Vercel, mismo repo.  
   - **Root Directory:** `turborepo/atlantida-platform/apps/inmobiliaria`.  
   - Build Command: `npm run build`.  
   - Añadir variables de entorno (Firebase público, Algolia, etc.).  
   - Deploy.

### Opción B: Monorepo con raíz en atlantida-platform

- Root: `turborepo/atlantida-platform`.  
- Build Command: `npm run build:portal` o `npm run build:inmobiliaria` según el proyecto.  
- Asegurar que el directorio de salida y el start command coincidan con la app que despliegas (Vercel suele detectar Next.js por app).

### Tras el deploy

1. Revisar que la URL de producción cargue (ej. `https://barrio.uy`).  
2. Probar login con Google (elferdi2024@gmail.com).  
3. Ir a **Mi dashboard** → comprobar que ves **Panel Creador** y **Activar Plan Pro**.  
4. Probar **Activar Plan Pro** y que el perfil pase a Pro.  
5. Entrar a **Panel Creador** (`/creator`) y listar usuarios / asignar plan.

---

## 4. Dominios

En Vercel → Project → Settings → Domains:

- Barrio.uy: asignar dominio (ej. `barrio.uy` o `www.barrio.uy`).  
- MiBarrio.uy: asignar su dominio (ej. `mibarrio.uy`).

Actualizar `NEXT_PUBLIC_APP_URL` en el portal con la URL final de producción (ej. `https://barrio.uy`).

---

## 5. Checklist pre-deploy

- [ ] Build local OK: `npm run build` (o `build:portal` / `build:inmobiliaria`).  
- [ ] Variables de entorno de producción configuradas (sobre todo Firebase Admin y CREATOR_EMAILS en portal).  
- [ ] No hay archivos sensibles (JSON de cuenta de servicio, `.env.local`) en el repositorio.  
- [ ] `NEXT_PUBLIC_APP_URL` apunta a la URL real de producción.
