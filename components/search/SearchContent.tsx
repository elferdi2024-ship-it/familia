"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import geoData from "@/data/uruguay-geo.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FavoriteButton } from "@/components/FavoriteButton"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { PropertyGridSkeleton } from "@/components/Skeletons"
import { useComparison } from "@/contexts/ComparisonContext"
import { searchClient } from "@/lib/algolia-client"
import { Property, formatPrice } from "@/lib/data"
import { getMarketIntelligence, MarketData } from "@/lib/analytics"
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { Search, Map as MapIcon, List, Filter, X, MapPin } from "lucide-react"

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
}

const defaultCenter = {
    lat: -34.9011,
    lng: -56.1645
}

interface SearchContentProps {
    initialOperation?: string
    initialNeighborhood?: string
    initialType?: string
    seoTitle?: string
    seoDescription?: string
}

export function SearchContent({
    initialOperation,
    initialNeighborhood,
    initialType,
    seoTitle,
    seoDescription
}: SearchContentProps) {
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [showMap, setShowMap] = useState(false)

    const [filters, setFilters] = useState({
        operation: initialOperation || searchParams.get('operation') || "Venta",
        propertyTypes: (initialType ? [initialType] : searchParams.get('type')?.split(',').filter(Boolean)) || [] as string[],
        query: searchParams.get('q') || "",
        priceMin: "",
        priceMax: "",
        bedrooms: "",
        department: initialNeighborhood ? "Montevideo" : "",
        city: initialNeighborhood ? "Montevideo" : "",
        neighborhood: initialNeighborhood || "",
        amenities: [] as string[]
    })

    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [marketStats, setMarketStats] = useState<Record<string, MarketData>>({})
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

    // Add loadError to destructuring to handle map API failures
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    })

    const performSearch = async () => {
        setIsLoading(true)
        try {
            const facetFilters: string[] = []
            if (filters.operation) facetFilters.push(`operation:${filters.operation}`)
            if (filters.department) facetFilters.push(`department:${filters.department}`)
            if (filters.city) facetFilters.push(`city:${filters.city}`)
            if (filters.neighborhood) facetFilters.push(`neighborhood:${filters.neighborhood}`)

            if (filters.propertyTypes.length > 0) {
                const typeFilters = filters.propertyTypes.map(t => `type:${t}`)
                facetFilters.push(`(${typeFilters.join(' OR ')})`)
            }

            if (filters.bedrooms) {
                const bed = filters.bedrooms === "Mono" ? 0 : filters.bedrooms === "3+" ? 3 : parseInt(filters.bedrooms)
                facetFilters.push(filters.bedrooms === "3+" ? `bedrooms >= ${bed}` : `bedrooms:${bed}`)
            }

            const numericFilters: string[] = []
            if (filters.priceMin) numericFilters.push(`price >= ${filters.priceMin}`)
            if (filters.priceMax) numericFilters.push(`price <= ${filters.priceMax}`)

            // Algolia Search Call
            const { results } = await searchClient.search({
                requests: [{
                    indexName: 'properties',
                    query: filters.query,
                    filters: facetFilters.join(' AND '),
                    numericFilters: numericFilters.join(' AND '),
                    hitsPerPage: 100
                }]
            })

            const hits = (results[0] as any).hits as any[]
            const formattedProperties = hits.map(hit => ({
                ...hit,
                id: hit.objectID,
                publishedAt: hit.publishedAt ? new Date(hit.publishedAt).toISOString() : new Date().toISOString()
            })) as Property[]

            setProperties(formattedProperties)

            // Fetch Market Intelligence for top results
            const statsToFetch = formattedProperties.slice(0, 10)
            const statsMap: Record<string, MarketData> = {}
            if (formattedProperties.length > 0) {
                await Promise.all(statsToFetch.map(async (p) => {
                    try {
                        const stats = await getMarketIntelligence(p)
                        if (stats) statsMap[p.id] = stats
                    } catch (e) { console.error(e) }
                }))
                setMarketStats(statsMap)
            }
        } catch (error) {
            console.error("Search Error:", error)
            setProperties([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        performSearch()
    }, [filters])

    const cities = useMemo(() => {
        if (!filters.department) return []
        const typedGeoData = geoData as Record<string, Record<string, string[]>>
        return Object.keys(typedGeoData[filters.department] || {})
    }, [filters.department])

    const neighborhoods = useMemo(() => {
        if (!filters.department || !filters.city) return []
        const typedGeoData = geoData as Record<string, Record<string, string[]>>
        return typedGeoData[filters.department]?.[filters.city] || []
    }, [filters.department, filters.city])

    const FilterContent = () => (
        <div className="space-y-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar barrio, título..."
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white"
                />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Rango de Precio (USD)</label>
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                        placeholder="Mín"
                    />
                    <input
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                        placeholder="Máx"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: "", neighborhood: "" }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                >
                    <option value="">Todo el País</option>
                    {Object.keys(geoData).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>

                <select
                    disabled={!filters.department}
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, neighborhood: "" }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary disabled:opacity-50 text-slate-900 dark:text-white"
                >
                    <option value="">Ciudad</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>

                <select
                    disabled={!filters.city}
                    value={filters.neighborhood}
                    onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary disabled:opacity-50 text-slate-900 dark:text-white"
                >
                    <option value="">Barrio</option>
                    {neighborhoods.map((nb: string) => <option key={nb} value={nb}>{nb}</option>)}
                </select>
            </div>

            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Dormitorios</label>
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    {["Mono", "1", "2", "3+"].map((num) => (
                        <button
                            key={num}
                            onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
                            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${filters.bedrooms === num ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-500"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 overflow-hidden h-[100dvh] flex flex-col pt-24 md:pt-28">
            <div className="flex flex-1 overflow-hidden relative">
                {/* Desktop Filter Sidebar */}
                <aside className="hidden lg:block w-[320px] xl:w-[380px] flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-black text-2xl tracking-tighter">Búsqueda</h2>
                        <button onClick={() => setFilters({ ...filters, query: "", priceMin: "", priceMax: "", bedrooms: "", department: "", city: "", neighborhood: "" })} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Limpiar</button>
                    </div>
                    <FilterContent />
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950 sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
                                {properties.length} Propiedades
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="lg:flex hidden items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-all active:scale-95"
                            >
                                {showMap ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                                {showMap ? 'Ver Lista' : 'Ver Mapa'}
                            </button>
                            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold">
                                <Filter className="w-4 h-4" />
                                Filtros
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Results Grid */}
                        <section className={`${showMap ? 'hidden lg:block lg:w-1/2' : 'w-full'} overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-slate-900/10 custom-scrollbar`}>
                            <div className={`grid grid-cols-1 ${!showMap ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
                                {isLoading ? (
                                    <PropertyGridSkeleton count={6} />
                                ) : properties.length === 0 ? (
                                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                                            No encontramos resultados
                                        </h3>
                                        <p className="text-slate-500 max-w-sm mx-auto font-medium mb-8">
                                            Probá ajustando los filtros o buscando términos más generales.
                                        </p>
                                        <Button
                                            onClick={() => setFilters({ ...filters, query: "", priceMin: "", priceMax: "", bedrooms: "", department: "", city: "", neighborhood: "" })}
                                            className="bg-primary text-white font-bold rounded-full px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Limpiar todos los filtros
                                        </Button>
                                    </div>
                                ) : (
                                    properties.map(p => (
                                        <Link key={p.id} href={`/property/${p.id}`} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                                            <div className="aspect-[4/3] relative overflow-hidden">
                                                <Image fill src={p.images[0] || '/placeholder.jpg'} alt={p.title || 'Propiedad'} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute top-4 left-4">
                                                    {p.badge && <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase shadow-xl">{p.badge}</span>}
                                                </div>
                                                <div className="absolute bottom-4 right-4 h-10 w-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                                    <FavoriteButton propertyId={p.id} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{formatPrice(p.price, p.currency)}</h3>
                                                    {marketStats[p.id] && (
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${marketStats[p.id].differencePercentage < -5 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                            {marketStats[p.id].status === 'Very Competitive' || marketStats[p.id].status === 'Competitive' ? 'Oportunidad' : 'Precio Mercado'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 truncate mb-1">{p.title}</p>
                                                <p className="text-xs text-slate-400 mb-6">{p.neighborhood}, {p.city}</p>
                                                <div className="flex gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest border-t pt-5 border-slate-50 dark:border-slate-800">
                                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{p.bedrooms || 0} Dorm.</span>
                                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{p.area || 0}m²</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Map View */}
                        <section className={`${showMap ? 'block' : 'hidden'} lg:block lg:w-1/2 w-full relative h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700`}>
                            {loadError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                                        <MapPin className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Mapa no disponible</h3>
                                    <p className="text-sm text-slate-500 max-w-xs">Hubo un problema al cargar el mapa. Verificá tu conexión o la configuración de API.</p>
                                    <p className="text-xs font-mono mt-4 text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">{loadError.message}</p>
                                </div>
                            ) : isLoaded ? (
                                <GoogleMap mapContainerStyle={mapContainerStyle} center={properties[0]?.geolocation || defaultCenter} zoom={13} onClick={() => setSelectedProperty(null)}>
                                    {properties.map(p => p.geolocation && (
                                        <MarkerF
                                            key={p.id}
                                            position={p.geolocation}
                                            onClick={() => setSelectedProperty(p)}
                                            label={{
                                                text: `${formatPrice(p.price, p.currency)}`,
                                                className: "bg-slate-900 text-white px-3 py-1.5 rounded-full font-black text-[10px] shadow-2xl border-2 border-white"
                                            }}
                                            icon={{ path: 0, scale: 0 }}
                                        />
                                    ))}

                                    {selectedProperty && selectedProperty.geolocation && (
                                        <InfoWindowF
                                            position={selectedProperty.geolocation}
                                            onCloseClick={() => setSelectedProperty(null)}
                                            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                                        >
                                            <div className="w-[260px] p-0 font-sans overflow-hidden">
                                                <div className="relative h-32 w-full bg-slate-100 rounded-t-xl overflow-hidden group">
                                                    <Image
                                                        src={selectedProperty.images[0] || '/placeholder.jpg'}
                                                        alt={selectedProperty.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-1.5 hover:bg-white/40 transition-colors">
                                                            <FavoriteButton propertyId={selectedProperty.id} className="text-white w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-b-xl shadow-sm">
                                                    <h3 className="font-black text-lg text-slate-900 mb-1 tracking-tight">
                                                        {formatPrice(selectedProperty.price, selectedProperty.currency)}
                                                    </h3>
                                                    <p className="text-xs font-bold text-slate-700 truncate mb-1">{selectedProperty.title}</p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-3 font-medium">
                                                        <MapPin className="w-3 h-3" />
                                                        {selectedProperty.neighborhood}, {selectedProperty.city}
                                                    </p>

                                                    <Link
                                                        href={`/property/${selectedProperty.id}`}
                                                        className="block w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg text-center hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                                                    >
                                                        Ver Propiedad
                                                    </Link>
                                                </div>
                                            </div>
                                        </InfoWindowF>
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 animate-pulse">
                                    <span className="text-slate-400 font-medium text-sm flex items-center gap-2">
                                        <MapIcon className="w-4 h-4 animate-bounce" />
                                        Cargando mapa...
                                    </span>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
                <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 animate-in slide-in-from-bottom duration-500 flex flex-col p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-black tracking-tighter">Filtros</h2>
                        <button onClick={() => setShowFilters(false)} className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <FilterContent />
                    </div>
                    <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 mt-8"
                    >
                        Ver Propiedades
                    </button>
                </div>
            )}
        </div>
    )
}
