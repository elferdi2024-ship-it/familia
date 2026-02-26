/**
 * 🔥 Barrio.uy — Cloud Functions for Feed Engine
 * Transactional lead intent tracking that protects ranking integrity.
 *
 * Deploy: firebase deploy --only functions
 *
 * These functions handle score updates that CANNOT be done from the client.
 * Firestore rules block all client writes to score fields.
 */

import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import { initializeApp } from "firebase-admin/app"

initializeApp()
const db = getFirestore()

// ── Ranking Constants (mirrored from lib/feed/ranking.ts) ─────────
const TYPE_WEIGHTS: Record<string, number> = {
    price_drop: 1.5,
    new_property: 1.3,
    market_update: 1.2,
    opinion: 1.0,
}

const PLAN_BOOSTS: Record<string, number> = {
    free: 1.0,
    pro: 1.2,
    elite: 1.35,
    premium: 1.35, // mismo boost que elite (plan Premium = Elite en feed)
}

const LEAD_INTENT_WEIGHTS: Record<string, number> = {
    whatsapp_click: 12,
    property_click: 10,
    comment: 3,
    like: 1,
}

function calculateRankingScore(
    leadIntentScore: number,
    type: string,
    plan: string,
    publishedAtMs: number,
    zonaWeight = 1,
    nowMs = Date.now(),
): number {
    const hoursSince = Math.max(0, (nowMs - publishedAtMs) / (1000 * 60 * 60))
    const relevance =
        leadIntentScore *
        zonaWeight *
        (TYPE_WEIGHTS[type] ?? 1.0) *
        (PLAN_BOOSTS[plan] ?? 1.0)
    return relevance / Math.pow(hoursSince + 2, 1.35)
}

// ── Generic Tracking Function ─────────────────────────────────────

async function trackLeadIntent(postId: string, action: string, userId?: string) {
    if (!postId || typeof postId !== "string") {
        throw new HttpsError("invalid-argument", "postId is required")
    }

    const weight = LEAD_INTENT_WEIGHTS[action]
    if (!weight) {
        throw new HttpsError("invalid-argument", `Unknown action: ${action}`)
    }

    const postRef = db.collection("feedPosts").doc(postId)

    await db.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef)
        if (!postDoc.exists) {
            throw new HttpsError("not-found", `Post ${postId} not found`)
        }

        const data = postDoc.data()!
        const newIntentScore = (data.leadIntentScore || 0) + weight
        const publishedAtMs = data.publishedAt?.toMillis?.() || Date.now()
        const newRanking = calculateRankingScore(
            newIntentScore,
            data.type || "opinion",
            data.plan || "free",
            publishedAtMs,
        )

        const update: Record<string, unknown> = {
            leadIntentScore: newIntentScore,
            rankingScore: newRanking,
        }

        if (action === "whatsapp_click") {
            update.whatsappClicks = FieldValue.increment(1)
        } else if (action === "like") {
            update.likes = FieldValue.increment(1)
        } else if (action === "comment") {
            update.comments = FieldValue.increment(1)
        }

        transaction.update(postRef, update)
    })

    return { success: true }
}

// ── Exported Cloud Functions ──────────────────────────────────────

/** WhatsApp click: +12 points — highest purchase intent signal */
export const onWhatsAppClick = onCall(async (request: CallableRequest<any>) => {
    const { postId } = request.data
    return trackLeadIntent(postId, "whatsapp_click", request.auth?.uid)
})

/** Property detail click: +10 points */
export const onPropertyClick = onCall(async (request: CallableRequest<any>) => {
    const { postId } = request.data
    return trackLeadIntent(postId, "property_click", request.auth?.uid)
})

/** Comment on post: +3 points */
export const onComment = onCall(async (request: CallableRequest<any>) => {
    const { postId } = request.data
    return trackLeadIntent(postId, "comment", request.auth?.uid)
})

/** Like on post: +1 point */
export const onLike = onCall(async (request: CallableRequest<any>) => {
    const { postId } = request.data
    return trackLeadIntent(postId, "like", request.auth?.uid)
})
