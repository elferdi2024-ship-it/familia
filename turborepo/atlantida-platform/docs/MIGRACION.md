# Guía de Migración: Monolito → Turborepo Monorepo

## Resumen Ejecutivo

**Proyecto**: Atlantida Platform (anteriormente familia-main)
**Fecha**: Febrero 2025
**Estrategia**: Turborepo Monorepo

## Estado de la Migración

### Completado ✅
- [x] Estructura de directorios Turborepo
- [x] Configuración turbo.json
- [x] Package.json raíz con workspaces
- [x] Package @repo/ui (componentes UI)
- [x] Package @repo/lib (Firebase, Algolia, tracking)
- [x] Package @repo/types (interfaces TypeScript)
- [x] App portal (marketplace) configurada
- [x] App inmobiliaria (MiBarrio.uy) configurada
- [x] Configuraciones de branding diferenciadas

### Pendiente ⏳
- [ ] Actualizar imports en código existente
- [ ] Configurar tsconfig paths en cada app
- [ ] Setup Sentry por app
- [ ] Crear .env.example por app
- [ ] Probar build completo
- [ ] Configurar Vercel

## Diferencias Entre Apps

| Aspecto | Portal | Inmobiliaria |
|---------|--------|--------------|
| **Nombre** | Barrio.uy | MiBarrio.uy |
| **Multi-agente** | Sí | No |
| **Registro agentes** | Sí | No |
| **Suscripciones** | Sí | No |
| **Puerto dev** | 3000 | 3001 |
| **Color primario** | #0066FF | #1E3A5F |
| **Dominio** | Barrio.uy.uy | mibarrio.uy |

## Comandos Post-Migración

```bash
# Instalar dependencias
cd atlantida-platform
npm install

# Verificar estructura
npm run dev

# Build de prueba
npm run build
```

## Checklist de Validación

### Por cada app verificar:
- [ ] `npm run dev` funciona
- [ ] `npm run build` sin errores
- [ ] Firebase se conecta correctamente
- [ ] Algolia funciona
- [ ] Sentry captura errores
- [ ] Branding correcto visible

## Rollback Plan

Si hay problemas críticos:
1. El código original permanece en `/workspace/proyecto/familia-main`
2. Se puede revertir volviendo al monolito original
3. Los cambios en monorepo no afectan el código original

## Contacto

Para problemas con la migración, revisar:
- README.md del monorepo
- Documentación de Turborepo: https://turbo.build/repo/docs
