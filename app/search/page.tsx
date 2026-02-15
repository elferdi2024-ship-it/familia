"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import geoData from "@/data/uruguay-geo.json"
import { FavoriteButton } from "@/components/FavoriteButton"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { PropertyGridSkeleton } from "@/components/Skeletons"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, limit } from "firebase/firestore"
import { Property, formatPrice } from "@/lib/data"

function SearchPageInner() {
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState({
        mode: searchParams.get('mode') || searchParams.get('operation') || "comprar",
        operation: searchParams.get('operation') || "Venta",
        propertyTypes: searchParams.get('type')?.split(',').filter(Boolean) || [] as string[],
        query: searchParams.get('q') || "",
        priceMin: "",
        priceMax: "",
        bedrooms: "",
        department: "",
        city: "",
        neighborhood: "",
        amenities: [] as string[]
    })

    // Real data state
    const [properties, setProperties] = useState<Property[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [savedToast, setSavedToast] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { saveSearch } = useSavedSearches()

    const fetchProperties = async () => {
        setIsLoading(true)
        if (!db) {
            setProperties([])
            setIsLoading(false)
            return
        }
        try {
            const propertiesRef = collection(db, "properties")
            // Fetch all properties and filter client-side to avoid composite index requirements
            const q = query(propertiesRef, limit(200))

            const querySnapshot = await getDocs(q)
            let docs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Property))

            // Client-side filtering
            if (filters.operation) {
                docs = docs.filter(p => p.operation === filters.operation)
            }
            if (filters.propertyTypes.length > 0) {
                docs = docs.filter(p => filters.propertyTypes.includes(p.type))
            }
            if (filters.department) {
                docs = docs.filter(p => p.department === filters.department)
            }
            if (filters.city) {
                docs = docs.filter(p => p.city === filters.city)
            }
            if (filters.neighborhood) {
                docs = docs.filter(p => p.neighborhood === filters.neighborhood)
            }
            if (filters.bedrooms) {
                const bed = filters.bedrooms === "Mono" ? 0 : filters.bedrooms === "3+" ? 3 : parseInt(filters.bedrooms)
                docs = docs.filter(p => filters.bedrooms === "3+" ? p.bedrooms >= bed : p.bedrooms === bed)
            }
            if (filters.priceMin) {
                const min = parseInt(filters.priceMin)
                docs = docs.filter(p => p.price >= min)
            }
            if (filters.priceMax) {
                const max = parseInt(filters.priceMax)
                docs = docs.filter(p => p.price <= max)
            }
            if (filters.amenities.length > 0) {
                docs = docs.filter(p => filters.amenities.every(a => p.amenities?.includes(a)))
            }

            // Sort by publishedAt descending
            docs.sort((a, b) => {
                const aTime = (a as any).publishedAt?.seconds || 0
                const bTime = (b as any).publishedAt?.seconds || 0
                return bTime - aTime
            })

            setProperties(docs)
        } catch (error) {
            console.error("Error fetching properties:", error)
            setProperties([])
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch on mount or when filters change
    useEffect(() => {
        fetchProperties()
    }, [filters])

    // Update filters if query params change
    useEffect(() => {
        const mode = searchParams.get('mode')
        const operation = searchParams.get('operation')
        const type = searchParams.get('type')
        const q = searchParams.get('q')
        setFilters(prev => ({
            ...prev,
            ...(mode ? { mode } : {}),
            ...(operation ? { operation, mode: operation === 'Alquiler' || operation === 'Alquiler Temporal' ? 'alquilar' : 'comprar' } : {}),
            ...(type ? { propertyTypes: type.split(',').filter(Boolean) } : {}),
            ...(q ? { query: q } : {}),
        }))
    }, [searchParams])

    // Lock body scroll when filter sheet is open on mobile
    useEffect(() => {
        if (showFilters) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [showFilters])

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
            setFilters(prev => ({
                ...prev,
                amenities: prev.amenities.filter(a => a !== value)
            }))
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

    // Shared Filter UI (used in both sidebar and mobile sheet)
    const FilterContent = () => (
        <div className="space-y-8">
            {/* Price Range */}
            <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 block">Rango de Precio (USD)</label>
                <div className="flex gap-3 mb-2">
                    <div className="w-1/2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Mín</span>
                        <input
                            value={filters.priceMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded p-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary"
                            type="text"
                            placeholder="0"
                        />
                    </div>
                    <div className="w-1/2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Máx</span>
                        <input
                            value={filters.priceMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded p-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary"
                            type="text"
                            placeholder="Cualquiera"
                        />
                    </div>
                </div>
                <div className="relative h-1 bg-slate-200 dark:bg-slate-700 rounded-full my-6">
                    <div
                        className="absolute h-full bg-primary rounded-full transition-all duration-300"
                        style={{
                            left: `${Math.min(pricePercentMin, pricePercentMax)}%`,
                            right: `${100 - Math.max(pricePercentMin, pricePercentMax)}%`
                        }}
                    ></div>
                    <div
                        className="absolute w-5 h-5 bg-white dark:bg-slate-800 border-2 border-primary rounded-full -top-2 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
                        style={{ left: `${pricePercentMin}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <div
                        className="absolute w-5 h-5 bg-white dark:bg-slate-800 border-2 border-primary rounded-full -top-2 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all z-10"
                        style={{ left: `${pricePercentMax}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Location Hierarchy */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 block italic">1. Departamento</label>
                    <select
                        value={filters.department}
                        onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, city: "", neighborhood: "" }))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary shadow-inner"
                    >
                        <option value="">Cualquier departamento</option>
                        {Object.keys(geoData).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 block italic">2. Ciudad</label>
                    <select
                        disabled={!filters.department}
                        value={filters.city}
                        onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value, neighborhood: "" }))}
                        className={`w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary shadow-inner transition-opacity ${!filters.department ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        <option value="">{filters.department ? `Todas en ${filters.department}` : 'Primero elija departamento'}</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2 block italic">3. Barrio</label>
                    <select
                        disabled={!filters.city}
                        value={filters.neighborhood}
                        onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                        className={`w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 text-sm font-semibold focus:ring-2 focus:ring-primary shadow-inner transition-opacity ${!filters.city ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        <option value="">{filters.city ? `Todos en ${filters.city}` : 'Primero elija ciudad'}</option>
                        {neighborhoods.map((nb: string) => (
                            <option key={nb} value={nb}>{nb}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bedrooms */}
            <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 block">Dormitorios</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 font-sans">
                    {["Mono", "1", "2", "3+"].map((num) => (
                        <button
                            key={num}
                            onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
                            className={`flex-1 py-3 text-sm font-semibold border-l first:border-l-0 border-slate-200 dark:border-slate-700 transition-colors ${filters.bedrooms === num ? "bg-primary text-white" : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <label className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 block">Comodidades</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Seguridad 24hs", "Piscina", "Barbacoa", "Gimnasio", "Garage", "Parrillero", "Losa Radiante", "Ascensor", "Acepta Mascotas"].map((amenity) => (
                        <label key={amenity} className="flex items-center gap-3 cursor-pointer group py-1">
                            <input
                                checked={filters.amenities.includes(amenity)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }))
                                    } else {
                                        setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }))
                                    }
                                }}
                                className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800 w-5 h-5"
                                type="checkbox"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden h-[100dvh] flex flex-col">
            <div className="pt-16 md:pt-20"></div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar Filters — hidden on mobile */}
                <aside className="hidden md:block w-[300px] xl:w-[340px] flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark overflow-y-auto hide-scrollbar p-6">
                    <h2 className="font-bold text-lg mb-6">Filtros Avanzados</h2>
                    <FilterContent />
                    <button className="w-full mt-12 bg-primary text-white py-4 rounded-lg font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                        Aplicar Filtros
                    </button>
                </aside>

                {/* Mobile Filter Sheet (Full Screen Overlay) */}
                {showFilters && (
                    <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white dark:bg-background-dark">
                        {/* Sheet Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                            <h2 className="font-bold text-lg">Filtros</h2>
                            <div className="flex items-center gap-3">
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-sm font-bold text-primary">
                                        Limpiar
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </div>
                        </div>
                        {/* Sheet Body */}
                        <div className="flex-1 overflow-y-auto p-4 pb-28">
                            <FilterContent />
                        </div>
                        {/* Sheet Footer */}
                        <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark safe-bottom">
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                            >
                                Ver {properties.length} propiedades
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Top Bar — responsive */}
                    <div className="min-h-[48px] md:h-14 px-4 md:px-6 py-2 md:py-0 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-40 gap-2">
                        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                            <span className="font-bold text-slate-900 dark:text-white text-sm md:text-base whitespace-nowrap">{properties.length} propiedades</span>
                            <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                            {/* Desktop filter chips — hidden on mobile */}
                            <div className="hidden md:flex gap-2 items-center flex-wrap">
                                {filters.department && (
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                                        {filters.department}
                                        <button onClick={() => removeFilter('department', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {filters.city && (
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                                        {filters.city}
                                        <button onClick={() => removeFilter('city', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {filters.neighborhood && (
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                                        {filters.neighborhood}
                                        <button onClick={() => removeFilter('neighborhood', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {filters.bedrooms && (
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                                        {filters.bedrooms} Dorm.
                                        <button onClick={() => removeFilter('bedrooms', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {filters.amenities.map(amenity => (
                                    <span key={amenity} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                                        {amenity}
                                        <button onClick={() => removeFilter('amenities', amenity)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                ))}
                                {filters.priceMin && filters.priceMin !== "0" && (
                                    <span className="bg-green-500/10 text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-500/20">
                                        Min: USD {parseInt(filters.priceMin).toLocaleString()}
                                        <button onClick={() => removeFilter('priceMin', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {filters.priceMax && (
                                    <span className="bg-green-500/10 text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-green-500/20">
                                        Max: USD {parseInt(filters.priceMax).toLocaleString()}
                                        <button onClick={() => removeFilter('priceMax', null)} className="material-icons text-[14px] hover:text-red-500">close</button>
                                    </span>
                                )}
                                {hasFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-slate-400 hover:text-primary px-2 transition-colors ml-2"
                                    >
                                        Limpiar todo
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Mobile: active filter count + sort */}
                        <div className="flex items-center justify-between md:justify-end gap-2">
                            {/* Mobile filter chips (scrollable) */}
                            <div className="flex md:hidden gap-1.5 items-center overflow-x-auto no-scrollbar flex-1 mr-2">
                                {filters.department && (
                                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">{filters.department}</span>
                                )}
                                {filters.city && (
                                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">{filters.city}</span>
                                )}
                                {filters.bedrooms && (
                                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">{filters.bedrooms} Dorm.</span>
                                )}
                                {filters.amenities.length > 0 && (
                                    <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">+{filters.amenities.length} filtros</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        saveSearch({
                                            label: [filters.operation, filters.department, filters.city, filters.neighborhood, filters.query].filter(Boolean).join(" · ") || "Búsqueda general",
                                            operation: filters.operation,
                                            propertyTypes: filters.propertyTypes,
                                            query: filters.query,
                                            department: filters.department,
                                            city: filters.city,
                                            neighborhood: filters.neighborhood,
                                            priceMin: filters.priceMin,
                                            priceMax: filters.priceMax,
                                            bedrooms: filters.bedrooms,
                                        })
                                        setSavedToast(true)
                                        setTimeout(() => setSavedToast(false), 2500)
                                    }}
                                    className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-all hover:border-primary/30"
                                >
                                    <span className="material-icons text-sm">{savedToast ? 'check_circle' : 'bookmark_border'}</span>
                                    {savedToast ? 'Guardada ✓' : 'Guardar búsqueda'}
                                </button>
                                <span className="text-xs font-medium text-slate-400 hidden sm:inline">Ordenar:</span>
                                <button className="text-sm font-bold flex items-center gap-0.5 whitespace-nowrap hover:text-primary transition-colors cursor-pointer">
                                    Recientes <span className="material-icons text-sm">expand_more</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content: List + Map */}
                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Listing Grid — full width on mobile, 50% on desktop */}
                        <section className={`${showMap ? 'hidden md:block' : 'w-full'} md:w-1/2 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 bg-slate-50/50 dark:bg-slate-900/50 hide-scrollbar`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                                {isLoading ? (
                                    <PropertyGridSkeleton count={6} />
                                ) : properties.length === 0 ? (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-icons text-slate-400 text-4xl">search_off</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">No encontramos propiedades</h3>
                                        <p className="text-slate-500 mb-6">Prueba ajustando los filtros o buscando en otra zona.</p>
                                        <button onClick={clearFilters} className="text-primary font-bold hover:underline">Limpiar todos los filtros</button>
                                    </div>
                                ) : (
                                    properties.map((property) => (
                                        <Link key={property.id} href={`/property/${property.id}`} className="block">
                                            <div className="property-card bg-white dark:bg-background-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative">
                                                <div className="aspect-[4/3] md:aspect-[3/4] relative overflow-hidden">
                                                    <Image
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        alt={property.title}
                                                        src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"}
                                                        sizes="(max-width: 768px) 100vw, 25vw"
                                                    />
                                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                        {property.badge && (
                                                            <span className={`${property.badgeColor || 'bg-primary/90'} backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider`}>
                                                                {property.badge}
                                                            </span>
                                                        )}
                                                        {property.viviendaPromovida && (
                                                            <span className="bg-blue-600/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                                                VP
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Hover Actions — desktop only */}
                                                    <div className="hover-actions absolute inset-x-0 bottom-0 p-4 flex gap-2 opacity-0 translate-y-4 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100 group-hover:translate-y-0 hidden md:flex">
                                                        <button className="flex-1 bg-primary text-white py-2.5 rounded font-bold text-sm shadow-lg">Contactar</button>
                                                        <FavoriteButton propertyId={property.id} className="w-10 h-10 bg-white dark:bg-slate-800 rounded flex items-center justify-center text-slate-900 dark:text-white shadow-lg" />
                                                    </div>
                                                    {/* Mobile favorite button — always visible */}
                                                    <div className="md:hidden absolute top-3 right-3">
                                                        <FavoriteButton propertyId={property.id} className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 shadow-md" />
                                                    </div>
                                                </div>
                                                <div className="p-3.5 md:p-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-primary">
                                                            {formatPrice(property.price, property.currency)}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{property.title}</p>
                                                    <p className="text-xs text-slate-500 mb-3">{property.neighborhood}, {property.city}</p>
                                                    <div className="flex items-center gap-3 text-slate-500 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                                                        <span className="flex items-center gap-1"><span className="material-icons text-base">bed</span> {property.bedrooms}</span>
                                                        <span className="flex items-center gap-1"><span className="material-icons text-base">bathtub</span> {property.bathrooms}</span>
                                                        <span className="flex items-center gap-1"><span className="material-icons text-base">square_foot</span> {property.area}m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Map View — hidden on mobile by default, full on toggle */}
                        <section className={`${showMap ? 'block' : 'hidden'} md:block md:w-1/2 w-full relative bg-slate-200`}>
                            <Image
                                fill
                                className="object-cover"
                                alt="Map of Montevideo"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS3tqEbJXll60SW3vuu77a6MgWk2kkqvIJj-3FPuQIvD24JgqiVHN7qvOS7_7IVvGKxZKSe0lZvSEewoaidrBpWJp_B54eOBtINAA40IR8i-ubf6Jr6UZbJnnCfzoehI80gJB3vDS2JHyEfyiBsfeHh7DSd2YvSBwO8Xir_V5vNrANpG6mPK1IuUNgAapmeaZ5bpmYg1ShIHcM4JKI9cFyKJvNjp20QhDaLX9eiVU-jQfGA22BEnWzEEfa-_MjfxOe7KqXJt70-0Ld"
                                sizes="50vw"
                            />
                            {/* Floating Map Markers */}
                            <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                                <div className="bg-primary text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border-2 border-white flex items-center gap-1 group-hover:scale-110 transition-transform">
                                    USD 450k
                                </div>
                                <div className="w-0.5 h-3 bg-primary mx-auto"></div>
                            </div>
                            <div className="absolute top-1/2 left-2/3 group cursor-pointer">
                                <div className="bg-white dark:bg-slate-800 text-primary px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border-2 border-primary flex items-center gap-1 group-hover:scale-110 transition-transform">
                                    USD 325k
                                </div>
                                <div className="w-0.5 h-3 bg-primary mx-auto"></div>
                            </div>
                            <div className="absolute bottom-1/3 left-1/4 group cursor-pointer">
                                <div className="bg-white dark:bg-slate-800 text-primary px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border-2 border-primary flex items-center gap-1 group-hover:scale-110 transition-transform">
                                    USD 890k
                                </div>
                                <div className="w-0.5 h-3 bg-primary mx-auto"></div>
                            </div>
                            <div className="absolute bottom-1/4 right-1/4 group cursor-pointer">
                                <div className="bg-white dark:bg-slate-800 text-primary px-3 py-1.5 rounded-full font-bold text-xs shadow-xl border-2 border-primary flex items-center gap-1 group-hover:scale-110 transition-transform">
                                    USD 215k
                                </div>
                                <div className="w-0.5 h-3 bg-primary mx-auto"></div>
                            </div>
                            {/* Map Controls */}
                            <div className="absolute bottom-20 md:bottom-6 right-4 md:right-6 flex flex-col gap-2">
                                <button title="Acercar" className="w-11 h-11 bg-white dark:bg-background-dark shadow-xl rounded-lg flex items-center justify-center text-slate-800 dark:text-white hover:text-primary transition-colors">
                                    <span className="material-icons">add</span>
                                </button>
                                <button title="Alejar" className="w-11 h-11 bg-white dark:bg-background-dark shadow-xl rounded-lg flex items-center justify-center text-slate-800 dark:text-white hover:text-primary transition-colors">
                                    <span className="material-icons">remove</span>
                                </button>
                                <button title="Mi ubicación" className="w-11 h-11 bg-white dark:bg-background-dark shadow-xl rounded-lg flex items-center justify-center text-slate-800 dark:text-white hover:text-primary transition-colors mt-2">
                                    <span className="material-icons">my_location</span>
                                </button>
                            </div>
                            {/* Map Layers Toggle */}
                            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                <div className="bg-white dark:bg-background-dark shadow-xl rounded-lg p-1 flex gap-1">
                                    <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded">Mapa</button>
                                    <button className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Satélite</button>
                                </div>
                            </div>
                            {/* Mobile: Back to list button */}
                            <button
                                onClick={() => setShowMap(false)}
                                className="md:hidden absolute top-4 left-4 bg-white dark:bg-slate-900 dark:text-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 font-bold text-sm"
                            >
                                <span className="material-icons text-base">arrow_back</span>
                                Ver Lista
                            </button>
                        </section>
                    </div>
                </main>
            </div>

            {/* Mobile FABs — Floating Action Buttons */}
            {/* Mobile FABs — Floating Action Buttons */}
            <div className="md:hidden fixed bottom-28 left-0 right-0 flex justify-center gap-3 z-[100] px-4 pointer-events-none">
                <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3.5 rounded-full shadow-2xl font-bold text-sm border border-slate-200 pointer-events-auto active:scale-95 transition-transform"
                >
                    <span className="material-icons text-lg">tune</span>
                    Filtros
                    {hasFilters && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                </button>
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-3.5 rounded-full shadow-2xl font-bold text-sm pointer-events-auto active:scale-95 transition-transform"
                >
                    <span className="material-icons text-lg">{showMap ? 'view_list' : 'map'}</span>
                    {showMap ? 'Ver Lista' : 'Ver Mapa'}
                </button>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="bg-background-light dark:bg-background-dark font-display h-screen flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <span className="material-icons animate-spin">refresh</span>
                    <span className="font-medium">Cargando búsqueda...</span>
                </div>
            </div>
        }>
            <SearchPageInner />
        </Suspense>
    )
}
