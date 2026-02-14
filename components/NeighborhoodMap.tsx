"use client"

import * as React from "react"
import { MapPin, GraduationCap, Utensils, Trees, ShoppingBag, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Poi {
    id: string
    label: string
    category: "school" | "restaurant" | "park" | "shopping"
    x: number // Percentage 0-100
    y: number // Percentage 0-100
    description: string
}

const MOCK_POIS: Poi[] = [
    { id: "1", label: "British Schools", category: "school", x: 20, y: 30, description: "Colegio bilingüe de primer nivel international." },
    { id: "2", label: "Mercado del Inmigrante", category: "restaurant", x: 60, y: 50, description: "Paseo gastronómico con variedad de opciones." },
    { id: "3", label: "Parque Villa Biarritz", category: "park", x: 40, y: 70, description: "Gran espacio verde ideal para deportes y relax." },
    { id: "4", label: "Punta Carretas Shopping", category: "shopping", x: 80, y: 40, description: "El centro comercial más exclusivo de la zona." },
    { id: "5", label: "Restaurante La Perdiz", category: "restaurant", x: 55, y: 45, description: "Clásico restaurante de comida tradicional." },
]

const CATEGORY_ICONS = {
    school: <GraduationCap className="h-4 w-4" />,
    restaurant: <Utensils className="h-4 w-4" />,
    park: <Trees className="h-4 w-4" />,
    shopping: <ShoppingBag className="h-4 w-4" />,
}

const CATEGORY_COLORS = {
    school: "bg-blue-500",
    restaurant: "bg-orange-500",
    park: "bg-green-500",
    shopping: "bg-purple-500",
}

export function NeighborhoodMap({ location }: { location: string }) {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

    const filteredPois = activeCategory
        ? MOCK_POIS.filter(poi => poi.category === activeCategory)
        : MOCK_POIS

    return (
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Explora el Barrio
                    </h3>
                    <p className="text-sm text-muted-foreground">Puntos de interés cercanos a esta propiedad.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeCategory === null ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(null)}
                        className="text-xs h-8"
                    >
                        Todos
                    </Button>
                    <Button
                        variant={activeCategory === "school" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(activeCategory === "school" ? null : "school")}
                        className="text-xs h-8 gap-1"
                    >
                        <GraduationCap className="h-3 w-3" /> Colegios
                    </Button>
                    <Button
                        variant={activeCategory === "restaurant" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(activeCategory === "restaurant" ? null : "restaurant")}
                        className="text-xs h-8 gap-1"
                    >
                        <Utensils className="h-3 w-3" /> Gastronomía
                    </Button>
                </div>
            </div>

            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                {/* Map Placeholder */}
                <div
                    className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center grayscale transition-all hover:grayscale-0"
                />

                {/* Center Point (The Property) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white"></span>
                    </div>
                </div>

                {/* POIs */}
                <TooltipProvider delayDuration={0}>
                    {filteredPois.map((poi) => (
                        <Tooltip key={poi.id}>
                            <TooltipTrigger asChild>
                                <button
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110 z-10 ${CATEGORY_COLORS[poi.category]}`}
                                    style={{ top: `${poi.y}%`, left: `${poi.x}%` }}
                                >
                                    {CATEGORY_ICONS[poi.category]}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <div className="text-center">
                                    <p className="font-bold">{poi.label}</p>
                                    <p className="text-xs text-muted-foreground">{poi.description}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>

                {/* Overlay Labels for Context */}
                <div className="absolute bottom-2 right-2 rounded-md bg-white/80 px-2 py-1 text-xs font-bold text-slate-800 backdrop-blur-sm">
                    {location}
                </div>
            </div>
        </div>
    )
}
