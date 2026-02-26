'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '@repo/lib/tracking'
import { isFOMOTacticEnabled } from '@repo/lib'

const OFFER_DURATION_SEC = 24 * 60 * 60

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
}

export function UpgradeOffer({ userId }: { userId: string }) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [showOffer, setShowOffer] = useState(false)

    useEffect(() => {
        const key = `upgrade_offer_${userId}`
        const seen = typeof window !== 'undefined' ? localStorage.getItem(key) : null

        if (!seen) {
            const now = Date.now()
            if (typeof window !== 'undefined') localStorage.setItem(key, now.toString())
            setTimeLeft(OFFER_DURATION_SEC)
            setShowOffer(true)
            trackEvent.upgradeOfferShown({ userId, source: 'publish_limit' })
        } else {
            const firstSeen = parseInt(seen, 10)
            const remaining = OFFER_DURATION_SEC - (Date.now() - firstSeen) / 1000
            if (remaining > 0) {
                setTimeLeft(Math.floor(remaining))
                setShowOffer(true)
            }
        }
    }, [userId])

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return
        const timer = setInterval(() => setTimeLeft((prev) => (prev !== null ? prev - 1 : null)), 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const handleUpgradeClick = () => {
        trackEvent.upgradeOfferClicked({ userId, discount: '20_percent', source: 'publish_limit' })
    }

    if (!isFOMOTacticEnabled('timer_offer') || !showOffer || timeLeft === null || timeLeft <= 0) return null

    return (
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-4 rounded-2xl shadow-lg mb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h4 className="font-bold text-lg">Oferta de bienvenida</h4>
                    <p className="text-sm opacity-95 mt-1">
                        Activá el Plan Pro con <strong>20% OFF</strong> en tu primer mes.
                    </p>
                    <p className="text-xs opacity-80 mt-1">Válida por {formatTime(timeLeft)} más.</p>
                </div>
                <Link
                    href="/publish/pricing?offer=welcome20"
                    onClick={handleUpgradeClick}
                    className="shrink-0 bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                    Activar ahora
                </Link>
            </div>
        </div>
    )
}
