"use client"

import { Suspense } from "react"
import { SearchContent } from "@/components/search/SearchContent"

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="bg-background-light dark:bg-background-dark font-display h-screen flex items-center justify-center pt-20">
                <div className="flex items-center gap-3 text-slate-500">
                    <span className="material-icons animate-spin">refresh</span>
                    <span className="font-medium">Cargando búsqueda...</span>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
}
