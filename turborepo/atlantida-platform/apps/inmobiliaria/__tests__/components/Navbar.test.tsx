import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// We need to import AFTER mock setup
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

vi.mock('lucide-react', () => ({
    Instagram: () => <span data-testid="icon-instagram" />,
    Phone: () => <span data-testid="icon-phone" />,
    MessageCircle: () => <span data-testid="icon-message" />,
    Menu: () => <span data-testid="icon-menu" />,
    X: () => <span data-testid="icon-x" />,
    Search: () => <span data-testid="icon-search" />,
    User: () => <span data-testid="icon-user" />,
    LogOut: () => <span data-testid="icon-logout" />,
    Home: () => <span data-testid="icon-home" />,
    Heart: () => <span data-testid="icon-heart" />,
    ChevronDown: () => <span data-testid="icon-chevron" />,
}))

const mockLoginWithGoogle = vi.fn()
const mockLogout = vi.fn()

vi.mock('@/contexts/AuthContext', () => ({
    useAuth: vi.fn(() => ({
        user: null,
        loading: false,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithEmail: vi.fn(),
        registerWithEmail: vi.fn(),
        updateUserProfile: vi.fn(),
        logout: mockLogout,
    })),
}))

vi.mock('@/components/auth/AuthModal', () => ({
    AuthModal: ({ isOpen }: any) => isOpen ? <div data-testid="auth-modal">Auth Modal</div> : null,
}))

vi.mock('@/components/animated-theme-toggle', () => ({
    AnimatedThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}))

import { Navbar } from '@/components/layout/Navbar'
import { useAuth } from '@/contexts/AuthContext'

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
            ; (useAuth as any).mockReturnValue({
                user: null,
                loading: false,
                loginWithGoogle: mockLoginWithGoogle,
                loginWithEmail: vi.fn(),
                registerWithEmail: vi.fn(),
                updateUserProfile: vi.fn(),
                logout: mockLogout,
            })
    })

    describe('Rendering', () => {
        it('renders the logo', () => {
            render(<Navbar />)
            expect(screen.getByAltText('MiBarrio.uy')).toBeInTheDocument()
        })

        it('renders theme toggle', () => {
            render(<Navbar />)
            expect(screen.getAllByTestId('theme-toggle').length).toBeGreaterThan(0)
        })

        it('renders navigation links', () => {
            render(<Navbar />)
            expect(screen.getAllByText('Comprar')[0]).toBeInTheDocument()
            expect(screen.getAllByText('Alquilar')[0]).toBeInTheDocument()
            expect(screen.getAllByText('Vender')[0]).toBeInTheDocument()
        })
    })

    describe('Auth state - Logged out', () => {
        it('shows login option when user is not authenticated', () => {
            render(<Navbar />)
            const loginButtons = screen.getAllByText(/Ingresar/i)
            expect(loginButtons.length).toBeGreaterThan(0)
        })

        it('opens auth modal when login button clicked', () => {
            render(<Navbar />)
            const loginButton = screen.getAllByText(/Ingresar/i)[0]
            fireEvent.click(loginButton)
            expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
        })
    })

    describe('Auth state - Logged in', () => {
        beforeEach(() => {
            ; (useAuth as any).mockReturnValue({
                user: {
                    displayName: 'Fernando',
                    email: 'fernando@test.com',
                    photoURL: null,
                },
                loading: false,
                loginWithGoogle: mockLoginWithGoogle,
                loginWithEmail: vi.fn(),
                registerWithEmail: vi.fn(),
                updateUserProfile: vi.fn(),
                logout: mockLogout,
            })
        })

        it('shows user info when authenticated', () => {
            render(<Navbar />)
            const userElements = screen.getAllByText(/Fernando/i)
            expect(userElements.length).toBeGreaterThan(0)
        })

        it('shows Publicar option for authenticated users', () => {
            render(<Navbar />)
            const publishLinks = screen.getAllByText(/Publicar/i)
            expect(publishLinks.length).toBeGreaterThan(0)
        })

        it('calls logout when Salir is clicked', () => {
            render(<Navbar />)
            const logoutButton = screen.getAllByText(/Salir/i)[0]
            fireEvent.click(logoutButton)
            expect(mockLogout).toHaveBeenCalled()
        })
    })
})
