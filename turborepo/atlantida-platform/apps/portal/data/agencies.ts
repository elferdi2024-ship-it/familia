export type AgencyPlan = "free" | "pro" | "premium"

export interface AgencyBranch {
    name: string
    address: string
    phone?: string
    city: string
}

export interface Agency {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    longDescription?: string
    logo: string
    coverImage: string
    gallery: string[]
    verified: boolean
    plan: AgencyPlan
    phone?: string
    email?: string
    address?: string
    city: string
    neighborhood?: string
    branches?: AgencyBranch[]
    propertiesCount?: number
    sinceYear?: number
    website?: string
}

export const AGENCIES: Agency[] = [
    {
        id: "1",
        slug: "rossana-bonora-propiedades",
        name: "Rossana Bonora",
        tagline: "Propiedades",
        description: "Soluciones inmobiliarias con integridad, profesionalismo y transparencia desde 1996.",
        longDescription: "Rossana Bonora Propiedades es una empresa con más de 25 años de trayectoria en el mercado uruguayo. Nos especializamos en ofrecer soluciones rápidas y creativas para la compra, venta y alquiler de propiedades. Nuestro compromiso es con la integridad, el profesionalismo y la transparencia en cada operación. Te invitamos a conocer nuestros servicios y encontrar la propiedad que mejor se adapte a vos.",
        logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&h=120&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
        ],
        verified: true,
        plan: "premium",
        phone: "59899123456",
        email: "contacto@rossanabonora.com",
        address: "Bvar. España 2567",
        city: "Montevideo",
        neighborhood: "Pocitos",
        branches: [
            { name: "Casa central", address: "Bvar. España 2567", phone: "59899123456", city: "Montevideo" },
        ],
        propertiesCount: 42,
        sinceYear: 1996,
    },
    {
        id: "2",
        slug: "treehouse-bienes-raices",
        name: "TreeHouse Bienes Raíces",
        tagline: "Tu hogar en el lugar indicado",
        description: "Conectamos personas con su próxima casa. Especialistas en Pocitos, Punta Carretas y Malvín.",
        longDescription: "TreeHouse nació con la idea de hacer la búsqueda de vivienda más humana y transparente. Trabajamos con un equipo joven y enfocado en atención personalizada. Ofrecemos asesoramiento en compra, venta y alquiler, con foco en barrios costeros de Montevideo y Ciudad de la Costa.",
        logo: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=120&h=120&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
        ],
        verified: true,
        plan: "pro",
        phone: "59899234567",
        city: "Montevideo",
        neighborhood: "Punta Carretas",
        propertiesCount: 28,
        sinceYear: 2018,
    },
    {
        id: "3",
        slug: "arq-inmobiliaria",
        name: "ARQ",
        tagline: "Inmobiliaria · Arquitectos Asesores",
        description: "Arquitectura e inmobiliaria en un solo equipo. Proyectos y reventa en Montevideo.",
        longDescription: "ARQ combina el asesoramiento inmobiliario con la mirada del arquitecto. Desarrollamos proyectos propios y representamos a terceros en la venta y alquiler de propiedades en Montevideo. Enfocados en calidad constructiva y ubicación.",
        logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=120&h=120&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
        ],
        verified: false,
        plan: "free",
        phone: "59899345678",
        city: "Montevideo",
        propertiesCount: 12,
    },
    {
        id: "4",
        slug: "inmobiliaria-carrasco",
        name: "Inmobiliaria Carrasco",
        tagline: "Carrasco y Costa de Oro",
        description: "Líderes en venta y alquiler en Carrasco, Punta Gorda y zonas residenciales premium.",
        longDescription: "Con más de 15 años en la zona, conocemos cada rincón de Carrasco y la Costa de Oro. Ofrecemos un servicio discreto y profesional para compradores y vendedores exigentes. Especialistas en propiedades de alto estándar.",
        logo: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=120&h=120&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=400&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop",
        ],
        verified: true,
        plan: "premium",
        phone: "59899456789",
        address: "Av. Brasil 2841",
        city: "Montevideo",
        neighborhood: "Carrasco",
        propertiesCount: 56,
        sinceYear: 2008,
    },
]

export function getAgencyBySlug(slug: string): Agency | undefined {
    return AGENCIES.find((a) => a.slug === slug)
}

export function getVerifiedAgencies(): Agency[] {
    return AGENCIES.filter((a) => a.verified)
}
