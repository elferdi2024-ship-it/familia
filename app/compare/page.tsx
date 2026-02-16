"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useComparison } from "@/contexts/ComparisonContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, documentId } from "firebase/firestore"
import { Property, formatPrice, formatGastosComunes } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function ComparePage() {
    const { selectedIds, removeFromCompare } = useComparison()
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProperties = async () => {
            if (selectedIds.length === 0) {
                setProperties([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const q = query(
                    collection(db, "properties"),
                    where(documentId(), "in", selectedIds)
                )
                const querySnapshot = await getDocs(q)
                const fetched = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Property[]

                // Sort as per selectedIds order
                const ordered = selectedIds.map(id => fetched.find(p => p.id === id)).filter(Boolean) as Property[]
                setProperties(ordered)
            } catch (error) {
                console.error("Error fetching comparison properties:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperties()
    }, [selectedIds])

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin material-icons text-primary text-4xl mb-4">refresh</div>
                <p className="text-slate-500">Cargando comparación...</p>
            </div>
        )
    }

    if (properties.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="material-icons text-slate-300 text-6xl mb-4">compare_arrows</div>
                <h2 className="text-2xl font-bold mb-2">No hay nada para comparar</h2>
                <p className="text-slate-500 mb-6">Selecciona hasta 3 propiedades para ver un desglose detallado.</p>
                <Button asChild>
                    <Link href="/search">Ir a buscar propiedades</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-12">
            {/* Breadcrumbs & Title */}
            <div className="mb-6 md:mb-8">
                <nav className="flex text-xs text-slate-500 mb-2 gap-2">
                    <Link className="hover:underline" href="/">Inicio</Link>
                    <span>/</span>
                    <Link className="hover:underline" href="/search">Búsqueda</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-slate-200">Comparar Propiedades</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Comparación Detallada</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Analiza hasta 3 propiedades seleccionadas.</p>
            </div>

            {/* Comparison Container */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border-light dark:border-slate-800 overflow-hidden mb-12">
                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="w-full border-collapse min-w-[800px]">
                        {/* Property Header Cards Row */}
                        <thead>
                            <tr className="align-top">
                                <th className="label-column p-6 text-left border-b border-border-light dark:border-slate-800 bg-neutral-light dark:bg-slate-800/50 w-[200px] sticky top-0 z-10">
                                    <div className="pt-2">
                                        <Link href="/search" className="text-primary hover:text-blue-700 flex items-center gap-1 text-sm font-semibold">
                                            <span className="material-icons text-sm">add_circle</span>
                                            Agregar más
                                        </Link>
                                    </div>
                                </th>
                                {properties.map((p) => (
                                    <th key={p.id} className="comparison-column p-4 border-b border-border-light dark:border-slate-800 relative group sticky top-0 bg-white dark:bg-slate-900 z-10">
                                        <button
                                            onClick={() => removeFromCompare(p.id)}
                                            className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 p-1 rounded-full shadow-sm transition-all z-10"
                                            aria-label="Quitar de comparación"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                        <div className="mb-4 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 relative">
                                            <Image
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105 duration-500"
                                                alt={p.title}
                                                src={p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"}
                                            />
                                        </div>
                                        <div className="text-left px-2">
                                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{p.type}</span>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[40px]">{p.title}</h3>
                                            <div className="mt-2 text-xl font-bold text-primary tracking-tight font-display">
                                                {formatPrice(p.price, p.currency)}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                                {/* Empty placeholders for symmetry if less than 3 */}
                                {[...Array(Math.max(0, 3 - properties.length))].map((_, i) => (
                                    <th key={i} className="comparison-column p-4 border-b border-border-light dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                                        <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                            <Link href="/search" className="text-slate-400 hover:text-primary flex flex-col items-center gap-1 transition-colors">
                                                <span className="material-icons text-3xl">add</span>
                                                <span className="text-[10px] font-bold uppercase">Añadir</span>
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Comparison Rows */}
                        <tbody>
                            <tr className="bg-neutral-light/30 dark:bg-slate-800/20">
                                <td className="p-4 pl-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-slate-800">FINANZAS</td>
                                {properties.map(p => <td key={p.id} className="border-b border-border-light dark:border-slate-800"></td>)}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Precio / m²</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {p.pricePerM2 > 0 ? (
                                            <>USD {p.pricePerM2.toLocaleString("es-UY")} <span className="text-xs text-slate-400 font-normal">/ m²</span></>
                                        ) : "N/A"}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Gastos Comunes</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {formatGastosComunes(p.gastosComunes)}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>

                            <tr className="bg-neutral-light/30 dark:bg-slate-800/20">
                                <td className="p-4 pl-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-slate-800">CARACTERÍSTICAS</td>
                                {properties.map(p => <td key={p.id} className="border-b border-border-light dark:border-slate-800"></td>)}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Dormitorios</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {p.bedrooms || "Loft"} {p.bedrooms === 1 ? 'Dormitorio' : 'Dormitorios'}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Baños</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {p.bathrooms} {p.bathrooms === 1 ? 'Baño' : 'Baños'}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Superficie</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {p.area} m²
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Garajes</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">
                                        {p.garages > 0 ? `${p.garages} ${p.garages === 1 ? 'Lugar' : 'Lugares'}` : "No"}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Vivienda Promovida</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 border-b border-border-light dark:border-slate-800">
                                        {p.viviendaPromovida ? (
                                            <span className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                                                <span className="material-icons text-base">verified</span> LEY 18.795
                                            </span>
                                        ) : "No aplica"}
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>

                            <tr className="bg-neutral-light/30 dark:bg-slate-800/20">
                                <td className="p-4 pl-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-slate-800">SERVICIOS</td>
                                {properties.map(p => <td key={p.id} className="border-b border-border-light dark:border-slate-800"></td>)}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800"></td>)}
                            </tr>
                            <tr className="align-top">
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-slate-800">Amenities Clave</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6 border-b border-border-light dark:border-slate-800">
                                        <div className="flex flex-col gap-2">
                                            {p.amenities?.slice(0, 5).map((amen, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-300">
                                                    <span className="material-icons text-primary text-base">check_circle</span>
                                                    {amen}
                                                </div>
                                            ))}
                                            {(!p.amenities || p.amenities.length === 0) && <span className="text-slate-400 italic">No especificado</span>}
                                        </div>
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="border-b border-border-light dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/5"></td>)}
                            </tr>

                            {/* Actions Row */}
                            <tr>
                                <td className="p-4 pl-6 bg-neutral-light/10 dark:bg-slate-800/10"></td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-6">
                                        <Button asChild className="w-full h-12 md:h-14 font-bold text-base shadow-md group">
                                            <Link href={`/property/${p.id}`} className="flex items-center justify-center gap-2">
                                                Ver Detalles
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </td>
                                ))}
                                {[...Array(3 - properties.length)].map((_, i) => <td key={i} className="p-6"></td>)}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Info / Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 md:p-6 flex gap-3 md:gap-4">
                <span className="material-icons text-primary">info</span>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-blue-100">Consejo del experto</h4>
                    <p className="text-slate-600 dark:text-blue-200/70 text-sm mt-1 leading-relaxed">Al comparar apartamentos en Montevideo, ten en cuenta que los "Gastos Comunes" pueden variar significativamente según los servicios centrales y el tipo de calefacción. No olvides consultar si la propiedad cuenta con tributos domiciliarios incluidos.</p>
                </div>
            </div>
        </div>
    )
}

function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
