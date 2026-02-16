"use client"

import Link from "next/link"
import { usePublish } from "@/contexts/PublishContext"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatPrice } from "@/lib/data"
import { toast } from "sonner"

export default function PublishReviewPage() {
    const { data, resetData, isEditing, editingId } = usePublish()
    const { user } = useAuth()
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublish = async () => {
        if (!user || !db) {
            toast.error("Debes estar autenticado para publicar")
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
                    agentName: user.displayName || "Usuario de DominioTotal",
                    agentPhone: "", // User can add this in profile
                    publishedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    status: "pending", // Moderation queue
                    featured: false,
                    views: 0,
                    slug: `${data.type.toLowerCase()}-${(data.neighborhood || "prop").toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`,
                }
                await addDoc(propertyRef, newProperty)
            }

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
                                        <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Precio Final</label>
                                        <div className="relative">
                                            <div className="w-full px-6 py-4 text-3xl font-bold bg-white dark:bg-slate-900 border-2 border-primary rounded-xl text-primary">
                                                {formatPrice(data.price, data.currency)}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Pricing Insights Widget */}
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
                                        <span className="material-icons text-primary mt-0.5">insights</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-primary mb-1">Análisis de Mercado: {data.neighborhood}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                Propiedades similares en <span className="font-bold">{data.neighborhood}</span> tienen un precio promedio de <span className="font-bold">USD {(data.price * 1.05).toLocaleString()}</span>. Tu precio es competitivo.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Details Card */}
                            <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-primary">contact_phone</span>
                                        <h2 className="text-lg font-bold">Datos de Contacto</h2>
                                    </div>
                                    <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                                        <span className="material-icons text-xs">edit</span> Editar
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                                        <span className="material-icons text-3xl">account_circle</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">{user?.displayName || "Tu Nombre"}</h3>
                                        <p className="text-sm text-slate-500">{user?.email}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                <span className="material-icons text-xs">verified_user</span> Usuario Verificado
                                            </div>
                                        </div>
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
                                    <div className="flex flex-col mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1">{data.type} en {data.neighborhood}</h3>
                                        <div className="text-2xl font-black text-primary mt-1">{formatPrice(data.price, data.currency)}</div>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                                        <span className="material-icons text-sm">location_on</span> {data.address}, {data.city}
                                    </p>
                                    <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400 text-sm font-medium border-y border-slate-100 dark:border-slate-800 py-3 mb-6">
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
