import { db } from "@repo/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Property, PROPERTIES } from "@/lib/data"

export async function getProperty(id: string) {
    if (typeof window === 'undefined') {
        console.log(`🔍 [SERVER] getProperty check: ID="${id}" (Type: ${typeof id})`)
    }

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
            const property = { ...data, id: docSnap.id } as Property

            let agentInfo = null
            if (data.userId) {
                const agentSnap = await getDoc(doc(db, "users", data.userId))
                if (agentSnap.exists()) {
                    agentInfo = JSON.parse(JSON.stringify(agentSnap.data()))
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
