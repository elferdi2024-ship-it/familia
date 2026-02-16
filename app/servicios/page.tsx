"use client"

import React, { useState, useRef } from "react"
import Head from "next/head"
import { motion, AnimatePresence } from "framer-motion"
import {
    Key,
    Zap,
    Scale,
    TrendingUp,
    Search,
    PieChart,
    FileText,
    Building2,
    CheckCircle2,
    X,
    ArrowRight,
    ChevronRight,
    MessageSquare,
    MapPin,
    Phone,
    Mail,
    User
} from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

// --- Data Structures ---

const OWNER_SERVICES = [
    {
        id: "mantenimiento",
        title: "Mantenimiento y Reparaciones",
        text: "Coordinamos plomería, electricidad, pintura y mejoras generales para que tu propiedad esté lista para alquilar o vender.",
        icon: Key,
        color: "#1E3A5F",
        textColor: "text-white"
    },
    {
        id: "revision",
        title: "Revisión Técnica Integral",
        text: "Evaluamos instalaciones eléctricas y sanitarias para prevenir problemas antes de una operación.",
        icon: Zap,
        color: "#1F4F46",
        textColor: "text-white"
    },
    {
        id: "legal",
        title: "Asesoramiento Legal y Notarial",
        text: "Contratos de alquiler, compraventa y respaldo jurídico en cada paso.",
        icon: Scale,
        color: "#2F2F2F",
        textColor: "text-white"
    },
    {
        id: "tasacion",
        title: "Tasación y Análisis de Mercado",
        text: "Definimos el valor estratégico de tu propiedad según contexto real de mercado.",
        icon: TrendingUp,
        color: "#5B2C2C",
        textColor: "text-white"
    }
]

const INVESTOR_SERVICES = [
    {
        id: "busqueda",
        title: "Búsqueda Estratégica de Oportunidades",
        text: "Identificamos propiedades con potencial de valorización o renta.",
        icon: Search,
        color: "#0F2C4C",
        textColor: "text-white"
    },
    {
        id: "rentabilidad",
        title: "Análisis de Rentabilidad",
        text: "Evaluamos proyección de retorno y viabilidad de inversión.",
        icon: PieChart,
        color: "#204B3A",
        textColor: "text-white"
    },
    {
        id: "estructuracion",
        title: "Estructuración Legal de Inversión",
        text: "Acompañamiento jurídico y contractual para operaciones seguras.",
        icon: FileText,
        color: "#3A3A3A",
        textColor: "text-white"
    },
    {
        id: "gestion",
        title: "Optimización y Gestión de Activos",
        text: "Coordinamos mejoras y mantenimiento para potenciar valor.",
        icon: Building2,
        color: "#2C3E50",
        textColor: "text-white"
    }
]

// --- Components ---

