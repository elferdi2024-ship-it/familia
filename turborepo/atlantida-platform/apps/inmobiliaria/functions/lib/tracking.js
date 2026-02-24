"use strict";
/**
 * 🔥 Barrio.uy — Cloud Functions for Feed Engine
 * Transactional lead intent tracking that protects ranking integrity.
 *
 * Deploy: firebase deploy --only functions
 *
 * These functions handle score updates that CANNOT be done from the client.
 * Firestore rules block all client writes to score fields.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLike = exports.onComment = exports.onPropertyClick = exports.onWhatsAppClick = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
// ── Ranking Constants (mirrored from lib/feed/ranking.ts) ─────────
const TYPE_WEIGHTS = {
    price_drop: 1.5,
    new_property: 1.3,
    market_update: 1.2,
    opinion: 1.0,
};
const PLAN_BOOSTS = {
    free: 1.0,
    pro: 1.2,
    elite: 1.35,
};
const LEAD_INTENT_WEIGHTS = {
    whatsapp_click: 12,
    property_click: 10,
    comment: 3,
    like: 1,
};
function calculateRankingScore(leadIntentScore, type, plan, publishedAtMs, zonaWeight = 1, nowMs = Date.now()) {
    const hoursSince = Math.max(0, (nowMs - publishedAtMs) / (1000 * 60 * 60));
    const relevance = leadIntentScore *
        zonaWeight *
        (TYPE_WEIGHTS[type] ?? 1.0) *
        (PLAN_BOOSTS[plan] ?? 1.0);
    return relevance / Math.pow(hoursSince + 2, 1.35);
}
// ── Generic Tracking Function ─────────────────────────────────────
async function trackLeadIntent(postId, action, userId) {
    if (!postId || typeof postId !== "string") {
        throw new https_1.HttpsError("invalid-argument", "postId is required");
    }
    const weight = LEAD_INTENT_WEIGHTS[action];
    if (!weight) {
        throw new https_1.HttpsError("invalid-argument", `Unknown action: ${action}`);
    }
    const postRef = db.collection("feedPosts").doc(postId);
    await db.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists) {
            throw new https_1.HttpsError("not-found", `Post ${postId} not found`);
        }
        const data = postDoc.data();
        const newIntentScore = (data.leadIntentScore || 0) + weight;
        const publishedAtMs = data.publishedAt?.toMillis?.() || Date.now();
        const newRanking = calculateRankingScore(newIntentScore, data.type || "opinion", data.plan || "free", publishedAtMs);
        const update = {
            leadIntentScore: newIntentScore,
            rankingScore: newRanking,
        };
        if (action === "whatsapp_click") {
            update.whatsappClicks = firestore_1.FieldValue.increment(1);
        }
        else if (action === "like") {
            update.likes = firestore_1.FieldValue.increment(1);
        }
        else if (action === "comment") {
            update.comments = firestore_1.FieldValue.increment(1);
        }
        transaction.update(postRef, update);
    });
    return { success: true };
}
// ── Exported Cloud Functions ──────────────────────────────────────
/** WhatsApp click: +12 points — highest purchase intent signal */
exports.onWhatsAppClick = (0, https_1.onCall)(async (request) => {
    const { postId } = request.data;
    return trackLeadIntent(postId, "whatsapp_click", request.auth?.uid);
});
/** Property detail click: +10 points */
exports.onPropertyClick = (0, https_1.onCall)(async (request) => {
    const { postId } = request.data;
    return trackLeadIntent(postId, "property_click", request.auth?.uid);
});
/** Comment on post: +3 points */
exports.onComment = (0, https_1.onCall)(async (request) => {
    const { postId } = request.data;
    return trackLeadIntent(postId, "comment", request.auth?.uid);
});
/** Like on post: +1 point */
exports.onLike = (0, https_1.onCall)(async (request) => {
    const { postId } = request.data;
    return trackLeadIntent(postId, "like", request.auth?.uid);
});
//# sourceMappingURL=tracking.js.map