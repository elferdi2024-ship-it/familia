import { describe, it, expect } from 'vitest'
import { LeadSchema } from '@repo/lib/validations'
import { SearchFiltersSchema } from '@repo/lib/validations'

// ============================================
// LeadSchema Tests
// ============================================
describe('LeadSchema', () => {
    const validLead = {
        propertyId: 'prop-123',
        propertyTitle: 'Apartamento en Pocitos',
        agentId: 'agent-456',
        leadName: 'Martín López',
        leadEmail: 'martin@example.com',
        leadPhone: '+598 99 123 456',
        leadMessage: 'Me interesa este apartamento, quisiera agendar una visita.',
        type: 'contact' as const,
    }

    it('should validate a correct lead', () => {
        const result = LeadSchema.safeParse(validLead)
        expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            leadEmail: 'not-an-email',
        })
        expect(result.success).toBe(false)
    })

    it('should reject empty name', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            leadName: '',
        })
        expect(result.success).toBe(false)
    })

    it('should reject name with only 1 character', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            leadName: 'A',
        })
        expect(result.success).toBe(false)
    })

    it('should reject short message (< 10 chars)', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            leadMessage: 'Hola',
        })
        expect(result.success).toBe(false)
    })

    it('should reject message exceeding 2000 chars', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            leadMessage: 'A'.repeat(2001),
        })
        expect(result.success).toBe(false)
    })

    it('should require propertyId', () => {
        const { propertyId, ...withoutPropId } = validLead
        const result = LeadSchema.safeParse(withoutPropId)
        expect(result.success).toBe(false)
    })

    it('should require agentId', () => {
        const { agentId, ...withoutAgentId } = validLead
        const result = LeadSchema.safeParse(withoutAgentId)
        expect(result.success).toBe(false)
    })

    it('should allow optional phone', () => {
        const { leadPhone, ...withoutPhone } = validLead
        const result = LeadSchema.safeParse(withoutPhone)
        expect(result.success).toBe(true)
    })

    it('should allow "visit" type with date and time', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            type: 'visit',
            visitDate: '2026-03-15',
            visitTime: '10:00',
        })
        expect(result.success).toBe(true)
    })

    it('should default type to "contact"', () => {
        const { type, ...withoutType } = validLead
        const result = LeadSchema.safeParse(withoutType)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.type).toBe('contact')
        }
    })

    it('should reject invalid type', () => {
        const result = LeadSchema.safeParse({
            ...validLead,
            type: 'invalid',
        })
        expect(result.success).toBe(false)
    })
})

// ============================================
// SearchFiltersSchema Tests
// ============================================
describe('SearchFiltersSchema', () => {
    it('should validate an empty filter set', () => {
        const result = SearchFiltersSchema.safeParse({})
        expect(result.success).toBe(true)
    })

    it('should apply default pagination', () => {
        const result = SearchFiltersSchema.safeParse({})
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.page).toBe(1)
            expect(result.data.limit).toBe(24)
        }
    })

    it('should validate complete filters', () => {
        const result = SearchFiltersSchema.safeParse({
            operation: 'Venta',
            type: 'Apartamento',
            department: 'Montevideo',
            city: 'Montevideo',
            neighborhood: 'Pocitos',
            priceMin: 100000,
            priceMax: 300000,
            bedrooms: '2',
            page: 1,
            limit: 24,
        })
        expect(result.success).toBe(true)
    })

    it('should reject negative priceMin', () => {
        const result = SearchFiltersSchema.safeParse({
            priceMin: -100,
        })
        expect(result.success).toBe(false)
    })

    it('should reject limit > 50', () => {
        const result = SearchFiltersSchema.safeParse({
            limit: 100,
        })
        expect(result.success).toBe(false)
    })

    it('should reject page < 1', () => {
        const result = SearchFiltersSchema.safeParse({
            page: 0,
        })
        expect(result.success).toBe(false)
    })

    it('should allow amenities as string array', () => {
        const result = SearchFiltersSchema.safeParse({
            amenities: ['piscina', 'gimnasio', 'terraza'],
        })
        expect(result.success).toBe(true)
    })
})
