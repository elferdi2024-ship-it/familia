// ──────────────────────────────────────────────────────────────────────
// Feed Ranking Engine — Barrio.uy
// Pure functions with ZERO Firebase dependencies.
// Used server-side for authoritative scoring and client-side for preview.
// ──────────────────────────────────────────────────────────────────────
import type { FeedPost, FeedPostType, AgentPlan } from '@repo/types'

// ── Lead Intent Weights ───────────────────────────────────────────────
// WhatsApp click is the highest-value signal: direct purchase intent.
export const LEAD_INTENT_WEIGHTS = {
    whatsapp_click: 12,
    property_click: 10,
    comment: 3,
    like: 1,
} as const

export type LeadIntentAction = keyof typeof LEAD_INTENT_WEIGHTS

// ── Type & Plan Multipliers ───────────────────────────────────────────
export const TYPE_WEIGHTS: Record<FeedPostType, number> = {
    price_drop: 1.5,
    new_property: 1.3,
    market_update: 1.2,
    opinion: 1.0,
}

export const PLAN_BOOSTS: Record<AgentPlan, number> = {
    free: 1.0,
    pro: 1.2,
    elite: 1.35,
}

// ── Decay Constants ───────────────────────────────────────────────────
const GRAVITY = 1.35      // Power law exponent
const BASE_HOURS = 2      // Offset to prevent division-by-zero at t=0

/**
 * Resolves a Firestore timestamp or Date to epoch milliseconds.
 */
function toEpochMs(ts: Date | { seconds: number; nanoseconds: number } | number): number {
    if (typeof ts === 'number') return ts
    if (ts instanceof Date) return ts.getTime()
    // Firestore Timestamp-like object
    return ts.seconds * 1000 + ts.nanoseconds / 1_000_000
}

/**
 * Calculates the meritocratic ranking score for a feed post.
 *
 * Formula:
 *   Score = (LeadIntent × ZonaWeight × TypeWeight × PlanBoost) / (HoursSince + 2)^1.35
 *
 * @param post       - The feed post (needs leadIntentScore, type, plan, publishedAt)
 * @param zonaWeight - Neighborhood relevance multiplier (default 1.0)
 * @param nowMs      - Current time in ms (injectable for testing)
 */
export function calculateRankingScore(
    post: Pick<FeedPost, 'leadIntentScore' | 'type' | 'plan' | 'publishedAt'>,
    zonaWeight = 1,
    nowMs = Date.now(),
): number {
    const publishedMs = toEpochMs(post.publishedAt)
    const hoursSince = Math.max(0, (nowMs - publishedMs) / (1000 * 60 * 60))

    const relevance =
        post.leadIntentScore *
        zonaWeight *
        TYPE_WEIGHTS[post.type] *
        PLAN_BOOSTS[post.plan]

    return relevance / Math.pow(hoursSince + BASE_HOURS, GRAVITY)
}

/**
 * Computes an updated leadIntentScore after a user action.
 * This is a pure helper — the actual DB write must happen server-side.
 */
export function addLeadIntent(currentScore: number, action: LeadIntentAction): number {
    return currentScore + LEAD_INTENT_WEIGHTS[action]
}
