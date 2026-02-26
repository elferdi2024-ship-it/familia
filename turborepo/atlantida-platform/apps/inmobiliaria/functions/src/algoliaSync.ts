import { onDocumentWritten, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID || '',
    process.env.ALGOLIA_ADMIN_KEY || ''
);

const PROPERTIES_INDEX = 'properties';

/**
 * ⚡ Real-time Algolia Sychronization
 * Maintains search consistency by mirroring Firestore changes to Algolia.
 */
export const onPropertyWrite = onDocumentWritten('properties/{propertyId}', async (event: FirestoreEvent<any | undefined, { propertyId: string }>) => {
    const { propertyId } = event.params;
    const change = event.data;

    // 1. DELETE Case
    if (!change || !change.after.exists) {
        console.log(`🗑️ Deleting property ${propertyId} from Algolia`);
        await client.deleteObject({
            indexName: PROPERTIES_INDEX,
            objectID: propertyId
        }).catch(err => console.error('Error on delete:', err));
        return;
    }

    const data = change.after.data()!;

    // 2. STATUS FILTER: Only index active properties
    if (data.status !== 'active') {
        console.log(`🛑 Property ${propertyId} is not active (${data.status}). Removing from search.`);
        await client.deleteObject({
            indexName: PROPERTIES_INDEX,
            objectID: propertyId
        }).catch(() => { });
        return;
    }

    // 3. UPSERT Case: Prepare comprehensive data for Algolia
    console.log(`🔄 Syncing property ${propertyId} to Algolia`);

    const algoliaRecord = {
        objectID: propertyId,
        title: data.title,
        description: data.description?.substring(0, 500),
        price: data.price,
        currency: data.currency || 'USD',
        operation: data.operation, // Venta / Alquiler
        type: data.type || data.propertyType,
        neighborhood: data.neighborhood,
        city: data.city || 'Uruguay',
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        area: data.area || data.size,
        images: data.images && data.images.length > 0 ? [data.images[0]] : [], // Only store thumbnail for index size
        viviendaPromovida: data.viviendaPromovida ?? false,
        featured: data.featured ?? false,
        publishedAt: data.publishedAt?.toMillis ? data.publishedAt.toMillis() : Date.now(),
        updatedAt: Date.now(),
        // Algolia Geo-Search format
        _geoloc: data.geolocation ? {
            lat: data.geolocation.lat,
            lng: data.geolocation.lng
        } : (data.coordinates ? {
            lat: data.coordinates.lat,
            lng: data.coordinates.lng
        } : undefined)
    };

    try {
        await client.saveObject({
            indexName: PROPERTIES_INDEX,
            body: algoliaRecord
        });
        console.log(`✅ Property ${propertyId} synced successfully.`);
    } catch (error) {
        console.error(`❌ Failed to sync property ${propertyId}:`, error);
    }
});
