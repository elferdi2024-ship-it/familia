'use server'

// ──────────────────────────────────────────────────────────────────────
// Feed Server Actions — Barrio.uy
// These run EXCLUSIVELY on the server. Client code cannot access
// or tamper with leadIntentScore / rankingScore.
// ──────────────────────────────────────────────────────────────────────
import { doc, runTransaction, type Firestore } from 'firebase/firestore'
import { db as firebaseDb } from '@repo/lib'
import { calculateRankingScore, LEAD_INTENT_WEIGHTS, type LeadIntentAction } from './ranking'
import type { FeedPost } from '@repo/types'

function getDb(): Firestore {
    if (!firebaseDb) throw new Error('Firebase not initialized')
    return firebaseDb
}

/**
 * Generic transactional score update.
 * Reads → recalculates → writes atomically to prevent race conditions.
 *
 * @param postId - Firestore document ID from feedPosts collection
 * @param action - The type of lead intent action
 */
async function trackLeadIntent(postId: string, action: LeadIntentAction): Promise<void> {
    const db = getDb()
    const postRef = doc(db, 'feedPosts', postId)

    await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef)
        if (!postDoc.exists()) throw new Error(`Post ${postId} not found`)

        const data = postDoc.data() as FeedPost
        const newIntentScore = data.leadIntentScore + LEAD_INTENT_WEIGHTS[action]
        const newRanking = calculateRankingScore({
            ...data,
            leadIntentScore: newIntentScore,
        })

        const updatePayload: Record<string, unknown> = {
            leadIntentScore: newIntentScore,
            rankingScore: newRanking,
        }

        // Track specific counter fields
        if (action === 'whatsapp_click') {
            updatePayload.whatsappClicks = (data.whatsappClicks || 0) + 1
        } else if (action === 'like') {
            updatePayload.likes = (data.likes || 0) + 1
        } else if (action === 'comment') {
            updatePayload.comments = (data.comments || 0) + 1
        }

        transaction.update(postRef, updatePayload)
    })
}

// ── Public Server Actions ─────────────────────────────────────────────

/** WhatsApp click: +12 points (highest intent signal) */
export async function trackWhatsAppClick(postId: string): Promise<void> {
    await trackLeadIntent(postId, 'whatsapp_click')
}

/** Property detail click: +6 points */
export async function trackPropertyClick(postId: string): Promise<void> {
    await trackLeadIntent(postId, 'property_click')
}

/** Comment on post: +3 points */
export async function trackComment(postId: string): Promise<void> {
    await trackLeadIntent(postId, 'comment')
}

/** Like on post: +1 point */
export async function trackLike(postId: string): Promise<void> {
    await trackLeadIntent(postId, 'like')
}
