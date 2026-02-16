"use client"

import { useState } from "react"
import Image from "next/image"
import { CheckCircle, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react"

export default function SellPropertyPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSuccess(true)
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-12 md:pt-32 md:pb-24 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Zap className="h-3 w-3" /> Exclusividad DominioTotal
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
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-emerald-100 dark:border-emerald-900 text-center animate-in zoom-in-95 duration-500">
                                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                                <h2 className="text-3xl font-bold mb-4">¡Solicitud Recibida!</h2>
                                <p className="text-slate-500 mb-8">Un tasador experto se contactará contigo en menos de 24 horas hábiles.</p>
                                <button onClick={() => setSuccess(false)} className="text-primary font-bold hover:underline">Enviar otra propiedad</button>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-2xl font-bold mb-2">Comienza ahora</h3>
                                <p className="text-slate-500 mb-8 text-sm">Completa tus datos y te enviaremos una tasación preliminar gratuita.</p>

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tu Nombre</label>
                                            <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Juan Pérez" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Teléfono</label>
                                            <input required type="tel" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="099 123 456" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Zona de la propiedad</label>
                                        <input required className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Pocitos, Montevideo" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tipo de inmueble</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                                            <option>Apartamento</option>
                                            <option>Casa</option>
                                            <option>Terreno</option>
                                            <option>Local Comercial</option>
                                        </select>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? "Procesando..." : "Quiero Vender Mi Propiedad"}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
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
