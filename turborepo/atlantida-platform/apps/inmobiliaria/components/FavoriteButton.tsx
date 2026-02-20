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
            className={`flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${className.includes('w-') ? '' : 'w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                } ${className}`}
        >
            <span className={`material-icons transition-colors ${className.includes('text-xl') ? 'text-xl' : 'text-base'
                } ${active ? "text-red-500 drop-shadow-sm" : "text-slate-700 dark:text-slate-300 drop-shadow-none"}`}>
                {active ? "favorite" : "favorite_border"}
            </span>
        </button>
    )
}
