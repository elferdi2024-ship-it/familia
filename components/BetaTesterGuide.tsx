"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Megaphone, Bug, CheckCircle2, ChevronRight, X } from "lucide-react"
import { toast } from "sonner"

export function BetaTesterGuide() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="mb-8 relative animate-in fade-in slide-in-from-top-4 duration-500">
            <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-4 right-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVisible(false)}
                        className="h-8 w-8 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-black tracking-widest uppercase px-2 py-0.5">Beta v5.0 Active</Badge>
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200 flex items-center justify-center">
                                    <span className="text-[8px] font-bold">A{i}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        ¡Bienvenido al Panel de Agentes de Atlantida Group! <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
                        Estás usando la versión experimental de nuestra plataforma de gestión inmobiliaria.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-tighter text-slate-400">¿Qué puedes probar hoy?</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm font-medium">
                                <div className="mt-0.5 bg-blue-100 text-blue-600 p-1 rounded-md">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span>**Pipeline de Gestión**: Cambia el estado de tus interesados desde "Interesado" hasta "Vendido".</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm font-medium">
                                <div className="mt-0.5 bg-blue-100 text-blue-600 p-1 rounded-md">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span>**Contactabilidad Directa**: Prueba los botones de WhatsApp y llamar para contactar leads instantáneamente.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm font-medium">
                                <div className="mt-0.5 bg-blue-100 text-blue-600 p-1 rounded-md">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span>**Filtros de Búsqueda**: Usa el buscador inteligente Algolia (&lt; 50ms) en la home y busca por precio, barrio o tipo.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-950/50 rounded-2xl p-5 border border-white dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                                <Megaphone className="h-4 w-4" /> Centro de Feedback
                            </h4>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Soporte 24/7</Badge>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Tu feedback es el motor de esta plataforma. Si encuentras un error o tienes una idea, repórtalo directamente.
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            <Button
                                className="w-full justify-between bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 shadow-sm font-bold"
                                onClick={() => window.open('https://wa.me/59891000000?text=Hola! Tengo feedback sobre la plataforma v5.0...', '_blank')}
                            >
                                <span className="flex items-center gap-2">
                                    <Bug className="h-4 w-4 text-red-500" /> Reportar Error
                                </span>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                            </Button>
                            <Button
                                className="w-full justify-between bg-primary hover:bg-blue-700 text-white shadow-lg shadow-primary/20 font-bold"
                                onClick={() => toast.success("¡Gracias! En breve habilitaremos el formulario interno.")}
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> Sugerir Feature
                                </span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
