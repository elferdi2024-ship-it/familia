import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Ruler, Heart } from "lucide-react"
import Link from "next/link"

interface PropertyCardProps {
    id: number | string
    title: string
    location: string
    price: number
    currency?: string
    bedrooms: number
    area: number
    imageUrl?: string
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
    type,
    featured
}: PropertyCardProps) {
    return (
        <div className="group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-all hover:shadow-md">
            <div className="relative aspect-video w-full bg-muted transition-transform group-hover:scale-105">
                {/* Image placeholder - would be a Next.js Image component in production */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant={type === "Venta" ? "default" : "secondary"} className="font-semibold">
                        {type}
                    </Badge>
                    {featured && <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">Destacado</Badge>}
                </div>
                <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/50 text-foreground hover:bg-background/80 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Apartamento</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {location}
                    </div>
                </div>

                <Link href={`/properties/${id}`} className="group-hover:underline">
                    <h3 className="line-clamp-1 text-lg font-bold">{title}</h3>
                </Link>

                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{bedrooms}</span> Dorm.
                    </div>
                    <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{area}</span> m²
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-xl font-bold text-primary">{currency} {price.toLocaleString()}</span>
                    <Button size="sm" variant="outline" asChild>
                        <Link href={`/properties/${id}`}>Ver Detalles</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
