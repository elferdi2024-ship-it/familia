"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import geoData from "@/data/uruguay-geo.json"
import { FavoriteButton } from "@/components/FavoriteButton"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { PropertyGridSkeleton } from "@/components/Skeletons"
import { useComparison } from "@/contexts/ComparisonContext"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, limit } from "firebase/firestore"
import { Property, formatPrice } from "@/lib/data"
import { getMarketIntelligence, MarketData } from "@/lib/analytics"
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { Search } from "lucide-react"

const mapContainerStyle = {
    width: '100%',
    height: '100%',
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
        mode: initialOperation === 'Alquiler' ? 'alquilar' : 'comprar',
        operation: initialOperation || searchParams.get('operation') || "Venta",
        propertyTypes: (initialType ? [initialType] : searchParams.get('type')?.split(',').filter(Boolean)) || [] as string[],
        query: searchParams.get('q') || "",
        priceMin: "",
        priceMax: "",
        bedrooms: "",
        department: initialNeighborhood ? "Montevideo" : "", // Default to Montevideo for known neighborhoods
        city: initialNeighborhood ? "Montevideo" : "",
        neighborhood: initialNeighborhood || "",
        amenities: [] as string[]
    })

    // Real data state
    const [properties, setProperties] = useState<Property[]>([])
    const [savedToast, setSavedToast] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)
    const [marketStats, setMarketStats] = useState<Record<string, MarketData>>({})
    const { saveSearch } = useSavedSearches()
    const { isInCompare, addToCompare, removeFromCompare } = useComparison()

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    })

    const fetchProperties = async () => {
        setIsLoading(true)
        if (!db) {
            setProperties([])
            setIsLoading(false)
            return
        }
        try {
            const propertiesRef = collection(db, "properties")
            const q = query(propertiesRef, limit(200))

            const querySnapshot = await getDocs(q)
            let docs = querySnapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    ...data,
                    publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || new Date().toISOString()
                } as Property
            })

            // Client-side filtering
            if (filters.operation) docs = docs.filter(p => p.operation === filters.operation)
            if (filters.propertyTypes.length > 0) docs = docs.filter(p => filters.propertyTypes.includes(p.type))
            if (filters.department) docs = docs.filter(p => p.department === filters.department)
            if (filters.city) docs = docs.filter(p => p.city === filters.city)
            if (filters.neighborhood) docs = docs.filter(p => p.neighborhood === filters.neighborhood)
            if (filters.bedrooms) {
                const bed = filters.bedrooms === "Mono" ? 0 : filters.bedrooms === "3+" ? 3 : parseInt(filters.bedrooms)
                docs = docs.filter(p => filters.bedrooms === "3+" ? p.bedrooms >= bed : p.bedrooms === bed)
            }
            if (filters.priceMin) docs = docs.filter(p => p.price >= parseInt(filters.priceMin))
            if (filters.priceMax) docs = docs.filter(p => p.price <= parseInt(filters.priceMax))
            if (filters.amenities.length > 0) docs = docs.filter(p => filters.amenities.every(a => p.amenities?.includes(a)))

            docs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            setProperties(docs)

            const statsToFetch = docs.slice(0, 20)
            const statsMap: Record<string, MarketData> = {}
            await Promise.all(statsToFetch.map(async (p) => {
                try {
                    const stats = await getMarketIntelligence(p)
                    if (stats) statsMap[p.id] = stats
                } catch (e) { console.error(e) }
            }))
            setMarketStats(statsMap)
        } catch (error) {
            console.error(error)
            setProperties([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchProperties() }, [filters])

    useEffect(() => {
        if (searchParams.get('view') === 'map') setShowMap(true)
    }, [searchParams])

    const clearFilters = () => {
        setFilters({
            mode: filters.mode,
            operation: filters.operation,
            propertyTypes: filters.propertyTypes,
            query: filters.query,
            priceMin: "",
            priceMax: "",
            bedrooms: "",
            department: "",
            city: "",
            neighborhood: "",
            amenities: []
        })
    }

    const removeFilter = (key: string, value: string | null = null) => {
        if (key === 'amenities') {
            setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== value) }))
        } else if (key === 'department') {
            setFilters(prev => ({ ...prev, department: "", city: "", neighborhood: "" }))
        } else if (key === 'city') {
            setFilters(prev => ({ ...prev, city: "", neighborhood: "" }))
        } else {
            setFilters(prev => ({ ...prev, [key]: "" }))
        }
    }

    const hasFilters = filters.priceMin || filters.priceMax || filters.bedrooms || filters.department || filters.city || filters.neighborhood || filters.amenities.length > 0

    const cities = useMemo(() => {
        if (!filters.department) return []
        const typedGeoData = geoData as Record<string, Record<string, string[]>>
        return Object.keys(typedGeoData[filters.department] || {})
    }, [filters.department])

    const neighborhoods = useMemo(() => {
        if (!filters.department || !filters.city) return []
        const typedGeoData = geoData as Record<string, Record<string, string[]>>
        const rawNeighborhoods = typedGeoData[filters.department]?.[filters.city] || []
        return Array.from(new Set(rawNeighborhoods))
    }, [filters.department, filters.city])

    const pricePercentMin = Math.max(0, Math.min(100, (parseInt(filters.priceMin || "0") / 1000000) * 100))
    const pricePercentMax = Math.max(0, Math.min(100, (parseInt(filters.priceMax || "1000000") / 1000000) * 100))

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Price range, locations, bedrooms, amenities - Identical to search page but cleaned up */}
            <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 block">Rango de Precio (USD)</label>
                <div className="flex gap-3 mb-2">
                    <div className="w-1/2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Mín</span>
                        <input value={filters.priceMin} onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded p-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary" type="text" placeholder="0" />
                    </div>
                    <div className="w-1/2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Máx</span>
                        <input value={filters.priceMax} onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded p-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary" type="text" placeholder="Cualquiera" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="filter-department" className="sr-only">Departamento</label>
                    <select id="filter-department" value={filters.department} onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: "", neighborhood: "" }))} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary">
                        <option value="">Departamento</option>
                        {Object.keys(geoData).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-city" className="sr-only">Ciudad</label>
                    <select id="filter-city" disabled={!filters.department} value={filters.city} onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, neighborhood: "" }))} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary">
                        <option value="">Ciudad</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-neighborhood" className="sr-only">Barrio</label>
                    <select id="filter-neighborhood" disabled={!filters.city} value={filters.neighborhood} onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary">
                        <option value="">Barrio</option>
                        {neighborhoods.map((nb: string) => <option key={nb} value={nb}>{nb}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 block">Dormitorios</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    {["Mono", "1", "2", "3+"].map((num) => (
                        <button key={num} onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))} className={`flex-1 py-3 text-sm font-semibold border-l first:border-l-0 border-slate-200 dark:border-slate-700 transition-colors ${filters.bedrooms === num ? "bg-primary text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden h-[100dvh] flex flex-col pt-20">
            {/* SEO Header - Only shown on SEO routes */}
            {(seoTitle || seoDescription) && (
                <div className="bg-slate-50 dark:bg-slate-900 px-6 py-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">{seoTitle}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">{seoDescription}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-[300px] xl:w-[340px] flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark overflow-y-auto hide-scrollbar p-6">
                    <h2 className="font-bold text-lg mb-6">Filtros</h2>
                    <FilterContent />
                    <button onClick={fetchProperties} className="w-full mt-8 bg-primary text-white py-4 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        Aplicar Filtros
                    </button>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-background-dark">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            {properties.length} Resultados
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setShowMap(!showMap)} className="md:hidden bg-primary text-white px-4 py-2 rounded-full text-xs font-bold">{showMap ? 'Ver Lista' : 'Ver Mapa'}</button>
                            <button onClick={() => setShowFilters(true)} className="md:hidden border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-xs font-bold">Filtros</button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        <section className={`${showMap ? 'hidden md:block' : 'w-full'} md:w-1/2 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {isLoading ? <PropertyGridSkeleton count={4} /> : properties.map(p => (
                                    <Link key={p.id} href={`/property/${p.id}`} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <Image fill src={p.images[0]} alt={p.title} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                {p.badge && <span className="bg-primary px-2 py-1 rounded text-[10px] font-bold text-white uppercase">{p.badge}</span>}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-xl font-black text-primary mb-1">{formatPrice(p.price, p.currency)}</h3>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{p.title}</p>
                                            <p className="text-xs text-slate-500 mb-3">{p.neighborhood}, {p.city}</p>
                                            <div className="flex gap-3 text-slate-400 text-[11px] font-bold border-t pt-3 border-slate-100 dark:border-slate-800">
                                                <span>{p.bedrooms} Dorm.</span>
                                                <span>{p.bathrooms} Baños</span>
                                                <span>{p.area}m²</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className={`${showMap ? 'block' : 'hidden'} md:block md:w-1/2 w-full relative`}>
                            {isLoaded && (
                                <GoogleMap mapContainerStyle={mapContainerStyle} center={properties[0]?.geolocation || defaultCenter} zoom={13}>
                                    {properties.map(p => p.geolocation && (
                                        <MarkerF key={p.id} position={p.geolocation} label={{ text: `$${(p.price / 1000).toFixed(0)}k`, className: "bg-white text-primary px-2 py-1 rounded border-2 border-primary font-bold text-[10px]" }} icon={{ path: 0, scale: 0 }} />
                                    ))}
                                </GoogleMap>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Mobile Overlays (Filters) */}
            {showFilters && (
                <div className="fixed inset-0 z-[200] bg-white dark:bg-background-dark p-6 flex flex-col">
                    <div className="flex justify-between mb-8">
                        <h2 className="text-xl font-bold">Filtros</h2>
                        <button onClick={() => setShowFilters(false)} className="material-icons">close</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <FilterContent />
                    </div>
                    <button onClick={() => setShowFilters(false)} className="w-full bg-primary text-white py-4 rounded-xl font-bold mt-6">Ver Resultados</button>
                </div>
            )}
        </div>
    )
}