function ServiceCard({ service, onClick }: { service: typeof OWNER_SERVICES[0], onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden flex flex-col h-full"
        >
            {/* Background Accent on Hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: service.color }}
            />

            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-all duration-500"
                style={{ backgroundColor: service.color, boxShadow: `0 10px 20px ${service.color}33` }}
            >
                <service.icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                {service.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 flex-grow">
                {service.text}
            </p>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 transition-colors group-hover:border-primary/20">
                <button
                    onClick={onClick}
                    className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-primary transition-all"
                >
                    Solicitar ahora
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </motion.div>
    )
}

function ContactModal({
    isOpen,
    onClose,
    selectedService
}: {
    isOpen: boolean,
    onClose: () => void,
    selectedService: string
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE")
        formData.append("subject", `Solicitud Servicio — ${formData.get("service_type")}`)
        formData.append("from_name", "Atlantida Group Services")

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                toast.success("Solicitud enviada con éxito")
                setTimeout(() => {
                    setSuccess(false)
                    onClose()
                }, 3000)
            } else {
                toast.error("Error al enviar la solicitud")
            }
        } catch (err) {
            toast.error("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {success ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10" />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-2">¡Solicitud Enviada!</h3>
                                <p className="text-slate-500">Te contactaremos a la brevedad para coordinar el servicio.</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold">Solicitud de Servicio</h3>
                                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nombre y Apellido</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required name="name" type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Ej: Juan Pérez" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Teléfono</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required name="phone" type="tel" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Ej: 099 123 456" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input required name="email" type="email" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="juan@ejemplo.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tipo de Servicio</label>
                                        <select
                                            required
                                            name="service_type"
                                            defaultValue={selectedService}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm appearance-none"
                                        >
                                            <option value="">Seleccione un servicio</option>
                                            {[...OWNER_SERVICES, ...INVESTOR_SERVICES].map(s => (
                                                <option key={s.id} value={s.title}>{s.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Zona de la propiedad</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input required name="zone" type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Ej: Pocitos, Montevideo" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mensaje / Detalle</label>
                                        <textarea name="message" rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm resize-none" placeholder="Cuéntanos un poco más sobre tu necesidad..."></textarea>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            "Enviar solicitud"
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400">Te contactaremos a la brevedad para coordinar el servicio.</p>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

import Image from "next/image"

// --- Main Page ---

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeService, setActiveService] = useState("")

    const ownersRef = useRef<HTMLDivElement>(null)
    const investorsRef = useRef<HTMLDivElement>(null)

    const openModal = (serviceTitle: string) => {
        setActiveService(serviceTitle)
        setIsModalOpen(true)
    }

    const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Navbar />

            {/* 1. HERO PRINCIPAL - ENHANCED WITH VIDEO BANNER */}
            <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
                {/* Background Video with Overlay */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/flotantes-atlantida.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#FDFDFD] dark:to-background-dark"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Soluciones Integrales Atlantida Group
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95]"
                        >
                            Impulsamos tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-300">Patrimonio Inmobiliario</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed font-medium"
                        >
                            Acompañamos propietarios e inversores con servicios técnicos, legales y estratégicos en un solo lugar. Simple. Profesional. Eficiente.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-6"
                        >
                            <button
                                onClick={() => scrollTo(ownersRef as React.RefObject<HTMLDivElement>)}
                                className="group px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                🏠 Soy Propietario
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => scrollTo(investorsRef as React.RefObject<HTMLDivElement>)}
                                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                📈 Soy Inversor
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                        <div className="w-1 h-2 bg-current rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* 2. SERVICIOS PARA PROPIETARIOS */}
            <section ref={ownersRef} className="py-32 px-4 relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10" />
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-primary font-black uppercase tracking-[0.2em] text-sm mb-4 block">Gestión Especializada</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">Soluciones para <br /><span className="text-slate-400">Propietarios</span></h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl md:max-w-xs font-medium">Desde la preparación hasta la firma. Nos ocupamos de cada detalle técnico y legal.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {OWNER_SERVICES.map((service, idx) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onClick={() => openModal(service.title)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. SERVICIOS PARA INVERSORES */}
            <section ref={investorsRef} className="py-32 px-4 bg-slate-50 dark:bg-slate-900/30 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" />
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-sm mb-4 block">Inteligencia de Mercado</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">Estrategia para <br /><span className="text-slate-400">Inversores</span></h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl md:max-w-xs font-medium">Invertir requiere datos, visión y acompañamiento profesional constante.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {INVESTOR_SERVICES.map(service => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                onClick={() => openModal(service.title)}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* 5. SECCIÓN DIFERENCIAL FINAL */}
            <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-1" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">Un solo equipo. Múltiples soluciones.</h2>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                        Centralizamos servicios técnicos, legales y estratégicos para que no tengas que coordinar proveedores por separado.
                        Trabajamos con profesionales de confianza y procesos claros.
                    </p>
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center group hover:bg-white/10 transition-all">
                            <span className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-blue-600">100%</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-blue-400 transition-colors">Respaldo Integral</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center group hover:bg-white/10 transition-all">
                            <span className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 to-emerald-600">+15</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-emerald-400 transition-colors">Aliados Técnicos</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center group hover:bg-white/10 transition-all">
                            <span className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-orange-400 to-red-500">8/10</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-orange-400 transition-colors">Conversión Leads</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center group hover:bg-white/10 transition-all">
                            <span className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-pink-600">24hs</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-purple-400 transition-colors">Respuesta Media</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA FINAL */}
            <section className="py-24 px-4 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">¿Qué necesitás resolver hoy?</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-6 justify-center">
                        <button
                            onClick={() => openModal("Gestionar mi propiedad")}
                            className="group px-8 py-5 bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 rounded-2xl font-black text-slate-900 dark:text-white transition-all duration-300 border-2 border-slate-900 dark:border-white flex items-center justify-center gap-3 active:scale-95"
                        >
                            Gestionar mi propiedad
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => openModal("Analizar una inversión")}
                            className="group px-8 py-5 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-500 hover:text-white rounded-2xl font-black text-emerald-600 dark:text-emerald-400 transition-all duration-300 border-2 border-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
                        >
                            Analizar una inversión
                            <TrendingUp className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </button>
                        <button
                            onClick={() => openModal("Hablar con un asesor")}
                            className="px-8 py-5 bg-primary text-white hover:bg-blue-700 rounded-2xl font-black shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Hablar con un asesor
                        </button>
                    </div>
                </div>
            </section>

            <Footer />

            {/* 4. MODAL INTEGRADO */}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedService={activeService}
            />
        </div>
    )
}
