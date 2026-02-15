// ──────────────────────────────────────────────────────────────────────
// lib/data.ts — Schema Definitivo DominioTotal
// ──────────────────────────────────────────────────────────────────────
// Este schema es 1:1 con el modelo de Firestore del Sprint 4.
// Los datos mock acá abajo simulan propiedades reales de Montevideo
// en el rango del lead target ($35.000 UYU / USD 150-350K).
// ──────────────────────────────────────────────────────────────────────

// ───── TIPOS ─────

export type OperationType = "Venta" | "Alquiler" | "Alquiler Temporal"
export const OPERATIONS: OperationType[] = ["Venta", "Alquiler", "Alquiler Temporal"]

export type PropertyType =
    | "Casa"
    | "Apartamento"
    | "Terreno"
    | "Local Comercial"
    | "Oficina"
    | "Chacra o Campo"
    | "Garaje o Cochera"

export const PROPERTY_TYPES: PropertyType[] = [
    "Casa",
    "Apartamento",
    "Terreno",
    "Local Comercial",
    "Oficina",
    "Chacra o Campo",
    "Garaje o Cochera",
]

export type EnergyLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G"

export type GuaranteeType =
    | "ANDA"
    | "CGN"
    | "Porto Seguro"
    | "Sura"
    | "Depósito"
    | "Mapfre"
    | "Santander"

export const GUARANTEES: GuaranteeType[] = ["ANDA", "CGN", "Porto Seguro", "Sura", "Depósito", "Mapfre", "Santander"]

export const AMENITIES = [
    "Garage / Cochera",
    "Seguridad 24hs",
    "Piscina",
    "Parrillero",
    "Gimnasio",
    "Aire Acondicionado",
    "Losa Radiante",
    "Acepta Mascotas",
    "Terraza / Balcón",
    "Jardín",
    "Ascensor",
    "Calefacción",
    "Lavadero"
]

export type UtilityStatus = {
    saneamiento: "conectado" | "pozo" | "pendiente"
    gas: "cañería" | "supergas" | "sin servicio"
    agua: "OSE" | "pozo"
    electricidad: "UTE" | "solar" | "mixto"
}

export interface GeoLocation {
    lat: number
    lng: number
}

export interface Property {
    // ── Identificación ──
    id: string
    slug: string                    // URL-friendly: "penthouse-pocitos-nuevo"
    title: string
    description: string

    // ── Clasificación ──
    type: PropertyType
    operation: OperationType
    badge?: string                  // "Bajó de Precio", "Oportunidad", "Recién Ingresado"
    badgeColor?: string             // Tailwind color class

    // ── Precio ──
    price: number                   // Precio en USD
    currency: "USD" | "UYU"
    pricePerM2: number              // 🇺🇾 Precio por m² para comparación con zona
    gastosComunes: number | null    // 🇺🇾 Gastos comunes mensuales en UYU

    // ── Características ──
    bedrooms: number
    bathrooms: number
    area: number                    // m² totales
    builtArea?: number              // m² construidos (puede diferir del terreno)
    garages: number
    floors?: number
    yearBuilt?: number

    // ── Ubicación ──
    department: string              // Montevideo, Maldonado, etc.
    city: string
    neighborhood: string            // Cordón, Pocitos, Centro, etc.
    address?: string
    geolocation: GeoLocation        // 🇺🇾 Coordenadas exactas anti-lead-baiting

    // ── Uruguay-Specific ──
    viviendaPromovida: boolean      // 🇺🇾 Ley 18.795 — exoneración ITP, IRPF/IRAE 10 años
    acceptedGuarantees: GuaranteeType[] // 🇺🇾 Tipos de garantía aceptadas (alquileres)
    utilityStatus: UtilityStatus    // 🇺🇾 Estado de saneamiento/gas/agua/UTE

    // ── Energía ──
    energyLabel: EnergyLabel | null // Etiqueta energética (estándar Funda.nl)

    // ── Media ──
    images: string[]
    floorplanUrl?: string           // URL del plano
    virtualTourUrl?: string         // URL tour 360°

    // ── Amenidades ──
    amenities: string[]

    // ── Metadata ──
    userId?: string                 // 🇺🇾 ID del usuario que publicó
    status?: "active" | "pending" | "paused" | "sold"   // 🇺🇾 Estado de la publicación
    views: number                   // Para "Visto X veces hoy"
    publishedAt: string             // ISO date
    updatedAt: string
    featured: boolean               // Propiedad destacada/promovida
    agentName?: string
    agentPhone?: string
}

