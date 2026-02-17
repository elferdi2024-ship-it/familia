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
    console.log(`🔍 [SERVER] getProperty check: ID="${id}" (Type: ${typeof id})`)
    console.log(`📊 Mock properties available: ${PROPERTIES.length}`)

    // 1. Try mock data first
    const mockProperty = PROPERTIES.find(p => String(p.id) === String(id))
    if (mockProperty) {
        console.log("✅ Found in Mock data:", mockProperty.title)
        return { property: mockProperty, agentInfo: null }
    } else {
        console.log(`❌ Not found in Mock data. Available IDs: ${PROPERTIES.map(p => p.id).join(', ')}`)
    }

    // 2. Try Firestore
    if (!db) {
        console.warn("⚠️ Firestore DB instance is null/undefined in getProperty")
        return { property: null, agentInfo: null }
    }

    try {
        console.log(`尝试从 Firestore 读取 ID: ${id}`)
        const docRef = doc(db, "properties", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log("✅ Found in Firestore:", docSnap.id)
            const data = docSnap.data()
            const property = { ...data, id: docSnap.id } as Property

            let agentInfo = null
            if (data.userId) {
                const agentSnap = await getDoc(doc(db, "users", data.userId))
                if (agentSnap.exists()) {
                    agentInfo = JSON.parse(JSON.stringify(agentSnap.data()))
                }
            }

            return { property, agentInfo }
        } else {
            console.warn(`❌ Property not found in Firestore collection 'properties' with ID: ${id}`)
        }
    } catch (e) {
        console.error("🔥 Firestore fetch error:", e)
    }

    return { property: null, agentInfo: null }
}

export default async function PropertyPage({ params }: { params: any }) {
    const resolvedParams = await params
    const id = resolvedParams?.id

    console.log(`📄 Rendering PropertyPage for ID: ${id}`)

    if (!id) {
        return (
            <div className="p-20 text-center space-y-4">
                <h1 className="text-3xl font-black text-red-600">ERROR: NO_ID</h1>
                <p className="text-slate-500 font-mono bg-slate-100 p-4 rounded">Params: {JSON.stringify(resolvedParams)}</p>
                <Link href="/" className="text-primary font-bold hover:underline">Volver al Inicio</Link>
            </div>
        )
    }

    const { property, agentInfo } = await getProperty(id)

    if (!property) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons text-amber-500 text-4xl">search_off</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Propiedad No Localizada</h1>
                <p className="text-slate-500 max-w-sm mb-8">
                    No pudimos encontrar la propiedad con el ID <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">{id}</span>.
                </p>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left max-w-md w-full mb-8">
                    <h3 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Debug Console</h3>
                    <ul className="text-[10px] font-mono space-y-1 text-slate-600">
                        <li>• Params ID: "{id}"</li>
                        <li>• Mock Count: {PROPERTIES.length}</li>
                        <li>• DB Init: {db ? 'SUCCESS' : 'FAILED'}</li>
                        <li>• Timestamp: {new Date().toISOString()}</li>
                    </ul>
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                        Ir al Inicio
                    </Link>
                    <Link href="/search" className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        Buscar Otros
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <PropertyClient
            initialProperty={property}
            initialAgentInfo={agentInfo}
        />
    )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { property } = await getProperty(id)

    if (!property) return { title: 'Propiedad no encontrada' }

    return {
        title: `${property.title} | Inmobiliaria`,
        description: property.description.substring(0, 160),
        openGraph: {
            title: property.title,
            description: property.description.substring(0, 160),
            images: [property.images[0]],
        },
    }
}
