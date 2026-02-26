"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { auth, db, storage } from "@repo/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, setDoc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Link from "next/link"
import { formatPrice, Property } from "@/lib/data"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@repo/ui/badge"
import { Lock } from "lucide-react"
import { PropertyHealthCard } from "@/components/PropertyHealthCard"
import { VirtualTourGuideCard } from "@/components/VirtualTourGuideCard"
import { LeadKanban, type Lead as KanbanLead } from "@/components/LeadKanban"
import { ConversationList } from "@/components/chat/ConversationList"
import { ConversationThread } from "@/components/chat/ConversationThread"
import { isFOMOTacticEnabled } from "@repo/lib"
import { trackEvent } from "@repo/lib/tracking"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog"

interface Lead {
    id: string;
    propertyId: string;
    propertyTitle: string;
    agentId: string;
    leadName: string;
    leadEmail: string;
    leadMessage: string;
    createdAt: any;
    status: "new" | "contacted" | "negotiating" | "closed";
    contactType?: "contact" | "visit";
    visitDate?: string;
    visitTime?: string;
    conversationId?: string;
    source?: string;
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

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 px-4">
        <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
            <div className="h-16 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
                <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
                <div className="h-28 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
            </div>
            <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
            <div className="h-80 rounded-lg bg-slate-200 dark:bg-slate-800 shimmer-block" />
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
                    animation: dashboard-shimmer 1.5s infinite;
                }
                .dark .shimmer-block::after {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                }
                @keyframes dashboard-shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    </div>
)

