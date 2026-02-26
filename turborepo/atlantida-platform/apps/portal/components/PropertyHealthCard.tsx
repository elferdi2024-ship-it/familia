'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getDaysDifference } from '@/lib/getDaysDifference'
import { isFOMOTacticEnabled } from '@repo/lib'
import { trackEvent } from '@repo/lib/tracking'

type AgentPlan = 'free' | 'pro' | 'premium' | 'elite'

interface PropertyHealthCardProps {
    property: { id?: string; title?: string; neighborhood?: string; publishedAt?: string }
    userPlan: AgentPlan
}

export function PropertyHealthCard({ property, userPlan }: PropertyHealthCardProps) {
    const publishedAt = property.publishedAt ? new Date(property.publishedAt) : new Date()
    const daysOld = getDaysDifference(publishedAt, new Date())
    const isFree = userPlan === 'free'

    let status: 'good' | 'warning' | 'critical' = 'good'
    let message = ''

    if (!isFree) {
        message = `✓ Visibilidad Máxima activa (Plan ${userPlan})`
    } else if (daysOld <= 3) {
        message = '🟢 Visibilidad: Buena (Estándar)'
    } else if (daysOld <= 7) {
        message = '🟡 Visibilidad: Media (perdiendo posición)'
        status = 'warning'
    } else {
        message = '🔴 Visibilidad: Baja (aparecés después de las Pro)'
        status = 'critical'
    }

    useEffect(() => {
        if (isFOMOTacticEnabled('health_card') && property.id) {
            trackEvent.fomoHealthCardViewed({
                propertyId: property.id,
                status,
                userPlan,
            })
        }
    }, [property.id, status, userPlan])

    if (!isFOMOTacticEnabled('health_card')) return null

    return (
        <div
            className={`p-4 rounded-xl border text-sm ${
                status === 'critical'
                    ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                    : status === 'warning'
                      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
        >
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Salud de &quot;{property.title || property.neighborhood || 'Propiedad'}&quot;
            </h4>
            <p
                className="mt-1 text-slate-600 dark:text-slate-400 cursor-help"
                title="Las propiedades Free bajan en el ranking después de 7 días para priorizar contenido nuevo y agentes verificados."
            >
                {message}
            </p>
            {isFree && status !== 'good' && (
                <Link
                    href="/publish/pricing"
                    className="inline-block mt-3 text-sm text-orange-600 dark:text-orange-400 font-semibold hover:underline"
                >
                    Recuperar visibilidad máxima →
                </Link>
            )}
        </div>
    )
}
