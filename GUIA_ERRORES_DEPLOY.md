# Guía de Solución de Errores de Build y Despliegue

Este documento sirve como referencia para evitar errores comunes de TypeScript durante el proceso de build en Vercel o localmente.

## El Problema Recurrente: `Type error: Object literal may only specify known properties`

Este error ocurre cuando intentamos asignar un objeto a una variable tipada (como `MarketData`), pero las propiedades del objeto no coinciden exactamente con la definición de la interfaz.

### Ejemplo del Error
```typescript
Type error: Object literal may only specify known properties, and 'averagePriceInZone' does not exist in type 'MarketData'.
```

### Causa
La interfaz `MarketData` en `lib/analytics.ts` y su uso en `components/search/SearchContent.tsx` (u otros componentes) están desincronizados. A menudo, actualizamos uno pero olvidamos el otro, o usamos propiedades "mock" (falsas) que no existen en la definición real.

### Solución
Siempre verifica la definición de la interfaz antes de usarla.

**Definición Actual (`lib/analytics.ts`):**
```typescript
export interface MarketData {
    averagePricePerM2: number;
    propertyPricePerM2: number;
    differencePercentage: number;
    status: "Very Competitive" | "Competitive" | "Fair" | "Above Average" | "High";
    totalPropertiesInNeighborhood: number;
}
```

**Uso Correcto:**
```typescript
const stats: MarketData = {
    averagePricePerM2: 2500,
    propertyPricePerM2: 2400,
    differencePercentage: -4,
    status: 'Competitive',
    totalPropertiesInNeighborhood: 12
};
```

## Checklist Antes de Desplegar

1.  **Ejecutar Build Localmente**: Antes de hacer push, corre siempre:
    ```bash
    npm run build
    ```
    Si falla localmente, fallará en Vercel.

2.  **Verificar Interfaces**: Si cambiaste una interfaz (`interface`) en `lib/`, busca todas las referencias en el proyecto (Ctrl+Shift+F) para actualizar los usos.

3.  **No ignorar Errores de TS**: No uses `@ts-ignore` a menos que sea absolutamente crítico y temporal. TypeScript está ahí para evitar que la app se rompa en producción.
