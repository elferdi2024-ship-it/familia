"use client"

import * as React from "react"
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { MapPin, GraduationCap, Utensils, Trees, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.75rem',
}

// Montevideo Center as default
const defaultCenter = {
    lat: -34.9011,
    lng: -56.1645
}

interface Poi {
    id: string
    label: string
    category: "school" | "restaurant" | "park" | "shopping"
    lat: number
    lng: number
    description: string
}

import { getNearbyPlaces } from "@/actions/get-nearby-places"

const CATEGORY_COLORS = {
    school: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    restaurant: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    park: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    shopping: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
}

export function NeighborhoodMap({ location, coordinates }: { location: string, coordinates?: { lat: number, lng: number } }) {
    const { isLoaded, loadError } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" })

    const [map, setMap] = React.useState<google.maps.Map | null>(null)
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
    const [selectedPoi, setSelectedPoi] = React.useState<Poi | null>(null)
    const [pois, setPois] = React.useState<Poi[]>([])

    const center = coordinates || defaultCenter

    React.useEffect(() => {
        if (coordinates) {
            getNearbyPlaces(coordinates.lat, coordinates.lng).then(setPois)
        }
    }, [coordinates])

    const filteredPois = activeCategory
        ? pois.filter(poi => poi.category === activeCategory)
        : pois

    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])

    if (loadError) {
        return (
            <div className="aspect-[21/9] w-full rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Mapa temporalmente no disponible</h3>
                <p className="text-sm text-slate-500 max-w-xs">Hubo un problema cargando la API de Google Maps. Por favor, verifica la configuración de la clave API.</p>
            </div>
        )
    }

    if (!isLoaded) return <div className="aspect-[21/9] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Cargando mapa...</div>

    return (
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Explora el Barrio
                    </h3>
                    <p className="text-sm text-muted-foreground">Ubicación exacta y puntos de interés.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
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

            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        streetViewControl: true,
                        mapTypeControl: false,
                        fullscreenControl: true,
                    }}
                >
                    {/* Main Property Marker */}
                    <MarkerF
                        position={center}
                        title={location}
                    // animation={google.maps.Animation.DROP} // Removed to avoid typing issues if types not fully loaded
                    />

                    {/* POI Markers */}
                    {filteredPois.map((poi) => (
                        <MarkerF
                            key={poi.id}
                            position={{ lat: poi.lat, lng: poi.lng }}
                            title={poi.label}
                            icon={CATEGORY_COLORS[poi.category]}
                            onClick={() => setSelectedPoi(poi)}
                        />
                    ))}

                    {/* InfoWindow for Selected POI */}
                    {selectedPoi && (
                        <InfoWindowF
                            position={{ lat: selectedPoi.lat, lng: selectedPoi.lng }}
                            onCloseClick={() => setSelectedPoi(null)}
                        >
                            <div className="p-2 min-w-[150px]">
                                <h4 className="font-bold text-sm mb-1">{selectedPoi.label}</h4>
                                <p className="text-xs text-gray-600 mb-2">{selectedPoi.description}</p>
                                <Badge variant="outline" className="text-[10px] uppercase">
                                    {selectedPoi.category === 'restaurant' ? 'Gastronomía' : selectedPoi.category}
                                </Badge>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </div>
        </div>
    )
}
