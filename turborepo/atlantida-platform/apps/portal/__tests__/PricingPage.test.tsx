import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PricingPage from '@/app/publish/pricing/page'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: vi.fn()
}))

// Mock Sonner
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    }
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    ArrowLeft: () => <span>ArrowLeft</span>,
}))

// Mock FounderBanner (usa Firestore)
vi.mock('@/components/FounderBanner', () => ({
    FounderBanner: () => null,
}))

// Mock CorporatePlan (usa Firestore por defecto)
vi.mock('@/components/CorporatePlan', () => ({
    CorporatePlan: () => <div data-testid="corporate-plan">CorporatePlan</div>,
}))

// Mock fetch
global.fetch = vi.fn()

describe('PricingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        ;(useAuth as any).mockReturnValue({ user: null })
        ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ init_point: 'https://mercadopago.com/checkout' })
        })
    })

    it('renders the pricing plans', () => {
        render(<PricingPage />)
        expect(screen.getByText('Plan Base')).toBeInTheDocument()
        expect(screen.getByText('Plan Pro')).toBeInTheDocument()
        expect(screen.getByText('Plan Premium')).toBeInTheDocument()
    })

    it('renders segment labels and new CTAs', () => {
        render(<PricingPage />)
        expect(screen.getByText('Para propietarios')).toBeInTheDocument()
        expect(screen.getByText('Para profesionales')).toBeInTheDocument()
        expect(screen.getByText('Para agencias')).toBeInTheDocument()
        expect(screen.getByText('Empezar a crecer →')).toBeInTheDocument()
        expect(screen.getByText('Activar mi Agencia →')).toBeInTheDocument()
    })

    it('toggles between monthly and yearly billing', () => {
        render(<PricingPage />)
        const toggle = screen.getByRole('switch', { name: /cambiar facturación a anual/i })
        expect(toggle).toHaveAttribute('aria-checked', 'false')
        fireEvent.click(toggle)
        expect(toggle).toHaveAttribute('aria-checked', 'true')
    })

    it('shows toast error if trying to subscribe without login', () => {
        render(<PricingPage />)
        const subscribeBtn = screen.getByText('Empezar a crecer →')
        fireEvent.click(subscribeBtn)
        expect(toast.error).toHaveBeenCalledWith('Debes iniciar sesión para contratar un plan')
    })

    it('redirects to mercado pago checkout if logged in', async () => {
        ;(useAuth as any).mockReturnValue({ user: { uid: 'user-123', email: 'test@test.com' } })
        let href = ''
        const originalLocation = window.location
        Object.defineProperty(window, 'location', {
            value: { ...originalLocation, get href() { return href }, set href(v: string) { href = v } },
            writable: true,
        })

        render(<PricingPage />)
        const subscribeBtn = screen.getByText('Empezar a crecer →')
        fireEvent.click(subscribeBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/mercadopago/checkout', expect.any(Object))
            expect(href).toBe('https://mercadopago.com/checkout')
        })
        Object.defineProperty(window, 'location', { value: originalLocation, writable: true })
    })

    it('renders corporate plan section', () => {
        render(<PricingPage />)
        expect(screen.getByTestId('corporate-plan')).toBeInTheDocument()
    })
})
