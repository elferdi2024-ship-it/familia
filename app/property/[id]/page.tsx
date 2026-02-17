import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Property, PROPERTIES } from "@/lib/data"
import PropertyClient from "./PropertyClient"
import { notFound } from "next/navigation"
import Link from "next/link"

// Revalidate every hour
export const revalidate = 3600

// Pre-render the static mock properties for instant loading
export async function generateStaticParams() {
    return PROPERTIES.map((p) => ({
        id: p.id,
    }))
}

async function getProperty(id: string): Promise<{ property: Property | null, agentInfo: any | null }> {
    console.log("🔍 getProperty called for ID:", id)

    // 1. Try mock data first
    const mockProperty = PROPERTIES.find(p => p.id === id)
    if (mockProperty) {
        console.log("✅ Found mock property:", mockProperty.title)
        return { property: mockProperty, agentInfo: null }
    }

    // 2. Try Firestore
    if (!db) {
        console.warn("⚠️ Firestore DB not initialized")
        return { property: null, agentInfo: null }
    }

    try {
        const docRef = doc(db, "properties", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log("✅ Found Firestore property:", docSnap.id)
            const data = docSnap.data()
            const property = { ...data, id: docSnap.id } as Property

            let agentInfo = null
            if (data.userId) {
                const agentSnap = await getDoc(doc(db, "users", data.userId))
                if (agentSnap.exists()) {
                    agentInfo = JSON.parse(JSON.stringify(agentSnap.data())) // Ensure serializable
                }
            }

            return { property, agentInfo }
        } else {
            console.warn("❌ Property not found in Firestore collection 'properties' with ID:", id)
        }
    } catch (e) {
        console.error("🔥 Error fetching property from Firestore:", e)
    }

    return { property: null, agentInfo: null }
}

export default async function PropertyPage({ params }: { params: any }) {
    const resolvedParams = await params
    const id = resolvedParams?.id

    console.log("📄 DEBUG: PropertyPage rendered with ID:", id)

    if (!id) {
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold">Error: No ID provided</h1>
                <p>Params: {JSON.stringify(resolvedParams)}</p>
            </div>
        )
    }

    const { property, agentInfo } = await getProperty(id)

    if (!property) {
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold">Error: Propiedad no encontrada</h1>
                <p>Intentando buscar ID: <span className="font-mono bg-slate-100 p-1">{id}</span></p>
                <Link href="/" className="text-primary hover:underline mt-4 block">Volver al inicio</Link>
            </div>
        )
    }

    return <PropertyClient initialProperty={property} initialAgentInfo={agentInfo} />
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = await params
    const { property } = await getProperty(id)

    if (!property) return { title: 'Propiedad no encontrada' }

    return {
        title: `${property.title} | DominioTotal`,
        description: property.description.substring(0, 160),
        openGraph: {
            title: property.title,
            description: property.description.substring(0, 160),
            images: [property.images[0]],
        },
    }
}
