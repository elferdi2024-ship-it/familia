import { describe, it, expect } from 'vitest'
import {
    formatPrice,
    formatGastosComunes,
    getPropertiesByOperation,
    getFeaturedProperties,
    PROPERTIES
} from '@/lib/data'

describe('lib/data helpers', () => {
    it('formats price correctly for USD', () => {
        expect(formatPrice(150000, 'USD')).toBe('USD 150.000')
    })

    it('formats price correctly for UYU', () => {
        expect(formatPrice(35000, 'UYU')).toBe('$ 35.000')
    })

    it('formats gastos comunes correctly', () => {
        expect(formatGastosComunes(5000)).toBe('$ 5.000/mes')
        expect(formatGastosComunes(null)).toBe('Sin gastos')
    })

    it('filters properties by operation', () => {
        // Push a mock property if PROPERTIES is empty during test
        if (PROPERTIES.length === 0) {
            PROPERTIES.push({
                id: '1',
                title: 'Test',
                operation: 'Alquiler',
                price: 1000,
                currency: 'UYU',
                type: 'Apartamento',
                neighborhood: 'Centro',
                address: 'Calle 1',
                images: [],
                bedrooms: 1,
                bathrooms: 1,
                area: 50,
                description: '...',
                amenities: [],
                acceptedGuarantees: []
            } as any)
        }
        const rentals = getPropertiesByOperation('Alquiler')
        expect(rentals.length).toBeGreaterThan(0)
        expect(rentals[0].operation).toBe('Alquiler')
    })
})
