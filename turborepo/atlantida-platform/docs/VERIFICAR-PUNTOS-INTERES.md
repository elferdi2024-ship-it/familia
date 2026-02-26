# Cómo verificar coordenadas y puntos de interés

## 1. ¿La propiedad tiene coordenadas?

### Opción A: Consola del navegador (en la página de la propiedad)

1. Abrí la ficha de la propiedad (ej. `/property/ABC123`).
2. Abrí DevTools (F12) → pestaña **Console**.
3. Pegá y ejecutá:

```javascript
// Ver si hay geolocation en la página
const script = document.querySelector('script#__NEXT_DATA__')
if (script) {
  const data = JSON.parse(script.textContent)
  const pageProps = data?.props?.pageProps
  // En App Router el payload puede estar en otro lugar; probá:
  console.log('Page data:', data?.props)
}
```

Como la propiedad viene del server, la forma más directa es la **Opción B** o **C**.

### Opción B: Firebase Console (Firestore)

1. Entrá a [Firebase Console](https://console.firebase.google.com) → tu proyecto → **Firestore Database**.
2. Abrí la colección **`properties`**.
3. Buscá el documento de la propiedad (por ID o título).
4. Revisá si existe el campo **`geolocation`**:
   - **Tiene coordenadas:** verás algo como `geolocation: { lat: -34.9011, lng: -56.1645 }`.
   - **No tiene:** el campo no existe o está vacío.

### Opción C: Indicador en la tarjeta "Vive el barrio"

En **desarrollo** (`npm run dev`), la tarjeta muestra un pequeño texto de estado al pie:
- **"Coordenadas: sí · X puntos"** → la propiedad tiene `geolocation` y la API devolvió X puntos.
- **"Coordenadas: no"** → la propiedad no tiene `geolocation` en Firestore.
- **"Coordenadas: sí · 0 puntos"** → hay coordenadas pero la API no devolvió resultados (revisar API key o red).

---

## 2. ¿La API de Google Maps devuelve puntos?

### Variable de entorno

1. En la raíz del proyecto de la app (portal o inmobiliaria) debe existir `.env.local`.
2. Debe tener la variable:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_aqui
   ```
3. La clave debe tener habilitada **Places API** (y si usás mapa, **Maps JavaScript API**) en [Google Cloud Console](https://console.cloud.google.com/apis/library).

### Probar la API desde Node (misma lógica que el server)

En la raíz del monorepo (o en `apps/inmobiliaria`):

```bash
node -e "
const lat = -34.9011, lng = -56.1645
const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
if (!key) { console.log('FALTA NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en el entorno'); process.exit(1) }
const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=500&type=school&key='+key+'&language=es'
fetch(url).then(r=>r.json()).then(d=> console.log('Status:', d.status, '| Resultados:', d.results?.length ?? 0, '| Error:', d.error_message || 'ninguno'))
"
```

Pasar la variable antes del comando:

```bash
# Windows (PowerShell)
$env:NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_clave"; node -e "..."

# Linux/macOS
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave node -e "..."
```

- **Status OK y Resultados > 0:** la API está bien configurada y devuelve puntos.
- **Status ZERO_RESULTS:** la API responde pero no hay lugares en ese radio (probá otro lat/lng o radio).
- **error_message "invalid request" o "API key invalid":** revisá la clave y las APIs habilitadas.

---

## 3. Resumen rápido

| Qué verificar        | Dónde / cómo                                                                 |
|----------------------|-------------------------------------------------------------------------------|
| Propiedad con coords | Firestore → `properties` → documento → campo `geolocation: { lat, lng }`     |
| API key definida      | Archivo `.env.local` con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`                    |
| API devuelve datos   | Script `node -e "fetch(...)"` arriba o indicador en la tarjeta en dev        |

Si la propiedad tiene coordenadas y la API key es válida, la tarjeta "Vive el barrio" mostrará la lista de colegios, parques, comercios, etc. con distancias.
