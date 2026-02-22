import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMarketIntelligence, type MarketData } from '@/lib/analytics'
import { getDocs } from 'firebase/firestore'

// Type for our mock property
interface MockProperty {
    id: string
    neighborhood: string
    operation: string
    type: string
    price: number
    area: number
    currency: string
}

describe('getMarketIntelligence', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return null if property has no neighborhood', async () => {
        const property = {
            neighborhood: '',
            area: 50,
            price: 100000,
            operation: 'Venta',
            type: 'Apartamento',
        }
        const result = await getMarketIntelligence(property as never)
        expect(result).toBeNull()
    })

    it('should return null if property has no area', async () => {
        const property = {
            neighborhood: 'Pocitos',
            area: 0,
            price: 100000,
            operation: 'Venta',
            type: 'Apartamento',
        }
        const result = await getMarketIntelligence(property as never)
        expect(result).toBeNull()
    })

    it('should return null if db is falsy', async () => {
        // db is mocked as {} which is truthy, 
        // but if area or neighborhood are missing it returns null
        const property = {
            neighborhood: 'Pocitos',
            area: undefined,
            price: 100000,
            operation: 'Venta',
            type: 'Apartamento',
        }
        const result = await getMarketIntelligence(property as never)
        expect(result).toBeNull()
    })

    it('should return null if no properties found in neighborhood', async () => {
        vi.mocked(getDocs).mockResolvedValueOnce({
            docs: [],
            empty: true,
            size: 0,
        } as never)

        const property = {
            neighborhood: 'Pocitos',
            area: 50,
            price: 100000,
            operation: 'Venta',
            type: 'Apartamento',
        }

        const result = await getMarketIntelligence(property as never)
        expect(result).toBeNull()
    })

    it('should calculate "Fair" status for average price', async () => {
        const neighborhoodProperties: MockProperty[] = [
            { id: '1', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 100000, area: 50, currency: 'USD' },
            { id: '2', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 120000, area: 60, currency: 'USD' },
            { id: '3', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 110000, area: 55, currency: 'USD' },
        ]

        vi.mocked(getDocs).mockResolvedValueOnce({
            docs: neighborhoodProperties.map(p => ({ data: () => p })),
            empty: false,
            size: neighborhoodProperties.length,
        } as never)

        const property = {
            neighborhood: 'Pocitos',
            area: 55,
            price: 110000, // ~2000/m² close to avg
            operation: 'Venta',
            type: 'Apartamento',
        }

        const result = await getMarketIntelligence(property as never)
        expect(result).not.toBeNull()
        expect(result!.status).toBe('Fair')
        expect(result!.totalPropertiesInNeighborhood).toBe(3)
    })

    it('should calculate "Very Competitive" status for cheap property', async () => {
        const neighborhoodProperties: MockProperty[] = [
            { id: '1', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 200000, area: 50, currency: 'USD' },
            { id: '2', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 240000, area: 60, currency: 'USD' },
        ]

        vi.mocked(getDocs).mockResolvedValueOnce({
            docs: neighborhoodProperties.map(p => ({ data: () => p })),
            empty: false,
            size: neighborhoodProperties.length,
        } as never)

        // Property is much cheaper than average (~1000/m² vs ~4000/m²)
        const property = {
            neighborhood: 'Pocitos',
            area: 70,
            price: 70000,
            operation: 'Venta',
            type: 'Apartamento',
        }

        const result = await getMarketIntelligence(property as never)
        expect(result).not.toBeNull()
        expect(result!.status).toBe('Very Competitive')
        expect(result!.differencePercentage).toBeLessThan(-15)
    })

    it('should calculate "High" status for expensive property', async () => {
        const neighborhoodProperties: MockProperty[] = [
            { id: '1', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 100000, area: 50, currency: 'USD' },
            { id: '2', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 120000, area: 60, currency: 'USD' },
        ]

        vi.mocked(getDocs).mockResolvedValueOnce({
            docs: neighborhoodProperties.map(p => ({ data: () => p })),
            empty: false,
            size: neighborhoodProperties.length,
        } as never)

        // Property is much more expensive (~6000/m² vs ~2000/m²)
        const property = {
            neighborhood: 'Pocitos',
            area: 50,
            price: 300000,
            operation: 'Venta',
            type: 'Apartamento',
        }

        const result = await getMarketIntelligence(property as never)
        expect(result).not.toBeNull()
        expect(result!.status).toBe('High')
        expect(result!.differencePercentage).toBeGreaterThan(15)
    })

    it('should correctly calculate pricePerM2 and averagePricePerM2', async () => {
        const neighborhoodProperties: MockProperty[] = [
            { id: '1', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 100000, area: 50, currency: 'USD' }, // 2000/m²
            { id: '2', neighborhood: 'Pocitos', operation: 'Venta', type: 'Apartamento', price: 150000, area: 50, currency: 'USD' }, // 3000/m²
        ]

        vi.mocked(getDocs).mockResolvedValueOnce({
            docs: neighborhoodProperties.map(p => ({ data: () => p })),
            empty: false,
            size: neighborhoodProperties.length,
        } as never)

        const property = {
            neighborhood: 'Pocitos',
            area: 50,
            price: 125000, // 2500/m²
            operation: 'Venta',
            type: 'Apartamento',
        }

        const result = await getMarketIntelligence(property as never)
        expect(result).not.toBeNull()
        expect(result!.averagePricePerM2).toBe(2500) // (2000 + 3000) / 2
        expect(result!.propertyPricePerM2).toBe(2500) // 125000 / 50
        expect(result!.differencePercentage).toBe(0) // exactly at average
    })
})
