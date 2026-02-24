import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FeedList } from '@/components/feed/FeedList'
import { FeedLeftSidebar } from '@/components/feed/FeedLeftSidebar'
import { FeedRightSidebar } from '@/components/feed/FeedRightSidebar'
import { Rss } from 'lucide-react'

export const revalidate = 3600 // ISR: 1 hora

export const metadata: Metadata = {
    title: 'Feed | Barrio.uy — Lo que pasa en tu barrio',
    description:
        'Descubrí las últimas publicaciones inmobiliarias de tu barrio. Propiedades nuevas, bajadas de precio y opiniones de agentes verificados en Uruguay.',
    openGraph: {
        title: 'Barrio Feed — Lo que pasa en tu barrio',
        description: 'El feed inmobiliario de Uruguay. Propiedades, precios y tendencias de barrio.',
        type: 'website',
    },
}
function FeedSkeleton() {
    return (
        <div className="space-y-0 border-l border-r border-slate-200 dark:border-slate-800 min-h-screen">
            {Array.from({ length: 2 }).map((_, i) => (
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
                    <div className="aspect-[16/10] rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
            ))}
        </div>
    )
}

export default function FeedPage() {
    return (
        <div className="mx-auto flex w-full max-w-[1400px] justify-center gap-0 lg:gap-4 xl:gap-8 px-0 sm:px-4 pt-6 lg:px-8">
            <FeedLeftSidebar />

            <main className="w-full max-w-2xl flex-1 pb-20">
                {/* ── Header ───────────────────────────────────── */}
                <div className="mb-0 px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-[80px] z-30 border-b border-l border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Inicio
                    </h1>
                </div>

                {/* ── Feed Content ─────────────────────────────── */}
                <Suspense fallback={<FeedSkeleton />}>
                    <FeedList />
                </Suspense>
            </main>

            <FeedRightSidebar />
        </div>
    )
}
