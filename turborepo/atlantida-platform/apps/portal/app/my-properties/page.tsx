"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { formatPrice } from "@/lib/data"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui"
import { Badge } from "@repo/ui"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui"

import { useAgentDashboard } from "@/hooks/useAgentDashboard"
import { Lead } from "@/types"
import { Sparkline } from "@/components/dashboard/Sparkline"

export default function MyPropertiesPage() {
    const { user, loading: authLoading } = useAuth()
    const {
        properties,
        leads,
        loading: dashboardLoading,
        profile,
        updateProfile,
        isUpdatingProfile,
        deleteProperty,
        markLeadAsContacted
    } = useAgentDashboard()

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Profile Edit States (local form state)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [localProfileName, setLocalProfileName] = useState("")
    const [localProfilePhone, setLocalProfilePhone] = useState("")
    const [localProfileAgency, setLocalProfileAgency] = useState("")
    const [localProfileHours, setLocalProfileHours] = useState("")
    const [localProfilePhoto, setLocalProfilePhoto] = useState("")

    // Sync local form state with fetched profile when modal opens or profile loads
    useEffect(() => {
        if (profile) {
            setLocalProfileName(profile.name)
            setLocalProfilePhone(profile.phone)
            setLocalProfileAgency(profile.agency)
            setLocalProfileHours(profile.hours)
            setLocalProfilePhoto(profile.photo)
        }
    }, [profile, isProfileOpen])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await updateProfile({
            name: localProfileName,
            phone: localProfilePhone,
            agency: localProfileAgency,
            hours: localProfileHours,
            photo: localProfilePhoto
        })
        if (success) setIsProfileOpen(false)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return
        await deleteProperty(id)
    }

    const handleMarkAsContacted = async (leadId: string) => {
        await markLeadAsContacted(leadId)
        if (selectedLead?.id === leadId) {
            setSelectedLead(prev => prev ? { ...prev, status: "contacted" } : null)
        }
    }

    if (authLoading || (dashboardLoading && user)) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Cargando tu panel...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 flex flex-col items-center">
                <span className="material-icons text-6xl text-slate-300 mb-4">lock</span>
                <h1 className="text-2xl font-bold">Inicia sesión para ver tus propiedades</h1>
                <Link href="/" className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20">
                    Volver al Inicio
                </Link>
            </div>
        )
    }

    const newLeadsCount = leads.filter(l => l.status === 'new').length
    const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0)

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || lead.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const exportToCSV = () => {
        const headers = ["Fecha", "Estado", "Nombre", "Email", "Propiedad", "Mensaje"]
        const rows = leads.map(lead => [
            lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Hoy',
            lead.status === 'new' ? 'Nuevo' : 'Leído',
            lead.leadName,
            lead.leadEmail,
            lead.propertyTitle,
            lead.leadMessage.replace(/\n/g, " ")
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `leads_barrio_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 md:pt-32 pb-24 px-4 selection:bg-primary/20">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header & Profiler */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            Agent Workspace
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Comercial</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                            Hola, {profile.name || user.displayName || 'Agente'} — <span className="text-sm font-bold opacity-60">Gestionando {properties.length} propiedades activas</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary transition-all shadow-sm group"
                            title="Editar Perfil"
                        >
                            <span className="material-icons text-slate-400 group-hover:text-primary transition-colors">settings</span>
                        </button>
                        <Link
                            href="/publish"
                            className="bg-slate-900 dark:bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all"
                        >
                            <span className="material-icons text-sm">add_circle</span> Publicar Inmueble
                        </Link>
                    </div>
                </header>

                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Mi Perfil Profesional</DialogTitle>
                            <DialogDescription className="font-medium text-slate-500">
                                Estos datos se mostrarán en todas tus publicaciones y los leads que recibas.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleProfileUpdate} className="space-y-6 pt-6">
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100 flex items-center justify-center">
                                    <img src={localProfilePhoto || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">URL de Imagen</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        value={localProfilePhoto}
                                        onChange={(e) => setLocalProfilePhoto(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nombre Público</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        value={localProfileName}
                                        onChange={(e) => setLocalProfileName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Inmobiliaria</label>
                                    <input
                                        type="text"
                                        placeholder="Empresa"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        value={localProfileAgency}
                                        onChange={(e) => setLocalProfileAgency(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp de Contacto</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ej: 099 123 456"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary"
                                    value={localProfilePhone}
                                    onChange={(e) => setLocalProfilePhone(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Horario de Consultas</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Lun-Vie 9-18hs"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                    value={localProfileHours}
                                    onChange={(e) => setLocalProfileHours(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex-1 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="flex-1 py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50"
                                >
                                    {isUpdatingProfile ? "Actualizando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Performance Bento Strip */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <span className="material-icons text-primary/40 text-3xl">home_work</span>
                            <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary">LIVE</Badge>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inmuebles Activos</h4>
                            <p className="text-4xl font-black tracking-tighter mt-1">{properties.length}</p>
                            <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                                {Array.from({ length: Math.min(properties.length, 5) }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                            <span className="material-icons text-[150px]">rocket_launch</span>
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-white/50 tracking-widest">Interés Mensual</h4>
                                <p className="text-5xl font-black tracking-tighter mt-2">{totalViews.toLocaleString()}</p>
                                <p className="text-xs font-bold text-white/60 mt-2 flex items-center gap-1">
                                    <span className="material-icons text-emerald-400 text-sm">trending_up</span>
                                    Crecimiento del +14% vs periodo anterior
                                </p>
                            </div>
                            <div className="mt-8">
                                <Sparkline data={[120, 180, 140, 220, 190, 260, 240, 310, 280, 340]} color="#38bdf8" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="material-icons text-amber-500/40 text-3xl">mail</span>
                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <p className="text-amber-600 font-black text-sm">{newLeadsCount}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nuevos Leads</h4>
                            <p className="text-4xl font-black tracking-tighter mt-1">{leads.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">Ticket promedio: {(leads.length / (totalViews || 1) * 100).toFixed(1)}% conversión</p>
                        </div>
                    </div>
                </div>

                {/* Pipeline & Message Center */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Pipeline de Interesados</h2>
                            <p className="text-slate-500 font-medium">Gestiona tus contactos y solicitudes de visita desde aquí.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="relative">
                                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input
                                    type="text"
                                    placeholder="Filtrar por nombre o inmueble..."
                                    className="pl-10 pr-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 w-full md:w-80 outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={exportToCSV}
                                className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <span className="material-icons text-xs">download</span> Exportar
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative">
                        {leads.length === 0 ? (
                            <div className="py-24 flex flex-col items-center text-center px-6">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-icons text-slate-300 text-4xl">inbox_customize</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Aún no hay leads</h3>
                                <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Las consultas de los interesados aparecerán aquí automáticamente en tiempo real.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                        <TableRow className="border-none">
                                            <TableHead className="py-6 pl-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Estado</TableHead>
                                            <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Interesado</TableHead>
                                            <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Inmueble</TableHead>
                                            <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">Tipo de Lead</TableHead>
                                            <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right pr-8">Acción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <AnimatePresence mode="popLayout">
                                            {filteredLeads.map((lead, i) => (
                                                <TableRow
                                                    key={lead.id}
                                                    className="group border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <TableCell className="pl-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${lead.status === 'new' ? 'text-red-600' : 'text-slate-400'}`}>
                                                                {lead.status === 'new' ? 'Sin Leer' : 'Gestionado'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">{lead.leadName}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{lead.leadEmail}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="max-w-[200px]">
                                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{lead.propertyTitle}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 italic">Recibido: {lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Hoy'}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${lead.contactType === 'visit' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600'}`}>
                                                            <span className="material-icons text-xs">{lead.contactType === 'visit' ? 'calendar_month' : 'chat_bubble'}</span>
                                                            {lead.contactType === 'visit' ? 'Solicitó Visita' : 'Consulta Gral.'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6 text-right pr-8">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <button
                                                                    className="bg-primary text-white p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center ml-auto"
                                                                    onClick={() => setSelectedLead(lead)}
                                                                >
                                                                    <span className="material-icons text-lg">forum</span>
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                                                                <div className="p-8 pb-0 flex items-center justify-between">
                                                                    <div>
                                                                        <h3 className="text-2xl font-black tracking-tight">{selectedLead?.leadName}</h3>
                                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedLead?.leadEmail}</p>
                                                                    </div>
                                                                    <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${selectedLead?.contactType === 'visit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                                                        {selectedLead?.contactType === 'visit' ? 'SOLICITA VISITA' : 'CONSULTA GENERAL'}
                                                                    </div>
                                                                </div>
                                                                <div className="p-8 space-y-8">
                                                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 italic text-slate-700 dark:text-slate-300 relative">
                                                                        <span className="material-icons absolute -top-3 -left-1 text-primary/20 text-4xl">format_quote</span>
                                                                        {selectedLead?.leadMessage}
                                                                    </div>

                                                                    {selectedLead?.contactType === 'visit' && (
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                                                    <span className="material-icons text-lg">event</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Fecha Sugerida</p>
                                                                                    <p className="font-bold text-indigo-700 dark:text-indigo-400">{selectedLead?.visitDate}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                                                    <span className="material-icons text-lg">schedule</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Hora Sugerida</p>
                                                                                    <p className="font-bold text-indigo-700 dark:text-indigo-400">{selectedLead?.visitTime}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl text-white flex items-center justify-between">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                                                                <span className="material-icons text-primary underline-offset-4">apartment</span>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">En respuesta a:</p>
                                                                                <p className="font-bold truncate max-w-[180px]">{selectedLead?.propertyTitle}</p>
                                                                            </div>
                                                                        </div>
                                                                        <Link
                                                                            href={`/property/${selectedLead?.propertyId}`}
                                                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                        >
                                                                            VER PROPIEDAD <span className="material-icons text-sm">arrow_outward</span>
                                                                        </Link>
                                                                    </div>

                                                                    <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                                                        <button
                                                                            onClick={() => {
                                                                                const body = `Hola ${selectedLead?.leadName}, recibimos tu consulta sobre ${selectedLead?.propertyTitle}. Soy ${user.displayName} de ${profile.agency || 'Barrio.uy'}...`
                                                                                window.location.href = `mailto:${selectedLead?.leadEmail}?subject=Re: ${selectedLead?.propertyTitle}&body=${encodeURIComponent(body)}`
                                                                            }}
                                                                            className="flex-1 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                                                                        >
                                                                            <span className="material-icons text-sm">send</span> Responder Email
                                                                        </button>
                                                                        {selectedLead?.status === 'new' && (
                                                                            <button
                                                                                onClick={() => selectedLead && handleMarkAsContacted(selectedLead.id)}
                                                                                className="px-6 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                                                                            >
                                                                                Cerrar Ticket
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Properties Showcase */}
                <div className="space-y-8 pt-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Inventario de Propiedades</h2>
                            <p className="text-slate-500 font-medium">Gestiona tus publicaciones directamente.</p>
                        </div>
                    </div>

                    {properties.length === 0 ? (
                        <div className="p-16 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
                                <span className="material-icons text-slate-300 text-5xl">inventory_2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Comienza tu viaje comercial</h3>
                            <p className="text-slate-500 mb-8 max-w-sm">Publica tu primera propiedad y activa el generador de leads de Barrio.uy.</p>
                            <Link href="/publish" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30">Publicar Mi Primer Inmueble</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {properties.map(property => (
                                    <motion.div
                                        key={property.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                                    >
                                        <div className="w-full sm:w-48 h-48 rounded-3xl overflow-hidden relative shadow-inner shrink-0">
                                            <img src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Home" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <Badge className={`uppercase text-[9px] font-black border-none px-3 py-1 ${property.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                                                    }`}>
                                                    {property.status === 'active' ? 'ONLINE' : 'PAUSADA'}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{property.neighborhood}</h3>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{property.type} • {property.operation}</p>
                                                <div className="mt-4 flex items-center gap-4 text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-icons text-sm text-primary/40">bed</span>
                                                        <span className="text-xs font-black">{property.bedrooms}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-icons text-sm text-primary/40">square_foot</span>
                                                        <span className="text-xs font-black">{property.area}m²</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-icons text-sm text-primary/40">visibility</span>
                                                        <span className="text-xs font-black">{property.views || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                                    {formatPrice(property.price, property.currency)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/publish?edit=${property.id}`}
                                                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                                                        title="Editar"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(property.id)}
                                                        className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                        title="Borrar"
                                                    >
                                                        <span className="material-icons text-lg">delete_outline</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
