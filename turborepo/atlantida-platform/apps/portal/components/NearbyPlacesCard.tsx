"use client"

import {
    MapPin,
    GraduationCap,
    Utensils,
    Trees,
    ShoppingBag,
    Heart,
    Bus,
    Pill,
} from "lucide-react"
import { Poi } from "@repo/types"
import { formatDistance } from "../lib/formatDistance"
import { motion } from "framer-motion"

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    school: GraduationCap,
    restaurant: Utensils,
    park: Trees,
    shopping: ShoppingBag,
    pharmacy: Pill,
    health: Heart,
    transit: Bus,
}

const CATEGORY_BG: Record<string, string> = {
    school: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    restaurant: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    park: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    shopping: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    pharmacy: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    health: "bg-red-500/10 text-red-700 dark:text-red-400",
    transit: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
}

interface NearbyPlacesCardProps {
    places: Poi[]
    /** Si no hay coordenadas, places puede estar vacío */
    hasCoordinates: boolean
}

export function NearbyPlacesCard({ places, hasCoordinates }: NearbyPlacesCardProps) {
    const hasPlaces = places.length > 0

    if (!hasCoordinates) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-6 sm:p-8 shadow-lg"
            >
                <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-sm">
                        <MapPin className="h-3 w-3" />
                        Lo que nos diferencia
                    </span>
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl pr-32">
                        En el barrio
                    </h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Esta propiedad no tiene ubicación en el mapa. Al publicar o editar, agregá coordenadas para ver colegios, parques, comercios y más cerca.
                    </p>
                </div>
                {process.env.NODE_ENV === "development" && (
                    <p className="mt-4 pt-3 border-t border-slate-200/50 text-[10px] text-slate-400 font-mono">
                        Verificación: Coordenadas: no
                    </p>
                )}
            </motion.div>
        )
    }

    // Agrupar por categoría y quedarnos con los más cercanos por grupo para la tarjeta
    const byCategory = places.reduce<Record<string, Poi[]>>((acc, poi) => {
        const key = poi.categoryLabel
        if (!acc[key]) acc[key] = []
        if (acc[key].length < 2) acc[key].push(poi)
        return acc
    }, {})

    const categoriesOrder = [
        "Colegios",
        "Parques",
        "Gastronomía",
        "Comercios",
        "Farmacias",
        "Salud",
        "Transporte",
    ]
    const sortedCategories = hasPlaces ? categoriesOrder.filter((c) => byCategory[c]?.length) : []

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-6 sm:p-8 shadow-lg"
        >
            {/* Badge diferencial */}
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-sm">
                    <MapPin className="h-3 w-3" />
                    Lo que nos diferencia
                </span>
            </div>

            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        En el barrio
                    </h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Servicios y puntos de interés reales cerca de esta propiedad.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {!hasPlaces && (
                        <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-8 text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                                No pudimos cargar puntos de interés para esta ubicación. Revisa que la API de Google Maps esté configurada (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>).
                            </p>
                        </div>
                    )}
                    {sortedCategories.map((categoryLabel) => {
                        const items = byCategory[categoryLabel] ?? []
                        const first = items[0]
                        if (!first) return null
                        const Icon = CATEGORY_ICONS[first.category] ?? MapPin
                        const bgClass = CATEGORY_BG[first.category] ?? "bg-slate-500/10 text-slate-700 dark:text-slate-400"

                        return (
                            <div
                                key={categoryLabel}
                                className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${bgClass}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        {categoryLabel}
                                    </span>
                                </div>
                                <ul className="space-y-1.5">
                                    {items.map((poi) => (
                                        <li
                                            key={poi.id}
                                            className="flex items-baseline justify-between gap-2 text-sm"
                                        >
                                            <span className="font-medium text-slate-900 dark:text-white truncate">
                                                {poi.label}
                                            </span>
                                            <span className="shrink-0 text-xs font-bold text-primary">
                                                {formatDistance(poi.distanceMeters)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
            {process.env.NODE_ENV === "development" && (
                <p className="mt-4 pt-3 border-t border-slate-200/50 text-[10px] text-slate-400 font-mono">
                    Verificación: Coordenadas: sí · Puntos de interés: {places.length}
                </p>
            )}
        </motion.div>
    )
}
