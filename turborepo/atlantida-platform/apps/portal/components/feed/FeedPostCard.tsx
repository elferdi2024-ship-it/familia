'use client'

import type { FeedPost } from '@repo/types'
import { MessageCircle, Heart, TrendingDown, CheckCircle2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { PropertySnapshotCard } from './PropertySnapshotCard'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { isFOMOTacticEnabled } from '@repo/lib'
import { trackEvent } from '@repo/lib/tracking'
import { useEffect, useState, type MouseEvent } from 'react'
import { toast } from 'sonner'

interface FeedPostCardProps {
    post: FeedPost
    onWhatsAppClick: (postId: string, url: string) => void
    onLike: (postId: string) => void
    onPropertyClick: (postId: string) => void
    onAuthorClick?: (agent: any) => void
    onHashtagClick?: (tag: string) => void
}

function resolveDate(ts: Date | { seconds: number; nanoseconds: number }): Date {
    if (ts instanceof Date) return ts
    return new Date(ts.seconds * 1000)
}

/** Badge FOMO: Estándar (free) vs Destacado (pro/elite/premium) */
function PlanBadge({ plan }: { plan: FeedPost['plan'] }) {
    if (!isFOMOTacticEnabled('badge')) return null
    const effectivePlan = plan === 'premium' ? 'elite' : plan
    if (effectivePlan === 'free') {
        return (
            <span
                className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-help"
                title="Mejorá tu plan para destacar tu propiedad en el Feed"
            >
                Propiedad Estándar
            </span>
        )
    }
    if (effectivePlan === 'pro' || effectivePlan === 'elite') {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                ✨ Destacado
            </span>
        )
    }
    return null
}

