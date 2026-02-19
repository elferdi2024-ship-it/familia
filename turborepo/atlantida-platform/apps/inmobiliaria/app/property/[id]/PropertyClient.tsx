"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { db } from "@repo/lib/firebase"
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc, increment } from "firebase/firestore"
import { Property, formatPrice, AMENITIES_BY_CATEGORY } from "@/lib/data"
import { FavoriteButton } from "@/components/FavoriteButton"
import { FloorplanViewer } from "@/components/FloorplanViewer"
import { NeighborhoodMap } from "@/components/NeighborhoodMap"
import { notifyLead } from "@/actions/notify-lead"
import { toast } from "sonner"
import { trackEvent } from "@repo/lib/tracking"

interface PropertyClientProps {
    initialProperty: Property;
    initialAgentInfo: any;
}

export default function PropertyClient({ initialProperty, initialAgentInfo }: PropertyClientProps) {
    const [property] = useState<Property>(initialProperty)
    const [showContactForm, setShowContactForm] = useState(false)
    const [currentPhoto, setCurrentPhoto] = useState(0)

    // Lead Form State
    const [leadName, setLeadName] = useState("")
    const [leadEmail, setLeadEmail] = useState("")
    const [leadMessage, setLeadMessage] = useState("Hola, estoy interesado en recibir más información sobre esta propiedad...")
    const [isSubmittingLead, setIsSubmittingLead] = useState(false)
    const [leadSuccess, setLeadSuccess] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [contactType, setContactType] = useState<"contact" | "visit">("contact") // "contact" or "visit"
    const [visitDate, setVisitDate] = useState("")
    const [visitTime, setVisitTime] = useState("")
    const [agentInfo] = useState(initialAgentInfo)

    useEffect(() => {
        // Track view on load (client-side only for better accuracy and to avoid SSR double counting if we had it)
        if (property.id) {
            trackEvent.propertyViewed(property.id)

            // Increment views in Firestore
            if (db) {
                const docRef = doc(db, "properties", property.id)
                updateDoc(docRef, {
                    views: increment(1)
                }).catch(e => console.error("Error updating views:", e))
            }
        }
    }, [property.id])

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!property || !db) return

        setIsSubmittingLead(true)
        try {
            // 1. Save to Firestore
            await addDoc(collection(db, "leads"), {
                propertyId: property.id,
                propertyTitle: property.title,
                agentId: property.userId || "admin",
                leadName,
                leadEmail,
                leadMessage,
                contactType,
                visitDate: contactType === "visit" ? visitDate : null,
                visitTime: contactType === "visit" ? visitTime : null,
                createdAt: serverTimestamp(),
                status: "new"
            })

            // 2. Notify via Web3Forms (Email)
            const web3FormsData = {
                access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
                subject: `Nueva Consulta: ${property.title}`,
                from_name: "MiBarrio.uy - Leads",
                name: leadName,
                email: leadEmail,
                message: leadMessage,
                tipo_consulta: contactType === "visit" ? "Solicitud de Visita" : "Contacto General",
                fecha_visita: contactType === "visit" ? visitDate : "N/A",
                hora_visita: contactType === "visit" ? visitTime : "N/A",
                propiedad_url: `https://mibarrio.uy/property/${property.id}`,
                telefono_agente: agentInfo?.phone || property.agentPhone
            }

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(web3FormsData)
            })

            if (!response.ok) {
                console.warn("Web3Forms notification failed, but lead saved to DB")
            }

            // 3. Track Metric
            trackEvent.leadSubmitted({ propertyId: property.id, type: contactType })

            setLeadSuccess(true)
            toast.success(contactType === "visit" ? "¡Solicitud de visita enviada!" : "¡Consulta enviada!")

        } catch (error) {
            console.error(error)
            toast.error("Hubo un error al enviar la consulta. Reintenta.")
        } finally {
            setIsSubmittingLead(false)
        }
    }

    if (!property) return null

    // Helper for formatting
    const shareProperty = () => {
        if (navigator.share) {
            navigator.share({
                title: property.title,
                text: property.description,
                url: window.location.href,
            })
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 lg:pb-0">
            {/* Gallery Section */}
            <section className="relative h-[40vh] lg:h-[70vh] group">
                <Image
                    src={property.images[currentPhoto]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Back button */}
                <Link
                    href="/search"
                    className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-white transition-all z-10"
                >
                    <span className="material-icons">arrow_back</span>
                </Link>

                {/* Actions */}
                <div className="absolute top-6 right-6 flex gap-3 z-10">
                    <button
                        onClick={shareProperty}
                        className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-white transition-all"
                    >
                        <span className="material-icons text-xl">share</span>
                    </button>
                    <FavoriteButton propertyId={property.id} />
                </div>

                {/* Thumbnails Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {property.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPhoto(idx)}
                            className={`relative min-w-[80px] h-16 rounded-lg overflow-hidden border-2 transition-all ${currentPhoto === idx ? 'border-primary scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <Image src={img} alt={`Photo ${idx}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1 space-y-10">
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">{property.type}</span>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full uppercase tracking-wider">En {property.operation}</span>
                                {property.badge && (
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">{property.badge}</span>
                                )}
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                {property.title}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500">
                                <span className="material-icons text-red-500">place</span>
                                <p className="text-lg font-medium">{property.address}, {property.neighborhood}</p>
                            </div>
                        </div>

                        {/* Price Card Mobile - Redesigned to be subtle and premium */}
                        <div className="lg:hidden bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{property.operation}</p>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {formatPrice(property.price, property.currency)}
                                </h2>
                            </div>
                            {property.gastosComunes && (
                                <div className="text-right border-l border-slate-100 dark:border-slate-800 pl-6">
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-0.5">G. Comunes</p>
                                    <p className="text-sm font-extrabold text-slate-600 dark:text-slate-400">
                                        ${property.gastosComunes.toLocaleString()} <span className="text-[9px]">UYU</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: "king_bed", label: "Dormitorios", value: property.bedrooms },
                                { icon: "bathtub", label: "Baños", value: property.bathrooms },
                                { icon: "straighten", label: "Área Total", value: `${property.area}m²` },
                                { icon: "directions_car", label: "Garages", value: property.garages }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-2">
                                    <span className="material-icons text-primary">{stat.icon}</span>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{stat.label}</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Descripción</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-10 text-center">Amenidades y Servicios</h3>
                            <div className="space-y-12">
                                {Object.entries(AMENITIES_BY_CATEGORY).map(([category, items]) => {
                                    // Filter category items to show only those present in the property
                                    const propertyAmenities = items.filter(item => property.amenities.includes(item.name));
                                    if (propertyAmenities.length === 0) return null;

                                    return (
                                        <div key={category} className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">{category}</h4>
                                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {propertyAmenities.map((amenity, i) => (
                                                    <div key={i} className="flex items-center gap-4 group">
                                                        <div className="w-10 h-10 rounded-[12px] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                                                            <span className="material-icons text-primary/80 group-hover:text-primary transition-colors text-lg">{amenity.icon}</span>
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300 font-bold text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{amenity.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Rental Guarantees Section */}
                        {(property.operation === "Alquiler" || property.operation === "Alquiler Temporal") && (
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">Garantías Aceptadas</h3>
                                {property.acceptedGuarantees && property.acceptedGuarantees.length > 0 ? (
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {property.acceptedGuarantees.map((guarantee, i) => (
                                            <div key={i} className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold shadow-sm flex items-center gap-2">
                                                <span className="material-icons text-emerald-500 text-sm">verified_user</span>
                                                {guarantee}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 font-medium">Consultar garantías aceptadas con el agente.</p>
                                )}
                            </div>
                        )}

                        {/* Market Intelligence Teaser */}
                        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <h3 className="text-2xl font-black">Market Intelligence</h3>
                                    <p className="text-blue-100 leading-relaxed">
                                        Esta propiedad está un <span className="font-bold text-white underline">12.5% por debajo</span> del precio promedio en {property.neighborhood}. Es una oportunidad de inversión Clase A.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                        <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl border border-white/20">
                                            <p className="text-[10px] uppercase font-bold text-blue-100">Plusvalía Est.</p>
                                            <p className="text-lg font-black">+4.2% anual</p>
                                        </div>
                                        <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl border border-white/20">
                                            <p className="text-[10px] uppercase font-bold text-blue-100">ROI Alquiler</p>
                                            <p className="text-lg font-black">5.8% neto</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-64 h-48 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20 relative overflow-hidden">
                                    <div className="absolute inset-4 flex items-end gap-1">
                                        {[40, 60, 45, 75, 55, 90, 85].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <span className="relative font-bold text-xs uppercase tracking-widest bg-white text-blue-600 px-3 py-1 rounded-full shadow-lg">Tendencia Alcista</span>
                                </div>
                            </div>
                        </div>

                        {/* Map & Neighborhood */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ubicación y Entorno</h3>
                                <div className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                                    <span className="material-icons text-sm">explore</span>
                                    <span className="text-sm font-bold">Ver en Google Maps</span>
                                </div>
                            </div>
                            <div className="h-[400px] rounded-3xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
                                <NeighborhoodMap
                                    location={`${property.address}, ${property.neighborhood}`}
                                    coordinates={property.geolocation}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: "school", label: "Colegios", value: "4 a menos de 1km" },
                                    { icon: "shopping_bag", label: "Comercios", value: "Shopping a 5 min" },
                                    { icon: "park", label: "Áreas Verdes", value: "Parque Rodó a 200m" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <span className="material-icons text-primary/60">{item.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{item.label}</p>
                                            <p className="text-xs text-slate-500 font-medium">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floorplan Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center">Plano de la Propiedad</h3>
                            <FloorplanViewer imageUrl={property.floorplanUrl || "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1200&auto=format&fit=crop"} />
                        </div>
                    </div>

                    {/* Desktop Sidebar (Contact) */}
                    <div className="hidden lg:block w-[400px]">
                        <aside className="sticky top-12 space-y-6">
                            {/* Price Card Desktop */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="material-icons text-9xl">savings</span>
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Precio de {property.operation}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-5xl font-black text-slate-900 dark:text-white">{formatPrice(property.price, property.currency)}</h2>
                                        </div>
                                        {property.gastosComunes && (
                                            <p className="mt-2 text-slate-500 font-medium">Gastos Comunes: ${property.gastosComunes.toLocaleString()} UYU</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                if (!showPhone) {
                                                    setShowPhone(true)
                                                    trackEvent.phoneRevealed(property.id)
                                                } else {
                                                    const phone = agentInfo?.phone || property.agentPhone
                                                    window.open(`https://wa.me/${phone?.replace(/[^0-9]/g, '')}`, '_blank')
                                                }
                                            }}
                                            className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                                            {showPhone ? "WhatsApp" : "Ver WhatsApp"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (!showPhone) {
                                                    setShowPhone(true)
                                                    trackEvent.phoneRevealed(property.id)
                                                } else {
                                                    const phone = agentInfo?.phone || property.agentPhone
                                                    window.location.href = `tel:${phone?.replace(/[^0-9]/g, '')}`
                                                }
                                            }}
                                            className="w-full py-4 bg-white border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                                        >
                                            <span className="material-icons">phone</span>
                                            Llamar Directo
                                        </button>
                                    </div>
                                </div>
                                <div className="my-8 flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center">
                                        <Image
                                            alt="Agent"
                                            fill
                                            className="object-cover"
                                            src={agentInfo?.photoURL || property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"}
                                            sizes="56px"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{agentInfo?.displayName || property.agentName || "Agente MiBarrio.uy"}</p>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {agentInfo?.agencyName || "Agente Verificado"} • {showPhone ? (agentInfo?.phone || property.agentPhone) : "Teléfono oculto"}
                                        </p>
                                        {!showPhone && (
                                            <button
                                                onClick={() => {
                                                    setShowPhone(true)
                                                    trackEvent.phoneRevealed(property.id)
                                                }}
                                                className="text-[10px] text-primary font-bold hover:underline"
                                            >
                                                Revelar número
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Lead Form Desktop */}
                                <div className="space-y-4">
                                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setContactType('contact')}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${contactType === "contact" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-slate-500"}`}
                                        >
                                            Inhibir / Consultar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setContactType('visit')}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${contactType === "visit" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-slate-500"}`}
                                        >
                                            Solicitar Visita
                                        </button>
                                    </div>

                                    {leadSuccess ? (
                                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-in zoom-in-95 duration-300">
                                            <span className="material-icons text-green-500 text-4xl mb-2">check_circle</span>
                                            <h4 className="font-bold text-green-900">¡Consulta Enviada!</h4>
                                            <p className="text-sm text-green-700 mt-1">El agente se contactará contigo a la brevedad.</p>

                                            {agentInfo?.workingHours && (
                                                <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-100/50 text-[11px] text-slate-600">
                                                    <p className="font-bold uppercase mb-1">Horario de Atención:</p>
                                                    <p>{agentInfo.workingHours}</p>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setLeadSuccess(false)}
                                                className="mt-4 text-xs font-bold text-green-800 hover:underline"
                                            >
                                                Enviar otra consulta
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                                            {contactType === "visit" && (
                                                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Fecha</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={visitDate}
                                                            onChange={(e) => setVisitDate(e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Horario</label>
                                                        <select
                                                            required
                                                            value={visitTime}
                                                            onChange={(e) => setVisitTime(e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                        >
                                                            <option value="">Elegir...</option>
                                                            <option value="9:00 - 11:00">9:00 - 11:00</option>
                                                            <option value="11:00 - 13:00">11:00 - 13:00</option>
                                                            <option value="14:00 - 16:00">14:00 - 16:00</option>
                                                            <option value="16:00 - 18:00">16:00 - 18:00</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="lead-name-desktop" className="sr-only">Nombre completo</label>
                                                <input
                                                    id="lead-name-desktop"
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="Nombre completo"
                                                    type="text"
                                                    required
                                                    autoComplete="name"
                                                    value={leadName}
                                                    onChange={(e) => setLeadName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lead-email-desktop" className="sr-only">Email de contacto</label>
                                                <input
                                                    id="lead-email-desktop"
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder="Email de contacto"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    value={leadEmail}
                                                    onChange={(e) => setLeadEmail(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lead-msg-desktop" className="sr-only">Mensaje</label>
                                                <textarea
                                                    id="lead-msg-desktop"
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    placeholder={contactType === "visit" ? "Me gustaría visitar la propiedad..." : "Consulta..."}
                                                    rows={3}
                                                    required
                                                    value={leadMessage}
                                                    onChange={(e) => setLeadMessage(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <button
                                                disabled={isSubmittingLead}
                                                className="w-full bg-slate-900 dark:bg-primary text-white py-4 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg"
                                                type="submit"
                                            >
                                                {isSubmittingLead ? "Enviando..." : (contactType === "visit" ? "Solicitar Visita" : "Enviar Consulta")}
                                            </button>
                                        </form>
                                    )}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/20 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <span className="material-icons text-primary underline-offset-4">insights</span>
                                        <div>
                                            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Oportunidad de Mercado</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">Este inmueble tiene un precio por m² un <span className="font-bold text-slate-900 dark:text-white">12% menor</span> a propiedades similares en la zona.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Mobile Contact Bar - DEFINITIVE FIX: HIGH Z-INDEX */}
            <div
                className="lg:hidden fixed bottom-16 left-0 right-0 z-[999] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
                style={{ zIndex: 999 }}
            >
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Precio de {property.operation}</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">{formatPrice(property.price, property.currency)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={() => {
                                if (!showPhone) {
                                    setShowPhone(true)
                                    trackEvent.phoneRevealed(property.id)
                                } else {
                                    const phone = agentInfo?.phone || property.agentPhone
                                    window.location.href = `tel:${phone?.replace(/[^0-9]/g, '')}`
                                }
                            }}
                            className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:bg-slate-100 dark:active:bg-slate-700"
                        >
                            <span className="material-icons">phone</span>
                        </button>
                        <button
                            onClick={() => {
                                if (!showPhone) {
                                    setShowPhone(true)
                                    trackEvent.phoneRevealed(property.id)
                                } else {
                                    const phone = agentInfo?.phone || property.agentPhone
                                    window.open(`https://wa.me/${phone?.replace(/[^0-9]/g, '')}`, '_blank')
                                }
                            }}
                            className="h-12 px-5 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>
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
                    <div className="mt-auto bg-white dark:bg-slate-900 rounded-t-3xl relative z-10 p-6 pb-8 safe-bottom animate-in slide-in-from-bottom duration-300">
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center">
                                <Image
                                    alt="Agent"
                                    fill
                                    className="object-cover"
                                    src={agentInfo?.photoURL || property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"}
                                    sizes="48px"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{agentInfo?.displayName || property.agentName || "Agente MiBarrio.uy"}</p>
                                <p className="text-xs text-slate-500">{agentInfo?.agencyName || 'Agente Verificado'}</p>
                            </div>
                        </div>
                        {leadSuccess ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/20 rounded-xl p-8 text-center">
                                <span className="material-icons text-green-500 text-5xl mb-4">check_circle</span>
                                <h4 className="text-xl font-bold text-green-900 dark:text-green-400">¡Consulta Enviada!</h4>
                                <p className="text-sm text-green-700 dark:text-green-500/80 mt-2">Pronto recibirás una respuesta en tu email.</p>

                                {agentInfo?.workingHours && (
                                    <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-green-100 dark:border-green-800/20 text-xs text-slate-600 dark:text-slate-400">
                                        <p className="font-bold uppercase mb-1">Horario de Atención:</p>
                                        <p>{agentInfo.workingHours}</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setLeadSuccess(false)}
                                    className="mt-6 font-bold text-green-800 dark:text-green-400 border-b-2 border-green-200 dark:border-green-800 pb-1"
                                >
                                    Enviar otra consulta
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleLeadSubmit} className="space-y-4">
                                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setContactType('contact')}
                                        className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${contactType === "contact" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-slate-500"}`}
                                    >
                                        Consultar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContactType('visit')}
                                        className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${contactType === "visit" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-slate-500"}`}
                                    >
                                        Solicitar Visita
                                    </button>
                                </div>

                                {contactType === "visit" && (
                                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Fecha</label>
                                            <input
                                                type="date"
                                                required
                                                value={visitDate}
                                                onChange={(e) => setVisitDate(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Horario</label>
                                            <select
                                                required
                                                value={visitTime}
                                                onChange={(e) => setVisitTime(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="">Elegir...</option>
                                                <option value="9:00 - 11:00">9:00 - 11:00</option>
                                                <option value="11:00 - 13:00">11:00 - 13:00</option>
                                                <option value="14:00 - 16:00">14:00 - 16:00</option>
                                                <option value="16:00 - 18:00">16:00 - 18:00</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Nombre completo"
                                    type="text"
                                    required
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                />
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Email"
                                    type="email"
                                    required
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                />
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder={contactType === "visit" ? "Me gustaría visitar la propiedad..." : "Consulta..."}
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
                                    {isSubmittingLead ? "Enviando..." : (contactType === "visit" ? "Solicitar Visita" : "Enviar Consulta")}
                                </button>
                            </form>
                        )}
                        <button
                            onClick={() => setShowContactForm(false)}
                            className="w-full mt-4 py-3 text-slate-400 text-sm font-bold"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
