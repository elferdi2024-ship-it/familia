"use client"

import Link from "next/link"
import { useComparison } from "@/contexts/ComparisonContext"
import { Copy, X, ArrowRight } from "lucide-react"

export function ComparisonFloatingBar() {
    const { selectedIds, clearCompare, removeFromCompare } = useComparison()

    if (selectedIds.length === 0) return null

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-lg">
            <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                        <Copy size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold">{selectedIds.length} {selectedIds.length === 1 ? 'Propiedad' : 'Propiedades'} para comparar</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Máximo 3 propiedades</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={clearCompare} className="text-white/60 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                    <Link
                        href="/comparar"
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                        Comparar <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
