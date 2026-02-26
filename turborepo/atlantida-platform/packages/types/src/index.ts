// ──────────────────────────────────────────────────────────────────────
// @repo/types — Schema Definitivo Atlantida Platform
// @copyright (c) 2024-2025 Atlantida Platform. Todos los derechos reservados.
// Uso, copia o distribución no autorizados prohibidos.
// ──────────────────────────────────────────────────────────────────────

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

export const AMENITIES_BY_CATEGORY = {
  "Comodidades": [
    { name: "Aire Acondicionado", icon: "ac_unit" },
    { name: "Calefacción", icon: "wb_sunny" },
    { name: "Detectores de Humo", icon: "smoke_detector" },
    { name: "Lavadero", icon: "local_laundry_service" },
    { name: "Losa Radiante", icon: "solar_power" },
    { name: "Acepta Mascotas", icon: "pets" },
    { name: "Amoblado", icon: "chair" }
  ],
  "Entretenimiento": [
    { name: "Gimnasio", icon: "fitness_center" },
    { name: "Parque infantil", icon: "child_care" },
    { name: "Piscina exterior", icon: "pool" },
    { name: "Piscina interior", icon: "pool" },
    { name: "Sauna", icon: "spa" },
    { name: "Parrillero", icon: "outdoor_grill" },
    { name: "Sala de Cine", icon: "movie" },
    { name: "Jacuzzi", icon: "hot_tub" }
  ],
  "Instalaciones": [
    { name: "Ascensor", icon: "elevator" },
    { name: "Wifi", icon: "wifi" },
    { name: "Seguridad 24hs", icon: "security" },
    { name: "Garage / Cochera", icon: "directions_car" },
    { name: "Bicicletero", icon: "pedal_bike" },
    { name: "Portería", icon: "engineering" }
  ],
  "Otras": [
    { name: "TV", icon: "tv" },
    { name: "Terraza / Balcón", icon: "balcony" },
    { name: "Jardín", icon: "yard" },
    { name: "Vigilancia", icon: "visibility" },
    { name: "Alarma", icon: "notifications_active" },
    { name: "Vidriera", icon: "window" },
    { name: "Hogar a Leña", icon: "fireplace" }
  ]
}

export const AMENITIES = Object.values(AMENITIES_BY_CATEGORY).flat().map(a => a.name)

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
  id: string
  slug: string
  title: string
  description: string
  type: PropertyType
  operation: OperationType
  badge?: string
  badgeColor?: string
  price: number
  currency: "USD" | "UYU"
  pricePerM2: number
  gastosComunes: number | null
  bedrooms: number
  bathrooms: number
  area: number
  builtArea?: number
  garages: number
  floors?: number
  yearBuilt?: number
  department: string
  city: string
  neighborhood: string
  address?: string
  geolocation: GeoLocation
  latitude?: number
  longitude?: number
  viviendaPromovida: boolean
  acceptedGuarantees: GuaranteeType[]
  utilityStatus: UtilityStatus
  energyLabel: EnergyLabel | null
  images: string[]
  floorplanUrl?: string
  virtualTourUrl?: string
  amenities: string[]
  userId?: string
  status?: "active" | "pending" | "paused" | "sold"
  views: number
  publishedAt: string
  updatedAt: string
  featured: boolean
  agentName?: string
  agentPhone?: string
  agentId?: string // Added from migrate.sh version
}

export interface Agent {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  avatar?: string
  company?: string
}

export interface Lead {
  id: string
  propertyId: string
  agentId: string
  name: string
  email: string
  phone?: string
  message?: string
  type: 'contact' | 'visit' | 'whatsapp'
  status: 'new' | 'contacted' | 'negotiating' | 'closed'
  createdAt: string | Date
}

export interface BrandConfig {
  name: string
  slug: string
  logo: string
  primaryColor: string
  secondaryColor: string
  domain: string
  contact: {
    email: string
    phone: string
    whatsapp: string
    address: string
  }
  social?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
    github?: string
  }
}

// ──────────────────────────────────────────────────────────────────────
// Feed Engine Types — Barrio Feed
// ──────────────────────────────────────────────────────────────────────

export type FeedPostType = 'new_property' | 'price_drop' | 'market_update' | 'opinion'

export type AgentPlan = 'free' | 'pro' | 'elite' | 'premium'

/**
 * Immutable snapshot of property data embedded in a feed post.
 * Avoids expensive reads to the main `properties` collection.
 */
export interface PropertySnapshot {
  id: string
  slug: string
  price: number
  currency: 'USD' | 'UYU'
  neighborhood: string
  viviendaPromovida: boolean       // Ley 18.795
  acceptedGuarantees: GuaranteeType[] // ANDA, CGN, Porto, etc.
  mainImage: string
  bedrooms: number
  area: number
}

/**
 * Core feed post model. `leadIntentScore` and `rankingScore`
 * are updated exclusively by server-side logic (Cloud Functions / Server Actions).
 */
export interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorSlug: string
  authorVerified: boolean
  plan: AgentPlan
  text: string
  hashtags: string[]
  type: FeedPostType
  propertySnapshot: PropertySnapshot | null
  leadIntentScore: number
  rankingScore: number
  whatsappClicks: number
  likes: number
  comments: number
  publishedAt: Date | { seconds: number; nanoseconds: number }
  status: 'published' | 'hidden' | 'deleted'
}

/** Agent profile for the feed social layer */
export interface FeedAgentProfile {
  id: string
  name: string
  slug: string
  avatar: string
  company: string
  phone: string
  whatsapp: string
  plan: AgentPlan
  verified: boolean
  bio: string
  totalPosts: number
  totalLeads: number
  joinedAt: Date | { seconds: number; nanoseconds: number }
}

/** Categorías de puntos de interés soportadas (Google Places type → interno) */
export type PoiCategory = "school" | "restaurant" | "park" | "shopping" | "pharmacy" | "health" | "transit"

export interface Poi {
  id: string
  label: string
  category: PoiCategory
  categoryLabel: string
  lat: number
  lng: number
  description: string
  /** Distancia en metros desde el punto de referencia (propiedad) */
  distanceMeters: number
}
