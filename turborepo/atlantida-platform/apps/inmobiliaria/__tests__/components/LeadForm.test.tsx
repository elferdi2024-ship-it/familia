import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PropertyClient from '@/app/property/[id]/PropertyClient'
import { db } from '@repo/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

// Mock Firebase
vi.mock('@repo/lib/firebase', () => ({
    db: {}
}))

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'lead-123' })),
    collection: vi.fn(),
    serverTimestamp: vi.fn(() => 'timestamp'),
    updateDoc: vi.fn(() => Promise.resolve()),
    increment: vi.fn(),
}))

// Mock fetch for web3forms
global.fetch = vi.fn()

// Mock Tracking
vi.mock('@repo/lib/tracking', () => ({
    trackEvent: {
        propertyViewed: vi.fn(),
        phoneRevealed: vi.fn(),
        leadSubmitted: vi.fn(),
    }
}))

// Mock Sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children }: any) => <a>{children}</a>
}))

// Mock next/image
vi.mock('next/image', () => ({
    default: ({ alt }: any) => <img alt={alt} />
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
    },
    useScroll: () => ({ scrollY: 0 }),
    useTransform: () => ({}),
}))

// Mock components
vi.mock('@repo/ui', () => ({
    PropertyCarousel: () => <div data-testid="carousel" />,
}))
vi.mock('@/components/FavoriteButton', () => ({
    FavoriteButton: () => <div data-testid="fav-btn" />
}))
vi.mock('@/components/FloorplanViewer', () => ({
    FloorplanViewer: () => <div data-testid="floorplan" />
}))
vi.mock('@/components/NeighborhoodMap', () => ({
    NeighborhoodMap: () => <div data-testid="map" />
}))

const mockProperty = {
    id: 'prop-123',
    title: 'Casa Preciosa',
    description: 'Muy linda.',
    price: 150000,
    currency: 'U$S',
    operation: 'Venta',
    type: 'Casa',
    neighborhood: 'Carrasco',
    address: 'Av. Rivera 1234',
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    garages: 1,
    amenities: [],
    images: ['img1.jpg'],
}

const mockAgent = {
    displayName: 'Juan Perez',
    phone: '099123456',
    email: 'juan@test.com'
}

describe('LeadForm inside PropertyClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (global.fetch as any).mockResolvedValue({ ok: true })
            ; (addDoc as any).mockResolvedValue({ id: 'lead-123' })
    })

    it('renders the contact form by default', () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)
        // Desktop form
        expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Email de contacto')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Consulta...')).toBeInTheDocument()
    })

    it('switches to visit schedule mode', () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)
        const visitBtn = screen.getByText('Solicitar Visita')
        fireEvent.click(visitBtn)

        expect(screen.getByText('Fecha')).toBeInTheDocument()
        expect(screen.getByText('Horario')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Me gustaría visitar la propiedad...')).toBeInTheDocument()
    })

    it('submits a contact lead successfully', async () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Maria Lopez' } })
        fireEvent.change(screen.getByPlaceholderText('Email de contacto'), { target: { value: 'maria@test.com' } })
        fireEvent.change(screen.getByPlaceholderText('Consulta...'), { target: { value: 'Quiero info' } })

        // Submit
        fireEvent.click(screen.getByText('Enviar Consulta'))

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledTimes(1)
            // Verify db collection args
            expect(collection).toHaveBeenCalledWith({}, 'leads')
            // Verify fetch
            expect(global.fetch).toHaveBeenCalledTimes(1)
        })

        // Success state
        expect(screen.getByText('¡Consulta Enviada!')).toBeInTheDocument()
    })

    it('submits a visit lead successfully', async () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)

        fireEvent.click(screen.getByText('Solicitar Visita'))

        fireEvent.change(screen.getByLabelText('Fecha', { selector: 'input' }), { target: { value: '2023-12-01' } })
        fireEvent.change(screen.getByLabelText('Horario', { selector: 'select' }), { target: { value: '9:00 - 11:00' } })
        fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Carlos Silva' } })
        fireEvent.change(screen.getByPlaceholderText('Email de contacto'), { target: { value: 'carlos@test.com' } })

        fireEvent.click(screen.getByText('Solicitar Visita', { selector: 'button[type="submit"]' }))

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledTimes(1)
        })

        expect(screen.getByText('¡Consulta Enviada!')).toBeInTheDocument()
    })
})
