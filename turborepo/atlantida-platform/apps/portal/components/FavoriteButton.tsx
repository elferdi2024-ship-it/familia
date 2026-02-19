"use client"

import { useFavorites } from "@/contexts/FavoritesContext"

interface FavoriteButtonProps {
    propertyId: string
    className?: string
}

export function FavoriteButton({ propertyId, className = "" }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites()
    const active = isFavorite(propertyId)

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(propertyId)
            }}
            aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${active
                    ? "bg-red-500 text-white scale-110"
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500"
                } ${className}`}
        >
            <span className="material-icons text-sm">
                {active ? "favorite" : "favorite_border"}
            </span>
        </button>
    )
}
