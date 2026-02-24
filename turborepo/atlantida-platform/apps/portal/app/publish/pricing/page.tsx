"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Star, ArrowLeft, Building2, Zap, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Precios en UYU (cobro real en Mercado Pago). Referencia USD aproximada.
const PLANS = [
    {
        id: 'free',
        title: "Plan Base",
        price: { monthly: 0, yearly: 0 },
        usdApprox: 0,
        description: "Ideal para propietarios individuales y pruebas.",
        features: [
            "1 Propiedad activa",
            "Perfil Básico",
            "Estadísticas Básicas",
            "Soporte por Email",
        ],
        ctaText: "Plan Actual",
        color: "slate",
        icon: <Building2 className="w-6 h-6 text-slate-500" />,
    },
    {
        id: 'pro',
        title: "Plan Pro",
        price: { monthly: 1600, yearly: 15360 }, // UYU/mes; anual -20%
        usdApprox: 40,
        priceId: 'price_pro_subscription',
        description: "Para profesionales activos que buscan más alcance.",
        features: [
            "Hasta 10 Propiedades",
            "Perfil Profesional",
            "2x Visibilidad en búsqueda",
            "Badge de Verificado Pro",
            "Soporte Prioritario",
        ],
        ctaText: "Suscribirme Pro",
        isFeatured: true,
        color: "indigo",
        icon: <Zap className="w-6 h-6 text-indigo-500" />,
    },
    {
        id: 'premium',
        title: "Plan Premium",
        price: { monthly: 3600, yearly: 34560 }, // UYU/mes; anual -20%
        usdApprox: 90,
        priceId: 'price_premium_subscription',
        description: "Para inmobiliarias consolidadas y equipos.",
        features: [
            "Propiedades Ilimitadas",
            "Perfil Agencia (Logo & Social)",
            "4x Visibilidad máxima",
            "Badge de Verificado Elite",
            "Soporte 24/7",
            "Analytics & CRM básico",
        ],
        ctaText: "Suscribirme Premium",
        color: "orange",
        icon: <Sparkles className="w-6 h-6 text-orange-500" />,
    }
]

const AnimatedDigit: React.FC<{ digit: string; index: number }> = ({ digit, index }) => {
    return (
        <div className="relative overflow-hidden inline-block min-w-[1ch] text-center">
            <AnimatePresence mode="wait">
                <motion.span
                    key={digit}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
                    className="block"
                >
                    {digit}
                </motion.span>
            </AnimatePresence>
        </div>
    )
}

const ScrollingNumber: React.FC<{ value: number }> = ({ value }) => {
    const numberString = value.toString()
    return (
        <div className="flex items-center">
            {numberString.split('').map((digit, index) => (
                <AnimatedDigit key={`${value}-${index}`} digit={digit} index={index} />
            ))}
        </div>
    )
}

export default function PricingPage() {
    const { user } = useAuth()
    const [isYearly, setIsYearly] = useState(false)
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

    const handleSubscribe = async (plan: typeof PLANS[0]) => {
        if (!user) {
            toast.error("Debes iniciar sesión para contratar un plan")
            return
        }

        if (plan.id === 'free') {
            toast.info("Ya tienes el plan base")
            return
        }

        setLoadingPlan(plan.id)
        try {
            const response = await fetch('/api/mercadopago/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: plan.id,
                    userId: user.uid,
                    userEmail: user.email,
                    isYearly,
                }),
            })

            const data = await response.json()
            if (data.init_point) {
                window.location.href = data.init_point
            } else {
                throw new Error("No se pudo iniciar el checkout de Mercado Pago")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error al procesar el pago con Mercado Pago")
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
            <div className="max-w-7xl mx-auto px-6 pt-12 w-full">
                <Link href="/publish" className="flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors gap-1 mb-12">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Publicar
                </Link>

                <motion.div
                    className="text-center space-y-8 mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Escalabilidad para tu Inmobiliaria
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                            Elige el plan que mejor se adapte a tu ritmo de crecimiento en Barrio.uy
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        <Tabs value={isYearly ? "yearly" : "monthly"} onValueChange={(v) => setIsYearly(v === "yearly")}>
                            <TabsList className="h-12 w-64 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                <TabsTrigger value="monthly" className="flex-1 rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Mensual</TabsTrigger>
                                <TabsTrigger value="yearly" className="flex-1 gap-2 rounded-lg text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
                                    Anual <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">-20%</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            className="relative h-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {plan.isFeatured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 shadow-xl ring-2 ring-white dark:ring-slate-950">
                                    <Star className="size-3 fill-current" /> Más Popular
                                </div>
                            )}
                            <div className={`h-full flex flex-col p-8 rounded-3xl border-2 transition-all ${plan.isFeatured
                                ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10 shadow-2xl scale-105'
                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                                }`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${plan.id === 'free' ? 'bg-slate-100 dark:bg-slate-800' :
                                        plan.id === 'pro' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                                            'bg-orange-100 dark:bg-orange-900/30'
                                        }`}>
                                        {plan.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{plan.title}</h3>
                                        <p className="text-xs font-bold text-slate-400">Barrio.uy Tier</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px] mb-8 font-medium">
                                    {plan.description}
                                </p>

                                <div className="mb-8">
                                    <div className="text-4xl font-black text-slate-900 dark:text-white flex items-baseline gap-1 flex-wrap">
                                        <span className="text-2xl font-bold text-slate-400 mr-1">UYU</span>
                                        {plan.id === 'free' ? (
                                            <span>0</span>
                                        ) : (
                                            <ScrollingNumber value={isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly} />
                                        )}
                                        <span className="text-sm text-slate-400 font-black uppercase tracking-widest ml-1">/mes</span>
                                    </div>
                                    {plan.id !== 'free' && plan.usdApprox !== undefined && (
                                        <p className="text-xs font-bold text-slate-400 mt-1">aprox. {plan.usdApprox} USD</p>
                                    )}
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Inclusiones clave</p>
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                                <Check className="size-3 text-emerald-600 dark:text-emerald-400 font-black" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadingPlan === plan.id}
                                    variant={plan.isFeatured ? "default" : "outline"}
                                    className={`w-full py-6 rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 ${plan.isFeatured
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                                        : 'border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {loadingPlan === plan.id ? "Procesando..." : plan.ctaText}
                                </Button>

                                {isYearly && plan.id !== 'free' && (
                                    <p className="text-[10px] font-black text-center mt-4 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                        Facturado anualmente ({plan.price.yearly.toLocaleString('es-UY')} UYU)
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mb-20 p-12 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 mb-4 font-bold text-lg">¿Necesitas un plan personalizado para más de 1000 propiedades?</p>
                    <a
                        href="https://wa.me/59899123456?text=Hola, necesito un plan personalizado para Barrio.uy"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xl hover:scale-105 transition-transform"
                    >
                        Contactar con Soporte Corporativo
                    </a>
                </div>
            </div>
        </div>
    )
}
