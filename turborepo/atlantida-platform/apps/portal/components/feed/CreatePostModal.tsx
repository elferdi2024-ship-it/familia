"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/ui/dialog"
import { Home, TrendingDown, Megaphone, Lightbulb, Image as ImageIcon, Link as LinkIcon, User2, Loader2, Send } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@repo/lib/firebase"
import { collection, addDoc, serverTimestamp, getDoc, doc, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { toast } from "sonner"
import type { FeedPostType, AgentPlan, Property, PropertySnapshot } from "@repo/types"

interface CreatePostModalProps {
    isOpen: boolean
    onClose: () => void
}

const POST_TYPES: { id: FeedPostType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { id: 'new_property', label: 'Nuevo Ingreso', icon: <Home className="w-5 h-5 text-blue-500" />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 'price_drop', label: 'Bajó de Precio', icon: <TrendingDown className="w-5 h-5 text-orange-500" />, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { id: 'market_update', label: 'Actualización', icon: <Megaphone className="w-5 h-5 text-emerald-500" />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { id: 'opinion', label: 'Opinión', icon: <Lightbulb className="w-5 h-5 text-amber-500" />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
]

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { user } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [postType, setPostType] = useState<FeedPostType>('opinion')
    const [text, setText] = useState("")
    const [isPublishing, setIsPublishing] = useState(false)
    const [agentProperties, setAgentProperties] = useState<Property[]>([])
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
    const [isLoadingProperties, setIsLoadingProperties] = useState(false)

    useEffect(() => {
        if (!user || !db || !isOpen) return

        const fetchData = async () => {
            try {
                // Fetch Profile
                const docSnap = await getDoc(doc(db!, "users", user.uid))
                if (docSnap.exists()) {
                    setProfile(docSnap.data())
                }

                // Fetch Last 3 Properties (Dynamic sorting based on post type)
                setIsLoadingProperties(true)
                const sortField = postType === 'price_drop' ? "priceUpdatedAt" : "publishedAt"

                try {
                    const q = query(
                        collection(db!, "properties"),
                        where("userId", "==", user.uid),
                        orderBy(sortField, "desc"),
                        limit(3)
                    )
                    const querySnapshot = await getDocs(q)
                    const props = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Property))
                    setAgentProperties(props)
                } catch (sortError: any) {
                    console.warn(`Query with ${sortField} failed, trying fallback:`, sortError.message)
                    // If the specific price_drop index is missing, fallback to publishedAt
                    if (postType === 'price_drop') {
                        const fallbackQ = query(
                            collection(db!, "properties"),
                            where("userId", "==", user.uid),
                            orderBy("publishedAt", "desc"),
                            limit(3)
                        )
                        const fallbackSnap = await getDocs(fallbackQ)
                        const fallbackProps = fallbackSnap.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as Property))
                        setAgentProperties(fallbackProps)
                    }
                }
            } catch (error) {
                console.error("Error fetching modal data:", error)
            } finally {
                setIsLoadingProperties(false)
            }
        }
        fetchData()
    }, [user, isOpen, postType])

    const handlePropertySelect = (prop: Property) => {
        if (selectedPropertyId === prop.id) {
            setSelectedPropertyId(null)
            return
        }

        setSelectedPropertyId(prop.id)

        // Auto-generate text if empty or just basic placeholder
        if (!text.trim() || text.length < 5) {
            const operation = prop.operation === 'Venta' ? 'en VENTA' : 'en ALQUILER'
            const emoji = postType === 'price_drop' ? '📉 ¡BAJÓ DE PRECIO!' : '🆕 ¡NUEVO INGRESO!'

            const template = `${emoji}\n\nExcelente ${prop.type.toLowerCase()} ${operation} en ${prop.neighborhood}, ${prop.city}.\n\n✅ ${prop.bedrooms} Dorm. | ${prop.area} m²\n💰 ${prop.currency} ${prop.price.toLocaleString('es-UY')}\n\nEscribime para coordinar una visita 👋`
            setText(template)
        }
    }

    const handlePublish = async () => {
        if (!user || !db) {
            toast.error("Debes iniciar sesión para publicar.")
            return
        }
        if (!text.trim()) {
            toast.error("El contenido de la publicación no puede estar vacío.")
            return
        }

        setIsPublishing(true)
        try {
            const plan: AgentPlan = profile?.plan || 'free'
            const hashtags = text.match(/#[\wñáéíóú]+/g)?.map(h => h.substring(1)) || []

            let propertySnapshot: PropertySnapshot | null = null
            if (selectedPropertyId) {
                const prop = agentProperties.find(p => p.id === selectedPropertyId)
                if (prop) {
                    propertySnapshot = {
                        id: prop.id,
                        slug: prop.slug,
                        price: prop.price,
                        currency: prop.currency,
                        neighborhood: prop.neighborhood,
                        viviendaPromovida: prop.viviendaPromovida || false,
                        acceptedGuarantees: prop.acceptedGuarantees || [],
                        mainImage: prop.images?.[0] || '',
                        bedrooms: prop.bedrooms,
                        area: prop.area
                    }
                }
            }

            await addDoc(collection(db!, "feedPosts"), {
                authorId: user.uid,
                authorName: user.displayName || "Agente sin nombre",
                authorAvatar: user.photoURL || "",
                authorSlug: profile?.slug || user.uid,
                authorVerified: profile?.plan === 'elite' || profile?.plan === 'pro',
                plan,
                text,
                hashtags,
                type: postType,
                propertySnapshot,
                propertyUrl: selectedPropertyId ? `${window.location.origin}/property/${agentProperties.find(p => p.id === selectedPropertyId)?.slug}` : null,
                leadIntentScore: 0,
                rankingScore: 0,
                whatsappClicks: 0,
                likes: 0,
                comments: 0,
                publishedAt: serverTimestamp(),
                status: 'published'
            })

            toast.success("¡Publicación enviada al Feed!")
            setText("")
            setSelectedPropertyId(null)
            setPostType('opinion')
            onClose()
        } catch (error: any) {
            console.error("Error publishing post:", error)
            toast.error("Error al publicar: " + error.message)
        } finally {
            setIsPublishing(false)
        }
    }

    const reachMultiplier = profile?.plan === 'elite' ? 4 : profile?.plan === 'pro' ? 2 : 1
    const baseReach = 1500
    const estimatedReach = baseReach * reachMultiplier

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl">
                <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                        <span>Crear Actualización</span>
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-slate-500 font-medium">
                        Comparte tus novedades, exclusivas o análisis del mercado con la red de Barrio.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    {/* Author Preview */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User2 className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-[15px] text-slate-900 dark:text-white tracking-tight">{user?.displayName || "Agente"}</p>
                            <span className="px-1.5 py-0.5 mt-0.5 inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest rounded">
                                {profile?.plan === 'elite' ? 'Plan Elite' : profile?.plan === 'pro' ? 'Plan Pro' : 'Plan Free'}
                            </span>
                        </div>
                    </div>

                    {/* Post Type Selector */}
                    <div>
                        <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-3">Tipo de Publicación</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {POST_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setPostType(type.id)}
                                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all ${postType === type.id
                                        ? `border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-black shadow-md`
                                        : `border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900`
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg mb-2 ${postType === type.id ? 'bg-white/20 dark:bg-black/10' : type.bg}`}>
                                        {type.icon}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${postType === type.id ? 'text-white dark:text-black' : 'text-slate-500'}`}>
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="space-y-3">
                        <textarea
                            placeholder="¿Qué quieres compartir con tu red? Escribe tu análisis, detalle de propiedad o novedad..."
                            className="w-full min-h-[140px] p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white resize-none text-[15px] text-slate-900 dark:text-slate-200 placeholder:text-slate-400"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />

                        {/* Hashtag Suggestions */}
                        <div className="flex flex-wrap gap-2">
                            {['#Oportunidad', '#NuevoIngreso', '#Montevideo', '#Inversion', '#BajoDePrecio'].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        if (!text.includes(tag)) {
                                            setText(prev => prev.trim() + " " + tag)
                                        }
                                    }}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 ml-1">
                            <span className="material-icons text-[12px] text-blue-500">trending_up</span>
                            Usar hashtags aumenta el alcance de tu publicación hasta un 20%.
                        </p>
                    </div>

                    {/* Asset Linker (Property Selector) */}
                    {(postType === 'new_property' || postType === 'price_drop') && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Vincular Propiedad</p>
                                <span className="text-[10px] text-slate-400">Selecciona una de tus últimas 3</span>
                            </div>

                            {isLoadingProperties ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    ))}
                                </div>
                            ) : agentProperties.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {agentProperties.map((prop) => (
                                        <button
                                            key={prop.id}
                                            type="button"
                                            onClick={() => handlePropertySelect(prop)}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${selectedPropertyId === prop.id
                                                ? 'border-slate-900 dark:border-white ring-2 ring-slate-900/10 dark:ring-white/10'
                                                : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                                }`}
                                        >
                                            <img
                                                src={prop.images?.[0] || '/placeholder-property.jpg'}
                                                alt={prop.neighborhood}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 backdrop-blur-sm">
                                                <p className="text-[9px] font-bold text-white truncate text-center">{prop.neighborhood}</p>
                                                <p className="text-[8px] text-white/80 font-medium text-center">{prop.currency} {prop.price.toLocaleString('es-UY')}</p>
                                            </div>
                                            {selectedPropertyId === prop.id && (
                                                <div className="absolute inset-0 bg-slate-900/20 dark:bg-black/20 flex items-center justify-center">
                                                    <div className="bg-slate-900 dark:bg-white text-white dark:text-black rounded-full p-1 shadow-lg">
                                                        <LinkIcon className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                                    <p className="text-[12px] text-slate-400">No tienes propiedades publicadas todavía.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reach Estimator */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Alcance Estimado Barrio</p>
                                <p className="text-[13px] text-slate-700 dark:text-slate-300 mt-0.5">Tu publicación llegará a aprox. <strong className="text-slate-900 dark:text-white font-bold">+{estimatedReach.toLocaleString()} usuarios</strong> según tu plan.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors" title="Añadir Imagen">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-[13px] hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-[14px] rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handlePublish}
                            disabled={isPublishing || !text.trim()}
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Publicando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Publicar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
