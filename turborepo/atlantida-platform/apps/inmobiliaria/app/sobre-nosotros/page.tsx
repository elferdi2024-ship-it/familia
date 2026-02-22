"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    User,
    CheckCircle2,
    Building2,
    Users,
    ShieldCheck,
    Briefcase
} from "lucide-react"
import { toast } from "sonner"

export default function SobreNosotrosPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "522bee8c-a34d-4451-b57c-927ec9c97016"
        formData.append("access_key", accessKey)
        formData.append("subject", "Nuevo Contacto desde Sobre Nosotros")
        formData.append("from_name", "MiBarrio.uy Contacto")

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                toast.success("Mensaje enviado con éxito")
                e.currentTarget.reset()
                setTimeout(() => setSuccess(false), 5000)
            } else {
                toast.error("Error al enviar el mensaje")
            }
        } catch (err) {
            toast.error("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* HER0 SECTION */}
            <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/portada-inmobiliaria.webp"
                        alt="Sobre Nosotros MiBarrio.uy"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-[#FDFDFD] dark:to-background-dark"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6 mx-auto"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Conocé Nuestro Equipo
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]"
                    >
                        Más que una <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Inmobiliaria Tradicional</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium"
                    >
                        Somos un equipo enfocado en resultados, tecnología y un servicio que realmente supera las expectativas del mercado uruguayo.
                    </motion.p>
                </div>
            </section>

            {/* LARGE LOGO VISUAL */}
            <section className="py-20 px-4 bg-white dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-6xl mx-auto flex justify-center items-center">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        src="/mibarrio-ok-large.png"
                        alt="MiBarrio.uy Inmobiliaria"
                        className="w-full max-w-4xl h-auto object-contain dark:brightness-0 dark:invert transition-transform duration-700 hover:scale-105"
                    />
                </div>
            </section>

            {/* NOSOTROS CONTENT */}
            <section className="py-24 px-4 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full opacity-50"></div>
                            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl">
                                <Building2 className="w-12 h-12 text-emerald-500 mb-6" />
                                <h3 className="text-3xl font-black mb-4">Nuestra Historia</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">
                                    Este proyecto nace de la unión de tres familias emprendedoras con una visión clara: transformar la manera de gestionar propiedades.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">
                                    Cada familia aporta su especialización para construir una inmobiliaria sólida, moderna y eficiente. Una se enfoca en el área contractual y administrativa, asegurando respaldo y claridad en cada operación. Otra lidera la comunicación y el posicionamiento digital, dando visibilidad estratégica a cada propiedad. La tercera gestiona el área técnica y de mantenimiento, garantizando soluciones rápidas y cuidado permanente de los inmuebles.
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-6">
                                    Trabajamos de forma coordinada y participativa, atendiendo personalmente a cada cliente. Creemos en la gestión cercana, transparente y profesional, donde cada propiedad se administra con compromiso real y responsabilidad compartida.
                                </p>
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                                    <p className="text-emerald-800 dark:text-emerald-300 text-lg leading-relaxed font-bold">
                                        No somos una inmobiliaria tradicional. Somos un equipo organizado, con estructura clara y visión moderna.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">Por qué elegir trabajar con <span className="text-emerald-500">MiBarrio</span></h2>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-emerald-50 max-w-12 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Transparencia Total</h4>
                                        <p className="text-slate-500 dark:text-slate-400">Sin letras chicas. Conocerás todo el proceso de punta a punta, los costos reales y los tiempos estimados de la operación.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-blue-50 max-w-12 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-500">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Profesionalismo</h4>
                                        <p className="text-slate-500 dark:text-slate-400">Nuestro equipo comercial y legal está preparado para resolver problemas complejos y evitar que pierdas oportunidades.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-purple-50 max-w-12 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Atención Centrada en Vos</h4>
                                        <p className="text-slate-500 dark:text-slate-400">Cada cliente es un socio estratégico. Brindamos respuestas rápidas, actualizaciones constantes y un trato humano excepcional.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACTO SECTION */}
            <section id="contacto" className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Info */}
                        <div className="flex flex-col justify-center">
                            <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-sm mb-4 block">Hablemos</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                                Estamos listos para<br />escuchar tu proyecto
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-12">
                                Si querés vender, alquilar o buscar tu nueva propiedad, o si simplemente querés asesoramiento, escribinos. Un experto de nuestro equipo te contactará prontamente.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp / Llamadas</p>
                                        <p className="font-bold text-lg">+598 99 123 456</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                                        <p className="font-bold text-lg">hola@mibarrio.uy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-2xl font-black mb-8">Envianos un Mensaje</h3>

                            {success ? (
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h4>
                                    <p className="text-slate-500 dark:text-slate-400">Gracias por contactarnos. Te responderemos a la brevedad posible.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input required name="name" type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" placeholder="Tu nombre" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required name="email" type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" placeholder="tu@email.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Celular</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required name="phone" type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" placeholder="Número de contacto" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">¿En qué podemos ayudarte?</label>
                                        <textarea required name="message" rows={4} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium resize-none" placeholder="Escribe tu consulta aquí..."></textarea>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                Enviar Mensaje
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
