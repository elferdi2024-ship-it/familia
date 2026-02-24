"use server"

import { NearbyPlacesSchema } from "@repo/lib/validations"

interface Poi {
    id: string
    label: string
    category: "school" | "restaurant" | "park" | "shopping"
    lat: number
    lng: number
    description: string
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function getNearbyPlaces(lat: number, lng: number): Promise<Poi[]> {
    // Validate coordinates
    const validation = NearbyPlacesSchema.safeParse({ lat, lng })
    if (!validation.success) {
        console.error("Invalid coordinates:", validation.error.flatten())
        return []
    }

    if (!GOOGLE_MAPS_API_KEY) {
        console.error("Missing Google Maps API Key");
        return [];
    }

    const radius = 1000; // 1km radius
    const types = ["school", "restaurant", "park", "shopping_mall"];
    const allPois: Poi[] = [];

    // We'll fetch for each type to get a balanced list, or just one call with multiple types if API supports it (legacy supports 'type' as one, but 'keyword' can work).
    // Better to make parallel requests for specific types to ensure we get some of each.

    try {
        const requests = types.map(async (type) => {
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}&language=es`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK" && data.results) {
                return data.results.slice(0, 3).map((place: { place_id: string; name: string; geometry: { location: { lat: number; lng: number } }; vicinity?: string }) => ({
                    id: place.place_id,
                    label: place.name,
                    category: type === "shopping_mall" ? "shopping" : (type as string),
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                    description: place.vicinity || "Ubicación cercana",
                }));
            }
            return [];
        });

        const results = await Promise.all(requests);
        results.forEach(group => allPois.push(...group));

        return allPois;

    } catch (error) {
        console.error("Error fetching nearby places:", error);
        return [];
    }
}
