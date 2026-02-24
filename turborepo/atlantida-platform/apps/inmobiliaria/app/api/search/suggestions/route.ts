import { NextResponse } from 'next/server';
import { db } from "@repo/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy, startAt, endAt } from 'firebase/firestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 3) {
        return NextResponse.json({ suggestions: [] });
    }

    const searchTerm = q.toLowerCase();

    try {
        if (!db) {
            return NextResponse.json({ suggestions: [] });
        }

        const suggestions: { id: string; label: string; type: string; value: string }[] = [];
        const propertiesRef = collection(db, 'properties');

        // Strategy 1: Title match (case-sensitive unfortunately in Firestore without full text search, 
        // so we rely on client sending standardized queries or storing lowercase keywords)
        // For this demo, we'll try a simple range query on 'title' assuming some compatibility or just fetch recent
        // A real solution needs Algolia. We will simulate "Smart" by fetching a few and filtering in memory if dataset is small,
        // or using strict prefix if possible.
        // Let's try: Search by 'city' or 'neighborhood' as these are common.

        // Search by City
        const cityQuery = query(
            propertiesRef,
            where('city', '>=', q),
            where('city', '<=', q + '\uf8ff'),
            limit(3)
        );
        const citySnapshot = await getDocs(cityQuery);
        citySnapshot.forEach(doc => {
            const data = doc.data();
            if (!suggestions.some(s => s.id === `loc-${data.city}`)) {
                suggestions.push({
                    id: `loc-${data.city}`,
                    label: `${data.city}, ${data.department}`,
                    type: 'location',
                    value: data.city
                });
            }
        });

        // Search by Neighborhood
        const neighborhoodQuery = query(
            propertiesRef,
            where('neighborhood', '>=', q),
            where('neighborhood', '<=', q + '\uf8ff'),
            limit(3)
        );
        const neighborhoodSnapshot = await getDocs(neighborhoodQuery);
        neighborhoodSnapshot.forEach(doc => {
            const data = doc.data();
            if (!suggestions.some(s => s.id === `loc-${data.neighborhood}`)) {
                suggestions.push({
                    id: `loc-${data.neighborhood}`,
                    label: `${data.neighborhood}, ${data.city}`,
                    type: 'location',
                    value: data.neighborhood
                });
            }
        });

        // Search by Title (limited)
        const titleQuery = query(
            propertiesRef,
            orderBy('title'),
            startAt(q),
            endAt(q + '\uf8ff'),
            limit(3)
        );
        // Note: orderBy title might require composite index if we had other filters. 
        // For now let's skip title if it causes index issues and focus on location which is key for real estate.
        // Actually, let's include it but handle potential errors gracefully or just filtering client side if volume is low? 
        // We'll stick to Location + Type as primary "Smart" suggestions.

        // Manual addition of Property Types if query matches
        const types = ['Apartamento', 'Casa', 'Terreno', 'Local'];
        types.forEach(t => {
            if (t.toLowerCase().includes(searchTerm)) {
                suggestions.push({
                    id: `type-${t}`,
                    label: t,
                    type: 'property',
                    value: t
                });
            }
        });

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ suggestions: [], error: 'Failed to fetch' }, { status: 500 });
    }
}
