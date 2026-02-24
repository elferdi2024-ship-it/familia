import { describe, it, expect } from 'vitest'
import {
    calculateRankingScore,
    addLeadIntent,
    LEAD_INTENT_WEIGHTS,
    TYPE_WEIGHTS,
    PLAN_BOOSTS,
} from '@/lib/feed/ranking'
import type { FeedPost } from '@repo/types'

// Helper to create a minimal FeedPost-like object for testing
function makePost(
    overrides: Partial<Pick<FeedPost, 'leadIntentScore' | 'type' | 'plan' | 'publishedAt'>> = {},
) {
    return {
        leadIntentScore: 0,
        type: 'new_property' as const,
        plan: 'free' as const,
        publishedAt: new Date(),
        ...overrides,
    }
}

// Fixed "now" for deterministic tests (2026-02-22T22:00:00Z)
const NOW_MS = new Date('2026-02-22T22:00:00Z').getTime()

describe('Feed Ranking Engine', () => {
    // ── Core Formula ─────────────────────────────────────
    describe('calculateRankingScore', () => {
        it('returns 0 for a post with 0 lead intent', () => {
            const post = makePost({ publishedAt: new Date(NOW_MS) })
            const score = calculateRankingScore(post, 1, NOW_MS)
            expect(score).toBe(0)
        })

        it('produces a positive score when leadIntentScore > 0', () => {
            const post = makePost({
                leadIntentScore: 12,
                publishedAt: new Date(NOW_MS),
            })
            const score = calculateRankingScore(post, 1, NOW_MS)
            expect(score).toBeGreaterThan(0)
        })

        it('decays score over time (Power Law)', () => {
            const basePost = makePost({
                leadIntentScore: 12,
                publishedAt: new Date(NOW_MS),
            })

            const freshScore = calculateRankingScore(basePost, 1, NOW_MS)

            // Same post but 24 hours later
            const staleScore = calculateRankingScore(
                basePost,
                1,
                NOW_MS + 24 * 60 * 60 * 1000,
            )

            expect(freshScore).toBeGreaterThan(staleScore)
        })

        it('ranks WhatsApp clicks higher than likes', () => {
            // Post with 1 WhatsApp click (+12)
            const whatsappPost = makePost({
                leadIntentScore: 12,
                publishedAt: new Date(NOW_MS),
            })
            // Post with 12 likes (+12 total, same intent score)
            const likePost = makePost({
                leadIntentScore: 12,
                publishedAt: new Date(NOW_MS),
            })

            // Scores should be equal because leadIntentScore is the same
            const wa = calculateRankingScore(whatsappPost, 1, NOW_MS)
            const lk = calculateRankingScore(likePost, 1, NOW_MS)
            expect(wa).toEqual(lk)

            // But 1 WhatsApp click vs 1 like: WhatsApp wins
            const singleWa = calculateRankingScore(
                makePost({ leadIntentScore: 12, publishedAt: new Date(NOW_MS) }),
                1,
                NOW_MS,
            )
            const singleLike = calculateRankingScore(
                makePost({ leadIntentScore: 1, publishedAt: new Date(NOW_MS) }),
                1,
                NOW_MS,
            )
            expect(singleWa).toBeGreaterThan(singleLike)
        })
    })

    // ── Type Weights ─────────────────────────────────────
    describe('type weights', () => {
        it('price_drop gets 1.5× vs opinion 1.0×', () => {
            const priceDrop = makePost({
                leadIntentScore: 10,
                type: 'price_drop',
                publishedAt: new Date(NOW_MS),
            })
            const opinion = makePost({
                leadIntentScore: 10,
                type: 'opinion',
                publishedAt: new Date(NOW_MS),
            })

            const pdScore = calculateRankingScore(priceDrop, 1, NOW_MS)
            const opScore = calculateRankingScore(opinion, 1, NOW_MS)

            expect(pdScore / opScore).toBeCloseTo(1.5, 5)
        })

        it('new_property gets 1.3×', () => {
            expect(TYPE_WEIGHTS.new_property).toBe(1.3)
        })
    })

    // ── Plan Boosts ──────────────────────────────────────
    describe('plan boosts', () => {
        it('elite gets 1.35× vs free 1.0×', () => {
            const elitePost = makePost({
                leadIntentScore: 10,
                plan: 'elite',
                publishedAt: new Date(NOW_MS),
            })
            const freePost = makePost({
                leadIntentScore: 10,
                plan: 'free',
                publishedAt: new Date(NOW_MS),
            })

            const eliteScore = calculateRankingScore(elitePost, 1, NOW_MS)
            const freeScore = calculateRankingScore(freePost, 1, NOW_MS)

            expect(eliteScore / freeScore).toBeCloseTo(1.35, 5)
        })

        it('pro gets 1.2×', () => {
            expect(PLAN_BOOSTS.pro).toBe(1.2)
        })
    })

    // ── Zone Weight ──────────────────────────────────────
    describe('zonaWeight', () => {
        it('doubles score when zonaWeight is 2', () => {
            const post = makePost({
                leadIntentScore: 10,
                publishedAt: new Date(NOW_MS),
            })

            const normalScore = calculateRankingScore(post, 1, NOW_MS)
            const boostedScore = calculateRankingScore(post, 2, NOW_MS)

            expect(boostedScore / normalScore).toBeCloseTo(2, 5)
        })
    })

    // ── Firestore Timestamp Support ──────────────────────
    describe('Firestore timestamp compatibility', () => {
        it('handles Firestore-style timestamp objects', () => {
            const firestoreTs = {
                seconds: Math.floor(NOW_MS / 1000),
                nanoseconds: 0,
            }
            const post = makePost({
                leadIntentScore: 10,
                publishedAt: firestoreTs as unknown as Date,
            })

            const score = calculateRankingScore(post, 1, NOW_MS)
            expect(score).toBeGreaterThan(0)
        })
    })

    // ── addLeadIntent ────────────────────────────────────
    describe('addLeadIntent', () => {
        it('adds +12 for whatsapp_click', () => {
            expect(addLeadIntent(0, 'whatsapp_click')).toBe(12)
        })

        it('adds +6 for property_click', () => {
            expect(addLeadIntent(0, 'property_click')).toBe(6)
        })

        it('adds +3 for comment', () => {
            expect(addLeadIntent(0, 'comment')).toBe(3)
        })

        it('adds +1 for like', () => {
            expect(addLeadIntent(0, 'like')).toBe(1)
        })

        it('accumulates correctly', () => {
            let score = 0
            score = addLeadIntent(score, 'whatsapp_click') // 12
            score = addLeadIntent(score, 'like')            // 13
            score = addLeadIntent(score, 'comment')          // 16
            expect(score).toBe(16)
        })
    })

    // ── Edge Cases ───────────────────────────────────────
    describe('edge cases', () => {
        it('handles a post published exactly at now (0 hours elapsed)', () => {
            const post = makePost({
                leadIntentScore: 12,
                publishedAt: new Date(NOW_MS),
            })

            const score = calculateRankingScore(post, 1, NOW_MS)
            // Denominator = (0 + 2)^1.35 = 2^1.35 ≈ 2.554
            // Score = (12 × 1 × 1.3 × 1.0) / 2.554 ≈ 6.11
            expect(score).toBeGreaterThan(6)
            expect(score).toBeLessThan(7)
        })

        it('handles very old posts (30 days)', () => {
            const thirtyDaysAgo = NOW_MS - 30 * 24 * 60 * 60 * 1000
            const post = makePost({
                leadIntentScore: 100,
                publishedAt: new Date(thirtyDaysAgo),
            })

            const score = calculateRankingScore(post, 1, NOW_MS)
            // Very old → very low score
            expect(score).toBeLessThan(0.1)
        })
    })
})
