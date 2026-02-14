"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore"
import Link from "next/link"
import { formatPrice, Property } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"

export default function MyPropertiesPage() {
    const { user, loading: authLoading } = useAuth()
    const [properties, setProperties] = useState<Property[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProperties = async () => {
        if (!user || !db) return

        try {
            const q = query(
                collection(db, "properties"),
                where("userId", "==", user.uid)
                // orderBy("publishedAt", "desc") // This needs an index in Firestore Console
            )

            const querySnapshot = await getDocs(q)
            const props = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Property))

            // Sort manually if index not yet ready
            props.sort((a, b) => {
                const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                return dateB - dateA;
            })

            setProperties(props)
        } catch (error) {
            console.error("Error fetching properties:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchProperties()
            } else {
                setLoading(false)
            }
        }
    }, [user, authLoading])

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return
        if (!db) return

        try {
            await deleteDoc(doc(db, "properties", id))
            setProperties(properties.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting property:", error)
        }
    }

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Cargando tus propiedades...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 flex flex-col items-center">
                <span className="material-icons text-6xl text-slate-300 mb-4">lock</span>
                <h1 className="text-2xl font-bold">Inicia sesión para ver tus propiedades</h1>
                <Link href="/" className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20">
                    Volver al Inicio
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Mis Propiedades</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona y monitorea tus avisos publicados.</p>
                    </div>
                    <Link href="/publish" className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <span className="material-icons">add</span> Publicar Nueva
                    </Link>
                </div>

                {properties.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons text-slate-400 text-4xl">inventory_2</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No tienes publicaciones activas</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Crea tu primer aviso y llega a miles de personas interesadas en el mercado inmobiliario uruguayo.</p>
                        <Link href="/publish" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                            Empezar ahora
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {properties.map(property => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={property.id}
                                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                                >
                                    {/* Status Ribbon */}
                                    <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest ${property.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {property.status === 'pending' ? 'En Revisión' : 'Activo'}
                                    </div>

                                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                                        <img className="w-full h-full object-cover" src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} alt={property.type} />
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-primary uppercase tracking-tight">{property.operation}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-xs font-medium text-slate-500">{property.type}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{property.address || property.neighborhood}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                    <span className="material-icons text-xs">location_on</span> {property.neighborhood}, {property.city}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                                                <div className="text-xl font-black text-primary">
                                                    {formatPrice(property.price, property.currency)}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                                    <span className="flex items-center gap-1.5"><span className="material-icons text-sm">bed</span> {property.bedrooms}</span>
                                                    <span className="flex items-center gap-1.5"><span className="material-icons text-sm">shower</span> {property.bathrooms}</span>
                                                    <span className="flex items-center gap-1.5"><span className="material-icons text-sm">square_foot</span> {property.area}m²</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                                        <Link
                                            href={`/publish?edit=${property.id}`}
                                            className="flex-1 md:w-full h-10 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons text-sm">edit</span> Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(property.id)}
                                            className="flex-1 md:w-full h-10 px-4 rounded-lg bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons text-sm">delete</span> Borrar
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
