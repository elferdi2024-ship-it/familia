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
    default: ({ children }: any) => <a>{children}</a>
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Check: () => <span>Check</span>,
    Star: () => <span>Star</span>,
    ArrowLeft: () => <span>ArrowLeft</span>,
    Building2: () => <span>Building2</span>,
    Zap: () => <span>Zap</span>,
    Sparkles: () => <span>Sparkles</span>,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock UI Tabs
vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, onValueChange, value }: any) => (
        <div data-testid="tabs" onClick={() => onValueChange?.(value === 'monthly' ? 'yearly' : 'monthly')}>
            {children}
        </div>
    ),
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children, value }: any) => <button>{children}</button>,
}))

// Mock fetch
global.fetch = vi.fn()

describe('PricingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (useAuth as any).mockReturnValue({ user: null })
            ; (global.fetch as any).mockResolvedValue({
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

    it('toggles between monthly and yearly billing', () => {
        render(<PricingPage />)
        const yearlyBtn = screen.getByText(/Anual/i)
        fireEvent.click(yearlyBtn)

        // Check if discount is visible
        expect(screen.getByText('-20%')).toBeInTheDocument()
        // Check if yearly billing text appeared
        expect(screen.getAllByText(/Facturado anualmente/i).length).toBeGreaterThan(0)
    })

    it('shows toast error if trying to subscribe without login', () => {
        render(<PricingPage />)
        const subscribeBtn = screen.getByText('Suscribirme Pro')
        fireEvent.click(subscribeBtn)

        expect(toast.error).toHaveBeenCalledWith('Debes iniciar sesión para contratar un plan')
    })

    it('redirects to mercado pago checkout if logged in', async () => {
        ; (useAuth as any).mockReturnValue({ user: { uid: 'user-123', email: 'test@test.com' } })

        const originalLocation = window.location
        // Create a fake location object
        const fakeLocation = new URL('http://localhost') as any
        fakeLocation.href = ''

        // Mock window.location
        delete (window as any).location
        window.location = fakeLocation

        render(<PricingPage />)
        const subscribeBtn = screen.getByText('Suscribirme Pro')
        fireEvent.click(subscribeBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/mercadopago/checkout', expect.any(Object))
            expect(window.location.href).toBe('https://mercadopago.com/checkout')
        });

        (window as any).location = originalLocation
    })
})
