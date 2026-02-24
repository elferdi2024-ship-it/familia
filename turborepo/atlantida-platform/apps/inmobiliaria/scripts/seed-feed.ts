/**
 * 🌱 Barrio Feed Seed Engine
 * Seeds Firestore with realistic feed posts for testing.
 * 
 * Usage: npx tsx scripts/seed-feed.ts
 *        npx tsx scripts/seed-feed.ts --clear  (wipe + re-seed)
 */

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { join } from "path"
import * as dotenv from "dotenv"

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
    console.error("❌ Firebase config not found. Make sure .env.local exists.")
    process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ── Seed Data ─────────────────────────────────────────────────────────

const FEED_POSTS = [
    {
        authorId: "agent-001",
        authorName: "María González",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        authorSlug: "maria-gonzalez",
        authorVerified: true,
        plan: "elite",
        text: "🔥 Exclusivo: Penthouse con vista al mar en Pocitos. 3 dormitorios, terraza de 40m² y parrillero propio. Ideal para inversores — renta asegurada.",
        hashtags: ["Pocitos", "Penthouse", "Inversión", "VistaAlMar"],
        type: "new_property",
        propertySnapshot: {
            id: "prop-001",
            slug: "penthouse-pocitos-vista-mar",
            price: 285000,
            currency: "USD",
            neighborhood: "Pocitos",
            viviendaPromovida: false,
            acceptedGuarantees: ["ANDA", "Porto Seguro"],
            mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
            bedrooms: 3,
            area: 120,
        },
        leadIntentScore: 48,
        rankingScore: 15.2,
        whatsappClicks: 4,
        likes: 12,
        comments: 3,
        status: "published",
    },
    {
        authorId: "agent-002",
        authorName: "Carlos Rodríguez",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        authorSlug: "carlos-rodriguez",
        authorVerified: true,
        plan: "pro",
        text: "📉 ¡BAJÓ DE PRECIO! Apartamento en Cordón, a pasos de 18 de Julio. Era USD 145.000, ahora USD 125.000. Vivienda Promovida Ley 18.795 — ideal para primera vivienda con exoneraciones fiscales.",
        hashtags: ["Cordón", "BajóDePrecio", "Ley18795", "PrimeraVivienda"],
        type: "price_drop",
        propertySnapshot: {
            id: "prop-002",
            slug: "apartamento-cordon-ley18795",
            price: 125000,
            currency: "USD",
            neighborhood: "Cordón",
            viviendaPromovida: true,
            acceptedGuarantees: ["ANDA", "CGN", "Porto Seguro"],
            mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
            bedrooms: 2,
            area: 65,
        },
        leadIntentScore: 72,
        rankingScore: 22.8,
        whatsappClicks: 6,
        likes: 18,
        comments: 7,
        status: "published",
    },
    {
        authorId: "agent-003",
        authorName: "Ana Fernández",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        authorSlug: "ana-fernandez",
        authorVerified: false,
        plan: "free",
        text: "El mercado inmobiliario en Montevideo sigue creciendo. Los barrios con mayor demanda este mes: Pocitos, Cordón y Parque Rodó. Las propiedades con Ley 18.795 se venden 40% más rápido. 📊",
        hashtags: ["MercadoUY", "Tendencias", "Montevideo", "Ley18795"],
        type: "market_update",
        propertySnapshot: null,
        leadIntentScore: 15,
        rankingScore: 4.5,
        whatsappClicks: 0,
        likes: 22,
        comments: 8,
        status: "published",
    },
    {
        authorId: "agent-001",
        authorName: "María González",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        authorSlug: "maria-gonzalez",
        authorVerified: true,
        plan: "elite",
        text: "Casa de 4 dormitorios en Carrasco Norte con piscina climatizada y jardín de 300m². La familia perfecta tiene su hogar perfecto esperándola. 🏡",
        hashtags: ["Carrasco", "Casa", "Piscina", "FamiliaGrande"],
        type: "new_property",
        propertySnapshot: {
            id: "prop-003",
            slug: "casa-carrasco-norte-piscina",
            price: 420000,
            currency: "USD",
            neighborhood: "Carrasco",
            viviendaPromovida: false,
            acceptedGuarantees: [],
            mainImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
            bedrooms: 4,
            area: 280,
        },
        leadIntentScore: 30,
        rankingScore: 12.1,
        whatsappClicks: 2,
        likes: 8,
        comments: 1,
        status: "published",
    },
    {
        authorId: "agent-004",
        authorName: "Diego Martínez",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        authorSlug: "diego-martinez",
        authorVerified: true,
        plan: "pro",
        text: "Monoambiente divino en Parque Rodó para alquiler. Acepta garantía ANDA y CGN. Gastos comunes bajos. Perfecto para estudiantes o jóvenes profesionales. ✨",
        hashtags: ["ParqueRodó", "Alquiler", "Monoambiente", "GarantíaANDA"],
        type: "new_property",
        propertySnapshot: {
            id: "prop-004",
            slug: "monoambiente-parque-rodo",
            price: 18500,
            currency: "UYU",
            neighborhood: "Parque Rodó",
            viviendaPromovida: true,
            acceptedGuarantees: ["ANDA", "CGN"],
            mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
            bedrooms: 0,
            area: 32,
        },
        leadIntentScore: 36,
        rankingScore: 10.8,
        whatsappClicks: 3,
        likes: 6,
        comments: 2,
        status: "published",
    },
    {
        authorId: "agent-002",
        authorName: "Carlos Rodríguez",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        authorSlug: "carlos-rodriguez",
        authorVerified: true,
        plan: "pro",
        text: "Mi opinión profesional: si estás pensando en invertir en Uruguay, mirá Malvín y Buceo. Los precios todavía están accesibles y la demanda de alquiler crece cada trimestre. No esperen a que suban 🚀",
        hashtags: ["Inversión", "Malvín", "Buceo", "OpiniónExperta"],
        type: "opinion",
        propertySnapshot: null,
        leadIntentScore: 8,
        rankingScore: 2.1,
        whatsappClicks: 0,
        likes: 14,
        comments: 5,
        status: "published",
    },
    {
        authorId: "agent-005",
        authorName: "Lucía Suárez",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        authorSlug: "lucia-suarez",
        authorVerified: true,
        plan: "elite",
        text: "📉 OPORTUNIDAD: Duplex en Punta Carretas bajó USD 30.000. Último piso con terraza y vista a la rambla. No dura. Consultame por WhatsApp.",
        hashtags: ["PuntaCarretas", "Duplex", "BajóDePrecio", "Rambla"],
        type: "price_drop",
        propertySnapshot: {
            id: "prop-005",
            slug: "duplex-punta-carretas-rambla",
            price: 310000,
            currency: "USD",
            neighborhood: "Punta Carretas",
            viviendaPromovida: false,
            acceptedGuarantees: ["Porto Seguro", "Sura"],
            mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
            bedrooms: 3,
            area: 145,
        },
        leadIntentScore: 60,
        rankingScore: 19.5,
        whatsappClicks: 5,
        likes: 15,
        comments: 4,
        status: "published",
    },
]

