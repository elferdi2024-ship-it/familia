"use client"

import * as React from "react"
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api"
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

const MAP_LIBRARIES: ("marker" | "places")[] = ['marker', 'places']

interface LocationPickerProps {
    center?: { lat: number; lng: number }
    onLocationChange: (location: { lat: number; lng: number }) => void
    onAddressFound?: (addressData: { address: string, department: string, city: string, neighborhood: string }) => void
}

export function LocationPicker({ center, onLocationChange, onAddressFound }: LocationPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: MAP_LIBRARIES
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

    const geocodeLocation = React.useCallback((lat: number, lng: number) => {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0] && onAddressFound) {
                const address = results[0].formatted_address;
                let department = "";
                let city = "";
                let neighborhood = "";

                results[0].address_components.forEach(component => {
                    if (component.types.includes("administrative_area_level_1")) {
                        department = component.long_name;
                    }
                    if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
                        city = component.long_name;
                    }
                    if (component.types.includes("sublocality") || component.types.includes("neighborhood")) {
                        neighborhood = component.long_name;
                    }
                });

                onAddressFound({ address, department, city, neighborhood });
            }
        });
    }, [onAddressFound]);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            setMarkerPosition(newPos)
            onLocationChange(newPos)
            geocodeLocation(newPos.lat, newPos.lng)
        }
    }

    const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            setMarkerPosition(newPos)
            onLocationChange(newPos)
            geocodeLocation(newPos.lat, newPos.lng)
        }
    }

    React.useEffect(() => {
        if (!map || !isLoaded) return

        // Create the Advanced Marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: markerPosition,
            gmpDraggable: true,
            title: "Ubicación seleccionada"
        })

        // Handle Drag End
        const listener = marker.addListener("dragend", () => {
            // AdvancedMarkerElement updates position automatically
            const pos = marker.position
            if (pos) {
                // Handle both LatLng object and LatLngLiteral safely
                const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat
                const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng

                // Ensure we have numbers
                if (typeof lat === 'number' && typeof lng === 'number') {
                    const newPos = { lat, lng }
                    setMarkerPosition(newPos)
                    onLocationChange(newPos)
                    geocodeLocation(newPos.lat, newPos.lng)
                }
            }
        })

        return () => {
            marker.map = null
            google.maps.event.removeListener(listener)
        }
    }, [map, markerPosition, isLoaded])

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
                mapId: "DEMO_MAP_ID", // Required for AdvancedMarkerElement
            }}
        >
            {/* Marker is managed by useEffect now */}
        </GoogleMap>
    )
}
