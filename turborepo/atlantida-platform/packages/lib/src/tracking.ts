import { track } from '@vercel/analytics'
import { sendGAEvent } from '@next/third-parties/google'

// Helper to track in both platforms
type AllowedPropertyValues = string | number | boolean | null | undefined
const dualTrack = (eventName: string, properties?: Record<string, AllowedPropertyValues>) => {
  // Vercel Analytics tracking
  track(eventName, properties)

  // Google Analytics 4 tracking
  if (typeof window !== 'undefined') {
    sendGAEvent({ event: eventName, ...properties })
  }
}

// Type-safe event tracking
export const trackEvent = {
  // Search events
  searchPerformed: (filters: Record<string, string | number | boolean | null>) =>
    dualTrack('search_performed', filters),

  // Property events
  propertyViewed: (propertyId: string, propertyType?: string) =>
    dualTrack('property_viewed', { propertyId, propertyType }),

  propertyShared: (propertyId: string) =>
    dualTrack('property_shared', { propertyId }),

  // Lead events
  leadSubmitted: (data: { propertyId: string, propertyPrice?: number, propertyType?: string, type?: 'contact' | 'visit' }) =>
    dualTrack('lead_submitted', data),

  leadWhatsApp: (propertyId: string) =>
    dualTrack('lead_whatsapp', { propertyId }),

  phoneRevealed: (propertyId: string) =>
    dualTrack('phone_revealed', { propertyId }),

  // Favorite events
  favoriteAdded: (propertyId: string) =>
    dualTrack('favorite_added', { propertyId }),

  favoriteRemoved: (propertyId: string) =>
    dualTrack('favorite_removed', { propertyId }),

  // Compare events
  compareStarted: (propertyIds: string[]) =>
    dualTrack('compare_started', { propertyIds: propertyIds.join(','), count: propertyIds.length }),

  // Publish funnel
  publishStep1Completed: () => dualTrack('publish_step_1_completed'),
  publishStep2Completed: () => dualTrack('publish_step_2_completed'),
  publishStep3Completed: () => dualTrack('publish_step_3_completed'),
  publishSuccess: (propertyId: string) =>
    dualTrack('publish_success', { propertyId }),

  // Auth events
  loginCompleted: (method: 'google' | 'email') =>
    dualTrack('login_completed', { method }),

  registerCompleted: (method: 'google' | 'email') =>
    dualTrack('register_completed', { method }),

  // Search save
  searchSaved: (name: string) =>
    dualTrack('search_saved', { name }),

  // PWA
  pwaInstalled: () => dualTrack('pwa_installed'),
}

// Performance monitoring helper
export function trackQueryPerformance(queryName: string) {
  const start = performance.now()

  return {
    end: () => {
      const duration = Math.round(performance.now() - start)
      if (duration > 1000) {
        console.warn(`Slow query: ${queryName} took ${duration}ms`)
        track('slow_query', { queryName, duration })
      }
      return duration
    },
  }
}
