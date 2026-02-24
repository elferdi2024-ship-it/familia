'use client'

import { useOptimistic, useTransition } from 'react'
import {
    trackWhatsAppClick,
    trackPropertyClick,
    trackComment,
    trackLike,
} from '@/lib/feed/actions'
import type { FeedPost } from '@repo/types'

type OptimisticUpdate = {
    postId: string
    field: 'likes' | 'whatsappClicks' | 'comments'
}

/**
 * Feed actions hook with React 19 useOptimistic for instant UI feedback.
 * All actual score updates go through server actions (protected).
 */
export function useFeedActions(initialPosts: FeedPost[]) {
    const [isPending, startTransition] = useTransition()

    const [optimisticPosts, addOptimistic] = useOptimistic(
        initialPosts,
        (state: FeedPost[], update: OptimisticUpdate) =>
            state.map((post) =>
                post.id === update.postId
                    ? { ...post, [update.field]: (post[update.field] as number) + 1 }
                    : post,
            ),
    )

    const handleWhatsAppClick = (postId: string, whatsappUrl: string) => {
        // Open WhatsApp immediately (don't wait for server)
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

        startTransition(async () => {
            addOptimistic({ postId, field: 'whatsappClicks' })
            await trackWhatsAppClick(postId)
        })
    }

    const handleLike = (postId: string) => {
        startTransition(async () => {
            addOptimistic({ postId, field: 'likes' })
            await trackLike(postId)
        })
    }

    const handlePropertyClick = (postId: string) => {
        startTransition(async () => {
            await trackPropertyClick(postId)
        })
    }

    const handleComment = (postId: string) => {
        startTransition(async () => {
            addOptimistic({ postId, field: 'comments' })
            await trackComment(postId)
        })
    }

    return {
        optimisticPosts,
        isPending,
        handleWhatsAppClick,
        handleLike,
        handlePropertyClick,
        handleComment,
    }
}
