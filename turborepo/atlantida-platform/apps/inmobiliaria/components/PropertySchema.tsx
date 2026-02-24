"use client"

interface PropertySchemaProps {
    property: any;
    id: string;
}

export function PropertySchema({ property, id }: PropertySchemaProps) {
    const fullUrl = `https://mibarrio.uy/property/${id}`;

    // Create RealEstateListing schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "url": fullUrl,
        "datePosted": property.publishedAt ? new Date(property.publishedAt).toISOString() : new Date().toISOString(),
        "listingOrganization": {
            "@type": "Organization",
            "name": "Barrio.uy",
            "url": "https://mibarrio.uy"
        },
        "itemOffered": {
            "@type": "SingleFamilyResidence", // Can be adjusted based on property type
            "name": property.title,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": property.neighborhood || property.city || "Uruguay",
                "addressRegion": property.city || "Uruguay",
                "addressCountry": "UY"
            },
            "geo": property.geolocation ? {
                "@type": "GeoCoordinates",
                "latitude": property.geolocation.lat,
                "longitude": property.geolocation.lng
            } : undefined,
            "numberOfRooms": property.bedrooms,
            "numberOfBathroomsTotal": property.bathrooms,
            "floorSize": property.area ? {
                "@type": "QuantitativeValue",
                "value": property.area,
                "unitCode": "MTK" // Square meters
            } : undefined,
            "image": property.images && property.images.length > 0 ? property.images : undefined
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
