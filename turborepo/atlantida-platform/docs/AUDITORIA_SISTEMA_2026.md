# Auditoría y organización del sistema — Barrio.uy / Atlantida Platform

**Fecha:** 24 de Febrero 2026  
**Objetivo:** Pulir al 100% el sistema, reorganizar archivos y documentación, eliminar obsoletos.

---

## 1. Resumen ejecutivo

| Área | Estado antes | Acción |
|------|--------------|--------|
| Documentación | Dispersa en 3 niveles (raíz, turborepo, apps) | Unificada en `turborepo/atlantida-platform/docs/` |
| PRD / Roadmap | Múltiples copias (raíz, apps, testsprite tmp) | Una sola fuente: `docs/producto/` |
| Archivos obsoletos | Build logs, tmp, .docx, extractos | Eliminados o ignorados |
| Roles y responsabilidades | Implícitos | Definidos en este doc y en INDEX |

---

## 2. Estructura del repositorio (dos niveles)

### 2.1 Raíz del repo (`d:\INMOBILIARIA`)

- **Contenido:** App Next.js legacy/monolito (app/, components/, lib/, etc.) + carpeta `turborepo/` + `docs/`.
- **Uso:** Puede ser el proyecto “neo” histórico o un workspace que contiene tanto monolito como monorepo.
- **Recomendación:** Tratar **turborepo/atlantida-platform** como **fuente de verdad** para desarrollo. La raíz puede conservar README, CONTRIBUTING y enlaces a la documentación del monorepo.

### 2.2 Monorepo Turborepo (`turborepo/atlantida-platform`)

