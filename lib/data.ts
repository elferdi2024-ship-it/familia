// ──────────────────────────────────────────────────────────────────────
// lib/data.ts — Schema Definitivo Atlantida Group
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
    latitude?: number
    longitude?: number

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
        slug: "penthouse-pocitos-rambla",
        title: "Exclusivo Piso en la Rambla de Pocitos",
        description: "Vistas panorámicas al mar desde este espectacular piso. 3 dormitorios en suite más servicio completo. Gran recepción con terraza cerrada e integrada. Cocina definida con isla y electrodomésticos empotrados. Calefacción central y aire acondicionado en todos los ambientes. Edificio de categoría con portería 24hs y garaje para 2 autos.",
        type: "Apartamento",
        operation: "Venta",
        badge: "Exclusivo",
        badgeColor: "bg-slate-900",
        price: 650000,
        currency: "USD",
        pricePerM2: 3611,
        gastosComunes: 25000,
        bedrooms: 3,
        bathrooms: 4,
        area: 180,
        builtArea: 180,
        garages: 2,
        floors: 1,
        yearBuilt: 2015,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Pocitos",
        address: "Rambla República del Perú 1400",
        geolocation: { lat: -34.9150, lng: -56.1450 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "C",
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Portería 24hs", "Losa Radiante", "Ascensor", "Garage / Cochera", "Terraza / Balcón", "Jacuzzi", "Vigilancia"],
        views: 342,
        publishedAt: "2026-02-15T09:00:00Z",
        updatedAt: "2026-02-17T10:30:00Z",
        featured: true,
        agentName: "María Rodríguez",
        agentPhone: "+598 99 111 222",
    },
    {
        id: "2",
        slug: "residencia-jardines-carrasco",
        title: "Residencia Minimalista en Jardines de Carrasco",
        description: "Diseño de vanguardia y máxima privacidad. Amplio living comedor con estufa a leña y salida directa al jardín. 4 dormitorios (2 en suite master). Playroom independiente. Fondo verde intimo con piscina climatizada y barbacoa cerrada completisima. Seguridad y alarma perimetral.",
        type: "Casa",
        operation: "Alquiler",
        badge: "Destacado",
        badgeColor: "bg-emerald-600",
        price: 4500,
        currency: "USD",
        pricePerM2: 0,
        gastosComunes: null,
        bedrooms: 4,
        bathrooms: 4,
        area: 800,
        builtArea: 350,
        garages: 3,
        floors: 2,
        yearBuilt: 2021,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Carrasco",
        address: "Av. Rivera 7500",
        geolocation: { lat: -34.8850, lng: -56.0600 },
        viviendaPromovida: false,
        acceptedGuarantees: ["Porto Seguro", "Sura", "Depósito"],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "supergas",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "A",
        images: [
            "https://images.unsplash.com/photo-1600596542815-2a4d9fbea409?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Piscina", "Parrillero", "Jardín", "Seguridad 24hs", "Calefacción", "Acepta Mascotas", "Estufa a Leña"],
        views: 215,
        publishedAt: "2026-02-10T14:15:00Z",
        updatedAt: "2026-02-16T11:20:00Z",
        featured: true,
        agentName: "Juan Pérez",
        agentPhone: "+598 99 333 444",
    },
    {
        id: "3",
        slug: "apartamento-estudiantes-cordon",
        title: "Ideal Estudiantes - Cordón Soho",
        description: "A pasos de Facultades y con excelente locomoción. 1 dormitorio cómodo con placard empotrado. Cocina integrada con barra desayunadora y muebles bajo mesada. Baño completo moderno. Edificio joven con laundry y barbacoa de uso común en último piso. Gastos comunes bajos.",
        type: "Apartamento",
        operation: "Alquiler",
        badge: "Oportunidad",
        badgeColor: "bg-blue-500",
        price: 24000,
        currency: "UYU",
        pricePerM2: 0,
        gastosComunes: 3500,
        bedrooms: 1,
        bathrooms: 1,
        area: 40,
        builtArea: 40,
        garages: 0,
        floors: 1,
        yearBuilt: 2023,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Cordón",
        address: "Constituyente 1500",
        geolocation: { lat: -34.9080, lng: -56.1750 },
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
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Lavadero", "Ascensor", "Parrillero", "Aire Acondicionado"],
        views: 589,
        publishedAt: "2026-02-16T08:00:00Z",
        updatedAt: "2026-02-17T09:00:00Z",
        featured: false,
        agentName: "Ana Silva",
        agentPhone: "+598 99 555 666",
    },
    {
        id: "4",
        slug: "local-comercial-punta-carretas",
        title: "Local Comercial Premium - 21 de Setiembre",
        description: "Excelente vidriera sobre avenida de alto tránsito. 80m² en planta libre más entrepiso y subsuelo para depósito. Baño y kitchenette reciclados a nuevo. Pisos de porcelanato. Ideal franquicia, showroom o servicios. Zona de alto poder adquisitivo y movimiento constante.",
        type: "Local Comercial",
        operation: "Venta",
        badge: "Inversión",
        badgeColor: "bg-purple-600",
        price: 280000,
        currency: "USD",
        pricePerM2: 3500,
        gastosComunes: 4500,
        bedrooms: 0,
        bathrooms: 1,
        area: 80,
        builtArea: 80,
        garages: 0,
        floors: 1,
        yearBuilt: 1990,
        department: "Montevideo",
        city: "Montevideo",
        neighborhood: "Punta Carretas",
        address: "21 de Setiembre 2800",
        geolocation: { lat: -34.9180, lng: -56.1550 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "sin servicio",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "C",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Aire Acondicionado", "Alarma", "Vidriera"],
        views: 120,
        publishedAt: "2026-02-14T11:00:00Z",
        updatedAt: "2026-02-14T11:00:00Z",
        featured: false,
        agentName: "Carlos Méndez",
        agentPhone: "+598 99 777 888",
    },
    {
        id: "5",
        slug: "chacra-jose-ignacio",
        title: "Chacra Marítima en José Ignacio",
        description: "5 hectáreas de paz absoluta con vista a la laguna y el mar a lo lejos. Casa principal de piedra y madera, estilo rústico chic, con amplias galerías. Casa de caseros independiente, galpón y tajamar. A solo 10 minutos del pueblo de José Ignacio y sus restaurantes exclusivos.",
        type: "Chacra o Campo",
        operation: "Venta",
        badge: "Lifestyle",
        badgeColor: "bg-orange-600",
        price: 1200000,
        currency: "USD",
        pricePerM2: 24,
        gastosComunes: null,
        bedrooms: 3,
        bathrooms: 3,
        area: 50000,
        builtArea: 250,
        garages: 4,
        floors: 1,
        yearBuilt: 2010,
        department: "Maldonado",
        city: "José Ignacio",
        neighborhood: "José Ignacio",
        address: "Camino Saiz Martinez Km 5",
        geolocation: { lat: -34.8300, lng: -54.6500 },
        viviendaPromovida: false,
        acceptedGuarantees: [],
        utilityStatus: {
            saneamiento: "pozo",
            gas: "supergas",
            agua: "pozo",
            electricidad: "mixto",
        },
        energyLabel: "B",
        images: [
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Piscina", "Parrillero", "Jardín", "Hogar a Leña", "Pozo de Agua"],
        views: 89,
        publishedAt: "2026-02-01T10:00:00Z",
        updatedAt: "2026-02-15T16:00:00Z",
        featured: true,
        agentName: "Sofia Williams",
        agentPhone: "+598 99 000 111",
    },
    {
        id: "6",
        slug: "verano-playa-mansa",
        title: "Verano en Playa Mansa - Torre de Categoría",
        description: "Piso alto con inmejorable vista al puerto y la isla Gorriti. 2 dormitorios, 2 baños (principal en suite). Balcón terraza disfrutable. Edificio con servicios de hotel 5 estrellas: mucama diaria, servicio de playa, piscinas in/out climatizadas, microcine, canchas de tenis.",
        type: "Apartamento",
        operation: "Alquiler Temporal",
        badge: "Temporada 2026",
        badgeColor: "bg-cyan-500",
        price: 500,
        currency: "USD",
        pricePerM2: 0,
        gastosComunes: null,
        bedrooms: 2,
        bathrooms: 2,
        area: 90,
        builtArea: 90,
        garages: 1,
        floors: 1,
        yearBuilt: 2018,
        department: "Maldonado",
        city: "Punta del Este",
        neighborhood: "Playa Mansa",
        address: "Parada 3 Playa Mansa",
        geolocation: { lat: -34.9550, lng: -54.9450 },
        viviendaPromovida: false,
        acceptedGuarantees: ["Depósito"],
        utilityStatus: {
            saneamiento: "conectado",
            gas: "cañería",
            agua: "OSE",
            electricidad: "UTE",
        },
        energyLabel: "A",
        images: [
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop"
        ],
        amenities: ["Piscina", "Gimnasio", "Seguridad 24hs", "Garage / Cochera", "Terraza / Balcón", "Aire Acondicionado", "Servicio de Playa", "Sauna"],
        views: 410,
        publishedAt: "2026-01-15T12:00:00Z",
        updatedAt: "2026-02-17T12:00:00Z",
        featured: false,
        agentName: "Federico Lopez",
        agentPhone: "+598 99 888 999",
    }
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
