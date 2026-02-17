import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_API = 30
const MAX_REQUESTS_LEADS = 5

// Use a simple Map for rate limiting in memory (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'anonymous'
    return ip
}

function isRateLimited(key: string, maxRequests: number): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
        return false
    }

    entry.count++
    return entry.count > maxRequests
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 0. Exclude static assets from ALL middleware logic (including rate limiting)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
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
        const key = `api:${getRateLimitKey(request)}`
        if (isRateLimited(key, MAX_REQUESTS_API)) {
            return new NextResponse(
                JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }),
                { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
            )
        }
    }

    // 3. Stricter rate limit on lead-related endpoints to prevent spam
    if (pathname.includes('lead') || pathname.includes('notify')) {
        const key = `lead:${getRateLimitKey(request)}`
        if (isRateLimited(key, MAX_REQUESTS_LEADS)) {
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
        '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.png|.*\\.webp|.*\\.svg).*)',
    ],
}
