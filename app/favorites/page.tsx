"use client"

import Link from "next/link"
import { useFavorites } from "@/contexts/FavoritesContext"
import { FavoriteButton } from "@/components/FavoriteButton"
import { PROPERTIES, formatPrice, formatGastosComunes } from "@/lib/data"

export default function FavoritesPage() {
    const { favorites, clearFavorites } = useFavorites()

    const favoriteProperties = PROPERTIES.filter(p => favorites.includes(p.id))

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Mis Favoritos</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {favorites.length === 0 ? "No tenés propiedades guardadas" : `${favorites.length} propiedad${favorites.length !== 1 ? "es" : ""} guardada${favorites.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    {favorites.length > 0 && (
                        <button
                            onClick={clearFavorites}
                            className="text-sm text-slate-500 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                        >
                            <span className="material-icons text-sm">delete_outline</span>
                            Limpiar todo
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {favorites.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons text-5xl text-primary/30">favorite_border</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Todavía no guardaste propiedades</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                            Explorá las propiedades y tocá el ❤️ para guardar las que te interesen. Van a aparecer acá.
                        </p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-icons text-lg">search</span>
                            Explorar propiedades
                        </Link>
                    </div>
                )}

                {/* Favorites Grid */}
                {favoriteProperties.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {favoriteProperties.map(property => (
                            <Link
                                key={property.id}
                                href={`/property/${property.id}`}
                                className="group bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5"
                            >
                                <div className="relative h-48 lg:h-56">
                                    <img
                                        alt={property.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        src={property.images[0]}
                                    />
                                    {property.badge && (
                                        <div className="absolute top-4 left-4">
                                            <span className={`${property.badgeColor} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full`}>
                                                {property.badge}
                                            </span>
                                        </div>
                                    )}
                                    <FavoriteButton
                                        propertyId={property.id}
                                        className="absolute top-4 right-4"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="text-[22px] font-extrabold text-primary mb-1 tracking-tight">
                                        {formatPrice(property.price, property.currency)}
                                    </div>
                                    {property.gastosComunes !== null && (
                                        <div className="text-xs text-slate-400 font-medium mb-1">
                                            GC: {formatGastosComunes(property.gastosComunes)}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{property.title}</h3>
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        {property.bedrooms > 0 && (
                                            <span className="flex items-center gap-1"><span className="material-icons text-xs">bed</span> {property.bedrooms}</span>
                                        )}
                                        {property.bathrooms > 0 && (
                                            <span className="flex items-center gap-1"><span className="material-icons text-xs">shower</span> {property.bathrooms}</span>
                                        )}
                                        <span className="flex items-center gap-1"><span className="material-icons text-xs">square_foot</span> {property.area}m²</span>
                                    </div>
                                    {/* Uruguay-specific badges */}
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {property.viviendaPromovida && (
                                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                                Ley 18.795
                                            </span>
                                        )}
                                        {property.energyLabel && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${property.energyLabel <= "B" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                    : property.energyLabel <= "D" ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                }`}>
                                                Energía {property.energyLabel}
                                            </span>
                                        )}
                                        {property.acceptedGuarantees.length > 0 && (
                                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                                {property.acceptedGuarantees[0]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                                            <span className="material-icons text-xs">place</span> {property.neighborhood}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {property.pricePerM2 > 0 ? `USD ${property.pricePerM2}/m²` : ""}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
