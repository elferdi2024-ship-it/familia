import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { Redis } from '@upstash/redis'

const RATE_LIMIT_WINDOW = 60 // 1 minute in seconds
const MAX_REQUESTS_API = 30
const MAX_REQUESTS_LEADS = 5

// Initialize Redis only if url and token are available
const redisUrl = process.env.KV_REST_API_URL
const redisToken = process.env.KV_REST_API_TOKEN
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

function getRateLimitKey(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    return forwarded?.split(',')[0]?.trim() || 'anonymous'
}

async function isRateLimited(key: string, maxRequests: number): Promise<boolean> {
    if (!redis) return false // Fail open if no redis configured

    try {
        const current = await redis.incr(key)
        if (current === 1) {
            await redis.expire(key, RATE_LIMIT_WINDOW)
        }
        return current > maxRequests
    } catch (error) {
        console.error('Rate limit error:', error)
        return false // Fail open so we don't block legitimate traffic if Redis is down
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 0. Exclude static assets from ALL middleware logic (including rate limiting)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/manifest.json' ||
        pathname.startsWith('/icons/') ||
        pathname.endsWith('.json') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.webp')
    ) {
        return NextResponse.next()
    }

    // 1. Redirect /properties/[id] to /property/[id] (SEO Clean URLs)
    if (pathname.startsWith('/properties/')) {
        const id = pathname.split('/')[2]
        if (id) {
            return NextResponse.redirect(new URL(`/property/${id}`, request.url), 301)
        }
    }

    // 2. Rate limit API routes
    if (pathname.startsWith('/api/')) {
        const key = `rate_limit:api:${getRateLimitKey(request)}`
        if (await isRateLimited(key, MAX_REQUESTS_API)) {
            return new NextResponse(
                JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }),
                { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
            )
        }
    }

    // 3. Stricter rate limit on lead-related endpoints to prevent spam
    if (pathname.includes('lead') || pathname.includes('notify')) {
        const key = `rate_limit:lead:${getRateLimitKey(request)}`
        if (await isRateLimited(key, MAX_REQUESTS_LEADS)) {
            return new NextResponse(
                JSON.stringify({ error: 'Límite de consultas alcanzado. Espera un momento.' }),
                { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '120' } }
            )
        }
    }

    const response = NextResponse.next()

    // 4. Global Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - icons (PWA icons)
         * - manifest.json
         */
        '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)',
    ],
}
