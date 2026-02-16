import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_API = 30
const MAX_REQUESTS_LEADS = 5

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /properties/[id] to /property/[id] (fix duplicate URLs for SEO)
  if (pathname.startsWith('/properties/')) {
    const id = pathname.split('/')[2]
    if (id) {
      return NextResponse.redirect(new URL(`/property/${id}`, request.url), 301)
    }
  }

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const key = `api:${getRateLimitKey(request)}`
    if (isRateLimited(key, MAX_REQUESTS_API)) {
      return new NextResponse(
        JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      )
    }
  }

  // Stricter rate limit on lead-related endpoints
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

  // Add security headers to all responses
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
