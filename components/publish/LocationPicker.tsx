"use client"

import * as React from "react"
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api"
import { MapPin } from "lucide-react"

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
}

// Montevideo default center
const defaultCenter = {
    lat: -34.9011,
    lng: -56.1645
}

interface LocationPickerProps {
    center?: { lat: number; lng: number }
    onLocationChange: (location: { lat: number; lng: number }) => void
}

export function LocationPicker({ center, onLocationChange }: LocationPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    })

    const [map, setMap] = React.useState<google.maps.Map | null>(null)
    const [markerPosition, setMarkerPosition] = React.useState(center || defaultCenter)

    React.useEffect(() => {
        if (center) {
            setMarkerPosition(center)
            map?.panTo(center)
        }
    }, [center, map])

    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
        setMap(null)
    }, [])

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            setMarkerPosition(newPos)
            onLocationChange(newPos)
        }
    }

    const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            setMarkerPosition(newPos)
            onLocationChange(newPos)
        }
    }

    if (loadError) {
        return (
            <div className="w-full h-full min-h-[300px] rounded-lg bg-slate-50 border-2 border-dashed border-red-200 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Error al cargar el mapa</h3>
                <p className="text-sm text-slate-500 max-w-xs">Verifica tu conexión o la configuración de la API Key.</p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full min-h-[300px] rounded-lg bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
                <span className="flex items-center gap-2">
                    <MapPin className="animate-bounce" />
                    Cargando mapa...
                </span>
            </div>
        )
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center || defaultCenter}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            <MarkerF
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                animation={google.maps.Animation.DROP}
            />
        </GoogleMap>
    )
}
