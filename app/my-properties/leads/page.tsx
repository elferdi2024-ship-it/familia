"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, doc, updateDoc, Timestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Mail, ExternalLink, Filter, Clock, CheckCircle, XCircle, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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
    status: "new" | "contacted" | "qualified" | "lost"
    createdAt: string
}

const STATUS_CONFIG = {
    new: { label: "Nuevo", color: "bg-blue-100 text-blue-800", icon: Clock },
    contacted: { label: "Contactado", color: "bg-yellow-100 text-yellow-800", icon: MessageSquare },
    qualified: { label: "Calificado", color: "bg-green-100 text-green-800", icon: CheckCircle },
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
            toast.success(`Lead marcado como "${STATUS_CONFIG[status].label}"`)
        } catch (error) {
            toast.error("Error al actualizar el estado")
        }
    }

    const filteredLeads = filterStatus === "all"
        ? leads
        : leads.filter(l => l.status === filterStatus)

    const newLeadsCount = leads.filter(l => l.status === "new").length

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Cargando...</div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Inicia sesión</h2>
                    <p className="text-slate-500">Necesitás estar logueado para ver tus leads.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                            Mis Leads
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {leads.length} lead{leads.length !== 1 ? "s" : ""} total{leads.length !== 1 ? "es" : ""}
                            {newLeadsCount > 0 && (
                                <Badge className="ml-2 bg-blue-500 text-white">{newLeadsCount} nuevo{newLeadsCount !== 1 ? "s" : ""}</Badge>
                            )}
                        </p>
                    </div>
                    <Link href="/my-properties">
                        <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Mis Propiedades
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {(["new", "contacted", "qualified", "lost"] as const).map(status => {
                        const config = STATUS_CONFIG[status]
                        const count = leads.filter(l => l.status === status).length
                        const Icon = config.icon
                        return (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(filterStatus === status ? "all" : status)}
                                className={`p-4 rounded-xl border transition-all ${filterStatus === status
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50"
                                    }`}
                            >
                                <Icon className="h-5 w-5 text-slate-400 mb-2" />
                                <div className="text-2xl font-black">{count}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{config.label}</div>
                            </button>
                        )
                    })}
                </div>

                {/* Lead List */}
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border p-6 animate-pulse">
                                <div className="h-5 w-48 bg-slate-200 rounded mb-3" />
                                <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                                <div className="h-4 w-full bg-slate-100 rounded" />
                            </div>
                        ))
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-16">
                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {filterStatus === "all" ? "No tenés leads aún" : `No hay leads "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}"`}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Los leads aparecerán aquí cuando alguien consulte por tus propiedades.
                            </p>
                        </div>
                    ) : (
                        filteredLeads.map(lead => {
                            const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new
                            return (
                                <div key={lead.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Property info */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(lead.createdAt).toLocaleDateString("es-UY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>

                                            <Link href={`/property/${lead.propertyId}`} className="text-sm font-bold text-primary hover:underline mb-3 block truncate">
                                                {lead.propertyTitle}
                                            </Link>

                                            {/* Lead info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                                                    <span className="font-semibold">{lead.leadName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                                                    <a href={`mailto:${lead.leadEmail}`} className="text-primary hover:underline">{lead.leadEmail}</a>
                                                </div>
                                                {lead.leadPhone && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                                                        <a href={`tel:${lead.leadPhone}`} className="text-primary hover:underline">{lead.leadPhone}</a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                                    &ldquo;{lead.leadMessage}&rdquo;
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                            <a
                                                href={`https://wa.me/${lead.leadPhone?.replace(/\D/g, '')}?text=Hola ${lead.leadName}, vi tu consulta por "${lead.propertyTitle}" en DominioTotal.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-green-600 transition-colors"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                WhatsApp
                                            </a>
                                            {lead.status === "new" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateLeadStatus(lead.id, "contacted")}
                                                >
                                                    Marcar contactado
                                                </Button>
                                            )}
                                            {lead.status === "contacted" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateLeadStatus(lead.id, "qualified")}
                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                >
                                                    Calificar
                                                </Button>
                                            )}
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
