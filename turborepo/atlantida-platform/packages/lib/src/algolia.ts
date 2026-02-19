import { algoliasearch } from 'algoliasearch'

// These values should be in your .env file
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || ''
const ALGOLIA_SEARCH_ONLY_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''

// Multi-index client for v5 (Admin)
export const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

// Search-only client for frontend
export const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_KEY)

// Index names
export const PROPERTIES_INDEX = 'properties'

// Helper to push properties to Algolia
export async function syncPropertyToAlgolia(propertyId: string, propertyData: any) {
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
        console.warn('Algolia keys missing. Skipping sync.')
        return
    }

    try {
        // Format data for Algolia (ensure objectID is present)
        const record = {
            objectID: propertyId,
            ...propertyData,
            // Ensure specific fields are optimized for search
            _geoloc: propertyData.coordinates ? {
                lat: propertyData.coordinates.lat,
                lng: propertyData.coordinates.lng
            } : undefined
        }

        await algoliaClient.saveObject({
            indexName: PROPERTIES_INDEX,
            body: record as any
        })

        console.log(`Property ${propertyId} synced to Algolia.`)
    } catch (error) {
        console.error('Error syncing to Algolia:', error)
    }
}

export async function deletePropertyFromAlgolia(propertyId: string) {
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) return

    try {
        await algoliaClient.deleteObject({
            indexName: PROPERTIES_INDEX,
            objectID: propertyId
        })
        console.log(`Property ${propertyId} deleted from Algolia.`)
    } catch (error) {
        console.error('Error deleting from Algolia:', error)
    }
}
