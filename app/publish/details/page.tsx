"use client"

import Link from "next/link"
import { usePublish } from "@/contexts/PublishContext"
import { useRouter } from "next/navigation"
import { ImageUploader } from "@/components/publish/ImageUploader"
import { GUARANTEES, AMENITIES } from "@/lib/data"
import { PublishStep2Schema } from "@/lib/validations"
import { toast } from "sonner"
import { trackEvent } from "@/lib/tracking"

export default function PublishDetailsPage() {
    const { data, updateData } = usePublish()
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Dormitorios</label>
                                <select
                                    value={data.bedrooms}
                                    onChange={(e) => updateData({ bedrooms: Number(e.target.value) })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Baños</label>
                                <select
                                    value={data.bathrooms}
                                    onChange={(e) => updateData({ bathrooms: Number(e.target.value) })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary"
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Metros Cuadrados (m²)</label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary pr-12"
                                        placeholder="Ej: 85"
                                        type="number"
                                        value={data.area || ""}
                                        onChange={(e) => updateData({ area: Number(e.target.value) })}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">m²</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Precio</label>
                                <div className="flex">
                                    <select
                                        value={data.currency}
                                        onChange={(e) => updateData({ currency: e.target.value as "USD" | "UYU" })}
                                        className="rounded-l-lg border-r-0 border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary text-sm w-16"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="UYU">UYU</option>
                                    </select>
                                    <input
                                        className="w-full rounded-r-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {AMENITIES.map(amenity => (
                                <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={data.amenities.includes(amenity)}
                                        onChange={(e) => {
                                            const newAmenities = e.target.checked
                                                ? [...data.amenities, amenity]
                                                : data.amenities.filter(a => a !== amenity)
                                            updateData({ amenities: newAmenities })
                                        }}
                                        className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{amenity}</span>
                                </label>
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
                                className="w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-primary focus:border-primary p-4"
                                placeholder="Escriba aquí los puntos fuertes de la propiedad..."
                                rows={6}
                                value={data.description}
                                onChange={(e) => updateData({ description: e.target.value })}
                            ></textarea>
                            <div className="absolute bottom-3 right-4 text-xs text-slate-400">
                                {data.description.length} / 2000 caracteres
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
