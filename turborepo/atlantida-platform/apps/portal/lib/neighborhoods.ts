import geoData from '../data/uruguay-geo.json';

export interface NeighborhoodInfo {
    name: string;
    city: string;
    department: string;
    slug: string;
}

export function getAllNeighborhoods(): NeighborhoodInfo[] {
    const neighborhoods: NeighborhoodInfo[] = [];

    Object.entries(geoData).forEach(([dept, cities]) => {
        Object.entries(cities).forEach(([city, hoods]) => {
            (hoods as string[]).forEach(hood => {
                neighborhoods.push({
                    name: hood,
                    city,
                    department: dept,
                    slug: hood.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                });
            });
        });
    });

    return neighborhoods;
}

export function getNeighborhoodBySlug(slug: string): NeighborhoodInfo | undefined {
    return getAllNeighborhoods().find(n => n.slug === slug);
}
