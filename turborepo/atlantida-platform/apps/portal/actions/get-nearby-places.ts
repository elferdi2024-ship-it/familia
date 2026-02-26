/**
 * @copyright (c) 2024-2025 Atlantida Platform. Todos los derechos reservados.
 * Uso, copia o distribución no autorizados prohibidos.
 */
"use server"

import { NearbyPlacesSchema } from "@repo/lib/validations"
import { Poi, PoiCategory } from "@repo/types"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

/** Tipos de Google Places API y su mapeo a categoría interna + etiqueta en español */
const PLACE_TYPES: { type: string; category: PoiCategory; categoryLabel: string }[] = [
    { type: "school", category: "school", categoryLabel: "Colegios" },
    { type: "restaurant", category: "restaurant", categoryLabel: "Gastronomía" },
    { type: "park", category: "park", categoryLabel: "Parques" },
    { type: "shopping_mall", category: "shopping", categoryLabel: "Comercios" },
    { type: "pharmacy", category: "pharmacy", categoryLabel: "Farmacias" },
    { type: "hospital", category: "health", categoryLabel: "Salud" },
    { type: "transit_station", category: "transit", categoryLabel: "Transporte" },
]

/** Fórmula de Haversine: distancia en metros entre dos puntos lat/lng */
function haversineMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371000 // radio de la Tierra en metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
}

export async function getNearbyPlaces(lat: number, lng: number): Promise<Poi[]> {
    const validation = NearbyPlacesSchema.safeParse({ lat, lng })
    if (!validation.success) {
        console.error("Invalid coordinates:", validation.error.flatten())
        return []
    }

    if (!GOOGLE_MAPS_API_KEY) {
        console.error("Missing Google Maps API Key")
        return []
    }

    const radiusMeters = 1500 // 1.5 km para más opciones
    const maxPerType = 3
    const allPois: Poi[] = []

    try {
        const requests = PLACE_TYPES.map(async ({ type, category, categoryLabel }) => {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=${type}&key=${GOOGLE_MAPS_API_KEY}&language=es`

            const response = await fetch(url)
            const data = await response.json()

            if (data.status === "OK" && data.results) {
                return data.results.slice(0, maxPerType).map(
                    (place: {
                        place_id: string
                        name: string
                        geometry: { location: { lat: number; lng: number } }
                        vicinity?: string
                    }) => {
                        const placeLat = place.geometry.location.lat
                        const placeLng = place.geometry.location.lng
                        const distanceMeters = haversineMeters(lat, lng, placeLat, placeLng)
                        return {
                            id: place.place_id,
                            label: place.name,
                            category,
                            categoryLabel,
                            lat: placeLat,
                            lng: placeLng,
                            description: place.vicinity || "Ubicación cercana",
                            distanceMeters,
                        }
                    }
                )
            }
            return []
        })

        const results = await Promise.all(requests)
        results.forEach((group) => allPois.push(...group))

        // Ordenar por distancia (más cercanos primero)
        allPois.sort((a, b) => a.distanceMeters - b.distanceMeters)

        return allPois
    } catch (error) {
        console.error("Error fetching nearby places:", error)
        return []
    }
}