- **apps/portal** → Barrio.uy (marketplace, feed, ranking, pricing). Puerto 3000.
- **apps/inmobiliaria** → MiBarrio.uy (portal transaccional). Puerto 3001.
- **packages/** → lib, types, ui, config compartidos.

**Regla de arquitectura:** No mezclar apps. Feed/red social/ranking solo en `apps/portal`. Ver `REGLAS_ARQUITECTURA_DOMINIOS.md`.

---

## 3. Inventario de documentación por ubicación

### 3.1 Raíz (`INMOBILIARIA/`)

| Archivo | Rol | Decisión |
|---------|-----|----------|
| README.md | Onboarding general | Mantener; actualizar para apuntar al monorepo |
| PRD_FINAL.md | Producto | Consolidar en monorepo docs/producto/ |
| CHANGELOG.md | Historial | Mantener en raíz (o unificar con monorepo) |
| CONTRIBUTING.md | Desarrollo | Mantener |
| DEPLOY_RULES.md | Deploy | Unificar con turborepo/docs/DEPLOY.md |
| GUIA_ERRORES_DEPLOY.md | Deploy | Unificar en turborepo/docs/ |

### 3.2 Carpeta `docs/` (raíz)

| Archivo | Rol | Decisión |
|---------|-----|----------|
| README.md | Índice Atlantida | Mover lógica a turborepo/docs/README.md |
| ROADMAP_FUTURO_v2.0.md | Roadmap | Obsoleto; usar v3 en apps |
| GUIA_RAPIDA.md, GUIA_DIFERENCIACION_Y_DEPLOY.md, GUIA_ESTILOS.md | Guías | Mover a turborepo/docs/guias/ |
| FIRESTORE_DATA_DICT.md | Referencia técnica | Mover a turborepo/docs/tecnico/ |
| MANUAL_AGENTE_BETA.md | Rol: Agente Beta | Mover a turborepo/docs/roles/ o guias/ |
| PLAYBOOK_VENTAS.md, PLAYBOOK_VENTAS_B2B.md | Ventas | Mover a turborepo/docs/negocio/ |
| POLITICA_PRIVACIDAD.md, TERMINOS_Y_CONDICIONES.md | Legal | Mantener en raíz o en app (ya hay app/privacidad, app/terminos) |
| Documento auditor y road.md | Auditoría externa | Archivar en docs/archivo/ o eliminar si obsoleto |
| PLAN_MEJORA_v8_to_v9.5-3.docx.md | Plan antiguo | Eliminar u archivar |
| # 🚀 PLAN DE OPTIMIZACIÓN EXTREMA - Barrio (1).md | Plan optimización | Renombrar a PLAN_OPTIMIZACION_EXTREMA_v12.md y mover a docs/planes/ |
| extract_docx.py, auditoria_extracted.txt | Utilidades/extracción | Eliminar o mover a scripts/ si se usan |
| *.docx, *.pdf, *.png, *.webp, *.mp4 | Recursos | No versionar en Git; mover a drive/wiki o docs/assets (y .gitignore) |

### 3.3 Turborepo (`turborepo/atlantida-platform/`)

| Archivo | Rol | Decisión |
|---------|-----|----------|
| README.md | Monorepo | Mantener (ya es bueno) |
| REGLAS_ARQUITECTURA_DOMINIOS.md | Arquitectura | Mantener en raíz del monorepo |
| docs/DEPLOY.md | Deploy | Fuente de verdad deploy |
| docs/MIGRACION.md | Migración | Mantener |
| docs/AUDITORIA_SISTEMA_2026.md | Esta auditoría | Mantener |

### 3.4 Por app (portal / inmobiliaria)

| Archivo | Rol | Decisión |
|---------|-----|----------|
| PRD_FINAL.md | Duplicado de producto | Una sola copia en docs/producto/ |
| README.md, CONTRIBUTING.md, CHANGELOG.md | Por app | Mantener mínimos; enlace al monorepo |
| docs/ESTADO_ACTUAL_v11.0.md (inmobiliaria) | Estado | Unificar en docs/estado/ en monorepo |
| docs/ROADMAP_FUTURO_v3.0.md (ambas) | Roadmap | Una sola versión en docs/producto/ROADMAP_FUTURO.md |
| docs/PERFORMANCE_STACK.md (portal) | Técnico | Mover a turborepo/docs/tecnico/ |
| docs/MERCADOPAGO_PRODUCTION_GUIDE.md (portal) | Integración | Mover a turborepo/docs/tecnico/ |
| GUIA_ERRORES_DEPLOY.md, DEPLOY_RULES.md | Deploy | Eliminar duplicados; usar turborepo/docs/DEPLOY.md |

### 3.5 testsprite_tests

- **tmp/**: archivos generados (config.json, code_summary.yaml, prd_files/). **No versionar.** Añadir `testsprite_tests/tmp/` a .gitignore y eliminar del repo si ya están trackeados.
- **testsprite_frontend_test_plan.json, standard_prd.json**: si son configuración del equipo, mantener; si son genéricos, opcional mover a monorepo/docs/ o scripts/.

---

## 4. Archivos y carpetas obsoletos o innecesarios

### 4.1 Eliminar (o mover a .gitignore y no trackear)

- `turborepo/atlantida-platform/build.log`
- `turborepo/atlantida-platform/apps/inmobiliaria/build_log.txt`, `build_output.txt`, `build_verification.txt`, `build_verification_2.txt`
- `turborepo/atlantida-platform/apps/portal/build_log.txt`, `build_output.txt`, etc. (si existen)
- `docs/auditoria_extracted.txt`
- `docs/extract_docx.py` (si no se usa en pipeline)
- Contenido de `testsprite_tests/tmp/` en raíz y en cada app (y añadir tmp a .gitignore)
- Duplicados de PRD en `testsprite_tests/tmp/prd_files/` (no hace falta copia en tmp)

### 4.2 Archivar (renombrar o mover a docs/archivo/)

- Planes antiguos: `PLAN_MEJORA_v8_to_v9.5-3.docx.md`
- Documento auditor: `Documento auditor y road.md` (si solo es histórico)

### 4.3 No versionar (o mover a assets externos)

- Documentos Word/PDF en docs/ (Auditoria_*.docx, Plan de Monetizacion.pdf)
- Imágenes/vídeos en docs/ (BARRIO OK.png, portal.mp4, etc.): mejor en wiki o carpeta assets con .gitignore

---

## 5. Roles y responsabilidades (punto por punto)

| Rol | Ubicación lógica | Documentación clave |
|-----|------------------|---------------------|
| **Desarrollador** | Monorepo (portal + inmobiliaria + packages) | README monorepo, DEPLOY.md, REGLAS_ARQUITECTURA_DOMINIOS.md, docs/tecnico/ |
| **Producto** | PRD, Roadmap, Estado | docs/producto/PRD_FINAL.md, ROADMAP_FUTURO.md, ESTADO_ACTUAL.md |
| **Agente / Beta** | Uso de la plataforma | docs/guias/MANUAL_AGENTE_BETA.md |
| **Ventas / B2B** | Playbooks | docs/negocio/PLAYBOOK_VENTAS*.md |
| **DevOps / Deploy** | Vercel, Firebase, env | docs/DEPLOY.md, variables en DEPLOY.md |
| **Auditor / QA** | Estado y planes | docs/estado/, docs/planes/ |

---

## 6. Estructura objetivo de documentación (monorepo)

```
turborepo/atlantida-platform/
├── REGLAS_ARQUITECTURA_DOMINIOS.md   # No mover
├── README.md
├── docs/
│   ├── README.md                     # Índice maestro (este es el INDEX)
│   ├── AUDITORIA_SISTEMA_2026.md     # Esta auditoría
│   ├── DEPLOY.md
│   ├── MIGRACION.md
│   ├── producto/
│   │   ├── PRD_FINAL.md              # Única fuente de verdad
│   │   ├── ROADMAP_FUTURO.md        # v3 consolidado
│   │   └── ESTADO_ACTUAL.md         # v11 consolidado
│   ├── tecnico/
│   │   ├── PERFORMANCE_STACK.md
│   │   ├── MERCADOPAGO_PRODUCTION_GUIDE.md
│   │   └── FIRESTORE_DATA_DICT.md
│   ├── guias/
│   │   ├── GUIA_RAPIDA.md
│   │   ├── GUIA_ESTILOS.md
│   │   ├── GUIA_DIFERENCIACION_Y_DEPLOY.md
│   │   └── MANUAL_AGENTE_BETA.md
│   ├── negocio/
│   │   ├── PLAYBOOK_VENTAS.md
│   │   └── PLAYBOOK_VENTAS_B2B.md
│   └── planes/
│       └── PLAN_OPTIMIZACION_EXTREMA_v12.md
└── apps/
    ├── portal/
    │   └── README.md                 # Breve; enlace a docs/
    └── inmobiliaria/
        └── README.md
```

---

## 7. Checklist de tareas realizadas

- [x] Crear carpetas docs/producto, docs/tecnico, docs/guias, docs/negocio, docs/planes en monorepo.
- [x] Copiar PRD_FINAL.md (portal v11) a docs/producto/.
- [x] Consolidar ROADMAP (v3) y ESTADO_ACTUAL (v11) en docs/producto/.
- [x] Copiar PERFORMANCE_STACK y MERCADOPAGO a docs/tecnico/; FIRESTORE_DATA_DICT a docs/tecnico/.
- [x] Copiar guías y manual agente a docs/guias/.
- [x] Copiar playbooks a docs/negocio/.
- [x] Copiar plan optimización a docs/planes/PLAN_OPTIMIZACION_EXTREMA_v12.md.
- [x] Eliminar build.log, build_*.txt, auditoria_extracted.txt, extract_docx.py, PLAN_MEJORA_v8_to_v9.5.
- [x] Añadir testsprite_tests/tmp/, build.log, build_*.txt, lint_output.txt a .gitignore (raíz).
- [x] Eliminar contenidos de testsprite_tests/tmp/ (PRD, config, code_summary) en raíz y apps.
- [x] Actualizar README raíz y docs/README.md para apuntar al monorepo y a docs/.
- [ ] Opcional: archivar en docs/archivo/ el "Documento auditor y road.md" y los .docx/.pdf de docs/.

---

**Última actualización:** 24 Febrero 2026
