// ──────────────────────────────────────────────────────────────────────
// lib/data.ts — Schema Definitivo MiBarrio.uy
// ──────────────────────────────────────────────────────────────────────
// Este schema es 1:1 con el modelo de Firestore del Sprint 4.
// Los datos mock acá abajo simulan propiedades reales de Montevideo
// en el rango del lead target ($35.000 UYU / USD 150-350K).
// ──────────────────────────────────────────────────────────────────────

import {
    Property,
    PropertyType,
    OperationType,
    EnergyLabel,
    GuaranteeType,
    UtilityStatus,
    GeoLocation,
    OPERATIONS,
    PROPERTY_TYPES,
    GUARANTEES,
    AMENITIES,
    AMENITIES_BY_CATEGORY
} from "@repo/types"

export { OPERATIONS, PROPERTY_TYPES, GUARANTEES, AMENITIES, AMENITIES_BY_CATEGORY }
export type { Property, PropertyType, OperationType, EnergyLabel, GuaranteeType, UtilityStatus, GeoLocation }


// ───── DATOS MOCK — MONTEVIDEO ─────

export const PROPERTIES: Property[] = []


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
