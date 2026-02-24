'use client'

import Image from 'next/image'
import type { PropertySnapshot } from '@repo/types'
import { Bed, Ruler, Droplet, ShieldCheck } from 'lucide-react'

interface PropertySnapshotCardProps {
    snapshot: PropertySnapshot
}

/**
 * Compact property info card embedded inside feed posts.
 * Modeled after the "Agent-Centric Collaboration Hub" Stitch design.
 */
export function PropertySnapshotCard({ snapshot }: PropertySnapshotCardProps) {
    return (
        <div className="flex flex-col group h-full">
            {/* ── Image & Badges (aspect-video) ──────── */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <Image
                    src={snapshot.mainImage || '/placeholder-property.jpg'}
                    alt={`Propiedad en ${snapshot.neighborhood}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* ── Top Left Badges ── */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {snapshot.viviendaPromovida && (
                        <span className="bg-white/90 text-slate-900 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            LEY 18.795
                        </span>
                    )}
                </div>

                {/* ── Bottom Right Price ── */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-300 uppercase leading-none mb-1">
                        Destacado
                    </p>
                    <p className="text-lg font-black leading-none">
                        {snapshot.currency} {snapshot.price.toLocaleString('es-UY')}
                    </p>
                </div>
            </div>

            {/* ── Content Row ──────────────────────────────────── */}
            <div className="p-5 flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                    {snapshot.neighborhood}
                </h3>

                {/* ── Attributes Grid ── */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-white dark:bg-slate-900/50 rounded-xl mb-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Bed className="text-slate-400 w-4 h-4" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {snapshot.bedrooms} Dorm.
                        </span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-2">
                        <Ruler className="text-slate-400 w-4 h-4" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {snapshot.area} m²
                        </span>
                    </div>
                    {snapshot.acceptedGuarantees.length > 0 && (
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-2">
                            <ShieldCheck className="text-slate-400 w-4 h-4" />
                            <span className="text-[10px] font-bold text-slate-500 truncate" title={snapshot.acceptedGuarantees.join(', ')}>
                                {snapshot.acceptedGuarantees[0]} {snapshot.acceptedGuarantees.length > 1 && '+'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
