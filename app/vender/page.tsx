"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react"

export default function SellPropertyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "522bee8c-a34d-4451-b57c-927ec9c97016"
        formData.append("access_key", accessKey)
        formData.append("subject", `Nueva Propiedad para Vender — ${formData.get("name")}`)
        formData.append("from_name", "Atlantida Group — Ventas")

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (data.success) {
                setSuccess(true)
            }
        } catch (err) {
            console.error("Error submitting form:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Zap className="h-3 w-3" /> Exclusividad Atlantida Group
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                            Vendemos tu propiedad en <span className="text-primary">tiempo récord</span>.
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
                            Usamos inteligencia de mercado y las herramientas de marketing más avanzadas de Uruguay para encontrar al comprador ideal.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: ShieldCheck, title: "Seguridad Total", desc: "Validamos a cada interesado." },
                                { icon: TrendingUp, title: "Máximo Valor", desc: "Tasación basada en datos reales." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <item.icon className="h-6 w-6 text-primary shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {success ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-12 shadow-2xl border-2 border-emerald-500/20 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
                                {/* Success background accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-0"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/10">
                                        <CheckCircle className="h-10 w-10" />
                                    </div>

                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                        ¡Tu propiedad ya <br /> está en camino!
                                    </h2>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4 italic">
                                            &quot;Entendemos que vender una propiedad es una decisión importante. Quédate tranquilo, estás en las mejores manos.&quot;
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                "Un tasador senior revisará tus datos hoy.",
                                                "Recibirás una llamada técnica en breve.",
                                                "Privacidad absoluta de tus datos."
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="text-primary text-xs font-black uppercase tracking-widest hover:underline hover:scale-105 transition-all"
                                    >
                                        Vender otra propiedad
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Comienza ahora</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">Completa tus datos y te enviaremos una tasación preliminar gratuita.</p>

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tu Nombre</label>
                                            <input
                                                required
                                                name="name"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                                                placeholder="Ej. Juan Pérez"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                                            <input
                                                required
                                                name="phone"
                                                type="tel"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                                                placeholder="099 123 456"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona de la propiedad</label>
                                        <input
                                            required
                                            name="zone"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
                                            placeholder="Ej. Pocitos, Montevideo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de inmueble</label>
                                        <select
                                            name="property_type"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all font-medium text-sm"
                                        >
                                            <option>Apartamento</option>
                                            <option>Casa</option>
                                            <option>Terreno</option>
                                            <option>Local Comercial</option>
                                        </select>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                Quiero Vender Mi Propiedad
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">Un tasador experto te responderá en breve</p>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats section for Trust */}
            <section className="py-16 md:py-32 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Números que avalan nuestra gestión</h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Días promedio de venta", value: "45" },
                            { label: "Propiedades este mes", value: "+450" },
                            { label: "Inversores activos", value: "1.2k" },
                            { label: "Tasa de cierres", value: "94%" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="text-4xl font-black text-primary">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
