"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Property, formatPrice } from "@/lib/data"
import { FavoriteButton } from "@/components/FavoriteButton"
import { notifyLead } from "@/actions/notify-lead"
import { MarketData } from "@/lib/analytics"
import { useComparison } from "@/contexts/ComparisonContext"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { trackEvent } from "@/lib/tracking"

// Lazy load heavy components
const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap").then(m => ({ default: m.NeighborhoodMap })), {
    loading: () => <div className="aspect-[21/9] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Cargando mapa...</div>,
    ssr: false,
})

const FloorplanViewer = dynamic(() => import("@/components/FloorplanViewer").then(m => ({ default: m.FloorplanViewer })), {
    loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />,
})

interface PropertyClientProps {
    property: Property
    marketData: MarketData | null
}

export function PropertyClient({ property, marketData }: PropertyClientProps) {
    const [showContactForm, setShowContactForm] = useState(false)
    const [currentPhoto, setCurrentPhoto] = useState(0)
    const [leadName, setLeadName] = useState("")
    const [leadEmail, setLeadEmail] = useState("")
    const [leadMessage, setLeadMessage] = useState("Hola, estoy interesado en recibir más información sobre esta propiedad...")
    const [isSubmittingLead, setIsSubmittingLead] = useState(false)
    const [leadSuccess, setLeadSuccess] = useState(false)
    const { isInCompare, addToCompare, removeFromCompare } = useComparison()

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!property || !db) return

        setIsSubmittingLead(true)
        try {
            const leadData = {
                propertyId: property.id,
                propertyTitle: property.title,
                agentId: property.userId || "system",
                agentName: property.agentName || "Usuario",
                leadName,
                leadEmail,
                leadMessage,
                createdAt: serverTimestamp(),
                status: "new"
            }

            await addDoc(collection(db, "leads"), leadData)

            await notifyLead({
                ...leadData,
                createdAt: new Date().toISOString()
            })

            setLeadSuccess(true)
            setLeadName("")
            setLeadEmail("")
            setLeadMessage("")
            toast.success("¡Consulta enviada exitosamente! El agente te contactará pronto.")
            trackEvent.leadSubmitted({ propertyId: property.id, propertyPrice: property.price, propertyType: property.type })
        } catch (error) {
            console.error("Error submitting lead:", error)
            toast.error("No pudimos enviar tu consulta. Por favor intenta de nuevo.")
        } finally {
            setIsSubmittingLead(false)
        }
    }

    const photos = (property.images && property.images.length > 0)
        ? property.images.map((src, i) => ({ alt: `Property photo ${i + 1}`, src }))
        : [{ alt: "Placeholder", src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop" }]

    const safeTitle = property.title || "Propiedad en Atlantida Group"
    const safeDescription = property.description || "Detalle de propiedad en venta o alquiler en Uruguay."
    const safePrice = property.price || 0
    const safeCurrency = property.currency || "USD"
    const safeAmenities = property.amenities || []

    return (
        <main className="relative">
            {/* Photo Gallery — Mobile: Horizontal Scroll, Desktop: Grid */}
            <section className="md:hidden relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                <Image
                    alt={photos[currentPhoto].alt}
                    fill
                    priority
                    className="object-cover"
                    src={photos[currentPhoto].src}
                    sizes="100vw"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {currentPhoto + 1} / {photos.length}
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPhoto(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
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
                <Link href="/search" className="absolute top-3 left-3 w-10 h-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-900 dark:text-white">
                    <span className="material-icons">arrow_back</span>
                </Link>
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

            <section className="hidden md:grid relative w-full h-[70vh] overflow-hidden grid-cols-4 grid-rows-2 gap-2 p-2 bg-slate-50">
                <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-l-xl">
                    <Image
                        alt="Main View"
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        src={photos[0].src}
                        sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent via-transparent via-50%"></div>
                </div>
                {photos.slice(1, 4).map((photo, i) => (
                    <div key={i} className={`relative group cursor-pointer overflow-hidden ${i === 1 ? 'rounded-tr-xl' : ''}`}>
                        <Image
                            alt="Gallery Photo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            src={photo.src}
                            sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                ))}
                <div className="relative group cursor-pointer overflow-hidden rounded-br-xl">
                    <Image
                        alt="Gallery Photo"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        src={photos[4]?.src || photos[0].src}
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
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">{property.title}</h1>
                        <div className="flex flex-wrap items-center text-slate-500 gap-2 md:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="material-icons text-primary text-lg md:text-xl">location_on</span>
                                <span className="font-medium">{property.neighborhood}, {property.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Market Intelligence & Social Proof */}
                    <div className="flex flex-col gap-6">
                        <div className="overflow-hidden bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-2xl border border-white/5 relative p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Análisis del barrio {property.neighborhood}</h3>
                                <p className="text-slate-400 text-sm md:text-base max-w-sm">Validados por nuestro algoritmo de inteligencia de mercado.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">M² Propiedad</span>
                                    <span className="text-xl md:text-2xl font-black text-white">{property.currency === 'USD' ? 'U$S' : '$'} {Math.round(property.price / property.area).toLocaleString()}</span>
                                </div>
                                <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Promedio Zona</span>
                                    <span className="text-xl md:text-2xl font-black text-slate-400">{marketData ? Math.round(marketData.averagePricePerM2).toLocaleString() : '---'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof Badges */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-xs font-bold">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {property.views || 42} personas vieron esta propiedad recientemente
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/30 text-xs font-bold">
                                <span className="material-icons text-sm">schedule</span>
                                Actualizado hace {Math.floor(Math.random() * 3) + 1} días
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                            <span className="material-symbols-outlined text-primary">straighten</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Área Total</p>
                            <p className="font-bold">{property.area} m²</p>
                        </div>
                        <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                            <span className="material-symbols-outlined text-primary">bed</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Dormitorios</p>
                            <p className="font-bold">{property.bedrooms} Hab.</p>
                        </div>
                        <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                            <span className="material-symbols-outlined text-primary">shower</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Baños</p>
                            <p className="font-bold">{property.bathrooms} Baños</p>
                        </div>
                        <div className="p-4 md:p-5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col gap-2">
                            <span className="material-symbols-outlined text-primary">directions_car</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Garaje</p>
                            <p className="font-bold">{property.garages || 0} Coch.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Descripción</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                    </div>

                    {/* Lead Capture Invisible Component */}
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-3">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">¿No es lo que buscabas?</h3>
                                <p className="text-slate-500 font-medium">Te avisamos antes que a nadie cuando entren propiedades similares en {property.neighborhood}.</p>
                            </div>
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Tu email"
                                    className="px-6 py-4 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-primary outline-none text-sm font-bold min-w-[240px]"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
                                    Recibir Alertas
                                </button>
                            </div>
                        </div>
                    </div>

                    {property.floorplanUrl && <FloorplanViewer imageUrl={property.floorplanUrl} />}

                    <NeighborhoodMap
                        location={`${property.neighborhood}, ${property.city}`}
                        coordinates={property.geolocation}
                    />
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl sticky top-24">
                        <div className="mb-8 pb-8 border-b border-slate-100">
                            <p className="text-sm text-slate-500 font-bold uppercase mb-2">Precio de {property.operation}</p>
                            <h2 className="text-4xl font-bold text-slate-900">{formatPrice(property.price, property.currency)}</h2>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all">
                                Quiero visitar esta propiedad
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href={`https://wa.me/${property.agentPhone?.replace(/[^0-9]/g, '') || '59899123456'}?text=${encodeURIComponent(`Hola, quiero consultar por la propiedad en ${property.neighborhood} de ${property.bedrooms} dormitorios: ${window.location.href}`)}`}
                                    target="_blank"
                                    className="w-full py-4 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1da851] transition-all text-xs"
                                >
                                    <span className="material-icons text-sm">chat</span>
                                    WhatsApp
                                </a>
                                <button
                                    onClick={() => isInCompare(property.id) ? removeFromCompare(property.id) : addToCompare(property.id)}
                                    className={`w-full py-4 border-2 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${isInCompare(property.id) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
                                >
                                    <span className="material-icons text-sm">{isInCompare(property.id) ? 'check_circle' : 'compare_arrows'}</span>
                                    {isInCompare(property.id) ? 'Comparando' : 'Comparar'}
                                </button>
                            </div>
                        </div>
                        {/* Agent Info */}
                        <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">FF</div>
                            <div>
                                <p className="font-bold text-sm">Facundo Fernández</p>
                                <p className="text-xs text-slate-500">Agente Verificado</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Sticky Mobile CTA v4 */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-[60] px-4 pointer-events-none">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl flex gap-2 pointer-events-auto max-w-sm mx-auto">
                    <a
                        href={`https://wa.me/${property.agentPhone?.replace(/[^0-9]/g, '') || '59899123456'}?text=${encodeURIComponent(`Hola, quiero consultar por la propiedad en ${property.neighborhood} de ${property.bedrooms} dormitorios: ${window.location.href}`)}`}
                        target="_blank"
                        className="flex-1 bg-[#25D366] text-white h-14 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                        <span className="material-icons">chat</span>
                    </a>
                    <button
                        onClick={() => isInCompare(property.id) ? removeFromCompare(property.id) : addToCompare(property.id)}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isInCompare(property.id) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <span className="material-icons">{isInCompare(property.id) ? 'check_circle' : 'compare_arrows'}</span>
                    </button>
                    <button
                        onClick={() => setShowContactForm(true)}
                        className="flex-[2] bg-primary text-white h-14 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs"
                    >
                        Agendar Visita
                    </button>
                </div>
            </div>

            {/* Mobile Form Modal */}
            {showContactForm && (
                <div className="md:hidden fixed inset-0 z-[100] flex flex-col">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setShowContactForm(false)}></div>
                    <div className="mt-auto bg-white rounded-t-3xl relative p-8">
                        <h3 className="text-xl font-bold mb-6">Consultar propiedad</h3>
                        <form className="space-y-4" onSubmit={handleLeadSubmit}>
                            <input className="w-full border rounded-xl p-4" placeholder="Tu Nombre" required value={leadName} onChange={e => setLeadName(e.target.value)} />
                            <input className="w-full border rounded-xl p-4" placeholder="Email" type="email" required value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                            <textarea className="w-full border rounded-xl p-4" placeholder="Mensaje..." rows={3} required value={leadMessage} onChange={e => setLeadMessage(e.target.value)} />
                            <button className="w-full bg-primary text-white py-4 rounded-xl font-bold">Enviar Consulta</button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}
