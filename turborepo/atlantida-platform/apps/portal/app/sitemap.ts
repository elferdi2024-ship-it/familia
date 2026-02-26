import { MetadataRoute } from 'next'
import { db } from "@repo/lib/firebase"
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { POSTS } from '@/data/posts'
import { getAllNeighborhoods } from '@/lib/neighborhoods'

const baseUrl = 'https://familia-theta.vercel.app'

const BARRIOS_MONTEVIDEO = [
    'Pocitos', 'Punta-Carretas', 'Carrasco', 'Buceo', 'Cordon',
    'Centro', 'Ciudad-Vieja', 'Parque-Rodo', 'Malvin', 'Punta-Gorda',
    'La-Blanqueada', 'Tres-Cruces', 'Aguada', 'Palermo', 'Barrio-Sur',
    'Parque-Batlle', 'Larrañaga', 'Union', 'Sayago', 'Peñarol',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date().toISOString()

    const entries: MetadataRoute.Sitemap = [
        // Core pages
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/search?operation=Venta`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/search?operation=Alquiler`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/vender`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/compare`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]

    // SEO neighborhood pages
    const neighborhoods = getAllNeighborhoods()
    for (const n of neighborhoods) {
        entries.push({
            url: `${baseUrl}/barrio/${n.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        // Mantener compatibilidad con las rutas de comprar/alquilar si el usuario las usa
        entries.push(
            {
                url: `${baseUrl}/comprar/${n.slug}`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/alquilar/${n.slug}`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.7,
            }
        )
    }

    // Dynamic blog posts
    for (const post of POSTS) {
        entries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date,
            changeFrequency: 'monthly',
            priority: 0.7,
        })
    }

    // Dynamic property pages from Firestore
    if (db) {
        try {
            const propertiesRef = collection(db, 'properties')
            const q = query(propertiesRef, limit(500))
            const snapshot = await getDocs(q)

            snapshot.docs.forEach(doc => {
                if (!doc.id) return
                entries.push({
                    url: `${baseUrl}/property/${doc.id}`,
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                })
            })
        } catch (error) {
            console.error('Error generating sitemap from Firestore:', error)
        }
    }

    return entries.map(entry => ({
        ...entry,
        lastModified: entry.lastModified || now
    }))
}
