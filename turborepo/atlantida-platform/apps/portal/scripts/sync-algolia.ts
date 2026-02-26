/**
 * ⚡ Algolia Sync Engine (v5 API)
 * Syncs Firestore properties with Algolia Index for ultra-fast search.
 * 
 * Usage: npx tsx scripts/sync-algolia.ts
 */

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { algoliasearch } from 'algoliasearch'
import * as dotenv from "dotenv"
import { join } from "path"

// Load .env.local
dotenv.config({ path: join(process.cwd(), ".env.local") })

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const PROPERTIES_INDEX = 'properties'

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
    console.error("❌ Algolia keys missing in .env.local (NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)")
    process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const client = algoliasearch(ALGOLIA_APP_ID as string, ALGOLIA_ADMIN_KEY as string)

async function syncAll() {
    console.log("\n⚡ Algolia Sync Engine (v5)")
    console.log(`📡 App ID: ${ALGOLIA_APP_ID}`)
    console.log("═══════════════════════════════════════\n")

    console.log("🔍 Fetching properties from Firestore...")
    const snapshot = await getDocs(collection(db, "properties"))
    const properties = snapshot.docs.map(doc => {
        const data = doc.data()
        const geo = data.geolocation
            ? { lat: data.geolocation.lat, lng: data.geolocation.lng }
            : (typeof data.Latitude === 'number' && typeof data.Longitude === 'number')
                ? { lat: data.Latitude, lng: data.Longitude }
                : undefined
        return {
            objectID: doc.id,
            ...data,
            geolocation: geo ?? data.geolocation,
            publishedAt: data.publishedAt?.toMillis?.() || Date.now(),
            updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
            _geoloc: geo
        }
    })

    console.log(`📦 Found ${properties.length} properties to sync.`)

    if (properties.length === 0) {
        console.log("✨ Nothing to sync.")
        process.exit(0)
    }

    console.log("📤 Pushing to Algolia index...")
    try {
        await client.saveObjects({
            indexName: PROPERTIES_INDEX,
            objects: properties as any[]
        })
        console.log(`✅ Successfully synced properties.`)
    } catch (e) {
        console.error("❌ Error pushing to Algolia:", e)
        process.exit(1)
    }

    // Configure index settings
    console.log("⚙️ Configuring index settings...")
    try {
        await client.setSettings({
            indexName: PROPERTIES_INDEX,
            indexSettings: {
                searchableAttributes: [
                    'title',
                    'neighborhood',
                    'city',
                    'description',
                    'type'
                ],
                attributesForFaceting: [
                    'operation',
                    'type',
                    'neighborhood',
                    'bedrooms',
                    'bathrooms',
                    'viviendaPromovida',
                    'price'
                ],
                customRanking: [
                    'desc(featured)',
                    'desc(publishedAt)'
                ],
                attributesToSnippet: [
                    'description:20'
                ]
            }
        })
        console.log("✅ Index settings updated.")
    } catch (e) {
        console.warn("⚠️ Could not update index settings (might be lack of permissions or non-existent index):", e)
    }

    console.log(`\n═══════════════════════════════════════`)
    console.log(`✨ Sync completed successfully!`)
    console.log(`═══════════════════════════════════════\n`)

    process.exit(0)
}

syncAll().catch(console.error)
