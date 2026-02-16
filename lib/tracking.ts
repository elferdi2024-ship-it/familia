import { track } from '@vercel/analytics'

// Type-safe event tracking
export const trackEvent = {
  // Search events
  searchPerformed: (filters: Record<string, string | number | boolean | null>) =>
    track('search_performed', filters),

  // Property events
  propertyViewed: (propertyId: string, propertyType?: string) =>
    track('property_viewed', { propertyId, propertyType }),

  propertyShared: (propertyId: string) =>
    track('property_shared', { propertyId }),

  // Lead events
  leadSubmitted: (data: { propertyId: string; propertyPrice?: number; propertyType?: string }) =>
    track('lead_submitted', data),

  leadWhatsApp: (propertyId: string) =>
    track('lead_whatsapp', { propertyId }),

  // Favorite events
  favoriteAdded: (propertyId: string) =>
    track('favorite_added', { propertyId }),

  favoriteRemoved: (propertyId: string) =>
    track('favorite_removed', { propertyId }),

  // Compare events
  compareStarted: (propertyIds: string[]) =>
    track('compare_started', { propertyIds: propertyIds.join(','), count: propertyIds.length }),

  // Publish funnel
  publishStep1Completed: () => track('publish_step_1_completed'),
  publishStep2Completed: () => track('publish_step_2_completed'),
  publishStep3Completed: () => track('publish_step_3_completed'),
  publishSuccess: (propertyId: string) =>
    track('publish_success', { propertyId }),

  // Auth events
  loginCompleted: (method: 'google' | 'email') =>
    track('login_completed', { method }),

  registerCompleted: (method: 'google' | 'email') =>
    track('register_completed', { method }),

  // Search save
  searchSaved: (name: string) =>
    track('search_saved', { name }),

  // PWA
  pwaInstalled: () => track('pwa_installed'),
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
