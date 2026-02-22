/**
 * 🌱 Barrio.uy Seed Engine
 * Seeds Firestore with curated real estate properties from Uruguay.
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { readFileSync } from "fs"
import { resolve, join } from "path"
import * as dotenv from "dotenv"

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

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
    console.error("❌ Firebase config not found. Make sure .env.local exists with NEXT_PUBLIC_FIREBASE_* vars.")
    process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface SeedProperty {
    title: string
    slug: string
    description: string
    type: string
    operation: string
    price: number
    currency: string
    pricePerM2: number
    gastosComunes: number | null
    bedrooms: number
    bathrooms: number
    area: number
    garages: number
    department: string
    city: string
    neighborhood: string
    address: string
    geolocation: { lat: number; lng: number }
    viviendaPromovida: boolean
    acceptedGuarantees: string[]
    utilityStatus: { saneamiento: string; gas: string; agua: string; electricidad: string }
    energyLabel: string | null
    images: string[]
    amenities: string[]
    badge?: string
    badgeColor?: string
    views: number
    featured: boolean
    status: string
}

async function clearCollection(collectionName: string) {
    console.log(`🧹 Clearing existing ${collectionName}...`)
    const snapshot = await getDocs(collection(db, collectionName))
    let count = 0
    for (const d of snapshot.docs) {
        await deleteDoc(doc(db, collectionName, d.id))
        count++
    }
    console.log(`   Deleted ${count} documents.`)
}

async function seed() {
    const args = process.argv.slice(2)
    const shouldClear = args.includes("--clear")
    const jsonPath = resolve(__dirname, "../seeds/properties.json")

    console.log("\n🌱 Barrio.uy Seed Engine")
    console.log("═══════════════════════════════════════\n")

    // Read JSON
    let properties: SeedProperty[]
    try {
        const raw = readFileSync(jsonPath, "utf-8")
        properties = JSON.parse(raw)
        console.log(`📦 Loaded ${properties.length} properties from seeds/properties.json`)
    } catch (e) {
        console.error("❌ Could not read seeds/properties.json:", e)
        process.exit(1)
    }

    // Validate
    const errors: string[] = []
    properties.forEach((p, i) => {
        if (!p.title) errors.push(`Property ${i}: missing title`)
        if (!p.type) errors.push(`Property ${i}: missing type`)
        if (!p.operation) errors.push(`Property ${i}: missing operation`)
        if (!p.price || p.price <= 0) errors.push(`Property ${i}: invalid price`)
        if (!p.neighborhood) errors.push(`Property ${i}: missing neighborhood`)
        if (!p.images || p.images.length === 0) errors.push(`Property ${i}: no images`)
    })

    if (errors.length > 0) {
        console.error("❌ Validation errors:")
        errors.forEach(e => console.error(`   • ${e}`))
        process.exit(1)
    }
    console.log("✅ All properties validated successfully\n")

    // Clear if requested
    if (shouldClear) {
        await clearCollection("properties")
        console.log()
    }

    // Seed
    console.log("📤 Uploading to Firestore...")
    let success = 0
    let failed = 0

    for (const prop of properties) {
        try {
            const docData = {
                ...prop,
                publishedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userId: "seed-engine",
            }
            await addDoc(collection(db, "properties"), docData)
            success++
            process.stdout.write(`\r   Progress: ${success}/${properties.length}`)
        } catch (e) {
            failed++
            console.error(`\n   ❌ Failed: ${prop.title}:`, e)
        }
    }

    console.log(`\n\n═══════════════════════════════════════`)
    console.log(`✅ Seeding complete!`)
    console.log(`   Success: ${success}`)
    if (failed > 0) console.log(`   Failed:  ${failed}`)
    console.log(`═══════════════════════════════════════\n`)

    process.exit(0)
}

seed().catch(console.error)
