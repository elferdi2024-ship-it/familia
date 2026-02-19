"use client"

import Link from "next/link"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function SavedSearchesPage() {
    const { searches, removeSearch, clearSearches } = useSavedSearches()

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-32 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4">Búsquedas Guardadas</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm md:text-base">
                            Recibe notificaciones cuando aparezcan nuevas propiedades que coincidan con tus criterios.
                        </p>
                    </div>

                    {searches.length > 0 && (
                        <button
                            onClick={clearSearches}
                            className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit"
                        >
                            <span className="material-icons text-lg">delete_sweep</span>
                            Borrar todas
                        </button>
                    )}
                </div>

                {searches.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-primary/5 p-12 md:p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons text-4xl text-primary">bookmark_border</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3">No tienes búsquedas guardadas</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Guarda tus búsquedas para acceder rápidamente a los filtros que más usas y estar al tanto de las novedades.
                        </p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <span className="material-icons text-lg">search</span>
                            Empezar a buscar
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {searches.map((search) => {
                            // Construct query string for the link
                            const params = new URLSearchParams()
                            if (search.operation) params.append("operation", search.operation)
                            if (search.query) params.append("q", search.query)
                            if (search.department) params.append("department", search.department)
                            if (search.city) params.append("city", search.city)
                            if (search.neighborhood) params.append("neighborhood", search.neighborhood)
                            if (search.priceMin) params.append("priceMin", search.priceMin)
                            if (search.priceMax) params.append("priceMax", search.priceMax)
                            if (search.bedrooms) params.append("bedrooms", search.bedrooms)
                            search.propertyTypes?.forEach(type => params.append("type", type))

                            const searchLink = `/search?${params.toString()}`

                            return (
                                <div
                                    key={search.id}
                                    className="group bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-primary/20 transition-all flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/5 p-2.5 rounded-xl">
                                            <span className="material-icons text-primary">notifications_active</span>
                                        </div>
                                        <button
                                            onClick={() => removeSearch(search.id)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                            title="Eliminar"
                                        >
                                            <span className="material-icons text-xl">delete_outline</span>
                                        </button>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
                                        {search.label}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {search.operation && <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{search.operation}</span>}
                                        {search.bedrooms && <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{search.bedrooms} Dorm.</span>}
                                        {search.priceMax && <span className="text-[10px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded">Hasta USD {parseInt(search.priceMax).toLocaleString()}</span>}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-xs text-slate-400">
                                            {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true, locale: es })}
                                        </span>
                                        <Link
                                            href={searchLink}
                                            className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all underline underline-offset-4"
                                        >
                                            Ver resultados
                                            <span className="material-icons text-sm">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
