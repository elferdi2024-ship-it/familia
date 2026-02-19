import { db } from "@repo/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Property } from "./data";

export interface MarketData {
    averagePricePerM2: number;
    propertyPricePerM2: number;
    differencePercentage: number;
    status: "Very Competitive" | "Competitive" | "Fair" | "Above Average" | "High";
    totalPropertiesInNeighborhood: number;
}

/**
 * Calculates market intelligence data for a specific property compared to its neighborhood.
 */
export async function getMarketIntelligence(property: Property): Promise<MarketData | null> {
    if (!db || !property.neighborhood || !property.area || property.area === 0) return null;

    try {
        const q = query(
            collection(db, "properties"),
            where("neighborhood", "==", property.neighborhood),
            where("operation", "==", property.operation),
            where("type", "==", property.type)
        );

        const querySnapshot = await getDocs(q);
        const neighborhoodProperties = querySnapshot.docs.map(doc => doc.data() as Property);

        if (neighborhoodProperties.length === 0) return null;

        const pricesPerM2 = neighborhoodProperties
            .map(p => {
                if (!p.area || p.area === 0) return 0;
                // Convert currency to USD if necessary (simplified for now, assuming mostly USD for sales)
                return p.price / p.area;
            })
            .filter(price => price > 0);

        if (pricesPerM2.length === 0) return null;

        const averagePricePerM2 = pricesPerM2.reduce((acc, curr) => acc + curr, 0) / pricesPerM2.length;
        const propertyPricePerM2 = property.price / property.area;
        const differencePercentage = ((propertyPricePerM2 - averagePricePerM2) / averagePricePerM2) * 100;

        let status: MarketData["status"] = "Fair";
        if (differencePercentage < -15) status = "Very Competitive";
        else if (differencePercentage < -5) status = "Competitive";
        else if (differencePercentage > 15) status = "High";
        else if (differencePercentage > 5) status = "Above Average";

        return {
            averagePricePerM2,
            propertyPricePerM2,
            differencePercentage,
            status,
            totalPropertiesInNeighborhood: neighborhoodProperties.length
        };
    } catch (error) {
        console.error("Error calculating market intelligence:", error);
        return null;
    }
}
