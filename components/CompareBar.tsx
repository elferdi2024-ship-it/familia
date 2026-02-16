"use client"

import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useComparison } from "@/contexts/ComparisonContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, documentId } from "firebase/firestore"
import Image from "next/image"

export function CompareBar() {
    const { selectedIds, clearCompare } = useComparison()
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProperties = async () => {
            if (selectedIds.length === 0) {
                setProperties([])
                return
            }

            setLoading(true)
            try {
                const q = query(
                    collection(db, "properties"),
                    where(documentId(), "in", selectedIds)
                )
                const querySnapshot = await getDocs(q)
                const fetchedProperties = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                // Maintain the order of selectedIds
                const orderedProperties = selectedIds.map(id =>
                    fetchedProperties.find(p => p.id === id)
                ).filter(Boolean)

                setProperties(orderedProperties)
            } catch (error) {
                console.error("Error fetching comparison properties:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperties()
    }, [selectedIds])

    if (selectedIds.length === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-[80px] md:bottom-0 left-0 right-0 z-[60] border-t bg-white/95 dark:bg-slate-900/95 p-3 md:p-4 backdrop-blur-md shadow-[0_-4px_10px_rgba(0,0,0,0.1)] transition-colors"
            >
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="flex -space-x-3 shrink-0">
                            {properties.map((prop, i) => (
                                <div key={prop.id} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden relative shadow-sm">
                                    <Image
                                        fill
                                        src={prop.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"}
                                        alt={prop.title}
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                            {[...Array(Math.max(0, selectedIds.length - properties.length))].map((_, i) => (
                                <div key={i} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            ))}
                        </div>
                        <div className="hidden sm:block truncate">
                            <p className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                                {selectedIds.length} {selectedIds.length === 1 ? 'Propiedad seleccionada' : 'Propiedades seleccionadas'}
                            </p>
                            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">Compará para decidir mejor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCompare}
                            className="text-slate-500 hover:text-red-500 text-xs font-bold"
                        >
                            Limpiar
                        </Button>
                        <Button asChild className="rounded-full shadow-lg h-9 md:h-11 px-4 md:px-6 font-bold bg-primary hover:bg-primary/90 text-white">
                            <Link href="/compare">
                                Comparar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
