# Guia de Contribucion - DominioTotal

## Setup de Desarrollo

```bash
git clone <repo-url>
cd neo
npm install
cp .env.example .env.local  # Configurar variables
npm run dev
```

## Convenciones de Codigo

### Lenguaje
- **Codigo:** Ingles (nombres de variables, funciones, componentes)
- **UI/Textos:** Espanol (lo que ve el usuario)
- **Comentarios:** Solo cuando explican el "por que", no el "que"

### Estructura de Componentes
```typescript
// 1. Imports
import { useState } from "react"

// 2. Types/Interfaces
interface Props {
  title: string
}

// 3. Component
export function MyComponent({ title }: Props) {
  // hooks
  // handlers
  // render
}
```

### Nomenclatura
- **Componentes:** PascalCase (`PropertyCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useProperties.ts`)
- **Utils:** camelCase (`formatPrice`)
- **Server Actions:** camelCase (`notifyLead`)
- **Schemas Zod:** PascalCase con sufijo `Schema` (`LeadSchema`)

### Estilos
- Usar Tailwind CSS utilities
- Mobile-first: empezar con estilos base, agregar `md:`, `lg:` para desktop
- Usar `cn()` helper para clases condicionales
- Componentes UI base: shadcn/ui

## Git Workflow

### Branches
- `main` - produccion (deploy automatico a Vercel)
- `develop` - desarrollo (staging)
- `feature/nombre` - features nuevas
- `fix/nombre` - bug fixes
- `hotfix/nombre` - fixes urgentes en produccion

### Commits
Formato: `tipo: descripcion breve`

Tipos:
- `feat:` nueva funcionalidad
- `fix:` correccion de bug
- `perf:` mejora de performance
- `refactor:` refactorizacion sin cambio funcional
- `docs:` documentacion
- `style:` cambios de estilo (CSS, formato)
- `chore:` tareas de mantenimiento

Ejemplos:
```
feat: add lead dashboard with status filters
fix: resolve race condition in AuthContext
perf: lazy load NeighborhoodMap component
docs: update README with setup instructions
```

### Pull Requests
1. Crear branch desde `develop`
2. Implementar cambios
3. Verificar build: `npm run build`
4. Verificar lint: `npm run lint`
5. Crear PR con descripcion clara
6. Esperar review

## Validaciones

### Server Actions
Todos los server actions DEBEN validar input con Zod:
```typescript
"use server"
import { MySchema } from "@/lib/validations"

export async function myAction(data: unknown) {
  const result = MySchema.safeParse(data)
  if (!result.success) {
    return { success: false, error: result.error.flatten() }
  }
  // procesar...
}
```

### Accesibilidad
- Todos los botones icon-only DEBEN tener `aria-label`
- Iconos decorativos DEBEN tener `aria-hidden="true"`
- Formularios DEBEN tener labels (visible o `sr-only`)
- Contraste minimo 4.5:1

## Estructura de Carpetas

| Carpeta | Contenido |
|---------|-----------|
| `app/` | Paginas y rutas (App Router) |
| `components/` | Componentes React reutilizables |
| `components/ui/` | Componentes shadcn/ui base |
| `contexts/` | React Context providers |
| `hooks/` | Custom hooks |
| `actions/` | Server Actions de Next.js |
| `lib/` | Utilidades, configs, helpers |
| `public/` | Assets estaticos |
| `docs/` | Documentacion del proyecto |
