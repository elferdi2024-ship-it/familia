"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useComparison } from "@/contexts/ComparisonContext"
import { Property, formatPrice } from "@/lib/data"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { ArrowLeft, X, Check } from "lucide-react"

export default function ComparePage() {
    const { selectedIds, removeFromCompare, clearCompare } = useComparison()
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProperties = async () => {
            if (selectedIds.length === 0) {
                setProperties([])
                setIsLoading(false)
                return
            }

            try {
                const fetched = await Promise.all(
                    selectedIds.map(async (id) => {
                        const docRef = doc(db!, "properties", id)
                        const snap = await getDoc(docRef)
                        if (snap.exists()) {
                            return { id: snap.id, ...snap.data() } as Property
                        }
                        return null
                    })
                )
                setProperties(fetched.filter(Boolean) as Property[])
            } catch (error) {
                console.error("Error fetching comparison properties:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProperties()
    }, [selectedIds])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-background-dark pt-32 px-6 flex justify-center">
                <div className="animate-spin material-icons text-primary text-4xl">refresh</div>
            </div>
        )
    }

    if (properties.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-background-dark pt-32 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-icons text-4xl text-slate-400">compare_arrows</span>
                    </div>
                    <h1 className="text-3xl font-black">No hay propiedades para comparar</h1>
                    <p className="text-slate-500">Agregá hasta 3 propiedades desde los resultados de búsqueda para compararlas aquí.</p>
                    <Link href="/search" className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-bold">Ir a buscar propiedades</Link>
                </div>
            </div>
        )
    }

    const features = [
        { label: "Precio", key: "price", format: (val: any, p: Property) => formatPrice(val, p.currency) },
        { label: "Ubicación", key: "neighborhood" },
        { label: "Dormitorios", key: "bedrooms" },
        { label: "Baños", key: "bathrooms" },
        { label: "Área", key: "area", suffix: " m²" },
        { label: "Garajes", key: "garages" },
        { label: "Estado", key: "badge" },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <Link href="/search" className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                            <ArrowLeft size={16} /> Volver a la búsqueda
                        </Link>
                        <h1 className="text-4xl font-black tracking-tight">Comparar Propiedades</h1>
                    </div>
                    <button onClick={clearCompare} className="text-slate-500 font-bold text-sm hover:text-red-500 transition-colors">
                        Limpiar lista
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Labels Column (Desktop) */}
                    <div className="hidden lg:block space-y-4 pt-[320px]">
                        {features.map(f => (
                            <div key={f.key} className="h-16 flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest px-4 border-l-4 border-slate-200">
                                {f.label}
                            </div>
                        ))}
                        <div className="h-16 flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest px-4 border-l-4 border-slate-200">
                            Amenidades
                        </div>
                    </div>

                    {/* Property Columns */}
                    {properties.map(p => (
                        <div key={p.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative">
                            <button
                                onClick={() => removeFromCompare(p.id)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="aspect-[4/3] relative">
                                <Image fill src={p.images[0]} alt={p.title} className="object-cover" />
                            </div>

                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 h-[100px] flex flex-col justify-center">
                                <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2">{p.title}</h3>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {features.map(f => (
                                    <div key={f.key} className="h-16 flex items-center px-6">
                                        <div className="lg:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">{f.label}: </div>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {f.format ? f.format(p[f.key as keyof Property], p) : `${p[f.key as keyof Property] || ''}`}{f.suffix}
                                        </span>
                                    </div>
                                ))}

                                <div className="p-6">
                                    <div className="lg:hidden text-[10px] font-bold text-slate-400 uppercase block mb-3">Amenidades</div>
                                    <div className="space-y-2">
                                        {(p.amenities || []).slice(0, 5).map(a => (
                                            <div key={a} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                <Check size={12} className="text-emerald-500" />
                                                {a}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <Link href={`/property/${p.id}`} className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                                    Ver Detalle
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, 3 - properties.length) }).map((_, i) => (
                        <div key={i} className="hidden lg:flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-icons text-4xl text-slate-300 mb-4">add_circle_outline</span>
                            <p className="text-slate-400 font-bold text-sm">Agregar otra</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
