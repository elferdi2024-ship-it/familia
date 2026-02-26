# Fase 2 — Auditor Técnico / Arquitectura

**Objetivo:** Verificar la salud del stack técnico, la separación de dominios y la calidad del código.

---

## Documentos a revisar

| # | Documento | Ruta | Qué contiene |
|---|-----------|------|-------------|
| 1 | REGLAS_ARQUITECTURA_DOMINIOS.md | [raíz monorepo](../../../REGLAS_ARQUITECTURA_DOMINIOS.md) | Portal vs Inmobiliaria: qué va en cada app |
| 2 | FIRESTORE_DATA_DICT.md | [docs/tecnico/FIRESTORE_DATA_DICT.md](../../tecnico/FIRESTORE_DATA_DICT.md) | Colecciones, índices compuestos, reglas de seguridad |
| 3 | PERFORMANCE_STACK.md | [docs/tecnico/PERFORMANCE_STACK.md](../../tecnico/PERFORMANCE_STACK.md) | React Compiler, Suspense, cache, ISR, optimizaciones |
| 4 | MIGRACION.md | [docs/MIGRACION.md](../../MIGRACION.md) | Migración monolito → Turborepo |
| 5 | PRD_FINAL.md §6 | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Stack tecnológico, modelo de datos |
| 6 | PRD_FINAL.md §9 | [docs/producto/PRD_FINAL.md](../../producto/PRD_FINAL.md) | Requisitos no funcionales (performance, seguridad, accesibilidad) |

---

## Checklist de verificación

### Arquitectura
- [ ] Portal y Inmobiliaria no mezclan funcionalidades (feed solo en portal)
- [ ] Packages compartidos (`@repo/types`, `@repo/lib`, `@repo/ui`) correctamente referenciados
- [ ] No hay código duplicado que debería estar en packages

### Modelo de datos
- [ ] Colecciones Firestore = diccionario (users, properties, leads, feedPosts, config, corporate_leads)
- [ ] Índices compuestos desplegados y coinciden con queries
- [ ] Tipo `Property` en código = Firestore Data Dict

### Performance
- [ ] React Compiler habilitado
- [ ] Suspense/streaming en página de propiedad
- [ ] Cache-Control configurado por ruta
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Bundle size < 200KB First Load JS
- [ ] Upstash Redis activo

### Stack
- [ ] Next.js, React, TypeScript en versiones documentadas
- [ ] `npm audit` sin vulnerabilidades críticas
- [ ] TypeScript strict mode habilitado
- [ ] ESLint sin errores bloqueantes

---

## Comandos de verificación

```bash
cd turborepo/atlantida-platform

# Build completo
npm run build

# Auditoría de dependencias
npm audit

# Lighthouse (producción)
npx lighthouse https://barrio.uy --view --preset=mobile
npx lighthouse https://barrio.uy --view --preset=desktop
```

---

**Entregable:** Reporte técnico con deuda identificada y riesgos → guardar en `../hallazgos/`
