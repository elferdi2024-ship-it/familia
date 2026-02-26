/**
 * @copyright (c) 2024-2025 Atlantida Platform. Todos los derechos reservados.
 * Uso, copia o distribución no autorizados prohibidos.
 */
import { db } from "@repo/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Property, PROPERTIES } from "@/lib/data"

/** Serializa datos de Firestore para pasarlos a Client Components (evita Timestamp/GeoPoint) */
function serializeProperty(data: Record<string, unknown>, id: string): Property {
    const raw = { ...data, id } as Record<string, unknown>

    // Timestamps → ISO string
    const toPlain = (v: unknown): unknown => {
        if (v === null || v === undefined) return v
        if (typeof v === "object" && v !== null && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function") {
            return (v as { toDate: () => Date }).toDate().toISOString()
        }
        if (typeof v === "object" && v !== null && "seconds" in v && "nanoseconds" in v) {
            return new Date((v as { seconds: number }).seconds * 1000).toISOString()
        }
        // GeoPoint → { lat, lng }
        if (typeof v === "object" && v !== null && "latitude" in v && "longitude" in v) {
            const g = v as { latitude: number; longitude: number }
            return { lat: g.latitude, lng: g.longitude }
        }
        if (Array.isArray(v)) return v.map(toPlain)
        if (typeof v === "object" && v !== null && !(v instanceof Date)) {
            const out: Record<string, unknown> = {}
            for (const k of Object.keys(v)) out[k] = toPlain((v as Record<string, unknown>)[k])
            return out
        }
        return v
    }

    const serialized = toPlain(raw) as Record<string, unknown>

    // Asegurar geolocation: Firebase puede guardar latitude/longitude o geolocation (GeoPoint)
    const lat = (serialized.latitude as number) ?? (serialized.geolocation as { lat?: number; latitude?: number })?.lat ?? (serialized.geolocation as { lat?: number; latitude?: number })?.latitude
    const lng = (serialized.longitude as number) ?? (serialized.geolocation as { lng?: number; longitude?: number })?.lng ?? (serialized.geolocation as { lng?: number; longitude?: number })?.longitude
    if (lat != null && lng != null && !serialized.geolocation) {
        serialized.geolocation = { lat: Number(lat), lng: Number(lng) }
    }
    if (serialized.geolocation && typeof (serialized.geolocation as { lat?: number }).lat !== "number") {
        const g = serialized.geolocation as { latitude?: number; longitude?: number }
        serialized.geolocation = { lat: g.latitude ?? lat ?? -34.9011, lng: g.longitude ?? lng ?? -56.1645 }
    }

    return serialized as unknown as Property
}

export async function getProperty(id: string) {
    console.log(`🔍 [SERVER] getProperty check: ID="${id}" (Type: ${typeof id})`)

    // 1. Try mock data first
    const mockProperty = PROPERTIES.find(p => String(p.id) === String(id))
    if (mockProperty) {
        return { property: mockProperty, agentInfo: null, errorReason: null }
    }

    // 2. Try Firestore
    if (!db) {
        return { property: null, agentInfo: null, errorReason: "DB_CONNECTION_ERROR" }
    }

    try {
        const docRef = doc(db, "properties", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()
            const property = serializeProperty(data, docSnap.id)

            let agentInfo = null
            if (data.userId) {
                try {
                    const agentSnap = await getDoc(doc(db, "users", data.userId))
                    if (agentSnap.exists()) {
                        agentInfo = JSON.parse(JSON.stringify(agentSnap.data()))
                    }
                } catch (agentErr) {
                    console.warn(`⚠️ Error fetching agent info for property ${id}:`, agentErr)
                }
            }

            return { property, agentInfo, errorReason: null }
        } else {
            console.warn(`❌ Property not found in Firestore. Likely a Sync Issue (Ghost Record).`)
            return { property: null, agentInfo: null, errorReason: "NOT_FOUND" }
        }
    } catch (e) {
        console.error("🔥 Firestore fetch error:", e)
        return { property: null, agentInfo: null, errorReason: "FETCH_ERROR" }
    }
}
