import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dominiototal.vercel.app'

    // Static routes
    const routes = [
        '',
        '/search',
        '/profile',
        '/my-properties',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        // Dynamic routes (Properties)
        // Note: In a real scenario, you might want to limit this or paginates chunks if > 50k
        // For now, we fetch all active properties.
        if (db) {
            const propertiesRef = collection(db, "properties")
            // const q = query(propertiesRef, where("status", "==", "active")) // Uncomment if status field is widely used
            const snapshot = await getDocs(propertiesRef)

            const propertyRoutes = snapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    url: `${baseUrl}/property/${doc.id}`,
                    lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.9, // High priority for listings
                }
            })

            return [...routes, ...propertyRoutes]
        }
    } catch (error) {
        console.error("Error generating sitemap:", error)
    }

    return routes
}