export default function MyPropertiesPage() {
    const { user, loading: authLoading } = useAuth()
    const [properties, setProperties] = useState<Property[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    /** Abre el hilo de chat desde el drawer del lead (conversationId + leadName). */
    const [chatFromLead, setChatFromLead] = useState<{ conversationId: string; leadName: string } | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const { updateUserProfile } = useAuth()

    // Profile Edit States
    const [profileName, setProfileName] = useState(user?.displayName || "")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileAgency, setProfileAgency] = useState("")
    const [profileHours, setProfileHours] = useState("")
    const [profileBio, setProfileBio] = useState("")
    const [profilePhoto, setProfilePhoto] = useState(user?.photoURL || "")
    const [profileCoverPhoto, setProfileCoverPhoto] = useState("")
    const [profileOfficeAddress, setProfileOfficeAddress] = useState("")
    const [profileContactEmail, setProfileContactEmail] = useState("")
    const [profileWebsite, setProfileWebsite] = useState("")
    const [profileSocialFacebook, setProfileSocialFacebook] = useState("")
    const [profileSocialInstagram, setProfileSocialInstagram] = useState("")
    const [profileSocialTwitter, setProfileSocialTwitter] = useState("")
    const [profileSocialLinkedIn, setProfileSocialLinkedIn] = useState("")
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [isUploadingCover, setIsUploadingCover] = useState(false)
    const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium' | 'elite'>('free')
    const [canManageCreator, setCanManageCreator] = useState(false)
    const [showLeadsModal, setShowLeadsModal] = useState<string | null>(null)

    const isProOrPremium = userPlan === 'pro' || userPlan === 'premium' || userPlan === 'elite'
    /** Perfil Agencia (logo, cover, empresa, redes) solo para Premium/Elite. Pro tiene solo Perfil Profesional (nombre, teléfono, bio, avatar para el feed). */
    const isPremiumOrElite = userPlan === 'premium' || userPlan === 'elite'

    useEffect(() => {
        if (user && auth) {
            auth.currentUser?.getIdToken().then((token) => {
                if (!token) return
                fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
                    .then((r) => r.json())
                    .then((data) => setCanManageCreator(!!data.canManage))
                    .catch(() => setCanManageCreator(false))
            })
        } else {
            setCanManageCreator(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            setProfileName(user.displayName || "")
            setProfilePhoto(user.photoURL || "")
            const fetchProfile = async () => {
                if (!db) return
                const docSnap = await getDoc(doc(db, "users", user.uid))
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    const plan = (data.plan as 'free' | 'pro' | 'premium' | 'elite') || 'free'
                    setUserPlan(plan)
                    setProfilePhone(data.phone || "")
                    setProfileAgency(data.agencyName || "")
                    setProfileHours(data.workingHours || "")
                    setProfileBio(data.bio || "")
                    setProfileCoverPhoto(data.coverPhotoURL || "")
                    setProfileOfficeAddress(data.officeAddress || "")
                    setProfileContactEmail(data.contactEmail || "")
                    setProfileWebsite(data.website || "")
                    setProfileSocialFacebook(data.socialFacebook || "")
                    setProfileSocialInstagram(data.socialInstagram || "")
                    setProfileSocialTwitter(data.socialTwitter || "")
                    setProfileSocialLinkedIn(data.socialLinkedIn || "")
                }
            }
            fetchProfile()
        }
    }, [user])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdatingProfile(true)
        try {
            await updateUserProfile(
                isProOrPremium
                    ? { displayName: profileName, photoURL: profilePhoto }
                    : { displayName: profileName }
            )
            if (db) {
                if (isPremiumOrElite) {
                    await setDoc(doc(db, "users", user!.uid), {
                        displayName: profileName,
                        photoURL: profilePhoto,
                        phone: profilePhone,
                        agencyName: profileAgency,
                        workingHours: profileHours,
                        bio: profileBio,
                        coverPhotoURL: profileCoverPhoto,
                        officeAddress: profileOfficeAddress,
                        contactEmail: profileContactEmail,
                        website: profileWebsite,
                        socialFacebook: profileSocialFacebook,
                        socialInstagram: profileSocialInstagram,
                        socialTwitter: profileSocialTwitter,
                        socialLinkedIn: profileSocialLinkedIn,
                        updatedAt: new Date().toISOString()
                    }, { merge: true })
                } else if (isProOrPremium) {
                    await setDoc(doc(db, "users", user!.uid), {
                        displayName: profileName,
                        photoURL: profilePhoto,
                        phone: profilePhone,
                        workingHours: profileHours,
                        bio: profileBio,
                        updatedAt: new Date().toISOString()
                    }, { merge: true })
                } else {
                    await setDoc(doc(db, "users", user!.uid), {
                        displayName: profileName,
                        phone: profilePhone,
                        updatedAt: new Date().toISOString()
                    }, { merge: true })
                }
            }
            toast.success("Perfil actualizado con éxito")
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar perfil")
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0]
        if (!file || !user || !storage) return

        const isAvatar = type === 'avatar'
        if (isAvatar) setIsUploadingAvatar(true)
        else setIsUploadingCover(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.uid}_${type}_${Date.now()}.${fileExt}`
            const storageRef = ref(storage, `users/${user.uid}/${fileName}`)
            await uploadBytes(storageRef, file)
            const url = await getDownloadURL(storageRef)

            if (isAvatar) setProfilePhoto(url)
            else setProfileCoverPhoto(url)

            toast.success("Imagen subida con éxito")
        } catch (error) {
            console.error("Error uploading file:", error)
            toast.error("Error al subir la imagen")
        } finally {
            if (isAvatar) setIsUploadingAvatar(false)
            else setIsUploadingCover(false)
        }
    }

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

    const handleLeadStatusChange = async (leadId: string, newStatus: "new" | "contacted" | "negotiating" | "closed") => {
        if (!db) return
        try {
            const leadRef = doc(db, "leads", leadId)
            await updateDoc(leadRef, { status: newStatus })
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
            setSelectedLead(null)
            toast.success("Estado actualizado")
        } catch (error) {
            console.error("Error updating lead:", error)
            toast.error("Error al actualizar estado")
        }
    }

    if (authLoading || (loading && user)) {
        return <DashboardSkeleton />
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 px-4 flex flex-col items-center">
                <span className="material-icons text-6xl text-slate-300 mb-4">lock</span>
                <h1 className="text-2xl font-bold">Inicia sesión para ver tus propiedades</h1>
                <Link href="/" className="mt-6 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                    Volver al Inicio
                </Link>
            </div>
        )
    }

    const newLeadsCount = leads.filter(l => l.status === 'new').length
    const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0)

    const statusLabel = (s: string) => ({ new: "Nuevo", contacted: "Contactado", negotiating: "Negociando", closed: "Cerrado" }[s] || s)

    const exportToCSV = () => {
        const headers = ["Fecha", "Estado", "Nombre", "Email", "Propiedad", "Mensaje"]
        const rows = leads.map(lead => [
            lead.createdAt?.seconds ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : 'Hoy',
            statusLabel(lead.status || 'new'),
            lead.leadName,
            lead.leadEmail,
            lead.propertyTitle,
            (lead.leadMessage || "").replace(/\n/g, " ")
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `leads_atlantida_group_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 md:pt-30 pb-24 px-4 selection:bg-primary/20">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Tu plan actual — visible para comparar precios */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tu plan actual</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md ${userPlan === 'free' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' :
                            userPlan === 'pro' ? 'bg-slate-800 dark:bg-slate-700 text-white' :
                                'bg-violet-900/90 dark:bg-violet-800/90 text-white'
                            }`}>
                            {userPlan === 'free' && 'Plan Base'}
                            {userPlan === 'pro' && 'Plan Pro'}
                            {(userPlan === 'premium' || userPlan === 'elite') && 'Plan Premium'}
                        </span>
                    </div>
                    <Link
                        href="/publish/pricing"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary inline-flex items-center gap-1 transition-all active:scale-[0.98]"
                    >
                        Comparar precios
                        <span className="material-icons text-base">arrow_forward</span>
                    </Link>
                </div>

                {/* Header & Profiler */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold w-fit">
                            <span className="w-1.5 h-1.5 rounded-sm bg-slate-400 dark:bg-slate-500" />
                            Agent Workspace
                        </div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                            Dashboard <span className="text-slate-600 dark:text-slate-300">Comercial</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-base flex items-center gap-2 flex-wrap">
                            Hola, {user.displayName || 'Agente'} —{" "}
                            <Link href="#inventario" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:underline inline-flex items-center gap-1">
                                {properties.length} propiedades activas
                                <span className="material-icons text-sm">arrow_forward</span>
                            </Link>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {canManageCreator && (
                            <>
                                <Link
                                    href="/creator"
                                    className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    <span className="material-icons text-sm">admin_panel_settings</span> Panel Creador
                                </Link>
                                {!isProOrPremium && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!auth?.currentUser) return
                                            try {
                                                const token = await auth.currentUser.getIdToken()
                                                const res = await fetch('/api/admin/set-plan', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                                    body: JSON.stringify({ plan: 'pro' })
                                                })
                                                const data = await res.json()
                                                if (res.ok) {
                                                    setUserPlan('pro')
                                                    toast.success('Tu cuenta ahora tiene Plan Pro.')
                                                    return
                                                }
                                                if (res.status === 503 && db) {
                                                    await setDoc(doc(db, 'users', auth.currentUser.uid), { plan: 'pro', updatedAt: new Date().toISOString() }, { merge: true })
                                                    setUserPlan('pro')
                                                    toast.success('Tu cuenta ahora tiene Plan Pro (guardado en tu perfil).')
                                                    return
                                                }
                                                toast.error(data.error || 'Error al asignar plan')
                                            } catch {
                                                toast.error('Error al asignar plan')
                                            }
                                        }}
                                        className="bg-slate-800 dark:bg-slate-700 text-white px-5 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-slate-700 dark:hover:bg-slate-600 transition-all active:scale-[0.98]"
                                    >
                                        <span className="material-icons text-sm">workspace_premium</span> Activar Plan Pro en mi cuenta
                                    </button>
                                )}
                            </>
                        )}
                        <Link
                            href="/publish"
                            className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                        >
                            <span className="material-icons text-sm">add_circle</span> Publicar Inmueble
                        </Link>
                    </div>
                </header>

                {/* Inline Profile Section */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Configuración del Perfil</h2>
                                <p className="font-medium text-slate-500 mt-1">
                                    {isProOrPremium
                                        ? "Estos datos se mostrarán en todas tus publicaciones y los leads que recibas."
                                        : "Plan Free: solo puedes editar datos básicos de contacto. Mejora a Pro o Premium para desbloquear el perfil completo."}
                                </p>
                                {isPremiumOrElite && (
                                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                        <span className="material-icons text-slate-400 text-lg">link</span>
                                        Tu perfil de agencia aparece en <Link href="/inmobiliarias" className="font-bold text-slate-800 dark:text-slate-200 hover:underline">Inmobiliarias</Link>. Inventario actual: <strong>{properties.length} propiedades</strong>.
                                    </p>
                                )}
                                {userPlan === 'pro' && (
                                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                        <span className="material-icons text-slate-400 text-lg">campaign</span>
                                        Destacá en el <Link href="/feed" className="font-bold text-slate-800 dark:text-slate-200 hover:underline">Feed</Link> de Barrio.uy con tu badge Pro. Sin página en Inmobiliarias.
                                    </p>
                                )}
                            </div>
                            {!isProOrPremium && (
                                <Link
                                    href="/publish/pricing"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                                >
                                    <span className="material-icons text-base">workspace_premium</span>
                                    Mejorar a Pro o Premium
                                </Link>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="p-8 space-y-8">
                        {/* Free: solo datos básicos */}
                        {!isProOrPremium && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nombre Público</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp de Contacto</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Ej: 099 123 456"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary"
                                        value={profilePhone}
                                        onChange={(e) => setProfilePhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pro: Perfil Profesional (nombre, teléfono, horario, bio, avatar para el Feed). Sin página en Inmobiliarias. */}
                        {userPlan === 'pro' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl space-y-6">
                                <div className="md:col-span-2 flex flex-col items-center gap-4">
                                    <label className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 flex items-center justify-center cursor-pointer group">
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar')} disabled={isUploadingAvatar} />
                                        {isUploadingAvatar ? (
                                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <img src={profilePhoto || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} alt="Avatar" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="material-icons text-white text-2xl">photo_camera</span>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tu foto (se ve en el Feed)</span>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nombre Público</label>
                                    <input type="text" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp de Contacto</label>
                                    <input type="tel" required placeholder="Ej: 099 123 456" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Horario de Consultas</label>
                                    <input type="text" placeholder="Ej: Lun-Vie 9-18hs" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" value={profileHours} onChange={(e) => setProfileHours(e.target.value)} />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Descripción / Presentación</label>
                                    <textarea placeholder="Cuéntanos sobre ti y tu experiencia..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium resize-none min-h-[100px]" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Premium/Elite: Perfil Agencia (logo, cover, empresa, redes, etc.) — aparece en Inmobiliarias */}
                        {isPremiumOrElite && (
                            <>
                                {/* Cover Photo */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Foto de Portada (Inmobiliaria)</label>
                                    <label className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group cursor-pointer block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(e, 'cover')}
                                            disabled={isUploadingCover}
                                        />
                                        {isUploadingCover ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                                                <span className="font-medium text-sm">Subiendo portada...</span>
                                            </div>
                                        ) : profileCoverPhoto ? (
                                            <>
                                                <img src={profileCoverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2">
                                                        <span className="material-icons text-sm">upload</span> Cambiar Foto
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                <span className="material-icons text-4xl mb-2 opacity-50">wallpaper</span>
                                                <span className="font-medium text-sm">Haz clic para subir una portada</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* Avatar & Basic Info */}
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex flex-col items-center gap-4 shrink-0 px-4 md:px-8">
                                        <label className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-slate-100 flex items-center justify-center z-10 relative -top-16 md:-top-24 mb-[-4rem] md:mb-[-6rem] cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileUpload(e, 'avatar')}
                                                disabled={isUploadingAvatar}
                                            />
                                            {isUploadingAvatar ? (
                                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <img src={profilePhoto || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} alt="Avatar" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="material-icons text-white">photo_camera</span>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mt-2">
                                            Logo / Avatar
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nombre Público</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileName}
                                                onChange={(e) => setProfileName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Inmobiliaria / Empresa</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Atlantida Group"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileAgency}
                                                onChange={(e) => setProfileAgency(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp de Contacto</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="Ej: 099 123 456"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-primary"
                                                value={profilePhone}
                                                onChange={(e) => setProfilePhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Horario de Consultas</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Lun-Vie 9-18hs"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileHours}
                                                onChange={(e) => setProfileHours(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Dirección de Oficina</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Av. 18 de Julio 1234"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileOfficeAddress}
                                                onChange={(e) => setProfileOfficeAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email de Contacto</label>
                                            <input
                                                type="email"
                                                placeholder="Ej: contacto@tuinmobiliaria.com"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileContactEmail}
                                                onChange={(e) => setProfileContactEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Sitio Web</label>
                                            <input
                                                type="url"
                                                placeholder="Ej: www.tuinmobiliaria.com"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                                value={profileWebsite}
                                                onChange={(e) => setProfileWebsite(e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest block">Redes Sociales</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input type="url" placeholder="Facebook" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm" value={profileSocialFacebook} onChange={(e) => setProfileSocialFacebook(e.target.value)} />
                                                <input type="url" placeholder="Instagram" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm" value={profileSocialInstagram} onChange={(e) => setProfileSocialInstagram(e.target.value)} />
                                                <input type="url" placeholder="Twitter / X" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm" value={profileSocialTwitter} onChange={(e) => setProfileSocialTwitter(e.target.value)} />
                                                <input type="url" placeholder="LinkedIn" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm" value={profileSocialLinkedIn} onChange={(e) => setProfileSocialLinkedIn(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Descripción / Presentación</label>
                                            <textarea
                                                placeholder="Cuéntanos sobre ti y tu experiencia..."
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium resize-none min-h-[100px]"
                                                value={profileBio}
                                                onChange={(e) => setProfileBio(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-sm disabled:opacity-50 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                {isUpdatingProfile ? "Actualizando Perfil..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tarjeta upgrade cuando usuario free ya tiene 1 propiedad */}
                {userPlan === 'free' && properties.length >= 1 && (
                    <div className="mb-8 p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <span className="material-icons text-2xl text-slate-500 dark:text-slate-400">workspace_premium</span>
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Has alcanzado el límite del Plan Base</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Desbloquea más propiedades y mayor visibilidad con Plan Pro o Premium.</p>
                                </div>
                            </div>
                            <Link
                                href="/publish/pricing"
                                className="shrink-0 inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold py-2.5 px-5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                Ver planes
                                <span className="material-icons text-base">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Performance Bento Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <span className="material-icons text-slate-400 dark:text-slate-500 text-2xl">home_work</span>
                            <Badge variant="outline" className="text-[10px] font-semibold border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">LIVE</Badge>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-[11px] font-semibold text-slate-500">Inmuebles activos</h4>
                            <p className="text-4xl font-bold tracking-tight mt-1">{properties.length}</p>
                            <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                                {Array.from({ length: Math.min(properties.length, 5) }).map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-5 bg-slate-800 dark:bg-slate-800/90 rounded-lg text-white shadow-sm relative overflow-hidden group border border-slate-700 dark:border-slate-700">
                        <div className="absolute top-0 right-0 p-6 text-white/5">
                            <span className="material-icons text-[120px]">rocket_launch</span>
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="text-[10px] font-semibold uppercase text-white/50 tracking-widest">Interés Mensual</h4>
                                <p className="text-4xl font-bold tracking-tight mt-2">{totalViews.toLocaleString()}</p>
                                <p className="text-xs font-medium text-white/60 mt-2 flex items-center gap-1">
                                    <span className="material-icons text-emerald-400/90 text-sm">trending_up</span>
                                    Crecimiento del +14% vs periodo anterior
                                </p>
                            </div>
                            <div className="mt-6">
                                <Sparkline data={[120, 180, 140, 220, 190, 260, 240, 310, 280, 340]} color="#94a3b8" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="material-icons text-amber-500/40 text-3xl">mail</span>
                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <p className="text-amber-600 font-black text-sm">{newLeadsCount}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-[11px] font-semibold text-slate-500">Nuevos leads</h4>
                            <p className="text-4xl font-bold tracking-tight mt-1">{leads.length}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">Ticket promedio: {(leads.length / (totalViews || 1) * 100).toFixed(1)}% conversión</p>
                        </div>
                    </div>
                </div>

                {/* Tour Virtual — guía para Pro/Premium, blur + CTA para Free */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Tour Virtual</h2>
                    <p className="text-slate-500 font-medium text-sm">Cómo crear un recorrido guiado por habitaciones o 360° para destacar tus propiedades.</p>
                    <VirtualTourGuideCard userPlan={userPlan} />
                </section>

                {/* Mensajes — chat en tiempo real (Pro/Premium) */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Mensajes</h2>
                    <p className="text-slate-500 font-medium text-sm">Conversaciones en tiempo real con interesados. Responde desde acá.</p>
                    <ConversationList agentId={user?.uid ?? ""} userPlan={userPlan} />
                </section>

                {/* Analytics & CRM básico (Plan Premium) */}
                {(userPlan === 'premium' || userPlan === 'elite') && (
                    <div className="mb-10 p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-icons text-slate-500 dark:text-slate-400 text-xl">analytics</span>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Analytics & CRM</h2>
                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border-0">Premium</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Nuevos</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leads.filter(l => (l.status || 'new') === 'new').length}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Contactados</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leads.filter(l => l.status === 'contacted').length}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Negociando</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leads.filter(l => l.status === 'negotiating').length}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Cerrados</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{leads.filter(l => l.status === 'closed').length}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Leads por propiedad</p>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {(() => {
                                    const byProperty = leads.reduce<Record<string, number>>((acc, l) => {
                                        const key = l.propertyTitle || 'Sin propiedad'
                                        acc[key] = (acc[key] || 0) + 1
                                        return acc
                                    }, {})
                                    const entries = Object.entries(byProperty).sort((a, b) => b[1] - a[1])
                                    if (entries.length === 0) return <p className="p-4 text-sm text-slate-500">Aún no hay leads.</p>
                                    return (
                                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {entries.map(([title, count]) => (
                                                <li key={title} className="flex justify-between items-center px-4 py-3 text-sm">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[280px]">{title}</span>
                                                    <span className="font-black text-slate-900 dark:text-white shrink-0 ml-2">{count}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pipeline Kanban CRM */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 w-full max-w-md">
                        <span className="material-icons text-slate-400 text-sm">search</span>
                        <input
                            type="text"
                            placeholder="Filtrar por nombre o inmueble..."
                            className="flex-1 pl-2 pr-4 py-2.5 bg-transparent border-none text-sm font-medium focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <LeadKanban
                        leads={leads.map(l => ({ ...l, status: (l.status || "new") as KanbanLead["status"] }))}
                        onStatusChange={handleLeadStatusChange}
                        userPlan={userPlan}
                        searchTerm={searchTerm}
                        onExportCSV={exportToCSV}
                        renderLeadDetailModal={(lead, onClose) => {
                            if (!lead) return null
                            return (
                                <Dialog open={!!lead} onOpenChange={(open) => !open && onClose()}>
                                    <DialogContent className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl p-0 overflow-hidden max-w-lg">
                                        <div className="p-8 pb-0 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tight">{lead.leadName}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lead.leadEmail}</p>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest ${lead.contactType === 'visit' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                {lead.contactType === 'visit' ? 'SOLICITA VISITA' : 'CONSULTA GENERAL'}
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-8">
                                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 italic text-slate-700 dark:text-slate-300 relative">
                                                <span className="material-icons absolute -top-3 -left-1 text-primary/20 text-4xl">format_quote</span>
                                                {lead.leadMessage}
                                            </div>

                                            {lead.contactType === 'visit' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center">
                                                            <span className="material-icons text-lg">event</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha Sugerida</p>
                                                            <p className="font-bold text-slate-700 dark:text-slate-200">{lead.visitDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center">
                                                            <span className="material-icons text-lg">schedule</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hora Sugerida</p>
                                                            <p className="font-bold text-slate-700 dark:text-slate-200">{lead.visitTime}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notas e historial — blur para Free */}
                                            <div className={`relative rounded-xl border overflow-hidden ${isProOrPremium ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" : ""}`}>
                                                {!isProOrPremium && (
                                                    <div className="absolute inset-0 z-10 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center py-8">
                                                        <Lock className="w-10 h-10 text-white/80 mb-2" />
                                                        <p className="text-white font-bold text-sm text-center px-4">Notas e historial exclusivos de Pro y Premium</p>
                                                        <Link href="/publish/pricing" className="mt-3 px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold text-xs hover:bg-slate-100">
                                                            Mejorá a Pro →
                                                        </Link>
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Notas internas</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">Sin notas aún. {isProOrPremium && "Agregá notas para seguir el historial."}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-800 dark:bg-slate-700 p-5 rounded-xl text-white flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                                        <span className="material-icons text-primary underline-offset-4">apartment</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">En respuesta a:</p>
                                                        <p className="font-bold truncate max-w-[180px]">{lead.propertyTitle}</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/property/${lead.propertyId}`}
                                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                >
                                                    VER PROPIEDAD <span className="material-icons text-sm">arrow_outward</span>
                                                </Link>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <button
                                                    onClick={() => {
                                                        const body = `Hola ${lead.leadName}, recibimos tu consulta sobre ${lead.propertyTitle}. Soy ${user?.displayName || "Agente"} de ${profileAgency || "Atlantida Group"}...`
                                                        window.location.href = `mailto:${lead.leadEmail}?subject=Re: ${lead.propertyTitle}&body=${encodeURIComponent(body)}`
                                                    }}
                                                    className="flex-1 min-w-[140px] py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-sm shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                                >
                                                    <span className="material-icons text-sm">send</span> Responder Email
                                                </button>
                                                {(lead as Lead).conversationId && isProOrPremium && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setChatFromLead({ conversationId: (lead as Lead).conversationId!, leadName: lead.leadName })
                                                            onClose()
                                                        }}
                                                        className="flex-1 min-w-[140px] py-4 bg-primary text-white rounded-lg font-semibold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                                    >
                                                        <span className="material-icons text-sm">chat</span> Ir al chat
                                                    </button>
                                                )}
                                                {isProOrPremium && (
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as Lead["status"])}
                                                        className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold text-xs bg-white dark:bg-slate-900"
                                                    >
                                                        <option value="new">Nuevo</option>
                                                        <option value="contacted">Contactado</option>
                                                        <option value="negotiating">Negociando</option>
                                                        <option value="closed">Cerrado</option>
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )
                        }}
                    />

                    {/* Modal: chat con el lead desde el drawer */}
                    <Dialog open={!!chatFromLead} onOpenChange={(open) => !open && setChatFromLead(null)}>
                        <DialogContent className="rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl p-0 overflow-hidden max-w-lg max-h-[85vh] flex flex-col">
                            {chatFromLead && user && (
                                <>
                                    <DialogHeader className="p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                                        <DialogTitle>Chat con {chatFromLead.leadName}</DialogTitle>
                                        <DialogDescription>Conversación en tiempo real.</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex-1 min-h-0 overflow-hidden p-4">
                                        <ConversationThread
                                            conversationId={chatFromLead.conversationId}
                                            currentUserId={user.uid}
                                            otherUserName={chatFromLead.leadName}
                                        />
                                    </div>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Properties Showcase - anchor for "Gestionando X propiedades" link */}
                <div id="inventario" className="space-y-8 pt-12 scroll-mt-32">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Inventario de Propiedades</h2>
                            <p className="text-slate-500 font-medium">Gestiona tus publicaciones directamente. {properties.length} activas.</p>
                        </div>
                    </div>

                    {properties.length === 0 ? (
                        <div className="p-16 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                                <span className="material-icons text-slate-300 text-5xl">inventory_2</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Comienza tu viaje comercial</h3>
                            <p className="text-slate-500 mb-8 max-w-sm">Publica tu primera propiedad y activa el generador de leads de Atlantida Group.</p>
                            <Link href="/publish" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]">Publicar Mi Primer Inmueble</Link>
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
                                        className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                                    >
                                        <Link href={`/property/${property.id}`} className="w-full sm:w-48 h-44 rounded-lg overflow-hidden relative shrink-0 cursor-pointer block">
                                            <img src={property.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Home" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <Badge className={`uppercase text-[9px] font-black border-none px-3 py-1 ${property.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                                                    }`}>
                                                    {property.status === 'active' ? 'ONLINE' : 'PAUSADA'}
                                                </Badge>
                                            </div>
                                        </Link>

                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <Link href={`/property/${property.id}`} className="block cursor-pointer">
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
                                            </Link>

                                            {/* Salud de la propiedad (FOMO) */}
                                            {isFOMOTacticEnabled('health_card') && (
                                                <div className="mt-4">
                                                    <PropertyHealthCard property={{ id: property.id, title: property.neighborhood, neighborhood: property.neighborhood, publishedAt: property.publishedAt }} userPlan={userPlan} />
                                                </div>
                                            )}

                                            {/* Teaser de leads para Free: "X interesados (Oculto)" */}
                                            {isFOMOTacticEnabled('teaser') && userPlan === 'free' && (() => {
                                                const leadsCountForProperty = leads.filter(l => l.propertyId === property.id).length
                                                return leadsCountForProperty > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            trackEvent.fomoTeaserClicked({ propertyId: property.id, leadsCount: leadsCountForProperty, userPlan })
                                                            setShowLeadsModal(property.id)
                                                        }}
                                                        className="flex items-center gap-2 text-sm text-slate-500 mt-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                                    >
                                                        <Lock className="w-4 h-4 shrink-0" />
                                                        <span>{leadsCountForProperty} interesado{leadsCountForProperty !== 1 ? 's' : ''} (Oculto)</span>
                                                        <span className="text-orange-600 dark:text-orange-400 font-semibold">Ver quiénes →</span>
                                                    </button>
                                                )
                                            })()}

                                            <div className="mt-6 flex items-center justify-between">
                                                <p className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                                    {formatPrice(property.price, property.currency)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/publish?edit=${property.id}`}
                                                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-all active:scale-95"
                                                        title="Editar"
                                                    >
                                                        <span className="material-icons text-lg">edit</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(property.id)}
                                                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
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

                {/* Modal FOMO: teaser de leads (blur + CTA) */}
                {showLeadsModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLeadsModal(null)}>
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-5 max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                            <div className="text-center blur-sm select-none pointer-events-none">
                                <p className="text-slate-400 dark:text-slate-500">María G. • Hace 2h</p>
                                <p className="text-slate-400 dark:text-slate-500">Carlos R. • Hace 5h</p>
                                <p className="text-slate-400 dark:text-slate-500">Ana M. • Ayer</p>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    <strong>Desbloqueá el contacto directo</strong> con tus interesados mejorando a Pro.
                                </p>
                                <Link
                                    href="/publish/pricing"
                                    className="inline-block bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 text-sm font-semibold transition-all active:scale-[0.98]"
                                >
                                    Ver planes y desbloquear
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowLeadsModal(null)}
                                    className="block mt-2 text-slate-500 dark:text-slate-400 text-sm hover:underline w-full"
                                >
                                    Tal vez después
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
