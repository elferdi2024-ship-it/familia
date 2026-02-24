# Arquitectura de Dominios - Barrio.uy vs MiBarrio.uy

**IMPORTANTE: NO MEZCLAR LAS APLICACIONES**

## 1. Barrio.uy (localhost:3000)
- **Propósito**: Red Social Inmobiliaria ("Feed", "Conecta con el Barrio").
- **Funcionalidad**: Aquí es donde vive toda la lógica de posts, interacciones sociales, ranking de agentes, perfiles sociales y monetización.
- **Ubicación en código**: `apps/portal` (Portal de Barrio).

## 2. Inmobiliaria / MiBarrio.uy (localhost:3001)
- **Propósito**: Portal transaccional de la inmobiliaria (Búsqueda de propiedades, detalles, gestión de listings).
- **Funcionalidad**: **NO IMPLEMENTAR** nada del Feed social aquí. Esta es la cara pública para buscar y comprar/alquilar propiedades de forma tradicional.
- **Ubicación en código**: `apps/inmobiliaria` (Atlantida Platform).

---

### Regla de Oro
Todos los cambios relacionados con la **Red Social**, el **Feed**, **Propuestas de Valor sociales** o **Ranking de Agentes** deben realizarse exclusivamente en `apps/portal` (Barrio.uy - :3000).
