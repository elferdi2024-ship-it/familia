"use client"

import Link from "next/link"
import { usePublish } from "@/contexts/PublishContext"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@repo/lib/firebase"
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/data"
import { trackEvent } from "@/lib/tracking"
import { toast } from "sonner"

export default function PublishReviewPage() {
    const { data, updateData, resetData, isEditing, editingId } = usePublish()
    const { user } = useAuth()
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)
    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [marketAnalysis, setMarketAnalysis] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)

    // Real Market Analysis Logic
    useEffect(() => {
        const fetchMarketData = async () => {
            if (!data.neighborhood || !data.type || !data.operation || !db) return

            setAnalyzing(true)
            try {
                // Query properties with same neighborhood, type, and operation
                const q = query(
                    collection(db, "properties"),
                    where("neighborhood", "==", data.neighborhood),
                    where("type", "==", data.type),
                    where("operation", "==", data.operation),
                    where("status", "==", "active"),
                    where("currency", "==", data.currency) // Compare same currency
                )

                const querySnapshot = await getDocs(q)
                const properties = querySnapshot.docs.map(doc => doc.data())

                // Filter out outliers if efficient, or just take simple average for now
                const validPrices = properties
                    .map((p: any) => Number(p.price))
                    .filter((p: number) => p > 0)

                if (validPrices.length === 0) {
                    setMarketAnalysis(null) // No enough data
                    return
                }

                const total = validPrices.reduce((acc: number, curr: number) => acc + curr, 0)
                const averagePrice = total / validPrices.length
                const currentPrice = Number(data.price)

                if (!currentPrice) return

                let analysis = {
                    label: "Precio de Mercado",
                    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
                    icon: "insights",
                    description: `Tu precio está alineado con el promedio de la zona (${formatPrice(averagePrice, data.currency)}).`,
                    count: validPrices.length
                }

                if (currentPrice < averagePrice * 0.8) {
                    analysis = {
                        label: "Oportunidad",
                        color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
                        icon: "trending_down",
                        description: `Tu precio es muy competitivo, un ${((1 - currentPrice / averagePrice) * 100).toFixed(0)}% más bajo que el promedio (${formatPrice(averagePrice, data.currency)}).`,
                        count: validPrices.length
                    }
                } else if (currentPrice > averagePrice * 1.2) {
                    analysis = {
                        label: "Premium / Alto",
                        color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
                        icon: "trending_up",
                        description: `Tu precio está un ${((currentPrice / averagePrice - 1) * 100).toFixed(0)}% por encima del promedio de la zona (${formatPrice(averagePrice, data.currency)}).`,
                        count: validPrices.length
                    }
                }

                setMarketAnalysis(analysis)

            } catch (error) {
                console.error("Error analyzing market:", error)
                // Fallback to null or simple message
            } finally {
                setAnalyzing(false)
            }
        }

        const timer = setTimeout(() => {
            fetchMarketData()
        }, 500) // Debounce

        return () => clearTimeout(timer)
    }, [data.neighborhood, data.type, data.operation, data.currency, data.price])

    const handlePublish = async () => {
        if (!user || !db) {
            toast.error("Debes estar autenticado para publicar")
            return
        }

        if (!data.agentPhone || data.agentPhone.length < 8) {
            toast.error("Por favor ingresa un número de contacto válido")
            return
        }

        setIsPublishing(true)
        try {
            if (isEditing && editingId) {
                // UPDATE
                const docRef = doc(db, "properties", editingId)
                const updateProperty = {
                    ...data,
                    updatedAt: serverTimestamp(),
                }
                await updateDoc(docRef, updateProperty)
            } else {
                // CREATE
                const propertyRef = collection(db, "properties")
                const title = data.description?.slice(0, 200) || `${data.type} ${data.operation} en ${data.neighborhood || data.address}`
                const newProperty = {
                    ...data,
                    title: title.length >= 10 ? title : `${data.type} ${data.operation} en ${data.neighborhood || data.address}`,
                    userId: user.uid,
                    agentName: user.displayName || "Usuario de Atlantida Group",
                    agentPhone: data.agentPhone,
                    publishedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: "active", // Published immediately
                    featured: false,
                    views: 0,
                    slug: `${data.type.toLowerCase()}-${(data.neighborhood || "prop").toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`,
                }
                await addDoc(propertyRef, newProperty)
            }

            trackEvent.publishStep3Completed()
            resetData()
            router.push("/publish/success")
        } catch (error) {
            console.error("Error publishing property:", error)
            toast.error("Error al publicar la propiedad. Por favor intente de nuevo.")
        } finally {
            setIsPublishing(false)
        }
    }
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pt-20">

            <main className="flex-grow py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Step Progress Indicator */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {isEditing ? "Guardar Cambios" : "Finalizar Publicación"}
                            </h1>
                            <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Revisión</span>
                        </div>
                        <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-primary w-full rounded-full"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                            <span>Ubicación</span>
                            <span>Multimedia</span>
                            <span className="text-primary font-bold">Precio y Revisión</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Inputs */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Pricing Card */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-icons text-primary">payments</span>
                                    <h2 className="text-lg font-bold">Definir Precio</h2>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Operación Seleccionada</label>
                                        <div className="text-xl font-bold p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
                                            {data.operation} de {data.type}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">Precio Final</label>
                                            <button
                                                onClick={() => setIsEditingPrice(!isEditingPrice)}
                                                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                                            >
                                                <span className="material-icons text-sm">{isEditingPrice ? 'check' : 'edit'}</span>
                                                {isEditingPrice ? 'Listo' : 'Editar Precio'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            {isEditingPrice ? (
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
                                                    <input
                                                        type="number"
                                                        value={data.price}
                                                        onChange={(e) => updateData({ price: Number(e.target.value) })}
                                                        className="w-full pl-10 pr-4 py-4 text-3xl font-bold bg-white dark:bg-slate-900 border-2 border-primary rounded-xl text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full px-6 py-4 text-3xl font-bold bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-primary flex items-center justify-between group cursor-pointer hover:border-primary transition-colors" onClick={() => setIsEditingPrice(true)}>
                                                    {formatPrice(data.price, data.currency)}
                                                    <span className="material-icons text-slate-300 group-hover:text-primary transition-colors">edit</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pricing Insights Widget - Dynamic */}
                                    {marketAnalysis && (
                                        <div className={`border rounded-xl p-4 flex items-start gap-4 transition-colors ${marketAnalysis.color}`}>
                                            <span className="material-icons mt-0.5">{marketAnalysis.icon}</span>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold">{marketAnalysis.label}</h4>
                                                    <span className="text-[10px] uppercase font-black tracking-wider opacity-70 px-2 py-0.5 border border-current rounded-full">Beta</span>
                                                </div>
                                                <p className="text-sm opacity-90 leading-relaxed">
                                                    {marketAnalysis.description}
                                                    <span className="block mt-1 text-xs opacity-70">Basado en datos simulados del mercado.</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Contact Details Card */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-primary">contact_phone</span>
                                        <h2 className="text-lg font-bold">Datos de Contacto</h2>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 overflow-hidden">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-icons text-3xl">account_circle</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{user?.displayName || "Tu Nombre"}</h3>
                                            <p className="text-sm text-slate-500">{user?.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="material-icons text-xs text-green-500">verified_user</span>
                                                <span className="text-xs font-medium text-slate-400">Usuario Verificado</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide">WhatsApp / Teléfono de contacto</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400">phone</span>
                                            <input
                                                type="tel"
                                                placeholder="Ej: 099 123 456"
                                                value={data.agentPhone}
                                                onChange={(e) => updateData({ agentPhone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary focus:ring-0 transition-all font-bold"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400">Este número será visible para los interesados en tu propiedad.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Preview & Action */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Preview Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
                                <div className="relative">
                                    <img className="w-full h-56 object-cover" alt="Property preview" src={data.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"} />
                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                        Vista Previa
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col mb-4 relative group">
                                        <Link href="/publish/location" className="absolute top-0 right-0 p-1 text-slate-300 hover:text-primary transition-colors" title="Editar Ubicación">
                                            <span className="material-icons text-sm">edit</span>
                                        </Link>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 pr-6">{data.type} en {data.neighborhood}</h3>
                                        <div className="text-2xl font-black text-primary mt-1">{formatPrice(data.price, data.currency)}</div>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                                        <span className="material-icons text-sm">location_on</span> {data.address}, {data.city}
                                    </p>
                                    <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400 text-sm font-medium border-y border-slate-100 dark:border-slate-800 py-3 mb-6 relative group">
                                        <Link href="/publish/details" className="absolute top-1/2 -translate-y-1/2 right-0 p-1 text-slate-300 hover:text-primary transition-colors" title="Editar Características">
                                            <span className="material-icons text-sm">edit</span>
                                        </Link>
                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-slate-400">bed</span> {data.bedrooms} Dorm.</span>
                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-slate-400">shower</span> {data.bathrooms} Baño</span>
                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm text-slate-400">square_foot</span> {data.area}m²</span>
                                    </div>
                                    <div className="space-y-3">
                                        <button
                                            onClick={handlePublish}
                                            disabled={isPublishing}
                                            className={`w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 group ${isPublishing ? "opacity-70 cursor-not-allowed" : ""}`}
                                        >
                                            {isPublishing ? (
                                                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <span>{isEditing ? "GUARDAR CAMBIOS" : "PUBLICAR AHORA"}</span>
                                                    <span className="material-icons group-hover:translate-x-1 transition-transform">
                                                        {isEditing ? "save" : "rocket_launch"}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                        <Link href="/publish/details" className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                                            <span className="material-icons text-sm">arrow_back</span> Volver al paso anterior
                                        </Link>
                                    </div>
                                    <p className="mt-6 text-[11px] text-center text-slate-400 leading-tight">
                                        Al publicar, confirmas que los datos ingresados son verídicos. Tu aviso será revisado por nuestro equipo de moderación en un plazo de 2 horas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
