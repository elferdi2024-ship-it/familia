"use client"

import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"

export function CompareBar() {
    const [isVisible, setIsVisible] = useState(false)

    // Simulate state for demo purposes - in real app this would use a context
    const [selectedCount, setSelectedCount] = useState(2)

    useEffect(() => {
        // Show bar after a short delay to simulate "user added items"
        const timer = setTimeout(() => setIsVisible(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 backdrop-blur-md shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            <img className="h-10 w-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070" alt="" />
                            <img className="h-10 w-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" alt="" />
                        </div>
                        <div>
                            <p className="font-semibold">{selectedCount} Propiedades seleccionadas</p>
                            <p className="text-xs text-muted-foreground">Comparar para decidir mejor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                            Limpiar
                        </Button>
                        <Button asChild className="rounded-full shadow-lg">
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