// ───── DATOS MOCK — MONTEVIDEO ─────

export const PROPERTIES: Property[] = [
    {
        id: "1",
        slug: "penthouse-pocitos-nuevo",
        title: "Penthouse en Pocitos Nuevo",
        description: "Espectacular penthouse con vista al mar en Pocitos Nuevo. 2 dormitorios, 2 baños, cocina integrada con isla, living-comedor de gran porte con salida a terraza de 25m². Edificio con amenities: piscina, gimnasio, parrillero común, portería 24hs. Garaje doble. Ideal inversión con renta asegurada.",
        type: "Apartamento",
        operation: "Venta",
        badge: "Bajó de Precio",
        badgeColor: "bg-primary",
        price: 245000,
        currency: "USD",
        pricePerM2: 2882,
        gastosComunes: 12500,
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        builtArea: 85,
        garages: 2,
        floors: 1,
        yearBuilt: 2022,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Pocitos Nuevo",
        address: "Av. Luis A. de Herrera 1248",
        geolocation: { lat: -34.9180, lng: -56.1545 },
        viviendaPromovida: true,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "B",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDEJL59RDkUIGnT_zx8qvtK149oNbqK-iGLf-hD98LcRBkKWlWomv_W8zISMZFidif7IRaPeTsuBL6LsESki71K0EilOmQzzRCDlcbw_JTLPhaFdUZHaunqJWURtlX8jhzKpCGYhrnwUEAZjBuV1v85D_5XFIOvPDhO9_HSxWmPY49j7vBkgSkZpx7junf5SAvdenu7SZgWgAmtRJlmf9QuhLwlV5QtaYbnjbc3NWUNPyRs92psFkg3uNLFx5SYCGqFwux7XocDHArR",
        ],
        amenities: ["Piscina", "Gimnasio", "Parrillero", "Portería 24hs", "Terraza"],
        views: 142,
        publishedAt: "2026-02-10T10:00:00Z",
        updatedAt: "2026-02-14T14:20:00Z",
        featured: true,
        agentName: "María Rodríguez",
        agentPhone: "+598 99 123 456",
    },
    {
        id: "2",
        slug: "casa-minimalista-la-barra",
        title: "Casa Minimalista La Barra",
        description: "Casa de diseño contemporáneo sobre lote de 500m² en La Barra. Amplios espacios integrados, 4 dormitorios en suite, piscina climatizada, jardín paisajístico. Construcción premium con materiales importados. Barrio cerrado con seguridad. A 3 cuadras de la playa.",
        type: "Casa",
        operation: "Venta",
        badge: "Oportunidad",
        badgeColor: "bg-orange-500",
        price: 580000,
        currency: "USD",
        pricePerM2: 2762,
        gastosComunes: null,
        bedrooms: 4,
        bathrooms: 3,
        area: 210,
        builtArea: 210,
        garages: 2,
        floors: 2,
        yearBuilt: 2020,
        department: "Maldonado",
        city: "Punta del Este",
        neighborhood: "La Barra",
        address: "Ruta 10 km 161",
        geolocation: { lat: -34.9623, lng: -54.8713 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "supergas",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "A",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAhNgn4o9KHFe6kCK3VPbGgmCNk_y9ReURtDqsHiNql-LJjibPWWhU8bhazbwM6feV965D2d4iDY8LF3Hqc3NdaP4mFryfu0X1mJeMysodlsi6jqJJKPsU-rs_-9srHS23FR-bV2oSwxA6_hVtg-RwzASCNc9XDVzc0sV1pfwZXyWslZf4uslSuFUyxmvxHYdeMj-bfrL_MwC7gjU1nYCcZO2EJEQaHlxYX8LV5bnPHjweEn6JyOvRuBK-Uvbf0iwJfPJI3vn1RSeTh",
        ],
        amenities: ["Piscina", "Seguridad 24hs", "Parrillero", "Jardín"],
        views: 89,
        publishedAt: "2026-02-12T11:05:00Z",
        updatedAt: "2026-02-14T11:05:00Z",
        featured: true,
        agentName: "Carlos Méndez",
        agentPhone: "+598 99 234 567",
    },
    {
        id: "3",
        slug: "apartamento-cordon-sur",
        title: "Apartamento 2 dormitorios Cordón Sur",
        description: "Apartamento reciclado a nuevo en Cordón Sur, zona de alta demanda de alquiler. 2 dormitorios, living-comedor, cocina definida, baño completo. Piso de parquet, placard en dormitorios. Edificio con ascensor. Gastos bajos. Excelente para inversión — renta mensual estimada USD 650.",
        type: "Apartamento",
        operation: "Venta",
        badge: "Vivienda Promovida",
        badgeColor: "bg-blue-600",
        price: 168000,
        currency: "USD",
        pricePerM2: 3733,
        gastosComunes: 5800,
        bedrooms: 2,
        bathrooms: 1,
        area: 45,
        builtArea: 45,
        garages: 0,
        floors: 1,
        yearBuilt: 2024,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Cordón",
        address: "Eduardo Acevedo 1380",
        geolocation: { lat: -34.9058, lng: -56.1842 },
        viviendaPromovida: true,
        acceptedGuarantees: ["ANDA", "CGN", "Porto Seguro", "Sura"],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "B",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC67YJs7ZtyNE-aVoI_g6d-pFIVB7iEcoQwUGCuZDnckFYqGia63pNcIgoF42QruuhmdL9N2LhxoexeCOYwoyLR2_to3mPFzqszIOnNeippVJAfKObPkULgJBxCsii96Ft81Qffu5yjqu3hWa-KGm9tNESWcf4bSZvUaG6QrWM6VJSmioaU7SkWXANKh4k9BRXNgFpn7Isxz4s8PHRQ9gGoHJNgW3co8lY6Rw5VHq3rZen_pBMRz-XH3VSFfAYrSMoEeGyMMT8PDTKp",
        ],
        amenities: ["Ascensor", "Loza Radiante", "Placard"],
        views: 67,
        publishedAt: "2026-02-13T09:30:00Z",
        updatedAt: "2026-02-14T09:30:00Z",
        featured: true,
        agentName: "Ana Fernández",
        agentPhone: "+598 99 345 678",
    },
    {
        id: "4",
        slug: "loft-diseno-ciudad-vieja",
        title: "Loft de Diseño en Ciudad Vieja",
        description: "Loft industrial reconvertido en Ciudad Vieja, frente a la Plaza Zabala. Techos doble altura, estructura original de hierro a la vista, ventanales al sur. Ideal para profesionales creativos. Edificio patrimonial con ascensor. A 100m de la rambla.",
        type: "Apartamento",
        operation: "Venta",
        badge: "Recién Ingresado",
        badgeColor: "bg-green-500",
        price: 315000,
        currency: "USD",
        pricePerM2: 2625,
        gastosComunes: 9200,
        bedrooms: 1,
        bathrooms: 1,
        area: 120,
        builtArea: 120,
        garages: 1,
        floors: 1,
        yearBuilt: 1920,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Ciudad Vieja",
        address: "Rincón 528",
        geolocation: { lat: -34.9065, lng: -56.2030 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "D",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDZNRkuH34MD4uYE56vWNPE8LTxrq4Mze_JxKxRp-wRiC29veMX3Qju4BpQNga_XL-Sm93009bpOyxtmvkDGN0cI3A4JPRniG0BpJwj3cVNbnd_S2sYTCgofXvwD5_689UEGiNLij4c5sRwLP5Ipf9YpW3gy42WbIqWzrkzuPAzSPHc4Tf2Dws99TlwBo35H-z4jxmnAlOk_GtEFJzjkxnk_l7zltr0VTFuLCyFQrbiemdmNvtV78g_XmMX6-qXD4JX1ghviIUDot41",
        ],
        amenities: ["Ascensor", "Terraza Común", "Edificio Patrimonial"],
        views: 234,
        publishedAt: "2026-02-14T12:00:00Z",
        updatedAt: "2026-02-14T12:00:00Z",
        featured: true,
        agentName: "Roberto Silva",
        agentPhone: "+598 99 456 789",
    },
    {
        id: "5",
        slug: "monoambiente-parque-rodo",
        title: "Monoambiente a Estrenar Parque Rodó",
        description: "Monoambiente de 32m² a estrenar en edificio con amenities. Cocina integrada con mesada de granito, baño con mampara. Lavadero independiente. Piso 8 con vista al Parque Rodó. Vivienda Promovida: exoneración de ITP y renta por 10 años. Ideal primera vivienda o inversión.",
        type: "Apartamento",
        operation: "Venta",
        badge: "Vivienda Promovida",
        badgeColor: "bg-blue-600",
        price: 105000,
        currency: "USD",
        pricePerM2: 3281,
        gastosComunes: 4200,
        bedrooms: 0,
        bathrooms: 1,
        area: 32,
        builtArea: 32,
        garages: 0,
        floors: 1,
        yearBuilt: 2026,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Parque Rodó",
        address: "Gonzalo Ramírez 2080",
        geolocation: { lat: -34.9140, lng: -56.1680 },
        viviendaPromovida: true,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "A",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBMKJPtb3jnUYCCCqhTqNMnmGIx3aST7FPgMMQ3FyNaGQ_1bFcUbedl-LM5mcWzqjHKFq8e2vFl9r3rM0rTe3OuP8EF3q9kVwGu5Ns7Ts6PBUcyEBFBYzaOFSdXs0zzPYC1JEuGGb3Y2jFRTfOvpCXMr3aXCc-6WKCpNVZzGEeVHmFpQC2S-b5j9HEHdCYPHW7Nc1TI_3IhU9oHFSo2CJ9iV-P9aVbp0oEkiRfqB8SjnFPGO3FJjvyT_cxsNZjkqmrlL92vRBu0g",
        ],
        amenities: ["Piscina", "Gimnasio", "Lavadero", "Portería"],
        views: 312,
        publishedAt: "2026-02-08T08:00:00Z",
        updatedAt: "2026-02-14T08:00:00Z",
        featured: false,
        agentName: "Lucía Martínez",
        agentPhone: "+598 99 567 890",
    },
    {
        id: "6",
        slug: "alquiler-2d-cordon",
        title: "2 Dormitorios en Cordón — Vivienda Promovida",
        description: "Alquiler de apartamento de 2 dormitorios en edificio con beneficios de Ley 18.795. Living amplio, cocina equipada, baño completo. Calefacción por loza radiante. A 2 cuadras de 18 de Julio. Acepta ANDA, CGN y Porto Seguro como garantía.",
        type: "Apartamento",
        operation: "Alquiler",
        badge: "Acepta ANDA",
        badgeColor: "bg-emerald-600",
        price: 850,
        currency: "USD",
        pricePerM2: 0,
        gastosComunes: 6500,
        bedrooms: 2,
        bathrooms: 1,
        area: 58,
        builtArea: 58,
        garages: 0,
        floors: 1,
        yearBuilt: 2023,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Cordón",
        address: "Colonia 1980",
        geolocation: { lat: -34.9050, lng: -56.1790 },
        viviendaPromovida: true,
        acceptedGuarantees: ["ANDA", "CGN", "Porto Seguro"],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "B",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtB2I2rY-NKIz2MuyCmWw7qw7GXaEfPTsI3eDXq3mQQlnPGMjxvhIKk2QGnhHwGr9VeWtl3WuSCJnTGJPM6VCYDTfW_q3n2ldj4JVZAvpEXAcDFSj90ZxDaMkKFTv7XbxZh-H7CxH-fcjY2nBMXkU7ORVPv-10BbBpmV4aIjFX-y-3-aWufQ4OTvYY7cXE7PuGMkz2oiJa9XVXXrI8HYXJ6A0g_KeWFdH3Ag8Uedk7wPX-_aMQKhL1EHb5V44Fp_C6M7UfTRTQp",
        ],
        amenities: ["Loza Radiante", "Ascensor", "Portería", "Lavadero"],
        views: 456,
        publishedAt: "2026-02-11T15:00:00Z",
        updatedAt: "2026-02-14T15:00:00Z",
        featured: true,
        agentName: "Diego Acosta",
        agentPhone: "+598 99 678 901",
    },
    {
        id: "7",
        slug: "terreno-canelones",
        title: "Terreno 800m² en Canelones",
        description: "Terreno de 800m² en zona de crecimiento de Canelones, sobre ruta asfaltada. Ideal para construcción de vivienda o proyecto. Saneamiento pendiente de conexión, agua OSE disponible en el padrón. Zona tranquila a 20 min del centro de Montevideo.",
        type: "Terreno",
        operation: "Venta",
        badge: undefined,
        badgeColor: undefined,
        price: 45000,
        currency: "USD",
        pricePerM2: 56,
        gastosComunes: null,
        bedrooms: 0,
        bathrooms: 0,
        area: 800,
        garages: 0,
        department: "Canelones",
        city: "Las Piedras",
        neighborhood: "Las Piedras",
        address: "Ruta 36 km 5",
        geolocation: { lat: -34.7266, lng: -56.2203 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "pendiente",
            gas: "sin servicio",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: null,
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDEJL59RDkUIGnT_zx8qvtK149oNbqK-iGLf-hD98LcRBkKWlWomv_W8zISMZFidif7IRaPeTsuBL6LsESki71K0EilOmQzzRCDlcbw_JTLPhaFdUZHaunqJWURtlX8jhzKpCGYhrnwUEAZjBuV1v85D_5XFIOvPDhO9_HSxWmPY49j7vBkgSkZpx7junf5SAvdenu7SZgWgAmtRJlmf9QuhLwlV5QtaYbnjbc3NWUNPyRs92psFkg3uNLFx5SYCGqFwux7XocDHArR",
        ],
        amenities: [],
        views: 28,
        publishedAt: "2026-02-06T10:00:00Z",
        updatedAt: "2026-02-14T10:00:00Z",
        featured: false,
        agentName: "Fernando Gómez",
        agentPhone: "+598 99 789 012",
    },
    {
        id: "8",
        slug: "local-comercial-centro",
        title: "Local Comercial sobre 18 de Julio",
        description: "Local comercial de 65m² sobre 18 de Julio, zona de altísimo tránsito peatonal. Vidrieras amplias, baño, depósito. Habilitación comercial vigente. Ideal gastronomía, retail o servicios. Zona Centro con ómnibus en la puerta.",
        type: "Local Comercial",
        operation: "Alquiler",
        badge: "Alta Demanda",
        badgeColor: "bg-purple-600",
        price: 1800,
        currency: "USD",
        pricePerM2: 0,
        gastosComunes: 8000,
        bedrooms: 0,
        bathrooms: 1,
        area: 65,
        builtArea: 65,
        garages: 0,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Centro",
        address: "18 de Julio 1234",
        geolocation: { lat: -34.9055, lng: -56.1885 },
        viviendaPromovida: false,
        acceptedGuarantees: ["Depósito"],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "C",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAhNgn4o9KHFe6kCK3VPbGgmCNk_y9ReURtDqsHiNql-LJjibPWWhU8bhazbwM6feV965D2d4iDY8LF3Hqc3NdaP4mFryfu0X1mJeMysodlsi6jqJJKPsU-rs_-9srHS23FR-bV2oSwxA6_hVtg-RwzASCNc9XDVzc0sV1pfwZXyWslZf4uslSuFUyxmvxHYdeMj-bfrL_MwC7gjU1nYCcZO2EJEQaHlxYX8LV5bnPHjweEn6JyOvRuBK-Uvbf0iwJfPJI3vn1RSeTh",
        ],
        amenities: ["Vidrieras", "Depósito", "Habilitación Comercial"],
        views: 178,
        publishedAt: "2026-02-09T14:00:00Z",
        updatedAt: "2026-02-14T14:00:00Z",
        featured: false,
        agentName: "Patricia Núñez",
        agentPhone: "+598 99 890 123",
    },
]

