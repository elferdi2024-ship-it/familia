'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFeed } from '@/hooks/useFeed'
import { useFeedActions } from '@/hooks/useFeedActions'
import { FeedPostCard } from './FeedPostCard'
import { AgentProfileSummary } from './AgentProfileSummary'
import { Loader2, Rss, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Scrollable feed list with loading skeleton, pagination,
 * and empty state. Wires up real-time data → optimistic actions → cards.
 */
export function FeedList() {
    const searchParams = useSearchParams()
    const [filterAuthorId, setFilterAuthorId] = useState<string | null>(null)
    const [summaryAgent, setSummaryAgent] = useState<any | null>(null)

    useEffect(() => {
        const authorId = searchParams.get('authorId')
        if (authorId) {
            setFilterAuthorId(authorId)
        }
    }, [searchParams])

    const { posts, loading, error, hasMore, loadMore } = useFeed(10, filterAuthorId)
    const {
        optimisticPosts,
        handleWhatsAppClick,
        handleLike,
        handlePropertyClick,
    } = useFeedActions(posts)

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
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-1.5 flex-1">
                                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-2 w-16 rounded bg-slate-100 dark:bg-slate-900" />
                            </div>
                        </div>
                        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 mb-2" />
                        <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-900 mb-3" />
                        <div className="aspect-[16/10] rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
                        <div className="flex gap-4">
                            <div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-900" />
                            <div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-900" />
                            <div className="ml-auto h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                ))}
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
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Tu feed está vacío
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">
                    Pronto los agentes de tu barrio publicarán contenido aquí.
                    Volvé en un rato ✨
                </p>
            </div>
        )
    }

    // ── Feed Content ───────────────────────────────────────
    return (
        <div className="space-y-0 pb-24 border-l border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black min-h-screen">
            {/* ── Filter Pills (Stitch Design) ── */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/50">
                <div className="flex items-center gap-2 overflow-x-auto p-4 custom-scroll scrollbar-hide">
                    <button
                        onClick={() => setFilterAuthorId(null)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-colors ${!filterAuthorId
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-white dark:bg-black border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Todo
                    </button>
                    <button className="shrink-0 px-4 py-1.5 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-full text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300">
                        🔥 Bajó de Precio
                    </button>
                    <button className="shrink-0 px-4 py-1.5 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-full text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300">
                        Obra Nueva
                    </button>
                    <button className="shrink-0 px-4 py-1.5 bg-white dark:bg-black border border-slate-300 dark:border-slate-700 rounded-full text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300">
                        Premium
                    </button>
                </div>

                {/* Filter Active Indicator */}
                <AnimatePresence>
                    {filterAuthorId && optimisticPosts.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 overflow-hidden"
                        >
                            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-black rounded-full text-primary shrink-0">
                                        <Rss className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                                            Mostrando publicaciones de {optimisticPosts[0].authorName}
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

            {optimisticPosts.map((post) => (
                <FeedPostCard
                    key={post.id}
                    post={post}
                    onWhatsAppClick={handleWhatsAppClick}
                    onLike={handleLike}
                    onPropertyClick={handlePropertyClick}
                    onAuthorClick={(agent) => setSummaryAgent(agent)}
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
                <div className="flex justify-center py-4">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 px-6 py-3 text-sm font-bold text-primary transition-colors disabled:opacity-50"
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
    )
}
