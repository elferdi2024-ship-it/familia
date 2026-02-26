# Búsqueda de propiedades (Barrio.uy y MiBarrio.uy)

## Por qué no veo mis propiedades al buscar

La búsqueda en **Barrio.uy** y **MiBarrio.uy** usa **Algolia**, no Firestore directo. Para que las propiedades creadas en el dashboard aparezcan en **Comprar** o **Alquilar**, tenés que:

1. **Sincronizar Firestore → Algolia** (ejecutar el script de sync **una vez**; el mismo índice sirve para las dos webs).
2. **Usar el filtro correcto**: si publicaste en **Venta**, elegí **Comprar** en la búsqueda; si publicaste en **Alquiler**, elegí **Alquilar**.

---

## 1. Sincronizar el índice de Algolia

Cada vez que agregás o editás propiedades en Firestore, actualizá el índice. Podés correr el sync desde **cualquiera** de las dos apps (usan el mismo índice `properties`).

**Desde Barrio.uy (portal):**
```bash
cd turborepo/atlantida-platform/apps/portal
npx tsx scripts/sync-algolia.ts
```

**Desde MiBarrio.uy (inmobiliaria):**
```bash
cd turborepo/atlantida-platform/apps/inmobiliaria
npx tsx scripts/sync-algolia.ts
```

Requisitos en `.env.local` (portal **o** inmobiliaria, según desde dónde corras el sync):

- `NEXT_PUBLIC_ALGOLIA_APP_ID`
- `ALGOLIA_ADMIN_KEY` (solo para el script de sync)
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` (clave de solo búsqueda, para que la web consulte Algolia)
- Variables de Firebase (para el sync: leer la colección `properties`)

**Para que la búsqueda funcione en la web** (Barrio.uy y MiBarrio.uy), cada app debe tener en su `.env.local`:

- `NEXT_PUBLIC_ALGOLIA_APP_ID`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`

El script lee todas las propiedades de Firestore y las sube al índice **properties** de Algolia.

---

## 2. Filtro Alquilar vs Comprar

En la búsqueda:

- **Alquilar** → solo muestra propiedades con `operation: "Alquiler"` (o "Alquiler Temporal").
- **Comprar** → solo muestra propiedades con `operation: "Venta"`.

Si en el dashboard tenés 2 propiedades en **Venta** y en la web elegís **Alquilar**, es normal que no aparezca ninguna. Probá con **Comprar** después de haber corrido el sync.

---

## 3. Resumen

| Quiero que…                         | Acción                                                                 |
|-------------------------------------|------------------------------------------------------------------------|
| Aparezcan mis propiedades al buscar | Ejecutar `npx tsx scripts/sync-algolia.ts` desde `apps/portal` **o** `apps/inmobiliaria` (una vez alcanza para las dos webs) |
| Ver propiedades en venta            | En la búsqueda, elegir **Comprar**                                    |
| Ver propiedades en alquiler         | En la búsqueda, elegir **Alquilar**                                    |

Si después del sync y con el filtro correcto siguen sin aparecer, revisá en Firestore que cada propiedad tenga bien el campo **operation** ("Venta" o "Alquiler") y que el documento exista en la colección **properties**.
