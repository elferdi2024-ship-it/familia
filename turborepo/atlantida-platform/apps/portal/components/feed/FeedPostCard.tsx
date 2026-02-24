'use client'

import type { FeedPost } from '@repo/types'
import { MessageCircle, Heart, TrendingDown, Clock, CheckCircle2, Share2, Users } from 'lucide-react'
import Link from 'next/link'
import { PropertySnapshotCard } from './PropertySnapshotCard'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface FeedPostCardProps {
    post: FeedPost
    onWhatsAppClick: (postId: string, url: string) => void
    onLike: (postId: string) => void
    onPropertyClick: (postId: string) => void
    onAuthorClick?: (agent: any) => void
}

function resolveDate(ts: Date | { seconds: number; nanoseconds: number }): Date {
    if (ts instanceof Date) return ts
    return new Date(ts.seconds * 1000)
}

export function FeedPostCard({
    post,
    onWhatsAppClick,
    onLike,
    onPropertyClick,
    onAuthorClick,
}: FeedPostCardProps) {
    const publishedDate = resolveDate(post.publishedAt)
    const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: es })
    const isPriceDrop = post.type === 'price_drop'

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
        >
            {/* ── Header: Agent Info ─────────────────────────── */}
            <div className="px-4 py-3 pb-1 flex items-start justify-between">
                <div className="flex items-center gap-3">
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
                            className={`w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 dark:ring-offset-black ${post.plan === 'elite' ? 'ring-purple-500 shadow-lg shadow-purple-500/20' :
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
                    <div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                            <h4
                                className="font-bold text-[16px] text-slate-900 dark:text-white hover:underline cursor-pointer tracking-tight"
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
                            {post.plan !== 'free' && (
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-widest hidden sm:inline-block ${post.plan === 'elite' ? 'bg-purple-600' : 'bg-emerald-600'
                                    }`}>
                                    {post.plan}
                                </span>
                            )}
                            <span className="text-slate-500 dark:text-slate-500 mx-0.5">·</span>
                            <span className="text-[14px] text-slate-500 hover:underline cursor-pointer">
                                {timeAgo.replace('hace ', '')}
                            </span>
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium">
                            {post.propertySnapshot?.neighborhood || 'General'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`p-2 rounded-lg transition-colors ${post.likes && post.likes > 0 ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        title="Me gusta"
                    >
                        <Heart className={`w-5 h-5 ${post.likes && post.likes > 0 ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* ── Text Content ───────────────────────────── */}
            <div className="px-4 pt-1 pb-3 pl-16">
                <p className="text-[15px] text-slate-900 dark:text-slate-200 leading-normal mb-3 whitespace-pre-wrap">
                    {post.text}
                </p>
                {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[14px] text-blue-500 hover:underline cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {isPriceDrop && (
                    <div className="mb-3 flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
                            Bajó de precio esta semana
                        </span>
                    </div>
                )}

                {/* ── Property Snapshot ─────────────────────────── */}
                {post.propertySnapshot && (
                    <div className="mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
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

            {/* ── Actions Bar ───────────────────────────────── */}
            <div className="pl-16 pr-4 pb-3 flex items-center justify-between text-slate-500 dark:text-slate-400">
                <button
                    onClick={() => onLike(post.id)}
                    className="flex items-center gap-2 group transition-colors hover:text-red-500"
                >
                    <div className="p-2 -ml-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                        <Heart className={`w-[18px] h-[18px] ${post.likes && post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    </div>
                    <span className={`text-[13px] ${post.likes && post.likes > 0 ? 'text-red-500' : ''}`}>{post.likes || ''}</span>
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault()
                        if (typeof navigator !== 'undefined' && navigator.share) {
                            navigator.share({
                                title: post.propertySnapshot?.neighborhood || 'Propiedad en Barrio.uy',
                                text: post.text.slice(0, 50) + '...',
                                url: window.location.origin + (post.propertySnapshot ? `/property/${post.propertySnapshot.id}` : `/feed`)
                            }).catch(() => { })
                        }
                    }}
                    className="flex items-center gap-2 group transition-colors hover:text-blue-500"
                >
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                        <Share2 className="w-[18px] h-[18px]" />
                    </div>
                </button>

                {/* Minimalist Action instead of big green button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onWhatsAppClick(post.id, '') // Ensure logic uses a generated url directly or adapt inside handler
                    }}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors"
                >
                    Contactar
                </button>
            </div>
        </motion.article>
    )
}
