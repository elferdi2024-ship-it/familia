/**
 * FOMO (Fear Of Missing Out) — Configuración compartida para rollback y A/B.
 * Usado por portal, inmobiliaria y ranking.
 * Variable: NEXT_PUBLIC_FOMO_MODE=conservative | balanced | aggressive | disabled
 */

export type FOMOMode = 'conservative' | 'balanced' | 'aggressive' | 'disabled'

const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FOMO_MODE : undefined
export const FOMO_MODE: FOMOMode = (raw === 'conservative' || raw === 'balanced' || raw === 'aggressive' || raw === 'disabled')
    ? raw
    : 'balanced'

export const FOMO_TACTICS = {
    conservative: ['badge', 'teaser'],
    balanced: ['badge', 'teaser', 'health_card', 'ranking_penalty'],
    aggressive: ['badge', 'teaser', 'health_card', 'ranking_penalty', 'timer_offer'],
} as const

export type FOMOTactic = 'badge' | 'teaser' | 'health_card' | 'ranking_penalty' | 'timer_offer'

export function isFOMOTacticEnabled(tactic: FOMOTactic): boolean {
    if (FOMO_MODE === 'disabled') return false
    const list = FOMO_TACTICS[FOMO_MODE]
    return (list as readonly string[]).includes(tactic)
}