// ── Agent Profiles ────────────────────────────────────────────────────

const AGENT_PROFILES = [
    {
        id: "agent-001",
        name: "María González",
        slug: "maria-gonzalez",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        company: "Barrio.uy Inmobiliaria",
        phone: "+59899123456",
        whatsapp: "+59899123456",
        plan: "elite",
        verified: true,
        bio: "15 años de experiencia en el mercado inmobiliario uruguayo. Especialista en Pocitos y Carrasco.",
        totalPosts: 24,
        totalLeads: 87,
    },
    {
        id: "agent-002",
        name: "Carlos Rodríguez",
        slug: "carlos-rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        company: "CR Propiedades",
        phone: "+59899234567",
        whatsapp: "+59899234567",
        plan: "pro",
        verified: true,
        bio: "Corredor inmobiliario dedicado a Cordón, Centro y Ciudad Vieja. Consultas sin compromiso.",
        totalPosts: 15,
        totalLeads: 42,
    },
    {
        id: "agent-004",
        name: "Diego Martínez",
        slug: "diego-martinez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        company: "DM Real Estate",
        phone: "+59899345678",
        whatsapp: "+59899345678",
        plan: "pro",
        verified: true,
        bio: "Especialista en alquileres y Ley 18.795. Zona Parque Rodó y Tres Cruces.",
        totalPosts: 8,
        totalLeads: 21,
    },
    {
        id: "agent-005",
        name: "Lucía Suárez",
        slug: "lucia-suarez",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        company: "Suárez & Asociados",
        phone: "+59899456789",
        whatsapp: "+59899456789",
        plan: "elite",
        verified: true,
        bio: "Propiedades premium en Punta Carretas y Pocitos. Más de 200 ventas exitosas.",
        totalPosts: 31,
        totalLeads: 112,
    },
]

// ── Execution ─────────────────────────────────────────────────────────

async function clearCollection(name: string) {
    console.log(`🧹 Clearing ${name}...`)
    const snap = await getDocs(collection(db, name))
    for (const d of snap.docs) {
        await deleteDoc(doc(db, name, d.id))
    }
    console.log(`   Deleted ${snap.size} documents.`)
}

async function seed() {
    const shouldClear = process.argv.includes("--clear")

    console.log("\n🌱 Barrio Feed Seed Engine")
    console.log("═══════════════════════════════════════\n")

    if (shouldClear) {
        await clearCollection("feedPosts")
        await clearCollection("feedAgentProfiles")
        console.log()
    }

    // Seed agent profiles
    console.log("👤 Seeding agent profiles...")
    for (const profile of AGENT_PROFILES) {
        const { id, ...data } = profile
        await addDoc(collection(db, "feedAgentProfiles"), {
            ...data,
            joinedAt: serverTimestamp(),
        })
    }
    console.log(`   ✅ ${AGENT_PROFILES.length} agent profiles created.\n`)

    // Seed feed posts
    console.log("📰 Seeding feed posts...")
    for (const post of FEED_POSTS) {
        await addDoc(collection(db, "feedPosts"), {
            ...post,
            publishedAt: serverTimestamp(),
        })
    }
    console.log(`   ✅ ${FEED_POSTS.length} feed posts created.\n`)

    console.log("═══════════════════════════════════════")
    console.log("✅ Feed seeding complete!")
    console.log("   Visit http://localhost:3001/feed to see the feed.")
    console.log("═══════════════════════════════════════\n")

    process.exit(0)
}

seed().catch(console.error)
