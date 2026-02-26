/**
 * 🧹 Limpia la colección "properties" en Firestore y el índice de Algolia.
 * Usa Firebase Admin (cuenta de servicio) para poder borrar aunque las reglas lo impidan al cliente.
 * Uso: npx tsx scripts/clear-properties.ts
 */

import * as admin from "firebase-admin"
import { algoliasearch } from "algoliasearch"
import * as dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY
const PROPERTIES_INDEX = "properties"

async function main() {
    console.log("\n🧹 Limpieza de propiedades (Firestore + Algolia)")
    console.log("═══════════════════════════════════════\n")

    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!projectId || !clientEmail || !privateKey) {
        console.error("❌ Falta FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL o FIREBASE_PRIVATE_KEY en .env.local (Firebase Admin)")
        process.exit(1)
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        })
    }

    const db = admin.firestore()

    // 1. Borrar todos los documentos de la colección "properties"
    console.log("🔍 Leyendo colección 'properties' en Firestore...")
    const snapshot = await db.collection("properties").get()
    const total = snapshot.size
    console.log(`   Encontrados ${total} documentos.`)

    if (total === 0) {
        console.log("   No hay propiedades que borrar en Firestore.")
    } else {
        const BATCH_SIZE = 500
        const docs = snapshot.docs
        for (let i = 0; i < docs.length; i += BATCH_SIZE) {
            const batch = db.batch()
            docs.slice(i, i + BATCH_SIZE).forEach((d) => batch.delete(d.ref))
            await batch.commit()
        }
        console.log(`✅ Eliminadas ${total} propiedades de Firestore.`)
    }

    // 2. Vaciar el índice de Algolia
    if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
        console.log("\n⚠️ Algolia no configurado. Solo se limpió Firestore.")
        process.exit(0)
    }

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

    try {
        const res = await client.searchSingleIndex({
            indexName: PROPERTIES_INDEX,
            searchParams: { query: "", hitsPerPage: 1000, attributesToRetrieve: ["objectID"] },
        })
        const hits = (res.hits || []) as Array<{ objectID: string }>
        const ids = hits.map((h) => h.objectID)

        if (ids.length === 0) {
            console.log("\n   Índice de Algolia ya está vacío o no existe.")
        } else {
            const batchSize = 1000
            for (let i = 0; i < ids.length; i += batchSize) {
                const chunk = ids.slice(i, i + batchSize)
                await client.deleteObjects({ indexName: PROPERTIES_INDEX, objectIDs: chunk })
            }
            console.log(`\n✅ Eliminados ${ids.length} registros del índice de Algolia.`)
        }
    } catch (e) {
        console.warn("\n⚠️ Error al limpiar Algolia:", (e as Error).message)
    }

    console.log("\n═══════════════════════════════════════")
    console.log("✨ Limpieza completada. Podés crear propiedades desde cero.")
    console.log("═══════════════════════════════════════\n")
    process.exit(0)
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
