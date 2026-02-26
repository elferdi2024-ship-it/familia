"use client"

import Link from "next/link"
import { usePublish } from "@/contexts/PublishContext"
import { useRouter } from "next/navigation"
import { ImageUploader } from "@/components/publish/ImageUploader"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@repo/ui"
import { GUARANTEES, AMENITIES, AMENITIES_BY_CATEGORY } from "@/lib/data"
import { PublishStep2Schema } from "@repo/lib/validations"
import { toast } from "sonner"
import { trackEvent } from "@repo/lib/tracking"

export default function PublishDetailsPage() {
    const { data, updateData } = usePublish()
    const { userData } = useAuth()
    const isPremium = userData?.plan === "premium"
    const router = useRouter()

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault()
        const parsed = PublishStep2Schema.safeParse({
            images: data.images,
            price: data.price,
        })
        if (!parsed.success) {
            const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
            toast.error(first || "Completa los campos obligatorios")
            return
        }
        trackEvent.publishStep2Completed()
        router.push("/publish/review")
    }
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen flex flex-col pt-20">

            {/* Progress Tracker */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Paso 2 de 3</span>
                        <span className="text-xs font-medium text-slate-500">66% Completado</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-2/3 transition-all duration-500"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Detalles & Multimedia</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Agregue las mejores fotos de su propiedad y complete la información técnica para atraer más compradores.</p>
                <form className="space-y-10">
                    {/* Section: Multimedia */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-icons text-primary">photo_library</span>
                            <h2 className="text-lg font-semibold">Fotos y Videos</h2>
                        </div>
                        <ImageUploader
                            images={data.images}
                            onImagesChange={(urls) => updateData({ images: urls })}
                        />
                    </section>

                    {/* Section: Especificaciones */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">analytics</span>
                            <h2 className="text-lg font-semibold">Especificaciones de la Propiedad</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dormitorios</label>
                                <select
                                    value={data.bedrooms}
                                    onChange={(e) => updateData({ bedrooms: Number(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Baños</label>
                                <select
                                    value={data.bathrooms}
                                    onChange={(e) => updateData({ bathrooms: Number(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metros Cuadrados (m²)</label>
                                <div className="relative group">
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium pr-12"
                                        placeholder="Ej: 85"
                                        type="number"
                                        value={data.area || ""}
                                        onChange={(e) => updateData({ area: Number(e.target.value) })}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">m²</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Precio</label>
                                <div className="flex gap-2">
                                    <select
                                        value={data.currency}
                                        onChange={(e) => updateData({ currency: e.target.value as "USD" | "UYU" })}
                                        className="w-24 px-3 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-bold text-sm"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="UYU">UYU</option>
                                    </select>
                                    <input
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium"
                                        placeholder="Importe"
                                        type="number"
                                        value={data.price || ""}
                                        onChange={(e) => updateData({ price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Amenities */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">checklist</span>
                            <h2 className="text-lg font-semibold">Comodidades y Amenities</h2>
                        </div>
                        <div className="space-y-8">
                            {Object.entries(AMENITIES_BY_CATEGORY).map(([category, items]) => (
                                <div key={category} className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">{category}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        {items.map(amenity => (
                                            <label key={amenity.name} className="flex items-center gap-3 cursor-pointer group min-w-0">
                                                <input
                                                    type="checkbox"
                                                    checked={data.amenities.includes(amenity.name)}
                                                    onChange={(e) => {
                                                        const newAmenities = e.target.checked
                                                            ? [...data.amenities, amenity.name]
                                                            : data.amenities.filter(a => a !== amenity.name)
                                                        updateData({ amenities: newAmenities })
                                                    }}
                                                    className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="material-icons text-slate-400 group-hover:text-primary text-lg transition-colors">{amenity.icon}</span>
                                                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors text-sm">{amenity.name}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section: Descripcion */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-icons text-primary">description</span>
                            <h2 className="text-lg font-semibold">Descripción Detallada</h2>
                        </div>
                        <div className="relative">
                            <textarea
                                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium resize-none"
                                placeholder="Escriba aquí los puntos fuertes de la propiedad..."
                                rows={6}
                                value={data.description}
                                onChange={(e) => updateData({ description: e.target.value })}
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-md">
                                {data.description.length} / 2000
                            </div>
                        </div>
                    </section>

                    {/* Section: Servicios (UY Specific) */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">plumbing</span>
                            <h2 className="text-lg font-semibold">Servicios del Inmueble</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Saneamiento</label>
                                <select
                                    value={data.utilityStatus.saneamiento}
                                    onChange={(e) => updateData({ utilityStatus: { ...data.utilityStatus, saneamiento: e.target.value as any } })}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                >
                                    <option value="conectado">Conectado</option>
                                    <option value="pozo">Pozo Séptico</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gas</label>
                                <select
                                    value={data.utilityStatus.gas}
                                    onChange={(e) => updateData({ utilityStatus: { ...data.utilityStatus, gas: e.target.value as any } })}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                >
                                    <option value="cañería">Cañería</option>
                                    <option value="supergas">Supergas</option>
                                    <option value="sin servicio">Sin servicio</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Agua</label>
                                <select
                                    value={data.utilityStatus.agua}
                                    onChange={(e) => updateData({ utilityStatus: { ...data.utilityStatus, agua: e.target.value as any } })}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                >
                                    <option value="OSE">OSE</option>
                                    <option value="pozo">Pozo</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Electricidad</label>
                                <select
                                    value={data.utilityStatus.electricidad}
                                    onChange={(e) => updateData({ utilityStatus: { ...data.utilityStatus, electricidad: e.target.value as any } })}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                >
                                    <option value="UTE">UTE</option>
                                    <option value="solar">Solar</option>
                                    <option value="mixto">Mixto</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section: Planos */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-icons text-primary">architecture</span>
                            <h2 className="text-lg font-semibold">Planos de la propiedad (Opcional)</h2>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-medium pl-12"
                                placeholder="URL de la imagen del plano (PNG, JPG)..."
                                type="url"
                                value={data.floorplanUrl || ""}
                                onChange={(e) => updateData({ floorplanUrl: e.target.value })}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons text-slate-400">link</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 italic font-medium">Cargue el plano para que los interesados tengan una mejor idea de la distribución.</p>
                    </section>

                    {/* Section: Visibilidad Premium */}
                    <section className={`p-8 rounded-2xl border-2 transition-all ${isPremium ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-amber-500">star</span>
                                <h2 className="text-lg font-bold">Visibilidad Premium</h2>
                            </div>
                            {!isPremium && <Badge className="bg-slate-400">Sólo Pro/Premium</Badge>}
                        </div>
                        <div className="space-y-6">
                            <label className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.featured ? 'bg-white dark:bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-white/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'} ${!isPremium ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-amber-500'}`}>
                                <input
                                    type="checkbox"
                                    disabled={!isPremium}
                                    checked={data.featured || false}
                                    onChange={(e) => updateData({ featured: e.target.checked })}
                                    className="w-6 h-6 rounded text-amber-500 focus:ring-amber-500"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold flex items-center gap-2">
                                        Destacar esta propiedad
                                        <span className="material-icons text-amber-500 text-sm">bolt</span>
                                    </h3>
                                    <p className="text-xs text-slate-500">Aparece en los primeros resultados de búsqueda y con un distintivo especial.</p>
                                </div>
                                {!isPremium && (
                                    <Link href="/publish/pricing" className="text-[10px] font-black uppercase text-primary border-b-2 border-primary/20 hover:border-primary transition-all">
                                        Mejorar Plan
                                    </Link>
                                )}
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sincronización</p>
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <span className="material-icons text-emerald-500 text-sm">check_circle</span>
                                        Algolia Cloud (Instantáneo)
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Análisis</p>
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <span className={`material-icons text-sm ${isPremium ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            {isPremium ? 'check_circle' : 'lock'}
                                        </span>
                                        Vercel Speed Insights Full
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Uruguay Specifics */}
                    <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-primary">account_balance</span>
                            <h2 className="text-lg font-semibold">Información Legal y Garantías (UY)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <label className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-all">
                                <input
                                    type="checkbox"
                                    checked={data.viviendaPromovida}
                                    onChange={(e) => updateData({ viviendaPromovida: e.target.checked })}
                                    className="w-6 h-6 rounded text-primary focus:ring-primary"
                                />
                                <div>
                                    <p className="font-bold">Vivienda Promovida (Ley 18.795)</p>
                                    <p className="text-xs text-slate-500">Exoneraciones fiscales para inversores</p>
                                </div>
                            </label>

                            <div className="space-y-3">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Garantías Aceptadas</p>
                                <div className="flex flex-wrap gap-2">
                                    {GUARANTEES.map(guarantee => (
                                        <button
                                            key={guarantee}
                                            type="button"
                                            onClick={() => {
                                                const newGuarantees = data.guarantees.includes(guarantee)
                                                    ? data.guarantees.filter(g => g !== guarantee)
                                                    : [...data.guarantees, guarantee]
                                                updateData({ guarantees: newGuarantees })
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${data.guarantees.includes(guarantee)
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary"
                                                }`}
                                        >
                                            {guarantee}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Actions */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-800 gap-3">
                        <Link href="/publish" className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                            Volver
                        </Link>
                        <button
                            type="submit"
                            onClick={handleNext}
                            className="px-10 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                        >
                            Siguiente <span className="material-icons text-sm">arrow_forward</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
