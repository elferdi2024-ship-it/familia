import { db } from "@repo/lib/firebase"
import PropertyClient from "./PropertyClient"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProperty } from "@/lib/properties"
import { PropertyBreadcrumb } from "@/components/BreadcrumbSchema"

// ISR: Regenerate property pages every 1 hour
// Cached on Vercel CDN for fast loads (~200ms vs ~2-3s)
export const revalidate = 3600

export default async function PropertyPage({ params }: { params: any }) {
    const resolvedParams = await params
    const id = resolvedParams?.id

    if (!id) return notFound()

    const { property, agentInfo, errorReason } = await getProperty(id)

    if (!property) {
        const isGhostRecord = errorReason === "NOT_FOUND" && id.length > 5; // Heuristic for Firestore IDs

        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-icons text-amber-500 text-4xl">search_off</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Propiedad No Localizada</h1>
                <p className="text-slate-500 max-w-sm mb-8">
                    No pudimos encontrar la propiedad con el ID <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">{id}</span>.
                </p>

                {isGhostRecord && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left max-w-md w-full rounded-r-lg">
                        <p className="text-sm text-blue-800 font-bold mb-1">ℹ️ Posible Error de Sincronización</p>
                        <p className="text-xs text-blue-700">
                            Esta propiedad aparece en los resultados de búsqueda pero no existe en la base de datos (Ghost Record).
                            Por favor, ejecuta "npm run algolia:sync" para limpiar el índice.
                        </p>
                    </div>
                )}

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left max-w-md w-full mb-8">
                    <h3 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Debug Console (Live)</h3>
                    <ul className="text-[10px] font-mono space-y-1 text-slate-600">
                        <li>• Params ID: "{id}"</li>
                        <li>• Error Code: {errorReason || 'UNKNOWN'}</li>
                        <li>• DB Connector: {db ? 'ONLINE' : 'OFFLINE'}</li>
                        {isGhostRecord && <li className="text-red-500 font-bold">• GHOST RECORD DETECTED</li>}
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
        <>
            <PropertyBreadcrumb
                title={property.title}
                id={id}
                neighborhood={property.neighborhood}
            />
            <PropertyClient
                initialProperty={property}
                initialAgentInfo={agentInfo}
            />
        </>
    )
}

export async function generateMetadata({ params }: { params: any }) {
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