export function FeedPostCard({
    post,
    onWhatsAppClick,
    onLike,
    onPropertyClick,
    onAuthorClick,
    onHashtagClick,
}: FeedPostCardProps) {
    const PREVIEW_LIMIT = 220
    const publishedDate = resolveDate(post.publishedAt)
    const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: es })
    const [isExpanded, setIsExpanded] = useState(false)
    const [showLikeBurst, setShowLikeBurst] = useState(false)

    useEffect(() => {
        if (isFOMOTacticEnabled('badge') && post.plan === 'free') {
            trackEvent.fomoBadgeViewed({
                propertyId: post.propertySnapshot?.id,
                userPlan: post.plan,
                location: 'feed',
            })
        }
    }, [post.id, post.plan, post.propertySnapshot?.id])
    const isPriceDrop = post.type === 'price_drop'
    const shouldTruncate = post.text.length > PREVIEW_LIMIT
    const textToShow = shouldTruncate && !isExpanded
        ? `${post.text.slice(0, PREVIEW_LIMIT).trim()}...`
        : post.text

    const handleDoubleTapLike = () => {
        setShowLikeBurst(true)
        onLike(post.id)
        setTimeout(() => setShowLikeBurst(false), 650)
    }

    const shareUrl = typeof window !== 'undefined'
        ? window.location.origin + (post.propertySnapshot ? `/property/${post.propertySnapshot.id}` : '/feed')
        : '/feed'

    const shareText = `${post.text.slice(0, 90)}${post.text.length > 90 ? '...' : ''}`

    const handleShare = async () => {
        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({
                    title: post.propertySnapshot?.neighborhood || 'Propiedad en Barrio.uy',
                    text: shareText,
                    url: shareUrl,
                })
                return
            }

            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareUrl)
                toast.success('Enlace copiado para compartir')
                return
            }

            window.open(shareUrl, '_blank', 'noopener,noreferrer')
        } catch {
            // Silenciar cancelaciones de share nativo y errores menores
        }
    }

    const handleWhatsApp = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const message = encodeURIComponent(
            `${shareText}\n\nVer publicación: ${shareUrl}`
        )
        const whatsappUrl = `https://wa.me/?text=${message}`
        onWhatsAppClick(post.id, whatsappUrl)
    }

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative flex flex-col bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 md:px-1"
            onDoubleClick={handleDoubleTapLike}
        >
            {/* ── Header: Agent Info ─────────────────────────── */}
            <div className="px-3 sm:px-4 pt-3 pb-1.5 md:px-5 md:pt-4 md:pb-2 flex items-start gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                        className="relative shrink-0 cursor-pointer"
                        onClick={() => onAuthorClick?.({
                            id: post.authorId,
                            name: post.authorName,
                            avatar: post.authorAvatar,
                            verified: post.authorVerified,
                            plan: post.plan,
                            neighborhood: post.propertySnapshot?.neighborhood
                        })}
                    >
                        <img
                            src={post.authorAvatar || '/placeholder-avatar.png'}
                            alt={post.authorName}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-offset-2 dark:ring-offset-black ${post.plan === 'elite' ? 'ring-purple-500 shadow-lg shadow-purple-500/20' :
                                post.plan === 'pro' ? 'ring-emerald-500 shadow-lg shadow-emerald-500/10' :
                                    'ring-transparent'
                                }`}
                        />
                        {post.authorVerified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-black flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                            <h4
                                className="font-semibold text-[15px] sm:text-[16px] md:text-[17px] text-slate-900 dark:text-white hover:underline cursor-pointer tracking-tight max-w-[170px] sm:max-w-none truncate"
                                onClick={() => onAuthorClick?.({
                                    id: post.authorId,
                                    name: post.authorName,
                                    avatar: post.authorAvatar,
                                    verified: post.authorVerified,
                                    plan: post.plan,
                                    neighborhood: post.propertySnapshot?.neighborhood
                                })}
                            >
                                {post.authorName}
                            </h4>
                            <PlanBadge plan={post.plan} />
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium truncate">
                            {post.propertySnapshot?.neighborhood || 'General'} · {timeAgo.replace('hace ', '')}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Text Content ───────────────────────────── */}
            <div className="px-3 sm:px-4 pt-1 pb-3 pl-3 sm:pl-16 md:px-5 md:pb-4">
                <p className="text-[15px] md:text-[16px] text-slate-900 dark:text-slate-200 leading-relaxed mb-1 whitespace-pre-wrap">
                    {textToShow}
                </p>
                {shouldTruncate && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(v => !v)}
                        className="mb-3 text-[12px] font-bold text-primary hover:underline"
                    >
                        {isExpanded ? "Ver menos" : "Ver más"}
                    </button>
                )}
                {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.hashtags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => onHashtagClick?.(tag)}
                                className="inline-flex items-center px-2.5 py-1 rounded-full border border-blue-200/80 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/20 text-[12px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/35 transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}

                {isPriceDrop && (
                    <div className="mb-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        <span className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
                            Bajó de precio esta semana
                        </span>
                    </div>
                )}

                {/* ── Property Snapshot ─────────────────────────── */}
                {post.propertySnapshot && (
                    <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors md:rounded-lg">
                        <Link
                            href={`/property/${post.propertySnapshot.id}`}
                            onClick={() => onPropertyClick(post.id)}
                            className="block"
                        >
                            <PropertySnapshotCard snapshot={post.propertySnapshot} />
                        </Link>
                    </div>
                )}
            </div>

            {showLikeBurst && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="material-icons text-6xl text-red-500 animate-ping">favorite</span>
                </div>
            )}

            {/* ── Actions Bar ───────────────────────────────── */}
            <div className="pl-3 sm:pl-16 pr-3 sm:pr-4 pb-3 md:px-5 md:pb-4 grid grid-cols-3 gap-2 md:gap-2.5 text-slate-500 dark:text-slate-400">
                <button
                    onClick={() => onLike(post.id)}
                    className="h-10 md:h-11 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 group transition-all active:scale-95 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900"
                >
                    <Heart className={`w-[17px] h-[17px] ${post.likes && post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className={`text-[12px] font-medium ${post.likes && post.likes > 0 ? 'text-red-500' : ''}`}>{post.likes || 'Me gusta'}</span>
                </button>

                <button
                    onClick={handleShare}
                    className="h-10 md:h-11 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 group transition-all active:scale-95 hover:text-blue-500 hover:border-blue-200 dark:hover:border-blue-900"
                >
                    <Share2 className="w-[17px] h-[17px]" />
                    <span className="text-[12px] font-medium">Compartir</span>
                </button>

                {/* Minimalist Action instead of big green button */}
                <button
                    onClick={handleWhatsApp}
                    className="h-10 md:h-11 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-[12px] font-semibold transition-all active:scale-95"
                >
                    <MessageCircle className="w-[16px] h-[16px]" />
                    WhatsApp
                </button>
            </div>
        </motion.article>
    )
}
