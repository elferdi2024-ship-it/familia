
# Guía de Errores y Soluciones de Despliegue

Este documento registra los errores comunes encontrados en producción/despliegue y cómo solucionarlos para evitar regresiones.

## 1. Firebase "Missing or insufficient permissions" en `update view`
**Síntoma:** Error en consola `FirebaseError: Missing or insufficient permissions` al cargar una página de propiedad.
**Causa:** Las reglas de seguridad de Firestore (`firestore.rules`) por defecto bloquean las actualizaciones (`update`) a usuarios no autenticados. El contador de vistas lo incrementa cualquier visitante.
**Solución:** Modificar `firestore.rules` para permitir actualizaciones *solo* al campo `views` por cualquier usuario.
```javascript
allow update: if isOwner(resource.data.userId) || isAdmin() || 
                (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views']));
```

## 2. Manifest.json 401 (Unauthorized)
**Síntoma:** Error 401 al cargar `/manifest.json`.
**Causa:** Puede ocurrir si el despliegue está protegido (password protection en Vercel) o si el middleware intercepta erróneamente la petición.
**Solución:**
1. Asegurar que `manifest.json` está en la carpeta `public/`.
2. Asegurar que el `matcher` del `middleware.ts` excluye explícitamente `manifest.json`.
```typescript
matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.png).*)',
],
```

## 3. Google Maps "Marker is deprecated"
**Síntoma:** Advertencia en consola `google.maps.Marker is deprecated`.
**Causa:** Google Maps ha deprecado la clase `Marker` antigua en favor de `AdvancedMarkerElement`.
**Solución:** Migrar a `AdvancedMarkerElement`. Requiere un `mapId` válido en la configuración del mapa. Si no se tiene `mapId`, la advertencia es inofensiva pero se debería planificar la migración.

## 4. UI Overlap en Móviles (Notch/Status Bar)
**Síntoma:** Elementos fijos (como modales o drawer handles) se superponen con textos o áreas seguras del sistema.
**Solución:** Aumentar el padding top (`pt-16` o más) en contenedores modales móviles o usar `safe-area-inset-top` si es una PWA instalada.
```tsx
<div className="pt-16 sm:pt-6 ..."> // Más padding en móvil
```

## 5. Imagenes 404 (Next/Image)
**Síntoma:** Imágenes no cargan y dan 404.
**Causa:**
1. URL de origen rota o expirada.
2. Dominio no permitido en `next.config.js`.
3. URL mal formada pasada al componente.
**Solución:** Verificar que el dominio de la imagen esté en `images.remotePatterns` en `next.config.ts`. Usar imágenes de fallback si la URL falla.
## 6. Error de Hidratación / Build con `useSearchParams`
**Síntoma:** Error `useSearchParams() should be wrapped in a suspense boundary` durante el build o error de hidratación en consola.
**Causa:** El uso de `useSearchParams` en componentes del layout (como la Navbar) o páginas estáticas sin un wrapper de `Suspense` causa que Next.js falle al intentar pre-renderizar la página.
**Solución:** Envolver el componente que usa el hook (o la Navbar entera en el layout) en un bloque `<Suspense>`.
```tsx
<Suspense fallback={<div className="h-16" />}>
  <Navbar />
</Suspense>
```
También es necesario usar `suppressHydrationWarning` en la etiqueta `<html>` si se usa `next-themes`.
