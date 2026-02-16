"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import Link from "next/link"
import { formatPrice, Property } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Lead {
    id: string;
    propertyId: string;
    propertyTitle: string;
    agentId: string;
    leadName: string;
    leadEmail: string;
    leadMessage: string;
    createdAt: any;
    status: "new" | "contacted" | "closed";
}

const Sparkline = ({ data, color = "#2563eb" }: { data: number[], color?: string }) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const width = 100
    const height = 30

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((val - min) / range) * height
        return `${x},${y}`
    }).join(" ")

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    )
}

export default function MyPropertiesPage() {
    const { user, loading: authLoading } = useAuth()
    const [properties, setProperties] = useState<Property[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const fetchData = async () => {
        if (!user || !db) return

        try {
            // 1. Fetch Properties
            const qProps = query(
                collection(db, "properties"),
                where("userId", "==", user.uid)
            )
            const propsSnap = await getDocs(qProps)
            const props = propsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Property))

            // Sort properties client-side
            props.sort((a, b) => {
                const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                return dateB - dateA;
            })
            setProperties(props)

            // 2. Fetch Leads
            const qLeads = query(
                collection(db, "leads"),
                where("agentId", "==", user.uid)
            )
            const leadsSnap = await getDocs(qLeads)
            const leadsData = leadsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Lead))

            // Sort leads client-side
            leadsData.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0
                const dateB = b.createdAt?.seconds || 0
                return dateB - dateA
            })
            setLeads(leadsData)

        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchData()
            } else {
                setLoading(false)
            }
        }
    }, [user, authLoading])

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return
        if (!db) return

        try {
            await deleteDoc(doc(db, "properties", id))
            setProperties(properties.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting property:", error)
        }
    }

    const handleMarkAsContacted = async (leadId: string) => {
        if (!db) return
        try {
            const leadRef = doc(db, "leads", leadId)
            await updateDoc(leadRef, { status: "contacted" })
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: "contacted" } : l))
            setSelectedLead(null) // Close modal if open
        } catch (error) {
            console.error("Error updating lead:", error)
        }
    }

    if (authLoading || (loading && user)) {
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
        link.setAttribute("download", `leads_dominio_total_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 md:pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Panel de Agente</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Bienvenido, {user.displayName || 'Usuario'}</p>
                    </div>
                    <Link href="/publish" className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <span className="material-icons">add</span> Publicar Nueva
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
                            <span className="material-icons text-slate-400">home_work</span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{properties.length}</div>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="material-icons text-[14px]">trending_up</span> +2 este mes
                                    </p>
                                </div>
                                <Sparkline data={[10, 12, 11, 13, 15, 14, 16]} color="#0ea5e9" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alcance Total (Vistas)</CardTitle>
                            <span className="material-icons text-slate-400">visibility</span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="material-icons text-[14px]">trending_up</span> +12% vs ayer
                                    </p>
                                </div>
                                <Sparkline data={[120, 150, 180, 140, 210, 250, 280]} color="#10b981" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                            <span className="material-icons text-slate-400">ads_click</span>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-2xl font-bold">{(leads.length / (totalViews || 1) * 100).toFixed(1)}%</div>
                                    <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                        <span className="material-icons text-[14px]">trending_flat</span> Estable
                                    </p>
                                </div>
                                <Sparkline data={[2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.5]} color="#f59e0b" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leads Section */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons text-primary">mail</span> Consultas Recibidas
                        </h2>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o propiedad..."
                                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none w-full md:w-64 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50 outline-none cursor-pointer transition-colors"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                aria-label="Filtrar por estado"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="new">Nuevos</option>
                                <option value="contacted">Leídos/Contactados</option>
                            </select>
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-primary/50"
                            >
                                <span className="material-icons text-sm">download</span> Exportar
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {leads.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No has recibido consultas todavía.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Interesado</TableHead>
                                        <TableHead>Propiedad</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                                No se encontraron consultas que coincidan con la búsqueda.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <TableRow key={lead.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <TableCell>
                                                    <Badge variant={lead.status === 'new' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                                                        {lead.status === 'new' ? 'Nuevo' : 'Leído'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500">
                                                    {lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Hoy'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {lead.leadName}
                                                    <div className="text-xs text-slate-400 font-normal">{lead.leadEmail}</div>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500 truncate max-w-[150px]">
                                                    {lead.propertyTitle}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button
                                                                className="text-primary hover:text-primary/80 font-bold text-xs"
                                                                onClick={() => setSelectedLead(lead)}
                                                            >
                                                                Ver Mensaje
                                                            </button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Consulta de {selectedLead?.leadName}</DialogTitle>
                                                                <DialogDescription>
                                                                    Propiedad: <span className="font-semibold text-slate-900">{selectedLead?.propertyTitle}</span>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4 space-y-4">
                                                                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700 italic">
                                                                    "{selectedLead?.leadMessage}"
                                                                </div>
                                                                <div className="flex flex-col gap-1 text-sm">
                                                                    <span className="font-bold flex items-center gap-2">
                                                                        <span className="material-icons text-sm text-slate-400">email</span>
                                                                        {selectedLead?.leadEmail}
                                                                    </span>
                                                                    <span className="text-slate-400 text-xs">
                                                                        Recibido el {selectedLead?.createdAt?.seconds ? new Date(selectedLead.createdAt.seconds * 1000).toLocaleString() : ''}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end gap-2">
                                                                {selectedLead?.status === 'new' && (
                                                                    <button
                                                                        onClick={() => selectedLead && handleMarkAsContacted(selectedLead.id)}
                                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700"
                                                                    >
                                                                        Marcar como Leído
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>

                {/* Properties List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-primary">holiday_village</span> Mis Publicaciones
                    </h2>

                    {properties.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-slate-400 text-4xl">inventory_2</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No tienes publicaciones activas</h2>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Crea tu primer aviso y llega a miles de personas interesadas.</p>
                            <Link href="/publish" className="inline-block bg-primary text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                                Empezar ahora
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence>
                                {properties.map(property => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={property.id}
                                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                                    >
                                        {/* Status Ribbon */}
                                        <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest ${property.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            property.status === 'paused' ? 'bg-slate-100 text-slate-700' :
                                                property.status === 'sold' ? 'bg-red-100 text-red-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {property.status === 'pending' ? 'En Revisión' :
                                                property.status === 'paused' ? 'Pausada' :
                                                    property.status === 'sold' ? 'Vendida' : 'Activo'}
                                        </div>

                                        <Link href={`/property/${property.id}`} className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-inner flex-shrink-0 hover:opacity-90 transition-opacity">
                                            <img className="w-full h-full object-cover" src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} alt={property.type} />
                                        </Link>

                                        <div className="flex-grow">
                                            <div className="flex flex-col h-full justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-primary uppercase tracking-tight">{property.operation}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="text-xs font-medium text-slate-500">{property.type}</span>
                                                    </div>
                                                    <Link href={`/property/${property.id}`}>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate hover:text-primary transition-colors cursor-pointer">{property.address || property.neighborhood}</h3>
                                                    </Link>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                                        <span className="material-icons text-xs">location_on</span> {property.neighborhood}, {property.city}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                                                    <div className="text-xl font-black text-primary">
                                                        {formatPrice(property.price, property.currency)}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm">bed</span> {property.bedrooms}</span>
                                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm">shower</span> {property.bathrooms}</span>
                                                        <span className="flex items-center gap-1.5"><span className="material-icons text-sm">square_foot</span> {property.area}m²</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                                            <Link
                                                href={`/property/${property.id}`}
                                                className="flex-1 md:w-full h-10 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
                                            >
                                                <span className="material-icons text-sm">rocket_launch</span> Ver Publicación
                                            </Link>
                                            <Link
                                                href={`/publish?edit=${property.id}`}
                                                className="flex-1 md:w-full h-10 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-icons text-sm">edit</span> Editar
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    const newStatus = property.status === 'active' ? 'paused' : 'active'
                                                    setProperties(properties.map(p => p.id === property.id ? { ...p, status: newStatus } : p))
                                                    if (db) {
                                                        await updateDoc(doc(db, "properties", property.id), { status: newStatus })
                                                    }
                                                }}
                                                className="flex-1 md:w-full h-10 px-4 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-icons text-sm">{property.status === 'active' ? 'pause' : 'play_arrow'}</span>
                                                {property.status === 'active' ? 'Pausar' : 'Activar'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="flex-1 md:w-full h-10 px-4 rounded-lg bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-icons text-sm">delete</span> Borrar
                                            </button>
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
