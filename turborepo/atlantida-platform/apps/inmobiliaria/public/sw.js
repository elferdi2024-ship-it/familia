/// <reference lib="webworker" />

const CACHE_NAME = 'mibarrio-v1'
const STATIC_ASSETS = [
    '/',
    '/search',
    '/offline',
    '/manifest.json',
    '/icon-redondel.png',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})

// Fetch: Network-first for pages, Cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET and external requests
    if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
        return
    }

    // Skip API routes and Firebase requests
    if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase') || url.hostname.includes('algolia')) {
        return
    }

    // Static assets (images, CSS, JS): Cache-first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?)$/) ||
        url.pathname.startsWith('/_next/static/')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
            })
        )
        return
    }

    // HTML pages: Network-first with offline fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/offline')
                    })
                })
        )
        return
    }
})
