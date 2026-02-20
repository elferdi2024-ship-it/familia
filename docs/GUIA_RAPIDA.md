# Guía Rápida de Migración - Atlantida Platform

## Opción 1: Migración Automática (Recomendada)

### Paso 1: Descargar archivos de configuración

Descarga estos archivos a una carpeta nueva `atlantida-platform/`:

```
atlantida-platform/
├── package.json         ← Copiar de abajo
├── turbo.json           ← Copiar de abajo
├── tsconfig.json        ← Copiar de abajo
└── scripts/
    └── migrate.sh       ← Script de migración
```

### Paso 2: Ejecutar script

```bash
cd atlantida-platform
chmod +x scripts/migrate.sh
./scripts/migrate.sh /ruta/a/tu/familia-main
```

### Paso 3: Instalar y probar

```bash
npm install
npm run dev
```

---

## Opción 2: Migración Manual (Paso a Paso)

### 1. Crear estructura
```bash
mkdir atlantida-platform && cd atlantida-platform
mkdir -p apps/portal apps/inmobiliaria
mkdir -p packages/{ui,lib,types,config}/src
```

### 2. Copiar archivos de configuración
Copia los archivos de abajo a tu proyecto.

### 3. Copiar código
```bash
cp -r /ruta/familia-main/* apps/portal/
cp -r /ruta/familia-main/* apps/inmobiliaria/
```

### 4. Instalar
```bash
npm install
```

---

## Archivos de Configuración

### package.json (raíz)
```json
{
  "name": "atlantida-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "dev:portal": "turbo run dev --filter=portal",
    "dev:inmobiliaria": "turbo run dev --filter=inmobiliaria",
    "build": "turbo run build",
    "build:portal": "turbo run build --filter=portal",
    "build:inmobiliaria": "turbo run build --filter=inmobiliaria",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.5.4",
    "prettier": "^3.5.5"
  },
  "packageManager": "npm@10.8.2"
}
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {}
  }
}
```

### tsconfig.json (raíz)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "declaration": true,
    "composite": true
  }
}
```

---

## Verificación Post-Migración

### Checklist
- [ ] `npm run dev` inicia ambas apps
- [ ] Portal en http://localhost:3000
- [ ] Inmobiliaria en http://localhost:3001
- [ ] `npm run build` sin errores
- [ ] Variables de entorno copiadas a cada app

### Errores Comunes

| Error | Solución |
|-------|----------|
| `workspace:*` not found | Ejecutar `npm install` desde la raíz |
| Port already in use | Cambiar puerto en package.json de la app |
| Module not found | Verificar que exports en packages/*/package.json |

---

## Tiempo Estimado

| Tarea | Tiempo |
|-------|--------|
| Setup inicial | 15 min |
| Migración código | 30 min |
| Configurar branding | 1 hora |
| Testing local | 30 min |
| Deploy Vercel | 30 min |
| **Total** | **~3 horas** |
