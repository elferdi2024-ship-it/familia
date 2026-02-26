import { describe, it, expect } from 'vitest'
import { calculateRankingScore, addLeadIntent, getFreeAgePenalty } from '../lib/feed/ranking'

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

    it('applies FOMO age penalty for free plan: 0-3 days = 1, 4-7 = 0.8, 8+ = 0.6', () => {
        const now = new Date('2026-02-25T12:00:00Z').getTime()
        expect(getFreeAgePenalty(new Date('2026-02-24T12:00:00Z').getTime(), now)).toBe(1)
        expect(getFreeAgePenalty(new Date('2026-02-21T12:00:00Z').getTime(), now)).toBe(0.8)
        expect(getFreeAgePenalty(new Date('2026-02-16T12:00:00Z').getTime(), now)).toBe(0.6)
    })
})
