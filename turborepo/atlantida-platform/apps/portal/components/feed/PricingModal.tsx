"use client"

import { Dialog, DialogContent } from "@repo/ui/dialog"
import { Check, X, Sparkles, Building2, Zap } from "lucide-react"

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
}

const PRICING_PLANS = [
    {
        id: 'free',
        name: 'Plan Base',
        description: 'Ideal para agentes independientes empezando.',
        price: 'Gratis',
        period: '',
        icon: <Building2 className="w-5 h-5 text-slate-500" />,
        color: 'slate',
        features: [
            { text: 'Hasta 5 publicaciones', included: true },
            { text: 'Perfil Básico', included: true },
            { text: 'Feed Comunidad', included: true },
            { text: 'Destacar Listados', included: false },
            { text: 'Insignia Verificada', included: false },
            { text: 'Agentes Múltiples', included: false },
        ]
    },
    {
        id: 'pro',
        name: 'Plan Pro',
        description: 'Para profesionales activos que buscan más alcance.',
        price: '$490',
        period: '/mes',
        icon: <Zap className="w-5 h-5 text-indigo-500" />,
        color: 'indigo',
        popular: true,
        features: [
            { text: 'Hasta 50 publicaciones', included: true },
            { text: 'Perfil Comercial', included: true },
            { text: '2x Alcance en Feed', included: true },
            { text: 'Destacar Listados (3/mes)', included: true },
            { text: 'Insignia Verificada', included: true },
            { text: 'Agentes Múltiples', included: false },
        ]
    },
    {
        id: 'elite',
        name: 'Plan Premium',
        description: 'Para inmobiliarias consolidadas y equipos.',
        price: '$1290',
        period: '/mes',
        icon: <Sparkles className="w-5 h-5 text-orange-500" />,
        color: 'orange',
        features: [
            { text: 'Publicaciones Ilimitadas', included: true },
            { text: 'Perfil Agencia (Logo)', included: true },
            { text: '4x Alcance en Feed', included: true },
            { text: 'Destacados Ilimitados', included: true },
            { text: 'Insignia Verificada Premium', included: true },
            { text: 'Hasta 5 Agentes', included: true },
        ]
    }
]

const PLAN_ICON_BG: Record<string, string> = {
    free: "bg-slate-50 dark:bg-slate-900/20",
    pro: "bg-indigo-50 dark:bg-indigo-900/20",
    elite: "bg-orange-50 dark:bg-orange-900/20",
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
                <div className="p-8 md:p-12 text-center pb-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-3">Conecta con todos en Barrio</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        Expande tu alcance en el mercado inmobiliario utilizando nuestra red impulsada por comunidad. Obtén más leads destacando frente a los clientes correctos.
                    </p>
                </div>

                <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {PRICING_PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border transition-all ${plan.popular
                                        ? 'border-primary ring-4 ring-primary/10 shadow-lg shadow-primary/20 md:scale-[1.02] z-10'
                                        : 'border-slate-200 dark:border-slate-800 shadow-md'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 inset-x-0 bg-primary text-white text-[10px] font-semibold py-1 text-center">
                                        Más Popular
                                    </div>
                                )}

                                <div className={`p-8 ${plan.popular ? 'pt-10' : ''}`}>
                                    <div className={`w-12 h-12 rounded-lg ${PLAN_ICON_BG[plan.id]} flex items-center justify-center mb-4`}>
                                        {plan.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[40px]">{plan.description}</p>

                                    <div className="mt-6 mb-8 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                                        <span className="text-sm font-semibold text-slate-400">{plan.period}</span>
                                    </div>

                                    <button
                                        className={`w-full py-3.5 rounded-lg font-semibold transition-all shadow-md active:scale-[0.98] ${plan.popular
                                                ? 'bg-primary text-white shadow-primary/30 hover:bg-emerald-600'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        onClick={() => window.open(`https://wa.me/59899123456?text=Hola, me interesa contratar el ${plan.name} en Barrio.uy`, '_blank')}
                                    >
                                        {plan.price === 'Gratis' ? 'Comenzar Gratis' : 'Contactar Ventas'}
                                    </button>
                                </div>

                                <div className="p-8 pt-0 mt-auto">
                                    <p className="text-[11px] font-semibold text-slate-500 mb-4">Qué incluye</p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                {feature.included ? (
                                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 font-bold" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                                        <X className="w-3 h-3 text-slate-400 font-bold" />
                                                    </div>
                                                )}
                                                <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
