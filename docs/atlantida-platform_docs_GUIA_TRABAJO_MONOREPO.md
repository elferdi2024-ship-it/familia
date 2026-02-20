# Guía de Trabajo - Atlantida Platform Monorepo

## Estructura de Tu Proyecto

```
d:\INMOBILIARIA\turborepo\atlantida-platform\
│
├── apps/
│   ├── portal/              ← Marketplace (Barrio.uy)
│   │   ├── app/             ← Páginas SOLO del portal
│   │   ├── components/      ← Componentes SOLO del portal
│   │   └── config/brand.ts  ← Branding del portal
│   │
│   └── inmobiliaria/        ← Web MiBarrio.uy
│       ├── app/             ← Páginas SOLO de inmobiliaria
│       ├── components/      ← Componentes SOLO de inmobiliaria
│       └── config/brand.ts  ← Branding de inmobiliaria
│
├── packages/
│   ├── ui/                  ← Componentes compartidos (Button, Card, etc.)
│   ├── lib/                 ← Utilidades compartidas (Firebase, Algolia)
│   └── types/               ← TypeScript types compartidos
│
└── package.json             ← Scripts de Turborepo
```

---

## 🎯 Regla Principal

| Si quieres cambiar... | Edita en... | Afecta a... |
|----------------------|-------------|-------------|
| Solo Portal | `apps/portal/` | Solo Portal |
| Solo Inmobiliaria | `apps/inmobiliaria/` | Solo Inmobiliaria |
| Ambas apps | `packages/` | Ambas apps |

---

## Comandos Diarios

```bash
# Abrir terminal en: d:\INMOBILIARIA\turborepo\atlantida-platform

# Desarrollo de AMBAS apps (recomendado)
npm run dev

# Solo trabajar en Portal
npm run dev:portal

# Solo trabajar en Inmobiliaria
npm run dev:inmobiliaria

# Build de producción
npm run build
```

---

## Ejemplos Prácticos

### 📌 Ejemplo 1: Cambiar Landing SOLO de Inmobiliaria

**Objetivo:** Nueva landing exclusiva para MiBarrio.uy

```
Editar: apps/inmobiliaria/app/page.tsx
```

```tsx
// apps/inmobiliaria/app/page.tsx
import { brandConfig } from '@/config/brand'

export default function Home() {
  return (
    <div style={{ backgroundColor: brandConfig.primaryColor }}>
      <h1>Bienvenido a {brandConfig.name}</h1>
      {/* Tu contenido exclusivo de inmobiliaria */}
    </div>
  )
}
```

**Resultado:** Solo cambia la landing de inmobiliaria. Portal no se toca.

---

### 📌 Ejemplo 2: Cambiar Landing SOLO del Portal

**Objetivo:** Landing diferente para el marketplace

```
Editar: apps/portal/app/page.tsx
```

```tsx
// apps/portal/app/page.tsx
import { brandConfig } from '@/config/brand'

export default function Home() {
  return (
    <div>
      <h1>Marketplace {brandConfig.name}</h1>
      {/* Contenido exclusivo del portal */}
      <AgentRegistration />  {/* Solo existe en portal */}
    </div>
  )
}
```

---

### 📌 Ejemplo 3: Cambiar Botón en AMBAS Apps

**Objetivo:** Cambiar el estilo de todos los botones

```
Editar: packages/ui/src/button.tsx
```

```tsx
// packages/ui/src/button.tsx
export function Button({ children, ...props }) {
  return (
    <button
      className="nuevo-estilo-global"  // ← Este cambio afecta AMBAS apps
      {...props}
    >
      {children}
    </button>
  )
}
```

**Resultado:** El botón cambia en Portal E Inmobiliaria automáticamente.

---

### 📌 Ejemplo 4: Componente que SOLO existe en Inmobiliaria

**Objetivo:** Crear tours virtuales solo para MiBarrio.uy

```
Crear: apps/inmobiliaria/components/VirtualTour.tsx
```

```tsx
// apps/inmobiliaria/components/VirtualTour.tsx
export function VirtualTour({ propertyId }) {
  return (
    <div className="tour-360">
      {/* Solo existe en inmobiliaria */}
    </div>
  )
}
```

**Usar en:** `apps/inmobiliaria/app/property/[id]/page.tsx`

---

