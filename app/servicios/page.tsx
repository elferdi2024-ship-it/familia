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

// --- Data Structures ---

const OWNER_SERVICES = [
    {
        id: "mantenimiento",
        title: "Gestión de Mantenimiento y Reformas",
        text: "Nos encargamos de que tu propiedad brille y mantenga su valor. Coordinamos equipos especializados en plomería, electricidad, pintura y diseño de interiores. Preparamos cada ambiente para maximizar su atractivo antes de una visita clave.",
        icon: Key,
        color: "#1E3A5F",
        features: ["Equipos verificados", "Presupuestos cerrados", "Supervisión de obra"]
    },
    {
        id: "revision",
        title: "Revisión Técnica y Diagnóstico",
        text: "Evita sorpresas desagradables en medio de una negociación. Realizamos inspecciones profundas de instalaciones y estructuras, entregando un reporte de estado que garantiza transparencia y acelera el cierre de la operación.",
        icon: Zap,
        color: "#1F4F46",
        features: ["Certificación técnica", "Detección de humedades", "Eficiencia energética"]
    },
    {
        id: "legal",
        title: "Blindaje Legal y Notarial",
        text: "Seguridad jurídica total en cada contrato. Nuestros expertos redactan y revisan documentos de compraventa y alquiler, asegurando el cumplimiento de todas las normativas locales y protegiendo tu patrimonio ante cualquier contingencia.",
        icon: Scale,
        color: "#2F2F2F",
        features: ["Contratos a medida", "Sucesiones y títulos", "Gestión de garantías"]
    },
    {
        id: "tasacion",
        title: "Tasación de Alto Impacto",
        text: "No solo damos un precio; entregamos una estrategia. Analizamos el contexto real del mercado, la demanda por zona y el potencial de tu inmueble para definir un valor competitivo que atraiga ofertas serias en tiempo récord.",
        icon: TrendingUp,
        color: "#5B2C2C",
        features: ["Análisis comparativo", "Tendencias de mercado", "Reporte profesional"]
    }
]

const INVESTOR_SERVICES = [
    {
        id: "busqueda",
        title: "Hunting Estratégico de Activos",
        text: "Identificamos oportunidades 'off-market' con alto potencial de plusvalía. Buscamos propiedades con estructuras sólidas en zonas de crecimiento proyectado, garantizando una entrada segura y con margen de rentabilidad.",
        icon: Search,
        color: "#0F2C4C",
        features: ["Zonas emergentes", "Oportunidades únicas", "Visión a largo plazo"]
    },
    {
        id: "rentabilidad",
        title: "Ingeniería de Rentabilidad",
        text: "Calculamos el ROI real antes de que pongas un peso. Realizamos proyecciones de flujo de caja, análisis de costos operativos y estimaciones de renta para que inviertas con datos sólidos, no con corazonadas.",
        icon: PieChart,
        color: "#204B3A",
        features: ["Cálculo de ROI", "Cashflow proyectado", "Análisis impositivo"]
    },
    {
        id: "estructuracion",
        title: "Estructuración Legal de Negocios",
        text: "Acompañamos la creación de fideicomisos, sociedades y acuerdos de inversión. Aseguramos que la arquitectura legal de tu inversión sea eficiente impositivamente y completamente segura para todos los intervinientes.",
        icon: FileText,
        color: "#3A3A3A",
        features: ["Vehículos de inversión", "Protección de socios", "Compliance legal"]
    },
    {
        id: "gestion",
        title: "Project Management Inmobiliario",
        text: "Transformamos activos obsoletos en máquinas de generar renta. Coordinamos desde el reciclaje total hasta el 'flipping' inmobiliario, gestionando proveedores y tiempos para que tu inversión se valorice día tras día.",
        icon: Building2,
        color: "#2C3E50",
        features: ["Supervisión de reciclaje", "Optimización de costos", "Puesta en valor"]
    }
]

// --- Components ---

function ServiceCard({ service, onClick }: { service: any, onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12 }}
            className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden flex flex-col h-full"
        >
            {/* Animated Background Gradient */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-white via-transparent to-black"
                style={{ backgroundColor: service.color }}
            />

            {/* Decorative Corner Light */}
            <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: service.color }}
            />

            <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10"
                style={{ backgroundColor: service.color, boxShadow: `0 15px 35px ${service.color}44` }}
            >
                <service.icon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-5 leading-tight group-hover:text-primary transition-colors relative z-10">
                {service.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 flex-grow relative z-10">
                {service.text}
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                {service.features?.map((f: string, i: number) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                        {f}
                    </span>
                ))}
            </div>

            <div className="pt-8 border-t border-slate-50 dark:border-slate-800 transition-colors group-hover:border-primary/20 relative z-10">
                <button
                    onClick={onClick}
                    className="w-full flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-all"
                >
                    <span>Comenzar ahora</span>
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                        <ChevronRight className="w-5 h-5" />
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

            {/* 1. HERO PRINCIPAL - ENHANCED WITH VIDEO BANNER */}
            <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
                {/* Background Video with Overlay */}
                <div className="absolute inset-0 z-0 text-white">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster="/portada.webp"
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
                            className="flex flex-col sm:flex-row gap-8"
                        >
                            <button
                                onClick={() => scrollTo(ownersRef as React.RefObject<HTMLDivElement>)}
                                className="group relative px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 overflow-hidden"
                            >
                                <span className="relative z-10">🏠 Soy Propietario</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button
                                onClick={() => scrollTo(investorsRef as React.RefObject<HTMLDivElement>)}
                                className="group px-12 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/30 text-white rounded-[2rem] font-black text-lg hover:bg-white/20 hover:border-white/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                                📈 Soy Inversor
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
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



            {/* 4. MODAL INTEGRADO */}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedService={activeService}
            />
        </div>
    )
}
