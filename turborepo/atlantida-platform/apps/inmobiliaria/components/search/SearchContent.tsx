"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import geoData from "@/data/uruguay-geo.json"
import { Badge, Button, ThumbnailCarousel } from "@repo/ui"
import { FavoriteButton } from "@/components/FavoriteButton"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { PropertyGridSkeleton } from "@/components/Skeletons"
import { useComparison } from "@/contexts/ComparisonContext"
import { searchClient, PROPERTIES_INDEX } from "@repo/lib/algolia"
import { motion, AnimatePresence } from "framer-motion"
import { Property, formatPrice, PROPERTIES, AMENITIES } from "@/lib/data"
import { getMarketIntelligence, MarketData } from "@/lib/analytics"
import { GoogleMap, useJsApiLoader, OverlayView, InfoWindowF } from "@react-google-maps/api"
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
    tags?: string[]
}

const MAP_LIBRARIES: ("marker" | "places")[] = ['marker']

export function SearchContent({
    initialOperation,
    initialNeighborhood,
    initialType,
    seoTitle,
    seoDescription
}: SearchContentProps) {
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(searchParams.get('filters') === 'open')
    const [showMap, setShowMap] = useState(false)

    const [filters, setFilters] = useState({
        operation: initialOperation || searchParams.get('operation') || "Alquiler",
        propertyTypes: (initialType ? [initialType] : searchParams.get('type')?.split(',').filter(Boolean)) || [] as string[],
        query: searchParams.get('q') || "",
        priceMin: "",
        priceMax: "",
        bedrooms: "",
        bathrooms: "",
        department: initialNeighborhood ? "Montevideo" : searchParams.get('department') || "",
        city: initialNeighborhood ? "Montevideo" : searchParams.get('city') || "",
        neighborhood: initialNeighborhood || searchParams.get('neighborhood') || "",
        tags: searchParams.get('tags') ? searchParams.get('tags')?.split(',') || [] : [] as string[]
    })

    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [marketStats, setMarketStats] = useState<Record<string, MarketData>>({})
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

    // Add loadError to destructuring to handle map API failures
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: MAP_LIBRARIES
    })

    const performSearch = async () => {
        setIsLoading(true)
        try {
            let results: Property[] = []

            if (searchClient) {
                const rawOp = filters.operation?.toLowerCase() || "alquiler"
                const searchOp = rawOp === "comprar" || rawOp === "venta" ? "Venta" : "Alquiler"
                const facetFilters: string[] = [`operation:${searchOp}`]
                if (filters.propertyTypes.length > 0) {
                    facetFilters.push(...filters.propertyTypes.map(t => `type:${t}`))
                }
                if (filters.neighborhood) facetFilters.push(`neighborhood:${filters.neighborhood}`)
                if (filters.department) facetFilters.push(`department:${filters.department}`)
                if (filters.city) facetFilters.push(`city:${filters.city}`)

                const numericFilters: string[] = []
                if (filters.priceMin) numericFilters.push(`price >= ${parseInt(filters.priceMin)}`)
                if (filters.priceMax) numericFilters.push(`price <= ${parseInt(filters.priceMax)}`)
                if (filters.bedrooms) {
                    if (filters.bedrooms === "Mono") numericFilters.push("bedrooms = 0")
                    else if (filters.bedrooms === "3+") numericFilters.push("bedrooms >= 3")
                    else numericFilters.push(`bedrooms = ${parseInt(filters.bedrooms)}`)
                }
                if (filters.bathrooms) {
                    if (filters.bathrooms === "4+") numericFilters.push("bathrooms >= 4")
                    else numericFilters.push(`bathrooms = ${parseInt(filters.bathrooms)}`)
                }

                const res = await searchClient.searchSingleIndex({
                    indexName: PROPERTIES_INDEX,
                    searchParams: {
                        query: filters.query || "",
                        facetFilters: facetFilters.length ? facetFilters : undefined,
                        numericFilters: numericFilters.length ? numericFilters : undefined,
                        hitsPerPage: 100
                    }
                })
                const hits = (res.hits || []) as Array<Record<string, unknown> & {
                    objectID: string;
                    _geoloc?: { lat: number; lng: number };
                    geolocation?: { lat: number; lng: number };
                    title: string;
                    description: string;
                    type: Property["type"];
                    operation: Property["operation"];
                    price: number;
                    currency: "USD" | "UYU";
                    bedrooms: number;
                    bathrooms: number;
                    area: number;
                    garages: number;
                    department: string;
                    city: string;
                    neighborhood: string;
                    images: string[];
                    amenities: string[];
                    viviendaPromovida: boolean;
                    featured?: boolean;
                    views?: number;
                    publishedAt?: string;
                    updatedAt?: string;
                    gastosComunes?: number;
                    slug?: string;
                }>
                results = hits.map(hit => {
                    const rawGeo = hit.geolocation || hit._geoloc;
                    const isValidGeo = typeof (rawGeo as any)?.lat === 'number' && typeof (rawGeo as any)?.lng === 'number';
                    const finalGeo = isValidGeo ? { lat: (rawGeo as any).lat, lng: (rawGeo as any).lng } : defaultCenter;

                    return {
                        ...hit,
                        id: hit.objectID,
                        slug: (hit.slug as string) || hit.objectID,
                        title: hit.title || "",
                        description: hit.description || "",
                        type: hit.type || "Apartamento",
                        operation: hit.operation || "Alquiler",
                        price: hit.price || 0,
                        currency: hit.currency || "USD",
                        bedrooms: Number(hit.bedrooms) || 0,
                        bathrooms: Number(hit.bathrooms) || 0,
                        area: Number(hit.area) || 0,
                        garages: Number(hit.garages) || 0,
                        gastosComunes: hit.gastosComunes !== undefined ? Number(hit.gastosComunes) : null,
                        department: hit.department || "",
                        city: hit.city || "",
                        neighborhood: hit.neighborhood || "",
                        geolocation: finalGeo,
                        latitude: finalGeo.lat,
                        longitude: finalGeo.lng,
                        pricePerM2: typeof hit.price === "number" && typeof hit.area === "number" && hit.area > 0 ? hit.price / hit.area : 0,
                        viviendaPromovida: !!hit.viviendaPromovida,
                        acceptedGuarantees: (hit.acceptedGuarantees as any[]) || [],
                        utilityStatus: (hit.utilityStatus as Property["utilityStatus"]) || { saneamiento: "conectado", gas: "cañería", agua: "OSE", electricidad: "UTE" },
                        energyLabel: (hit.energyLabel as Property["energyLabel"]) || null,
                        amenities: (hit.amenities as string[]) || [],
                        images: (hit.images as string[]) || [],
                        featured: !!hit.featured,
                        views: Number(hit.views) || 0,
                        publishedAt: typeof hit.publishedAt === 'string' ? hit.publishedAt : new Date().toISOString(),
                        updatedAt: typeof hit.updatedAt === 'string' ? hit.updatedAt : new Date().toISOString(),
                    } as unknown as Property
                })
            } else {
                results = [...PROPERTIES]
                if (filters.query) {
                    const q = filters.query.toLowerCase()
                    results = results.filter(p =>
                        p.title.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.neighborhood.toLowerCase().includes(q)
                    )
                }
                if (filters.operation) {
                    const searchOp = filters.operation === "Comprar" ? "venta" : filters.operation.toLowerCase()
                    results = results.filter(p => p.operation.toLowerCase() === searchOp)
                }
                if (filters.propertyTypes.length > 0) {
                    results = results.filter(p => filters.propertyTypes.includes(p.type))
                }
                if (filters.tags && filters.tags.length > 0) {
                    results = results.filter(p =>
                        filters.tags.every(tag => p.amenities?.includes(tag) || p.badge === tag)
                    )
                }
                if (filters.priceMin) results = results.filter(p => p.price >= parseInt(filters.priceMin))
                if (filters.priceMax) results = results.filter(p => p.price <= parseInt(filters.priceMax))
                if (filters.bedrooms) {
                    const bed = filters.bedrooms === "Mono" ? 0 : parseInt(filters.bedrooms)
                    if (filters.bedrooms === "3+") results = results.filter(p => p.bedrooms >= 3)
                    else results = results.filter(p => p.bedrooms === bed)
                }
                if (filters.bathrooms) {
                    const bath = parseInt(filters.bathrooms)
                    if (filters.bathrooms === "4+") results = results.filter(p => p.bathrooms >= 4)
                    else results = results.filter(p => p.bathrooms === bath)
                }
                if (filters.department) results = results.filter(p => p.department === filters.department)
                if (filters.city) results = results.filter(p => p.city === filters.city)
                if (filters.neighborhood) results = results.filter(p => p.neighborhood === filters.neighborhood)
            }

            setProperties(results)

            const statsMap: Record<string, MarketData> = {}
            results.forEach(p => {
                statsMap[p.id] = {
                    averagePricePerM2: p.pricePerM2 * 1.1,
                    propertyPricePerM2: p.pricePerM2,
                    differencePercentage: -5,
                    status: 'Competitive',
                    totalPropertiesInNeighborhood: 15
                }
            })
            setMarketStats(statsMap)

        } catch (error) {
            console.error("Search Error:", error)
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

    const filterContentJsx = (
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
                <label className="text-[11px] font-semibold text-slate-500 mb-4 block">
                    Rango de Precio ({filters.operation === 'Alquiler' ? '$U' : 'USD'})
                </label>
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                        placeholder="Mín"
                    />
                    <input
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="w-1/2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                        placeholder="Máx"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-3 block">Tipo de Operación</label>
                    <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 gap-1">
                        {["Alquiler", "Comprar"].map((op) => (
                            <button
                                key={op}
                                onClick={() => setFilters(prev => ({ ...prev, operation: op }))}
                                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${filters.operation === op ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-500"}`}
                            >
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <select
                        value={filters.department}
                        onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: "", neighborhood: "" }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                    >
                        <option value="">Todo el País</option>
                        {Object.keys(geoData).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>

                    <select
                        disabled={!filters.department}
                        value={filters.city}
                        onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, neighborhood: "" }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary disabled:opacity-50 text-slate-900 dark:text-white"
                    >
                        <option value="">Ciudad</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>

                    <select
                        disabled={!filters.city}
                        value={filters.neighborhood}
                        onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary disabled:opacity-50 text-slate-900 dark:text-white"
                    >
                        <option value="">Barrio</option>
                        {neighborhoods.map((nb: string) => <option key={nb} value={nb}>{nb}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-4 block">Dormitorios</label>
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    {["Mono", "1", "2", "3+"].map((num) => (
                        <button
                            key={num}
                            onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${filters.bedrooms === num ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-500"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-4 block">Baños</label>
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 gap-1">
                    {["1", "2", "3", "4+"].map((num) => (
                        <button
                            key={num}
                            onClick={() => setFilters(prev => ({ ...prev, bathrooms: num }))}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${filters.bathrooms === num ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-500"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-4 block">Características (Etiquetas)</label>
                <div className="flex flex-wrap gap-2">
                    {AMENITIES.slice(0, 15).map((amenity) => {
                        const isSelected = filters.tags.includes(amenity);
                        return (
                            <button
                                key={amenity}
                                onClick={() => {
                                    setFilters(prev => {
                                        if (isSelected) {
                                            return { ...prev, tags: prev.tags.filter(t => t !== amenity) }
                                        } else {
                                            return { ...prev, tags: [...prev.tags, amenity] }
                                        }
                                    })
                                }}
                                className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all border outline-none ${isSelected
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                    }`}
                            >
                                {amenity}
                            </button>
                        )
                    })}
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
                        <h2 className="font-semibold text-2xl tracking-tight">Búsqueda</h2>
                        <button onClick={() => setFilters({ ...filters, query: "", priceMin: "", priceMax: "", bedrooms: "", bathrooms: "", department: "", city: "", neighborhood: "", tags: [] })} className="text-[11px] font-semibold text-primary hover:underline">Limpiar</button>
                    </div>
                    {filterContentJsx}
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-4 md:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-950 sticky top-0 z-30">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold rounded-md animate-pulse whitespace-nowrap">
                                {properties.length} Propiedades
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowMap(!showMap)}
                                className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 md:px-5 py-2 rounded-lg text-[10px] md:text-xs font-semibold hover:scale-[1.02] transition-all active:scale-95"
                            >
                                {showMap ? <List className="w-3 h-3 md:w-4 md:h-4" /> : <MapIcon className="w-3 h-3 md:w-4 md:h-4" />}
                                <span className="whitespace-nowrap">{showMap ? 'Ver Lista' : 'Ver Mapa'}</span>
                            </button>
                            <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-[10px] font-semibold">
                                <Filter className="w-3 h-3" />
                                Filtros
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Results Grid */}
                        <section className={`${showMap ? 'hidden lg:block lg:w-1/2' : 'w-full'} overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8 bg-slate-50/30 dark:bg-slate-900/10 custom-scrollbar`}>
                            <div className={`grid grid-cols-1 ${!showMap ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-6`}>
                                {isLoading ? (
                                    <PropertyGridSkeleton count={6} />
                                ) : properties.length === 0 ? (
                                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
                                            No encontramos resultados
                                        </h3>
                                        <p className="text-slate-500 max-w-sm mx-auto font-medium mb-8">
                                            Probá ajustando los filtros o buscando términos más generales.
                                        </p>
                                        <Button
                                            onClick={() => setFilters({ ...filters, query: "", priceMin: "", priceMax: "", bedrooms: "", department: "", city: "", neighborhood: "", tags: [] })}
                                            className="bg-primary text-white font-semibold rounded-lg px-8 py-6 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Limpiar todos los filtros
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {properties.map(p => (
                                            <motion.div
                                                layout
                                                key={p.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                                            >
                                                <Link href={`/property/${p.id}`} className="group block h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                                                    <div className="aspect-[4/3] relative overflow-hidden">
                                                        <ThumbnailCarousel images={p.images && p.images.length > 0 ? p.images : ['/placeholder.jpg']} altText={p.title || 'Propiedad'} />
                                                        <div className="absolute top-4 left-4 z-20 pointer-events-none">
                                                            {p.badge && <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-semibold text-slate-900 shadow-xl">{p.badge}</span>}
                                                        </div>
                                                        <div className="absolute bottom-4 right-4 h-10 w-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 z-20 transition-colors">
                                                            <FavoriteButton propertyId={p.id} className="text-white w-5 h-5" />
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatPrice(p.price, p.currency)}</h3>
                                                            {marketStats[p.id] && (
                                                                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${marketStats[p.id].differencePercentage < -5 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                                    {marketStats[p.id].status === 'Very Competitive' || marketStats[p.id].status === 'Competitive' ? 'Oportunidad' : 'Precio Mercado'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 truncate mb-1">{p.title}</p>
                                                        <p className="text-xs text-slate-400 mb-6">{p.neighborhood}, {p.city}</p>
                                                        <div className="flex gap-4 text-slate-500 text-[11px] font-semibold border-t pt-5 border-slate-50 dark:border-slate-800">
                                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{p.bedrooms || 0} Dorm.</span>
                                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>{p.area || 0}m²</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </section>

                        {/* Map View */}
                        <section className={`${showMap ? 'fixed inset-0 top-24 z-40 lg:relative lg:inset-auto lg:top-0 lg:block lg:w-1/2' : 'hidden'} w-full h-full bg-slate-100 dark:bg-slate-900`}>
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
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={properties[0]?.geolocation || defaultCenter}
                                    zoom={13}
                                    onClick={() => setSelectedProperty(null)}
                                    options={{
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        mapTypeControl: false,
                                        streetViewControl: false,
                                        styles: [
                                            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] },
                                            { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] },
                                            { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                                            { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] },
                                            { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] },
                                            { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] },
                                            { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] },
                                            { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] },
                                            { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] },
                                            { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] },
                                            { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] },
                                            { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] },
                                            { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] },
                                            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }
                                        ]
                                    }}
                                >
                                    {properties.map(p => p.geolocation && (
                                        <OverlayView
                                            key={p.id}
                                            position={p.geolocation}
                                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProperty(p);
                                                }}
                                                className={`cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-50 ${selectedProperty?.id === p.id ? 'z-40 scale-110' : 'z-10'}`}
                                            >
                                                <div className={`px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 ${selectedProperty?.id === p.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                                                    <span className="text-[10px] font-semibold whitespace-nowrap">
                                                        {formatPrice(p.price, p.currency)}
                                                    </span>
                                                </div>
                                                <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] mx-auto -mt-0.5 ${selectedProperty?.id === p.id ? 'border-t-slate-900' : 'border-t-white'}`}></div>
                                            </div>
                                        </OverlayView>
                                    ))}

                                    {selectedProperty && selectedProperty.geolocation && (
                                        <InfoWindowF
                                            position={selectedProperty.geolocation}
                                            onCloseClick={() => setSelectedProperty(null)}
                                            options={{ pixelOffset: new window.google.maps.Size(0, -45) }}
                                        >
                                            <div className="w-[280px] p-0 font-sans overflow-hidden">
                                                <div className="relative h-40 w-full bg-slate-100 rounded-t-xl overflow-hidden group">
                                                    <Image
                                                        src={selectedProperty.images[0] || '/placeholder.jpg'}
                                                        alt={selectedProperty.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent w-full flex justify-end">
                                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-1.5 hover:bg-white/40 transition-colors cursor-pointer">
                                                            <FavoriteButton propertyId={selectedProperty.id} className="text-white w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                        <span className="text-white text-xs font-bold px-2 py-1 bg-primary rounded-md shadow-sm">
                                                            {selectedProperty.operation}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-4 rounded-b-xl shadow-lg border border-slate-100">
                                                    <h3 className="font-bold text-xl text-slate-900 mb-1 tracking-tight">
                                                        {formatPrice(selectedProperty.price, selectedProperty.currency)}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-slate-700 truncate mb-1">{selectedProperty.title}</p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-4 font-medium">
                                                        <MapPin className="w-3 h-3 text-primary" />
                                                        {selectedProperty.neighborhood}, {selectedProperty.city}
                                                    </p>

                                                    <Link
                                                        href={`/property/${selectedProperty.id}`}
                                                        className="block w-full bg-slate-900 text-white text-xs font-semibold py-3 rounded-lg text-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
                                                    >
                                                        Ver Detalles
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
                <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 animate-in slide-in-from-bottom duration-500 flex flex-col p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight">Filtros</h2>
                        <button onClick={() => setShowFilters(false)} className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filterContentJsx}
                    </div>
                    <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-base shadow-xl shadow-primary/30 mt-6"
                    >
                        Ver Propiedades
                    </button>
                </div>
            )}
        </div>
    )
}
