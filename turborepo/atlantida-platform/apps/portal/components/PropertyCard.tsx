import Image from "next/image"
import { Button, ThumbnailCarousel } from "@repo/ui"
import { Badge } from "@repo/ui"
import { MapPin, Bed, Ruler, Heart, Camera, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useComparison } from "@/contexts/ComparisonContext"
import { Copy } from "lucide-react"

interface PropertyCardProps {
    id: number | string
    title: string
    location: string
    price: number
    currency?: string
    bedrooms: number
    area: number
    imageUrl?: string
    images?: string[]
    type: "Venta" | "Alquiler"
    featured?: boolean
}

export function PropertyCard({
    id,
    title,
    location,
    price,
    currency = "U$S",
    bedrooms,
    area,
    imageUrl,
    images,
    type,
    featured
}: PropertyCardProps) {
    const [imageLoading, setImageLoading] = useState(true)
    const { isFavorite, toggleFavorite } = useFavorites()
    const { isInCompare, addToCompare, removeFromCompare } = useComparison()

    // Dynamic badges logic
    const isNew = Number(id) % 2 === 0; // Random logic for demo
    const isOpportunity = price < 150000 && type === "Venta";

    const favorited = isFavorite(String(id))
    const comparing = isInCompare(String(id))

    // Fallback/Mock for multi-images to demonstrate the carousel if the API only sends one
    const allImages = images?.length ? images : imageUrl ? [
        imageUrl,
        `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop`
    ] : []

    return (
        <div className="group overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                {allImages.length > 0 ? (
                    <div className="absolute inset-0 w-full h-full">
                        <ThumbnailCarousel images={allImages} altText={title} />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    <Badge className="bg-primary/90 backdrop-blur-md border-none font-bold uppercase tracking-wider text-[10px]">
                        {type}
                    </Badge>
                    {isNew && <Badge className="bg-emerald-500/90 backdrop-blur-md border-none font-bold uppercase tracking-wider text-[10px]">Nuevo</Badge>}
                    {isOpportunity && <Badge className="bg-orange-500/90 backdrop-blur-md border-none font-bold uppercase tracking-wider text-[10px]">Oportunidad</Badge>}
                    {featured && <Badge className="bg-amber-500/90 backdrop-blur-md border-none font-bold uppercase tracking-wider text-[10px]">Destacado</Badge>}
                </div>

                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => comparing ? removeFromCompare(String(id)) : addToCompare(String(id))}
                        aria-label={comparing ? "Quitar de comparación" : "Agregar a comparación"}
                        className={`h-9 w-9 rounded-full backdrop-blur-md transition-all ${comparing ? 'bg-primary text-white' : 'bg-black/20 text-white hover:bg-white hover:text-primary'}`}
                    >
                        <Copy className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleFavorite(String(id))}
                        aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                        className={`h-9 w-9 rounded-full backdrop-blur-md transition-all ${favorited ? 'bg-white text-red-500' : 'bg-black/20 text-white hover:bg-white hover:text-red-500'}`}
                    >
                        <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} aria-hidden="true" />
                    </Button>
                </div>
            </div>

            <div className="p-4 md:p-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Apartamento</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <MapPin className="h-3 w-3 text-primary/60" /> {location}
                    </div>
                </div>

                <Link href={`/property/${id}`}>
                    <h3 className="line-clamp-1 text-base font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
                </Link>

                <div className="mt-3 flex items-center gap-4 text-[12px] font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-slate-400" />
                        <span>{bedrooms} Dorm.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Ruler className="h-4 w-4 text-slate-400" />
                        <span>{area} m²</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Precio Total</span>
                        <span className="text-2xl font-black text-primary tracking-tight">
                            {currency} {price.toLocaleString()}
                        </span>
                    </div>
                    <Link href={`/property/${id}`} className="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2">
                        Ver <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
