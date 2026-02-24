/**
 * Cache Layer — Barrio.uy
 * Usa Vercel KV (Redis). Fallback graceful si no está configurado.
 *
 * Activar en producción:
 * Vercel Dashboard → Storage → Create KV Database → agregar variables al proyecto.
 */

// TTLs recomendados (en segundos)
export const CACHE_TTL = {
    FEATURED_PROPERTIES: 5 * 60,     // 5 min
    HOMEPAGE_STATS: 60 * 60,    // 1 hora
    SUGGESTIONS: 10 * 60,    // 10 min
    POPULAR_SEARCHES: 60 * 60,    // 1 hora
    AGENCY_PROFILE: 24 * 60 * 60,  // 1 día
} as const

/**
 * Obtiene un valor del caché. Si no existe, lo genera con `fetcher` y lo guarda.
 * Si KV no está configurado, llama directamente al fetcher (sin caché).
 */
export async function getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300
): Promise<T> {
    try {
        const { kv } = await import('@vercel/kv')
        const cached = await kv.get<T>(key)
        if (cached !== null && cached !== undefined) {
            return cached
        }
        const fresh = await fetcher()
        await kv.set(key, fresh, { ex: ttl })
        return fresh
    } catch {
        // Sin KV configurado (dev local) o error de cuota — fallback directo
        return fetcher()
    }
}

/**
 * Invalida una clave del caché manualmente.
 * Útil al publicar/editar una propiedad destacada.
 */
export async function invalidateCache(key: string): Promise<void> {
    try {
        const { kv } = await import('@vercel/kv')
        await kv.del(key)
    } catch {
        // Sin KV — no hace nada
    }
}
