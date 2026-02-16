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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 transition-all group flex flex-col h-full"
        >
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: service.color }}
            >
                <service.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{service.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                {service.text}
            </p>
            <button
                onClick={onClick}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-primary transition-colors mt-auto group/btn"
            >
                Solicitar servicio
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
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
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <Navbar />

            {/* 1. HERO PRINCIPAL */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-50 dark:opacity-20">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[80px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight"
                    >
                        Soluciones inmobiliarias que <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">simplifican decisiones.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Acompañamos propietarios e inversores con servicios técnicos, legales y estratégicos en un solo lugar.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => scrollTo(ownersRef as React.RefObject<HTMLDivElement>)}
                            className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            🏠 Soy propietario
                        </button>
                        <button
                            onClick={() => scrollTo(investorsRef as React.RefObject<HTMLDivElement>)}
                            className="px-10 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            📈 Soy inversor
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. SERVICIOS PARA PROPIETARIOS */}
            <section ref={ownersRef} className="py-20 px-4 bg-white dark:bg-slate-950/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Gestión integral para tu propiedad</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Desde la preparación hasta la firma. Nos ocupamos de todo.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {OWNER_SERVICES.map(service => (
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
            <section ref={investorsRef} className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Estrategia y respaldo para decisiones inteligentes</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Invertir requiere información, análisis y acompañamiento profesional.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 opacity-60">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold mb-1">100%</span>
                            <span className="text-xs uppercase tracking-widest font-bold">Respaldo</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold mb-1">+15</span>
                            <span className="text-xs uppercase tracking-widest font-bold">Aliados</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold mb-1">8/10</span>
                            <span className="text-xs uppercase tracking-widest font-bold">Conversión</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold mb-1">24hs</span>
                            <span className="text-xs uppercase tracking-widest font-bold">Respuesta</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA FINAL */}
            <section className="py-24 px-4 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">¿Qué necesitás resolver hoy?</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => openModal("Gestionar mi propiedad")}
                            className="px-8 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                        >
                            Gestionar mi propiedad
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openModal("Analizar una inversión")}
                            className="px-8 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
                        >
                            Analizar una inversión
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openModal("Hablar con un asesor")}
                            className="px-8 py-4 bg-primary text-white hover:bg-blue-700 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
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
