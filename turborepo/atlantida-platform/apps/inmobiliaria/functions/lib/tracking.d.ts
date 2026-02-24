/**
 * 🔥 Barrio.uy — Cloud Functions for Feed Engine
 * Transactional lead intent tracking that protects ranking integrity.
 *
 * Deploy: firebase deploy --only functions
 *
 * These functions handle score updates that CANNOT be done from the client.
 * Firestore rules block all client writes to score fields.
 */
/** WhatsApp click: +12 points — highest purchase intent signal */
export declare const onWhatsAppClick: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
/** Property detail click: +10 points */
export declare const onPropertyClick: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
/** Comment on post: +3 points */
export declare const onComment: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
/** Like on post: +1 point */
export declare const onLike: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
}>, unknown>;
//# sourceMappingURL=tracking.d.ts.map