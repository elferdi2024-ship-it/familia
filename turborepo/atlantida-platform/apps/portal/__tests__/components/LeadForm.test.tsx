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
    getDoc: vi.fn(),
    addDoc: vi.fn(),
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

describe('PropertyClient Interactions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (global.fetch as any).mockResolvedValue({ ok: true })
            ; (addDoc as any).mockResolvedValue({ id: 'lead-123' })
    })

    it('renders the contact form by default', () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)
        expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()
    })

    it('submits a contact lead successfully', async () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)

        fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Maria Lopez' } })
        fireEvent.change(screen.getByPlaceholderText('Email de contacto'), { target: { value: 'maria@test.com' } })
        fireEvent.change(screen.getByPlaceholderText('Consulta...'), { target: { value: 'Quiero info' } })

        fireEvent.click(screen.getByText('Enviar Consulta'))

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledTimes(1)
            expect(screen.getByText('¡Consulta Enviada!')).toBeInTheDocument()
        })
    })

    it('handles phone reveal and whatsapp click', () => {
        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)

        const wsBtn = screen.getByText('Ver WhatsApp')
        fireEvent.click(wsBtn)

        expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    })

    it('triggers share property', () => {
        const shareSpy = vi.fn()
        global.navigator.share = shareSpy

        render(<PropertyClient initialProperty={mockProperty as any} initialAgentInfo={mockAgent} />)
        const shareBtn = screen.getByText('share')
        fireEvent.click(shareBtn)

        expect(shareSpy).toHaveBeenCalled()
    })
})