// ───── HELPERS ─────

export function getPropertyById(id: string): Property | undefined {
    return PROPERTIES.find(p => p.id === id)
}

export function getFeaturedProperties(): Property[] {
    return PROPERTIES.filter(p => p.featured)
}

export function getPropertiesByOperation(operation: OperationType): Property[] {
    return PROPERTIES.filter(p => p.operation === operation)
}

export function getPropertiesByType(types: PropertyType[]): Property[] {
    if (types.length === 0) return PROPERTIES
    return PROPERTIES.filter(p => types.includes(p.type))
}

export function getViviendaPromovida(): Property[] {
    return PROPERTIES.filter(p => p.viviendaPromovida)
}

export function getPropertiesAcceptingGuarantee(guarantee: GuaranteeType): Property[] {
    return PROPERTIES.filter(p => p.acceptedGuarantees.includes(guarantee))
}

export function formatPrice(price: number, currency: "USD" | "UYU"): string {
    if (currency === "USD") {
        return `USD ${price.toLocaleString("es-UY")}`
    }
    return `$ ${price.toLocaleString("es-UY")}`
}

export function formatGastosComunes(gastos: number | null): string {
    if (gastos === null) return "Sin gastos"
    return `$ ${gastos.toLocaleString("es-UY")}/mes`
}
