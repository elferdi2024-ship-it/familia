import { describe, it, expect } from 'vitest'
import { calculateRankingScore, addLeadIntent } from '../lib/feed/ranking'

describe('Feed Ranking System', () => {
    it('calculates ranking score correctly', () => {
        const post = {
            leadIntentScore: 10,
            type: 'new_property' as const,
            plan: 'pro' as const,
            publishedAt: new Date()
        }

        const score = calculateRankingScore(post, 1)
        expect(score).toBeGreaterThan(0)
    })

    it('adds lead intent successfully', () => {
        const initial = 0
        const result = addLeadIntent(initial, 'whatsapp_click')
        expect(result).toBe(12) // LEAD_INTENT_WEIGHTS.whatsapp_click
    })
})