### 📌 Ejemplo 5: Funcionalidad que SOLO existe en Portal

**Objetivo:** Sistema de suscripciones para agentes (solo marketplace)

```
Crear: apps/portal/components/AgentSubscription.tsx
       apps/portal/app/pricing/page.tsx
```

```tsx
// apps/portal/app/pricing/page.tsx
export default function PricingPage() {
  return (
    <div>
      <h1>Planes para Agentes</h1>
      {/* Solo existe en portal, inmobiliaria no lo tiene */}
    </div>
  )
}
```

---

## Mapa de Decisiones

```
¿Qué quiero cambiar?
│
├─ Un componente UI (botón, card, input)
│  └─ ¿Lo usan ambas apps?
│     ├─ SÍ → Editar en packages/ui/
│     └─ NO → Editar en apps/[app]/components/
│
├─ Una página (landing, about, etc.)
│  └─ ¿Debe ser igual en ambas?
│     ├─ SÍ → Crear en packages/ y importar
│     └─ NO → Editar en apps/[app]/app/
│
├─ Colores/Logo/Branding
│  └─ Editar apps/[app]/config/brand.ts
│
├─ Firebase/Algolia/Utils
│  └─ packages/lib/ (afecta ambas)
│
└─ Types/Interfaces
   └─ packages/types/ (afecta ambas)
```

---

## Estructura de Archivos por Caso de Uso

### Archivos que DEBEN ser diferentes:

| Archivo | Portal | Inmobiliaria |
|---------|--------|--------------|
| `config/brand.ts` | Barrio.uy | MiBarrio.uy |
| `app/page.tsx` | Landing marketplace | Landing corporativa |
| `app/pricing/` | ✅ Existe | ❌ No existe |
| `app/agent-register/` | ✅ Existe | ❌ No existe |
| `public/logo.svg` | Logo portal | Logo Atlantida |

### Archivos que DEBEN ser iguales:

| Archivo | Ubicación |
|---------|-----------|
| Button, Card, Input | `packages/ui/` |
| Firebase config | `packages/lib/` |
| Property types | `packages/types/` |
| PropertyCard | `packages/ui/` (si es igual) |

---

## Flujo de Trabajo Diario

### Mañana: Trabajar en Inmobiliaria
```bash
cd d:\INMOBILIARIA\turborepo\atlantida-platform
npm run dev:inmobiliaria
# Abre VS Code/Cursor en apps/inmobiliaria/
# Edita solo archivos en esa carpeta
```

### Tarde: Trabajar en Portal
```bash
npm run dev:portal
# Abre VS Code/Cursor en apps/portal/
# Edita solo archivos en esa carpeta
```

### Cambio global (ambas apps)
```bash
npm run dev
# Edita archivos en packages/
# Ambas apps se actualizan en hot-reload
```

---

## Tips Importantes

### ✅ Hacer:
- Usar `@repo/ui` para componentes compartidos
- Usar `config/brand.ts` para colores/logos
- Mantener `packages/` limpio y genérico

### ❌ No hacer:
- Copiar componentes entre apps manualmente
- Hardcodear colores (usar brand config)
- Modificar `packages/` para algo específico de una app

---

## Comandos de Referencia Rápida

```bash
# Desarrollo
npm run dev              # Ambas apps
npm run dev:portal       # Solo portal :3000
npm run dev:inmobiliaria # Solo inmobiliaria :3001

# Build
npm run build            # Build ambas
npm run build:portal     # Build solo portal
npm run build:inmobiliaria

# Utilidades
npm run lint             # Lint todo
npm run clean            # Limpiar node_modules y .next
```

---

## Checklist Antes de Commit

- [ ] ¿El cambio afecta solo una app? → Verificar que está en `apps/[app]/`
- [ ] ¿El cambio afecta ambas? → Verificar que está en `packages/`
- [ ] ¿Funciona el build? → `npm run build`
- [ ] ¿Los tests pasan? → (cuando los implementes)

---

## Próximos Pasos Recomendados

1. **Ahora:** Familiarizarte con la estructura
2. **Esta semana:** Diferenciar las landings de cada app
3. **Próxima semana:** Crear features exclusivos por app
4. **Futuro:** Implementar tests

---

**¿Dudas?** Pregúntame cualquier caso específico y te explico dónde editar.
