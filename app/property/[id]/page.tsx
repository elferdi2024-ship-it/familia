import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Property, PROPERTIES } from "@/lib/data"
import PropertyClient from "./PropertyClient"
import { notFound } from "next/navigation"

// Revalidate every hour
export const revalidate = 3600

// Pre-render the static mock properties for instant loading
export async function generateStaticParams() {
    return PROPERTIES.map((p) => ({
        id: p.id,
    }))
}

async function getProperty(id: string): Promise<{ property: Property | null, agentInfo: any | null }> {
    // 1. Try mock data first
    const mockProperty = PROPERTIES.find(p => p.id === id)
    if (mockProperty) {
        return { property: mockProperty, agentInfo: null }
    }

    // 2. Try Firestore
    if (!db) return { property: null, agentInfo: null }

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
                    agentInfo = JSON.parse(JSON.stringify(agentSnap.data())) // Ensure serializable
                }
            }

            return { property, agentInfo }
        }
    } catch (e) {
        console.error("Error fetching property for ISR:", e)
    }

    return { property: null, agentInfo: null }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const { property, agentInfo } = await getProperty(id)

    if (!property) {
        notFound()
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
