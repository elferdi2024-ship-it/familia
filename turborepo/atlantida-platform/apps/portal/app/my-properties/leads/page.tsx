"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@repo/lib/firebase"
import { collection, query, where, getDocs, orderBy, doc, updateDoc, Timestamp } from "firebase/firestore"
import { Badge } from "@repo/ui"
import { Button } from "@repo/ui"
import { MessageSquare, Mail, ExternalLink, Filter, Clock, CheckCircle, XCircle, User, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { BetaTesterGuide } from "@/components/BetaTesterGuide"

interface Lead {
    id: string
    propertyId: string
    propertyTitle: string
    propertyPrice?: number
    propertyCurrency?: string
    propertyImage?: string
    agentId: string
    leadName: string
    leadEmail: string
    leadPhone?: string
    leadMessage: string
    status: "new" | "interested" | "contacted" | "visit_scheduled" | "closed" | "lost"
    createdAt: string
}

const STATUS_CONFIG = {
    new: { label: "Ingreso", color: "bg-blue-100 text-blue-800", icon: Clock },
    interested: { label: "Interesado", color: "bg-indigo-100 text-indigo-800", icon: TrendingUp },
    contacted: { label: "Contactado", color: "bg-yellow-100 text-yellow-800", icon: MessageSquare },
    visit_scheduled: { label: "Visita Agendada", color: "bg-purple-100 text-purple-800", icon: Calendar },
    closed: { label: "Vendido / Cerrado", color: "bg-green-100 text-green-800", icon: CheckCircle },
    lost: { label: "Perdido", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function LeadsDashboard() {
    const { user, loading: authLoading } = useAuth()
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>("all")

    useEffect(() => {
        if (!user || !db) return

        const fetchLeads = async () => {
            setIsLoading(true)
            try {
                if (!db) return
                const leadsRef = collection(db, "leads")
                const q = query(
                    leadsRef,
                    where("agentId", "==", user.uid)
                )
                const snapshot = await getDocs(q)

                const leadsData = snapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt instanceof Timestamp
                            ? data.createdAt.toDate().toISOString()
                            : data.createdAt || new Date().toISOString(),
                        // Default any "contacted" or "new" to our better pipeline if needed for existing data
                        status: data.status === 'contacted' ? 'contacted' : (data.status || 'new')
                    } as Lead
                })

                leadsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                setLeads(leadsData)
            } catch (error) {
                console.error("Error fetching leads:", error)
                toast.error("Error al cargar los leads")
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeads()
    }, [user])

    const updateLeadStatus = async (leadId: string, status: Lead["status"]) => {
        if (!db) return
        try {
            await updateDoc(doc(db, "leads", leadId), { status })
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
            toast.success(`Lead movido a "${STATUS_CONFIG[status].label}"`)
        } catch (error) {
            toast.error("Error al actualizar el estado")
        }
    }

    const filteredLeads = filterStatus === "all"
        ? leads
        : leads.filter(l => l.status === filterStatus)

    const newLeadsCount = leads.filter(l => l.status === "new" || l.status === "interested").length

    const LeadsSkeleton = () => (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800 shimmer-block" />
                            <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800 shimmer-block" />
                            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800 shimmer-block" />
                        </div>
                    </div>
                </div>
            ))}
            <style>{`
                .shimmer-block {
                    position: relative;
                    overflow: hidden;
                }
                .shimmer-block::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
                    animation: leads-shimmer 1.5s infinite;
                }
                .dark .shimmer-block::after {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                }
                @keyframes leads-shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-slate-400 font-medium animate-pulse">Cargando pipeline...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Inicia sesión</h2>
                    <p className="text-slate-500 max-w-sm">Necesitas una cuenta de agente para gestionar tus leads y el pipeline comercial.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

                {/* Beta Tester Alert/Guide */}
                <BetaTesterGuide />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            <span className="text-xs font-semibold text-primary">Panel de gestión</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                            Pipeline de Leads
                        </h1>
                        <p className="text-slate-500 font-medium text-base">
                            Gestioná el embudo de ventas y convertí interesados en cierres reales.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[11px] font-semibold text-slate-400">Estado del mes</p>
                            <p className="font-bold text-slate-900 dark:text-white">{leads.length} Leads Activos</p>
                        </div>
                        <Link href="/my-properties">
                            <Button className="bg-slate-900 dark:bg-slate-800 text-white font-semibold rounded-lg px-5 py-5 shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Mis Publicaciones
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Pipeline Stats / Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 mb-8">
                    {(["new", "interested", "contacted", "visit_scheduled", "closed", "lost"] as const).map(status => {
                        const config = STATUS_CONFIG[status]
                        const count = leads.filter(l => l.status === status).length
                        const Icon = config.icon
                        const isSelected = filterStatus === status
                        return (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(isSelected ? "all" : status)}
                                className={`group p-4 rounded-lg border text-left transition-all relative overflow-hidden ${isSelected
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-lg"
                                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 hover:shadow-md"
                                    }`}
                            >
                                    <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 transition-colors ${isSelected ? "bg-primary text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary"}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                        <div className={`text-2xl font-bold ${isSelected ? "text-primary" : "text-slate-900 dark:text-white"}`}>{count}</div>
                                        <div className="text-[11px] font-medium text-slate-500 truncate">{config.label}</div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Lead List Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        {filterStatus === "all" ? "Todos los Leads" : `Filtrando: ${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}`}
                    </h3>
                    {filterStatus !== "all" && (
                        <button onClick={() => setFilterStatus("all")} className="text-xs font-bold text-primary hover:underline">Ver todos</button>
                    )}
                </div>

                {/* Lead Cards */}
                <div className="space-y-4">
                    {isLoading ? (
                        <LeadsSkeleton />
                    ) : filteredLeads.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <MessageSquare className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                {filterStatus === "all" ? "Aún no hay actividad" : `Sin leads en etapa "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}"`}
                            </h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                Cuando un cliente contacte por una propiedad, verás su información y mensaje aquí para empezar la gestión.
                            </p>
                            {filterStatus !== "all" && (
                                <Button variant="ghost" className="mt-6 font-semibold text-primary" onClick={() => setFilterStatus("all")}>Ver todo el pipeline</Button>
                            )}
                        </div>
                    ) : (
                        filteredLeads.map(lead => {
                            const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new
                            const StatusIcon = statusConfig.icon
                            return (
                                <div key={lead.id} className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-5">

                                        {/* Status & Date */}
                                        <div className="lg:w-44 shrink-0 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${statusConfig.color.split(' ')[0]}`}>
                                                    <StatusIcon className={`h-4 w-4 ${statusConfig.color.split(' ')[1]}`} />
                                                </div>
                                                <span className={`text-xs font-semibold ${statusConfig.color.split(' ')[1]}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-slate-400">Recibido</p>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                                    {new Date(lead.createdAt).toLocaleDateString("es-UY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0 space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-primary">Interés en propiedad</p>
                                                <Link href={`/property/${lead.propertyId}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors block truncate">
                                                    {lead.propertyTitle} <ExternalLink className="inline h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <User className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-semibold text-slate-400 leading-none mb-1">Cliente</p>
                                                            <p className="font-semibold text-slate-900 dark:text-white">{lead.leadName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <Mail className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-semibold text-slate-400 leading-none mb-1">Email</p>
                                                            <a href={`mailto:${lead.leadEmail}`} className="font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors">{lead.leadEmail}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg relative">
                                                    <MessageSquare className="absolute top-4 right-4 h-4 w-4 text-slate-200 dark:text-slate-700" />
                                                    <p className="text-[11px] font-semibold text-slate-400 mb-2">Mensaje del cliente</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                                                        &ldquo;{lead.leadMessage}&rdquo;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Pipeline Actions */}
                                        <div className="lg:w-52 shrink-0 flex flex-col gap-2.5">
                                            <p className="text-[11px] font-semibold text-slate-400 text-center mb-1">Acciones de gestión</p>

                                            <Button
                                                className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-semibold rounded-lg py-5 shadow-md shadow-green-500/20 transition-all active:scale-95"
                                                onClick={() => {
                                                    const text = encodeURIComponent(`Hola ${lead.leadName}, vi tu consulta por "${lead.propertyTitle}" en Barrio.uy. ¿Cómo puedo ayudarte?`);
                                                    window.open(`https://wa.me/${lead.leadPhone?.replace(/\D/g, '')}?text=${text}`, '_blank');
                                                    if (lead.status === 'new') updateLeadStatus(lead.id, 'contacted');
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                                            </Button>

                                            <div className="grid grid-cols-1 gap-2">
                                                {/* Transition logic */}
                                                {(lead.status === 'new' || lead.status === 'interested') && (
                                                    <Button variant="outline" className="rounded-lg font-semibold py-5 border-slate-200 transition-all active:scale-95" onClick={() => updateLeadStatus(lead.id, 'contacted')}>
                                                        Marcar Contactado
                                                    </Button>
                                                )}

                                                {lead.status === 'contacted' && (
                                                    <Button className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold py-5 shadow-md shadow-purple-500/20 transition-all active:scale-95" onClick={() => updateLeadStatus(lead.id, 'visit_scheduled')}>
                                                        Agendar Visita
                                                    </Button>
                                                )}

                                                {lead.status === 'visit_scheduled' && (
                                                    <Button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 shadow-md shadow-emerald-500/20 transition-all active:scale-95" onClick={() => updateLeadStatus(lead.id, 'closed')}>
                                                        ¡Vendido / Cerrado!
                                                    </Button>
                                                )}

                                                {lead.status !== 'closed' && lead.status !== 'lost' && (
                                                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-all active:scale-95" onClick={() => updateLeadStatus(lead.id, 'lost')}>
                                                        Marcar como Perdido
                                                    </Button>
                                                )}

                                                {(lead.status === 'closed' || lead.status === 'lost') && (
                                                    <Button variant="link" className="text-slate-400 text-xs font-semibold" onClick={() => updateLeadStatus(lead.id, 'interested')}>
                                                        Re-abrir Lead
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
