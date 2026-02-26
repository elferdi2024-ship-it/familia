'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useFeed } from '@/hooks/useFeed'
import { useFeedActions } from '@/hooks/useFeedActions'
import { FeedPostCard } from './FeedPostCard'
import { AgentProfileSummary } from './AgentProfileSummary'
import { Loader2, Rss, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { CreatePostModal } from './CreatePostModal'
import type { FeedPostType } from '@repo/types'

/**
 * Scrollable feed list with loading skeleton, pagination,
 * and empty state. Wires up real-time data → optimistic actions → cards.
 */
export function FeedList() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const [filterAuthorId, setFilterAuthorId] = useState<string | null>(null)
    const [quickFilter, setQuickFilter] = useState<'all' | 'price_drop' | 'new_property' | 'premium'>('all')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [summaryAgent, setSummaryAgent] = useState<any | null>(null)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
    const [composerType, setComposerType] = useState<FeedPostType>('opinion')

    const handleOpenComposer = (type: FeedPostType = 'opinion') => {
        if (!user) {
            setShowAuthModal(true)
            return
        }
        setComposerType(type)
        setIsCreatePostOpen(true)
    }

    const updateTagInUrl = (tag: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (tag) {
            params.set('tag', tag)
        } else {
            params.delete('tag')
        }
        const queryString = params.toString()
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    }

    useEffect(() => {
        const authorId = searchParams.get('authorId')
        const tag = searchParams.get('tag')
        setFilterAuthorId(authorId || null)
        setSelectedTag(tag || null)
    }, [searchParams])

    const { posts, loading, error, hasMore, loadMore } = useFeed(10, filterAuthorId)
    const {
        optimisticPosts,
        handleWhatsAppClick,
        handleLike,
        handlePropertyClick,
    } = useFeedActions(posts)

    const visiblePosts = optimisticPosts.filter((post) => {
        if (quickFilter === 'all') return true
        if (quickFilter === 'premium') return post.plan === 'pro' || post.plan === 'elite' || post.plan === 'premium'
        return post.type === quickFilter
    }).filter((post) => {
        if (!selectedTag) return true
        return post.hashtags?.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase())
    })

    // ── Loading State ──────────────────────────────────────
    if (loading && posts.length === 0) {
        return (
            <div className="space-y-4 px-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black p-4"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 shimmer-block" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800 shimmer-block" />
                                <div className="h-2 w-16 rounded bg-slate-100 dark:bg-slate-900 shimmer-block" />
                            </div>
                        </div>
                        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2 shimmer-block" />
                        <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-900 mb-3 shimmer-block" />
                        <div className="aspect-[16/10] rounded-xl bg-slate-200 dark:bg-slate-800 mb-3 shimmer-block" />
                        <div className="flex gap-4">
                            <div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-900 shimmer-block" />
                            <div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-900 shimmer-block" />
                            <div className="ml-auto h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800 shimmer-block" />
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
                        animation: feed-shimmer 1.5s infinite;
                    }
                    .dark .shimmer-block::after {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                    }
                    @keyframes feed-shimmer {
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        )
    }

    // ── Error State ────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 mb-4">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Error al cargar el feed
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">{error}</p>
            </div>
        )
    }

    // ── Empty State ────────────────────────────────────────
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="p-8 mb-6 text-slate-300 dark:text-slate-700"
                >
                    <Rss className="h-12 w-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Tu feed está vacío
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">
                    Pronto los agentes de tu barrio publicarán contenido aquí.
                    Volvé en un rato ✨
                </p>
                <button
                    onClick={() => handleOpenComposer('opinion')}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                    <span className="material-icons text-base">edit</span>
                    Crear publicación
                </button>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
                <CreatePostModal
                    isOpen={isCreatePostOpen}
                    onClose={() => setIsCreatePostOpen(false)}
                    initialPostType={composerType}
                />
            </div>
        )
    }

    // ── Feed Content ───────────────────────────────────────
    return (
        <>
            <div className="space-y-0 pb-24 border-l border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black min-h-screen md:rounded-b-xl md:overflow-hidden">
            {/* ── Filter Pills (Stitch Design) ── */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50">
                <div className="md:hidden px-3 pt-3">
                    <button
                        onClick={() => handleOpenComposer('opinion')}
                        className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-left text-sm text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                        ¿Qué querés compartir hoy?
                    </button>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        <button onClick={() => handleOpenComposer('new_property')} className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                            Nuevo ingreso
                        </button>
                        <button onClick={() => handleOpenComposer('price_drop')} className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                            Bajó precio
                        </button>
                        <button onClick={() => handleOpenComposer('opinion')} className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900">
                            Opinión
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto p-4 custom-scroll scrollbar-hide md:px-5 md:py-3">
                    <button
                        onClick={() => {
                            setFilterAuthorId(null)
                            setQuickFilter('all')
                            setSelectedTag(null)
                            updateTagInUrl(null)
                        }}
                        className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-colors ${!filterAuthorId && quickFilter === 'all'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Todo
                    </button>
                    <button
                        onClick={() => setQuickFilter('price_drop')}
                        className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${quickFilter === 'price_drop'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-black border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        🔥 Bajó de Precio
                    </button>
                    <button
                        onClick={() => setQuickFilter('new_property')}
                        className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${quickFilter === 'new_property'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-black border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Obra Nueva
                    </button>
                    <button
                        onClick={() => setQuickFilter('premium')}
                        className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${quickFilter === 'premium'
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-black border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Premium
                    </button>
                </div>
                {selectedTag && (
                    <div className="px-4 pb-3 md:px-5">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedTag(null)
                                updateTagInUrl(null)
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/35 transition-colors"
                        >
                            #{selectedTag}
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Filter Active Indicator */}
                <AnimatePresence>
                    {filterAuthorId && visiblePosts.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 overflow-hidden"
                        >
                            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-black rounded-md text-primary shrink-0">
                                        <Rss className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                                            Mostrando publicaciones de {visiblePosts[0].authorName}
                                        </p>
                                        <p className="text-[12px] font-medium text-slate-500">
                                            Filtro de agente activado
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setFilterAuthorId(null)}
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {visiblePosts.map((post) => (
                <FeedPostCard
                    key={post.id}
                    post={post}
                    onWhatsAppClick={handleWhatsAppClick}
                    onLike={handleLike}
                    onPropertyClick={handlePropertyClick}
                    onAuthorClick={(agent) => setSummaryAgent(agent)}
                    onHashtagClick={(tag) => {
                        setSelectedTag(tag)
                        updateTagInUrl(tag)
                    }}
                />
            ))}

            {/* Agent Summary Modal */}
            {summaryAgent && (
                <AgentProfileSummary
                    isOpen={!!summaryAgent}
                    onClose={() => setSummaryAgent(null)}
                    agent={summaryAgent}
                    onViewPosts={(id) => setFilterAuthorId(id)}
                />
            )}

            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center py-5">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 hover:bg-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Cargando...
                            </>
                        ) : (
                            'Ver más publicaciones'
                        )}
                    </button>
                </div>
            )}
        </div>
            <button
                onClick={() => handleOpenComposer('opinion')}
                className="md:hidden fixed right-4 bottom-24 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-white shadow-lg shadow-primary/30 font-bold text-sm"
                aria-label="Crear publicación"
            >
                <span className="material-icons text-lg leading-none">add</span>
                Postear
            </button>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
                initialPostType={composerType}
            />
        </>
    )
}
