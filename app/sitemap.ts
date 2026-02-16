import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'

const baseUrl = 'https://Atlantida Group.vercel.app'

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
    ]

    // SEO neighborhood pages
    for (const barrio of BARRIOS_MONTEVIDEO) {
        if (!barrio) continue
        entries.push(
            {
                url: `${baseUrl}/comprar/${barrio.toLowerCase()}`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.7,
            },
            {
                url: `${baseUrl}/alquilar/${barrio.toLowerCase()}`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.7,
            }
        )
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
