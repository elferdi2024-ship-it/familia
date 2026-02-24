'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
    startAfter,
    onSnapshot,
    DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@repo/lib'
import type { FeedPost } from '@repo/types'

interface UseFeedReturn {
    posts: FeedPost[]
    loading: boolean
    error: string | null
    hasMore: boolean
    loadMore: () => void
}

const DEFAULT_LIMIT = 10

/**
 * Real-time feed hook. Subscribes to published feedPosts
 * ordered by rankingScore DESC with cursor-based pagination.
 * Supports optional authorId filtering.
 */
export function useFeed(pageSize = DEFAULT_LIMIT, authorId?: string | null): UseFeedReturn {
    const [posts, setPosts] = useState<FeedPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)

    // Initial load
    useEffect(() => {
        if (!db) {
            setError('Database not available')
            setLoading(false)
            return
        }

        let q = query(
            collection(db, 'feedPosts'),
            where('status', '==', 'published'),
            orderBy('rankingScore', 'desc'),
            firestoreLimit(pageSize),
        )

        if (authorId) {
            // If we filter by author, we might need a composite index for (status, authorId, rankingScore)
            // or just use where('authorId', '==', authorId) and then filter/order
            q = query(
                collection(db, 'feedPosts'),
                where('status', '==', 'published'),
                where('authorId', '==', authorId),
                orderBy('rankingScore', 'desc'),
                firestoreLimit(pageSize),
            )
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const feedPosts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as FeedPost[]

                setPosts(feedPosts)
                setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null)
                setHasMore(snapshot.docs.length === pageSize)
                setLoading(false)
            },
            (err) => {
                console.error('Feed subscription error:', err)
                setError(err.message)
                setLoading(false)
            },
        )

        return () => unsubscribe()
    }, [pageSize, authorId])

    // Pagination
    const loadMore = useCallback(() => {
        if (!db || !lastDoc || !hasMore || loading) return

        setLoading(true)

        let q = query(
            collection(db, 'feedPosts'),
            where('status', '==', 'published'),
            orderBy('rankingScore', 'desc'),
            startAfter(lastDoc),
            firestoreLimit(pageSize),
        )

        if (authorId) {
            q = query(
                collection(db, 'feedPosts'),
                where('status', '==', 'published'),
                where('authorId', '==', authorId),
                orderBy('rankingScore', 'desc'),
                startAfter(lastDoc),
                firestoreLimit(pageSize),
            )
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const newPosts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as FeedPost[]

                setPosts((prev) => [...prev, ...newPosts])
                setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null)
                setHasMore(snapshot.docs.length === pageSize)
                setLoading(false)
            },
            (err) => {
                console.error('Feed pagination error:', err)
                setError(err.message)
                setLoading(false)
            },
        )

        // Clean up on next load
        return () => unsubscribe()
    }, [db, lastDoc, hasMore, loading, pageSize, authorId])

    return { posts, loading, error, hasMore, loadMore }
}
