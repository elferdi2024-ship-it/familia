"use client"

import Link from "next/link"
import { usePublish } from "@/contexts/PublishContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense, useState } from "react"
import { PROPERTY_TYPES, OPERATIONS } from "@/lib/data"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { PublishStep1Schema } from "@/lib/validations"
import { toast } from "sonner"
import { trackEvent } from "@/lib/tracking"
import { LocationPicker } from "@/components/publish/LocationPicker"

function PublishPageContent() {
    const { data, updateData, startEditing, isEditing } = usePublish()
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get("edit")
    const { user, loading } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    useEffect(() => {
        if (editId) {
            startEditing(editId)
        }
    }, [editId])

    const handleNext = () => {
        const parsed = PublishStep1Schema.safeParse({
            address: data.address,
            type: data.type,
            operation: data.operation,
        })
        if (!parsed.success) {
            const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
            toast.error(first || "Completa los campos obligatorios")
            return
        }
        trackEvent.publishStep1Completed()
        router.push("/publish/details")
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons text-4xl text-primary">lock_person</span>
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2">Ingresa para publicar</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
                        Para publicar una propiedad en Dominio Total necesitas tener una cuenta. Es gratis y te tomará menos de 1 minuto.
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <span className="material-icons">login</span>
                        Iniciar Sesión / Registrarse
                    </button>
                    <Link href="/" className="block text-slate-400 hover:text-primary font-bold text-sm mt-8 transition-colors">
                        Volver al inicio
                    </Link>
                </div>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
        )
    }

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col pt-24 md:pt-28">
            {/* MAIN CONTENT */}
            <main className="flex-grow py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* PROGRESS BAR */}
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                                    {isEditing ? `Editando: ${data.address || 'Propiedad'}` : 'Paso 1: Información básica'}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">Cuéntanos sobre el tipo de propiedad y su ubicación.</p>
                            </div>
                            <span className="text-sm font-bold text-primary px-4 py-2 bg-primary/10 rounded-full">Paso 1 de 3</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/3 rounded-full"></div>
                        </div>
                    </div>
                    {/* FORM CARD */}
                    <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg p-8 md:p-12">
                        <section className="space-y-12">
                            {/* PROPERTY & OPERATION TYPE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <span className="material-icons text-lg">home</span>
                                        Tipo de Propiedad
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={data.type}
                                            onChange={(e) => updateData({ type: e.target.value })}
                                            className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-0 rounded-full appearance-none font-medium cursor-pointer outline-none"
                                        >
                                            {PROPERTY_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="material-icons text-slate-400 group-hover:text-primary transition-colors">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <span className="material-icons text-lg">sell</span>
                                        Operación
                                    </label>
                                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full h-16">
                                        {OPERATIONS.map(op => (
                                            <button
                                                key={op}
                                                onClick={() => updateData({ operation: op })}
                                                className={`flex-1 rounded-full font-bold transition-all flex items-center justify-center ${data.operation === op ? "bg-primary text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                    }`}
                                            >
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* LOCATION SEARCH */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <span className="material-icons text-lg">location_on</span>
                                        Ubicación de la propiedad
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-icons text-primary">search</span>
                                        <input
                                            className="w-full h-16 pl-14 pr-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-0 rounded-full font-medium"
                                            placeholder="Calle, número, barrio o ciudad..."
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => updateData({ address: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {/* MAP SECTOR */}
                                <div className="space-y-4">
                                    <div className="w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                                        <LocationPicker
                                            center={{
                                                lat: data.latitude || -34.9011,
                                                lng: data.longitude || -56.1645
                                            }}
                                            onLocationChange={(loc) => updateData({ latitude: loc.lat, longitude: loc.lng })}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <span className="material-icons text-primary text-base">info</span>
                                        Arrastra el pin para ubicar exactamente la propiedad.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-6">Barrio</label>
                                        <input
                                            className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-0 rounded-full font-medium"
                                            placeholder="Ej: Pocitos"
                                            type="text"
                                            value={data.neighborhood}
                                            onChange={(e) => updateData({ neighborhood: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-6">Apto / Casa Nº</label>
                                        <input
                                            className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary focus:ring-0 rounded-full font-medium"
                                            placeholder="Ej: 402"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* NAVIGATION BUTTONS */}
                        <div className="mt-12 md:mt-16 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800 gap-3">
                            <Link href="/my-properties" className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors px-6">
                                <span className="material-icons">arrow_back</span>
                                Volver
                            </Link>
                            <button
                                onClick={handleNext}
                                className="bg-primary text-white h-14 md:h-16 px-8 md:px-12 rounded-full font-bold text-base md:text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Siguiente
                                <span className="material-icons">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function PublishPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <PublishPageContent />
        </Suspense>
    )
}
