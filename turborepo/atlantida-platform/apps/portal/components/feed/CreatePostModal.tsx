"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/ui/dialog"
import { Home, TrendingDown, Megaphone, Lightbulb, Image as ImageIcon, Link as LinkIcon, User2, Loader2, Send } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@repo/lib/firebase"
import { collection, addDoc, serverTimestamp, getDoc, doc, query, where, limit, getDocs, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import type { FeedPostType, AgentPlan, Property, PropertySnapshot, FeedAgentProfile } from "@repo/types"

interface CreatePostModalProps {
    isOpen: boolean
    onClose: () => void
    initialPostType?: FeedPostType
    initialText?: string
}

const POST_TYPES: { id: FeedPostType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { id: 'new_property', label: 'Nuevo Ingreso', icon: <Home className="w-5 h-5 text-blue-500" />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 'price_drop', label: 'Bajó de Precio', icon: <TrendingDown className="w-5 h-5 text-orange-500" />, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { id: 'market_update', label: 'Actualización', icon: <Megaphone className="w-5 h-5 text-emerald-500" />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { id: 'opinion', label: 'Opinión', icon: <Lightbulb className="w-5 h-5 text-amber-500" />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
]

const QUICK_TEMPLATES: Record<FeedPostType, string[]> = {
    new_property: ["Nuevo ingreso en", "Coordinamos visita", "Excelente oportunidad"],
    price_drop: ["Bajó de precio", "Oportunidad para invertir", "Precio actualizado hoy"],
    market_update: ["Dato de mercado", "Tendencia del barrio", "Actualización importante"],
    opinion: ["Mi opinión profesional", "Tip inmobiliario", "Recomendación para compradores"],
}
const MAX_POST_CHARS = 500

export function CreatePostModal({ isOpen, onClose, initialPostType = "opinion", initialText }: CreatePostModalProps) {
    const { user } = useAuth()
    const [profile, setProfile] = useState<Partial<FeedAgentProfile> | null>(null)
    const [postType, setPostType] = useState<FeedPostType>(initialPostType)
    const [text, setText] = useState("")
    const [isPublishing, setIsPublishing] = useState(false)
    const [agentProperties, setAgentProperties] = useState<Property[]>([])
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
    const [isLoadingProperties, setIsLoadingProperties] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const charCount = text.trim().length
    const draftKey = user ? `barrio.feed.draft.${user.uid}` : "barrio.feed.draft.guest"

    useEffect(() => {
        if (!user || !db || !isOpen) return

        const fetchData = async () => {
            try {
                // Fetch Profile
                const docSnap = await getDoc(doc(db!, "users", user.uid))
                if (docSnap.exists()) {
                    setProfile(docSnap.data())
                }

                // Fetch Properties (All active for user)
                setIsLoadingProperties(true)

                try {
                    const q = query(
                        collection(db!, "properties"),
                        where("userId", "==", user.uid),
                        limit(20) // Fetch enough to sort locally
                    )
                    const querySnapshot = await getDocs(q)
                    const props = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Property))

                    // Local sorting to avoid missing field filtering from Firestore
                    props.sort((a, b) => {
                        const getVal = (p: any) => {
                            const field = postType === 'price_drop' ? p.priceUpdatedAt : p.publishedAt
                            if (!field) return 0
                            if (typeof field === 'object' && field !== null && 'seconds' in (field as any)) {
                                return (field as any).seconds * 1000
                            }
                            return new Date(field as string).getTime()
                        }
                        return getVal(b) - getVal(a)
                    })

                    setAgentProperties(props.slice(0, 3))
                } catch (error: unknown) {
                    console.error("Error fetching properties:", error)
                    setAgentProperties([])
                }
            } catch (error) {
                console.error("Error fetching modal data:", error)
            } finally {
                setIsLoadingProperties(false)
            }
        }
        fetchData()
    }, [user, isOpen, postType])

    useEffect(() => {
        if (!isOpen) return
        setPostType(initialPostType)
        setText(initialText ?? "")
        setSelectedPropertyId(null)

        if (!initialText && typeof window !== "undefined") {
            const savedDraft = window.localStorage.getItem(draftKey)
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft) as { text?: string; postType?: FeedPostType; selectedPropertyId?: string | null }
                    if (parsed.postType) setPostType(parsed.postType)
                    if (parsed.text) setText(parsed.text)
                    if (parsed.selectedPropertyId) setSelectedPropertyId(parsed.selectedPropertyId)
                } catch {
                    // ignore malformed drafts
                }
            }
        }

        const focusTimer = setTimeout(() => {
            textareaRef.current?.focus()
        }, 120)

        return () => clearTimeout(focusTimer)
    }, [isOpen, initialPostType, initialText, draftKey])

    useEffect(() => {
        if (!isOpen || typeof window === "undefined") return
        const payload = JSON.stringify({
            text,
            postType,
            selectedPropertyId,
            updatedAt: Date.now(),
        })
        window.localStorage.setItem(draftKey, payload)
    }, [isOpen, text, postType, selectedPropertyId, draftKey])

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
            // Límite 5 posts por día (aplicado en cliente; las reglas no permiten query+count)
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const todayQuery = query(
                collection(db!, "feedPosts"),
                where("authorId", "==", user.uid),
                where("publishedAt", ">=", Timestamp.fromDate(startOfDay)),
                limit(6)
            )
            const todaySnap = await getDocs(todayQuery)
            if (todaySnap.size >= 5) {
                toast.error("Has alcanzado el límite de 5 publicaciones por día. Intenta mañana.")
                setIsPublishing(false)
                return
            }

            // Premium (pricing propiedades) = Elite (feed/ranking); normalizar para badges y boost
            const rawPlan = profile?.plan || 'free'
            const plan: AgentPlan = rawPlan === 'premium' ? 'elite' : (rawPlan === 'pro' || rawPlan === 'elite' ? rawPlan : 'free')
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
                authorVerified: profile?.plan === 'elite' || profile?.plan === 'pro' || profile?.plan === 'premium',
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
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(draftKey)
            }
            onClose()
        } catch (error: unknown) {
            console.error("Error publishing post:", error)
            toast.error("Error al publicar: " + (error instanceof Error ? error.message : String(error)))
        } finally {
            setIsPublishing(false)
        }
    }

    const reachMultiplier = (profile?.plan === 'elite' || profile?.plan === 'premium') ? 4 : profile?.plan === 'pro' ? 2 : 1
    const baseReach = 1500
    const estimatedReach = baseReach * reachMultiplier

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-screen sm:w-[calc(100%-2rem)] h-[100dvh] sm:h-auto sm:max-h-[92dvh] sm:max-w-[620px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 shadow-xl rounded-none sm:rounded-xl flex flex-col">
                <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 sm:hidden" />
                    <DialogTitle className="text-2xl sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                        <span>Crear Actualización</span>
                    </DialogTitle>
                    <DialogDescription className="text-[15px] sm:text-[14px] text-slate-500 font-medium leading-snug">
                        Comparte tus novedades, exclusivas o análisis del mercado con la red de Barrio.
                    </DialogDescription>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Tu borrador se guarda automáticamente.
                    </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 sm:space-y-5">
                    {/* Author Preview */}
                    <div className="flex items-center gap-3 pb-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User2 className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-base text-slate-900 dark:text-white tracking-tight">{user?.displayName || "Agente"}</p>
                            <span className="px-2 py-0.5 mt-0.5 inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold rounded-md">
                                {profile?.plan === 'elite' || profile?.plan === 'premium' ? 'Plan Premium' : profile?.plan === 'pro' ? 'Plan Pro' : 'Plan Free'}
                            </span>
                        </div>
                    </div>

                    {/* Post Type Selector */}
                    <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Tipo de publicación</p>
                        <div className="grid grid-cols-2 gap-2">
                            {POST_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setPostType(type.id)}
                                    className={`flex items-center gap-2.5 h-14 px-3 rounded-xl border transition-all ${postType === type.id
                                        ? `border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-black shadow-sm`
                                        : `border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900`
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${postType === type.id ? 'bg-white/20 dark:bg-black/10' : type.bg}`}>
                                        {type.icon}
                                    </div>
                                    <span className={`text-[13px] font-semibold text-left leading-tight ${postType === type.id ? 'text-white dark:text-black' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="space-y-2.5">
                        <textarea
                            ref={textareaRef}
                            placeholder="¿Qué quieres compartir con tu red? Escribe tu análisis, detalle de propiedad o novedad..."
                            className="w-full min-h-[120px] p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 resize-none text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 leading-relaxed"
                            value={text}
                            onChange={(e) => {
                                const nextValue = e.target.value
                                if (nextValue.length <= MAX_POST_CHARS) {
                                    setText(nextValue)
                                }
                            }}
                        />

                        <div className="flex flex-wrap gap-1.5">
                            {QUICK_TEMPLATES[postType].map((template) => (
                                <button
                                    key={template}
                                    type="button"
                                    onClick={() => setText(prev => prev ? `${prev}\n${template}` : template)}
                                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                >
                                    + {template}
                                </button>
                            ))}
                        </div>

                        {/* Hashtag Suggestions */}
                        <div className="flex flex-wrap gap-1.5">
                            {['#Oportunidad', '#NuevoIngreso', '#Montevideo', '#Inversion', '#BajoDePrecio'].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        if (!text.includes(tag)) {
                                            setText(prev => prev.trim() + " " + tag)
                                        }
                                    }}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="material-icons text-[12px] text-blue-500">trending_up</span>
                            Usar hashtags aumenta el alcance de tu publicación hasta un 20%.
                        </p>
                    </div>

                    {/* Asset Linker (Property Selector) */}
                    {(postType === 'new_property' || postType === 'price_drop') && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Vincular propiedad</p>
                                <span className="text-xs text-slate-400">Tus últimas 3</span>
                            </div>

                            {isLoadingProperties ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    ))}
                                </div>
                            ) : agentProperties.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                                <div className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center bg-slate-50/60 dark:bg-slate-800/20">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No tienes propiedades publicadas todavía.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reach Estimator */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl flex items-start gap-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Alcance estimado</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">Tu publicación llegará a <strong className="text-slate-900 dark:text-white font-bold">+{estimatedReach.toLocaleString()} usuarios</strong>.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="sticky bottom-0 p-3 sm:p-4 sm:px-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Añadir Imagen">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <span className={`text-xs font-semibold ${charCount > 450 ? "text-orange-500" : "text-slate-400"}`}>
                            {charCount}/{MAX_POST_CHARS}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            className="px-3 sm:px-4 h-10 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 sm:px-5 h-10 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handlePublish}
                            disabled={isPublishing || !text.trim() || charCount > MAX_POST_CHARS}
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
