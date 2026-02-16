"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Property, formatPrice, PROPERTIES } from "@/lib/data"
import { FavoriteButton } from "@/components/FavoriteButton"
import { FloorplanViewer } from "@/components/FloorplanViewer"
import { NeighborhoodMap } from "@/components/NeighborhoodMap"
import { notifyLead } from "@/actions/notify-lead"
import { LeadSchema } from "@/lib/validation"
import { toast } from "sonner"

export default function PropertyDetailPage() {
    const { id } = useParams()
    const [property, setProperty] = useState<Property | null>(null)
    const [loading, setLoading] = useState(true)
    const [showContactForm, setShowContactForm] = useState(false)
    const [currentPhoto, setCurrentPhoto] = useState(0)

    // Lead Form State
    const [leadName, setLeadName] = useState("")
    const [leadEmail, setLeadEmail] = useState("")
    const [leadMessage, setLeadMessage] = useState("Hola, estoy interesado en recibir más información sobre esta propiedad...")
    const [isSubmittingLead, setIsSubmittingLead] = useState(false)
    const [leadSuccess, setLeadSuccess] = useState(false)

    useEffect(() => {
        async function fetchProperty() {
            setLoading(true)

            // Try finding in static/mock data first (for demo/development)
            // Check if id is in mock data range (simple numeric IDs)
            const mockProperty = PROPERTIES.find(p => p.id === id)

            if (mockProperty) {
                setProperty(mockProperty)
                setLoading(false)
                return
            }

            if (!id || !db) {
                setLoading(false)
                return
            }
            try {
                const docRef = doc(db, "properties", id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() } as Property)
                } else {
                    // If not found in DB and not in mock data
                    console.log("Property not found in DB")
                }
            } catch (error) {
                console.error("Error fetching property:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProperty()
    }, [id])

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!property || !db) return

        const leadPayload = {
            propertyId: property.id,
            propertyTitle: property.title,
            agentId: property.userId || "system",
            leadName,
            leadEmail,
            leadMessage,
        }
        const parsed = LeadSchema.safeParse(leadPayload)
        if (!parsed.success) {
            const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
            toast.error(first || "Revisa los datos del formulario")
            return
        }

        setIsSubmittingLead(true)
        try {
            const leadData = {
                ...leadPayload,
                agentName: property.agentName || "Usuario",
                createdAt: serverTimestamp(),
                status: "new",
            }
            await addDoc(collection(db, "leads"), leadData)

            const result = await notifyLead({
                ...leadPayload,
                createdAt: new Date().toISOString(),
            })
            if (!result.success) {
                toast.error("Consulta enviada, pero no pudimos notificar al agente.")
            }

            setLeadSuccess(true)
            setLeadName("")
            setLeadEmail("")
            setLeadMessage("")
            toast.success("¡Consulta enviada!")
        } catch (error) {
            console.error("Error submitting lead:", error)
            toast.error("Error al enviar la consulta. Por favor intenta de nuevo.")
        } finally {
            setIsSubmittingLead(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold">Cargando propiedad...</p>
                </div>
            </div>
        )
    }

    if (!property) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Propiedad no encontrada</h2>
                <p className="text-slate-500 mb-8 text-lg">Parece que el enlace que seguiste ya no está disponible o la propiedad fue eliminada.</p>
                <Link href="/search" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                    Volver al buscador
                </Link>
            </div>
        )
    }

    const photos = (property.images && property.images.length > 0)
        ? property.images.map((src, i) => ({ alt: `Property photo ${i + 1}`, src }))
        : [{ alt: "Placeholder", src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop" }]

    return (
        <div className="bg-background-light text-slate-900 font-display pt-16 md:pt-20 pb-24 md:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "RealEstateListing",
                        "name": property.title,
                        "description": property.description,
                        "datePosted": property.publishedAt,
                        "validFrom": property.publishedAt,
                        "image": property.images,
                        "url": `https://dominiototal.vercel.app/property/${property.id}`,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": property.address || "Dirección no disponible",
                            "addressLocality": property.city,
                            "addressRegion": property.department,
                            "addressCountry": "UY"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": property.geolocation?.lat,
                            "longitude": property.geolocation?.lng
                        },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": property.currency,
                            "price": property.price,
                            "availability": "https://schema.org/InStock",
                            "url": `https://dominiototal.vercel.app/property/${property.id}`,
                            "seller": {
                                "@type": "RealEstateAgent",
                                "name": property.agentName || "DominioTotal",
                                "telephone": property.agentPhone
                            }
                        },
                        "numBedrooms": property.bedrooms,
                        "numBathrooms": property.bathrooms,
                        "floorSize": {
                            "@type": "QuantitativeValue",
                            "value": property.area,
                            "unitCode": "MTK"
                        },
                        "amenityFeature": property.amenities.map(amenity => ({
                            "@type": "LocationFeatureSpecification",
                            "name": amenity,
                            "value": true
                        }))
                    })
                }}
            />
            <main className="relative">
                {/* Photo Gallery — Mobile: Horizontal Scroll, Desktop: Grid */}
                {/* Mobile swipe gallery */}
                <section className="md:hidden relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                        alt={photos[currentPhoto].alt}
                        fill
                        priority
                        className="object-cover"
                        src={photos[currentPhoto].src}
                        sizes="100vw"
                    />
                    {/* Photo counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {currentPhoto + 1} / {photos.length}
                    </div>
                    {/* Navigation dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPhoto(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? 'bg-white w-6' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                    {/* Prev/Next arrows */}
                    {currentPhoto > 0 && (
                        <button
                            onClick={() => setCurrentPhoto(prev => prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 dark:text-white"
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>
                    )}
                    {currentPhoto < photos.length - 1 && (
                        <button
                            onClick={() => setCurrentPhoto(prev => prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 dark:text-white"
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    )}
                    {/* Back button */}
                    <Link href="/search" className="absolute top-3 left-3 w-10 h-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-900 dark:text-white">
                        <span className="material-icons">arrow_back</span>
                    </Link>
                    {/* Share/Save */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={async () => {
                                try {
                                    if (navigator.share) {
                                        await navigator.share({
                                            title: property.title,
                                            text: `Mira esta propiedad en ${property.neighborhood}, ${property.city}`,
                                            url: window.location.href,
                                        })
                                    } else {
                                        await navigator.clipboard.writeText(window.location.href)
                                        // Simple visual feedback could be added here, currently just silent copy or we can add a state for &quot;Copied!&quot; tooltip
                                        alert("Enlace copiado al portapapeles")
                                    }
                                } catch (error) {
                                    console.error("Error sharing:", error)
                                }
                            }}
                            className="w-10 h-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-900 dark:text-white active:scale-90 transition-transform"
                        >
                            <span className="material-icons text-lg">share</span>
                        </button>
                        <FavoriteButton propertyId={property.id} className="w-10 h-10" />
                    </div>
                </section>

                {/* Desktop photo grid */}
                <section className="hidden md:grid relative w-full h-[70vh] overflow-hidden grid-cols-4 grid-rows-2 gap-2 p-2 bg-slate-50">
                    <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-l-xl">
                        <Image
                            alt="Main View"
                            fill
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={(photos[0] || photos[0]).src}
                            sizes="50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent via-transparent via-50%"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden">
                        <Image
                            alt="Gallery Photo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={(photos[1] || photos[0]).src}
                            sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden rounded-tr-xl">
                        <Image
                            alt="Gallery Photo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={(photos[2] || photos[0]).src}
                            sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden">
                        <Image
                            alt="Gallery Photo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={(photos[3] || photos[0]).src}
                            sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden rounded-br-xl">
                        <Image
                            alt="Gallery Photo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={(photos[4] || photos[0]).src}
                            sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                            <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
                                <span className="material-icons">grid_view</span>
                                Ver todas las fotos
                            </button>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        {/* Title & Badges */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
                                {property.featured && <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest">Destacado</span>}
                                {property.badge && (
                                    <span className={`px-3 py-1 ${property.badgeColor || 'bg-primary'} text-white text-[10px] font-bold rounded uppercase tracking-widest`}>
                                        {property.badge}
                                    </span>
                                )}
                                {property.viviendaPromovida && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-widest flex items-center gap-1">
                                        <span className="material-icons text-sm">gavel</span>
                                        Vivienda Promovida
                                    </span>
                                )}
                                {property.energyLabel && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-widest">Energía {property.energyLabel}</span>}
                            </div>
                            {/* Social Proof */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full font-bold">
                                    <span className="material-icons text-sm">visibility</span>
                                    {Math.floor(Math.random() * 50) + 10} personas vieron esta propiedad hoy
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">{property.title}</h1>
                            <div className="flex flex-wrap items-center text-slate-500 gap-2 md:gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="material-icons text-primary text-lg md:text-xl">location_on</span>
                                    <span className="font-medium">{property.neighborhood}, {property.city}</span>
                                </div>
                                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span className="flex items-center gap-1 font-medium text-blue-600"><span className="material-icons text-sm">verified</span> Ubicación Verificada</span>
                            </div>
                        </div>

                        {/* Mobile Price Card — shown only on mobile */}
                        <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Precio de {property.operation}</p>
                                    <h2 className="text-3xl font-bold text-slate-900">{formatPrice(property.price, property.currency)}</h2>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Actualizado</span>
                            </div>
                            {property.gastosComunes && (
                                <p className="text-sm text-slate-600">Gastos Comunes: <span className="font-bold text-slate-900">UYU {property.gastosComunes.toLocaleString()}</span></p>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 p-5 md:p-8 bg-[#F7F8FA] rounded-2xl border border-slate-100">
                            <div className="space-y-1">
                                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">Precio / m²</p>
                                <p className="text-xl md:text-2xl font-bold text-primary">USD 3.125</p>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span className="material-icons text-[14px]">arrow_downward</span> Muy Competitivo
                                </p>
                            </div>
                            <div className="space-y-1 sm:px-6 sm:border-x border-slate-200 pt-4 sm:pt-0 border-t sm:border-t-0">
                                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">Tiempo en Mercado</p>
                                <p className="text-xl md:text-2xl font-bold text-slate-900">12 Días</p>
                                <p className="text-xs text-slate-500 font-medium">Recién publicado</p>
                            </div>
                            <div className="space-y-1 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0">
                                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">Rentabilidad Est.</p>
                                <p className="text-xl md:text-2xl font-bold text-green-600">5.8% anual</p>
                                <p className="text-xs text-slate-500 font-medium">Alto potencial inversor</p>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3 md:gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">straighten</span>
                                <div>
                                    <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Área Total</p>
                                    <p className="font-bold text-slate-900 text-sm md:text-base">{property.area} m²</p>
                                </div>
                            </div>
                            <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3 md:gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">bed</span>
                                <div>
                                    <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Dormitorios</p>
                                    <p className="font-bold text-slate-900 text-sm md:text-base">{property.bedrooms} Hab.</p>
                                </div>
                            </div>
                            <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3 md:gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">shower</span>
                                <div>
                                    <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Baños</p>
                                    <p className="font-bold text-slate-900 text-sm md:text-base">{property.bathrooms} Baños</p>
                                </div>
                            </div>
                            <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3 md:gap-4">
                                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">directions_car</span>
                                <div>
                                    <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Garaje</p>
                                    <p className="font-bold text-slate-900 text-sm md:text-base">{property.garages || 0} Cocheras</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Descripción de la propiedad</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                                <div className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                    {property.description}
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Amenities y Destacados</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                {property.amenities.map((amenity) => (
                                    <div key={amenity} className="flex items-center gap-3 p-3 md:p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-default text-xs md:text-sm font-semibold text-slate-700">
                                        <span className="material-symbols-outlined text-slate-400">check_circle</span>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Uruguay — Servicios del Inmueble */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Servicios del Inmueble</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Saneamiento</p>
                                    <p className="text-sm font-bold text-green-600 flex items-center gap-1"><span className="material-icons text-sm">check_circle</span> Conectado</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Gas</p>
                                    <p className="text-sm font-bold text-green-600 flex items-center gap-1"><span className="material-icons text-sm">check_circle</span> Cañería</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Agua</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><span className="material-icons text-sm">water_drop</span> OSE</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Electricidad</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><span className="material-icons text-sm">bolt</span> UTE</p>
                                </div>
                            </div>
                        </div>

                        {/* FloorplanViewer */}
                        {property.floorplanUrl && <FloorplanViewer imageUrl={property.floorplanUrl} />}

                        {/* NeighborhoodMap */}
                        <NeighborhoodMap
                            location={`${property.neighborhood}, ${property.city}`}
                            coordinates={property.geolocation}
                        />

                        {/* Map */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900">Ubicación exacta</h3>
                                <button className="text-sm font-bold text-primary hover:underline">Ver puntos de interés</button>
                            </div>
                            <div className="h-56 md:h-80 rounded-2xl overflow-hidden border border-slate-100 relative shadow-inner">
                                <img alt="Map View" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-YkBQns-p1uMksdpIjDLQKIgFkCHbkjd2Bcqzzr2RToyfZN-alhRbKx5M_nnnA_mFV8zen_57wGCI5Shpg1c8fgfo5UryGoNGxyJeOR_GU2YSMZ9L0ppnCQy44zeJFhAofXZAwphv_Vbx5UPdqsIt_ACcxiYxxEOKL3IETaQByUu81UfkPIpc6HWwXs9vQgHETc64VE59fvvai0u6JnmE4HoqugPx3VcHnvLip01BDtQGejG2ZgI8ISzXxCPiG_pPKWfDMpvZlKbO" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-2xl backdrop-blur-sm border-2 border-primary">
                                        <span className="material-icons text-2xl md:text-3xl">location_on</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Contact Sidebar — hidden on mobile */}
                    <div className="hidden lg:block relative">
                        <aside className="lg:sticky lg:top-24 space-y-6" style={{ height: 'fit-content' }}>
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl">
                                <div className="mb-8 pb-8 border-b border-slate-100">
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">Precio de {property.operation}</p>
                                    <h2 className="text-[40px] leading-tight font-[700] text-slate-900 mb-2">{formatPrice(property.price, property.currency)}</h2>
                                    {property.gastosComunes && (
                                        <p className="text-sm text-slate-600">Gastos Comunes: <span className="font-bold text-slate-900">UYU {property.gastosComunes.toLocaleString()}</span></p>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <button className="w-full py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                                        <span className="material-icons">calendar_today</span>
                                        Solicitar Visita
                                    </button>
                                    <button className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                                        WhatsApp Inmobiliaria
                                    </button>
                                    <button className="w-full py-4 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3">
                                        <span className="material-icons">phone</span>
                                        Llamar Directo
                                    </button>
                                </div>
                                <div className="my-8 flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        <Image
                                            alt="Agent"
                                            fill
                                            className="object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvyNhoTCRM-sjGddCkfo3CZ4336KdDCk_p39rvb-eS24cSC1GX8wJtMWHfOYMqiFFn7CpWd9r7VfkTEp7jKwboGlPXXE8xzVm7bS3EGoWP64kqZ_r4CPL_LN4XyLN9Po4devGga_tJS47HsKEZsWi3alogsDppwbEiVAdgIatJB4ckkx-kjoV1-tgqpWKq-mC-PwSRWCeaM9WvCJx8cvrXmZZRItFU22WIvDNg9Rp7_i4Q-QGPGxiMq74RDmFRMFzvWDNyWs-VpyjX"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{property.agentName || "Agente DominioTotal"}</p>
                                        <p className="text-xs text-slate-500 font-medium">Agente Verificado • {property.agentPhone || 'Contactar por web'}</p>
                                    </div>
                                </div>
                                {leadSuccess ? (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-in zoom-in-95 duration-300">
                                        <span className="material-icons text-green-500 text-4xl mb-2">check_circle</span>
                                        <h4 className="font-bold text-green-900">¡Consulta Enviada!</h4>
                                        <p className="text-sm text-green-700 mt-1">El agente se contactará contigo a la brevedad.</p>
                                        <button
                                            onClick={() => setLeadSuccess(false)}
                                            className="mt-4 text-xs font-bold text-green-800 hover:underline"
                                        >
                                            Enviar otra consulta
                                        </button>
                                    </div>
                                ) : (
                                    <form className="space-y-3" onSubmit={handleLeadSubmit}>
                                        <input
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Tu Nombre Completo"
                                            type="text"
                                            required
                                            value={leadName}
                                            onChange={(e) => setLeadName(e.target.value)}
                                        />
                                        <input
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Email de contacto"
                                            type="email"
                                            required
                                            value={leadEmail}
                                            onChange={(e) => setLeadEmail(e.target.value)}
                                        />
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Mensaje..."
                                            rows={3}
                                            required
                                            value={leadMessage}
                                            onChange={(e) => setLeadMessage(e.target.value)}
                                        ></textarea>
                                        <button
                                            disabled={isSubmittingLead}
                                            className="w-full bg-slate-900 text-white py-4 font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                                            type="submit"
                                        >
                                            {isSubmittingLead ? "Enviando..." : "Enviar Consulta"}
                                        </button>
                                    </form>
                                )}
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-icons text-primary">insights</span>
                                    <div>
                                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Oportunidad de Mercado</p>
                                        <p className="text-sm text-slate-600 leading-snug">Este inmueble tiene un precio por m² un <span className="font-bold text-slate-900">12% menor</span> a propiedades similares en la zona.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Mobile Contact Bar - DEFINITIVE FIX: HIGH Z-INDEX */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[999] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
                style={{ zIndex: 999 }}
            >
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Precio de {property.operation}</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{formatPrice(property.price, property.currency)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <a href={`tel:${property.agentPhone}`} className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-700">
                            <span className="material-icons">phone</span>
                        </a>
                        <a
                            href={`https://wa.me/${property.agentPhone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-12 px-5 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                            <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                        <button
                            onClick={() => setShowContactForm(true)}
                            className="h-12 px-5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                        >
                            Contactar
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Contact Form Sheet */}
            {showContactForm && (
                <div className="lg:hidden fixed inset-0 z-[60] flex flex-col">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContactForm(false)}></div>
                    <div className="mt-auto bg-white rounded-t-3xl relative z-10 p-6 pb-8 safe-bottom animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-icons text-2xl">account_circle</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{property.agentName || "Agente DominioTotal"}</p>
                                <p className="text-xs text-slate-500">{property.agentPhone || 'Contactar por web'}</p>
                            </div>
                        </div>
                        {leadSuccess ? (
                            <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
                                <span className="material-icons text-green-500 text-5xl mb-4">check_circle</span>
                                <h4 className="text-xl font-bold text-green-900">¡Consulta Enviada!</h4>
                                <p className="text-sm text-green-700 mt-2">Pronto recibirás una respuesta en tu email.</p>
                                <button
                                    onClick={() => {
                                        setLeadSuccess(false)
                                        setShowContactForm(false)
                                    }}
                                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-bold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-3" onSubmit={handleLeadSubmit}>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Tu Nombre"
                                    type="text"
                                    required
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                />
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Email"
                                    type="email"
                                    required
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                />
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Mensaje..."
                                    rows={3}
                                    required
                                    value={leadMessage}
                                    onChange={(e) => setLeadMessage(e.target.value)}
                                ></textarea>
                                <button
                                    disabled={isSubmittingLead}
                                    className="w-full bg-primary text-white py-4 font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
                                    type="submit"
                                >
                                    {isSubmittingLead ? "Enviando..." : "Enviar Consulta"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
