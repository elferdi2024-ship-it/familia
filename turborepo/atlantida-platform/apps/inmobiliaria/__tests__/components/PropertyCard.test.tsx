import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '@/components/PropertyCard'

// Mock contexts
const mockToggleFavorite = vi.fn()
const mockIsFavorite = vi.fn(() => false)
const mockAddToCompare = vi.fn()
const mockRemoveFromCompare = vi.fn()
const mockIsInCompare = vi.fn(() => false)

vi.mock('@/contexts/FavoritesContext', () => ({
    useFavorites: () => ({
        isFavorite: mockIsFavorite,
        toggleFavorite: mockToggleFavorite,
    }),
}))

vi.mock('@/contexts/ComparisonContext', () => ({
    useComparison: () => ({
        isInCompare: mockIsInCompare,
        addToCompare: mockAddToCompare,
        removeFromCompare: mockRemoveFromCompare,
    }),
}))

// Mock @repo/ui components
vi.mock('@repo/ui', () => ({
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>{children}</button>
    ),
    Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    ThumbnailCarousel: ({ images, altText }: any) => (
        <div data-testid="thumbnail-carousel">{altText} ({images.length} images)</div>
    ),
}))

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
    MapPin: () => <span data-testid="icon-mappin" />,
    Bed: () => <span data-testid="icon-bed" />,
    Ruler: () => <span data-testid="icon-ruler" />,
    Heart: ({ className }: any) => <span data-testid="icon-heart" className={className} />,
    Camera: () => <span data-testid="icon-camera" />,
    ArrowRight: () => <span data-testid="icon-arrow" />,
    Copy: () => <span data-testid="icon-copy" />,
}))

const defaultProps = {
    id: '123',
    title: 'Apartamento Premium en Pocitos',
    location: 'Pocitos, Montevideo',
    price: 250000,
    currency: 'U$S',
    bedrooms: 3,
    area: 120,
    imageUrl: 'https://example.com/image.jpg',
    type: 'Venta' as const,
    featured: false,
}

describe('PropertyCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsFavorite.mockReturnValue(false)
        mockIsInCompare.mockReturnValue(false)
    })

    describe('Rendering', () => {
        it('renders title correctly', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('Apartamento Premium en Pocitos')).toBeInTheDocument()
        })

        it('renders location with MapPin icon', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('Pocitos, Montevideo')).toBeInTheDocument()
            expect(screen.getByTestId('icon-mappin')).toBeInTheDocument()
        })

        it('renders price formatted with currency', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('U$S 250,000')).toBeInTheDocument()
        })

        it('renders price label "Precio Total"', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('Precio Total')).toBeInTheDocument()
        })

        it('renders bedrooms count', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('3 Dorm.')).toBeInTheDocument()
        })

        it('renders area in m²', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('120 m²')).toBeInTheDocument()
        })

        it('renders type badge "Venta"', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('Venta')).toBeInTheDocument()
        })

        it('renders Alquiler type badge', () => {
            render(<PropertyCard {...defaultProps} type="Alquiler" />)
            expect(screen.getByText('Alquiler')).toBeInTheDocument()
        })

        it('links to property detail page', () => {
            render(<PropertyCard {...defaultProps} />)
            const links = screen.getAllByRole('link')
            const detailLinks = links.filter((l) => l.getAttribute('href') === '/property/123')
            expect(detailLinks.length).toBeGreaterThan(0)
        })

        it('renders "Ver" button', () => {
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByText('Ver')).toBeInTheDocument()
        })
    })

    describe('Badges', () => {
        it('renders "Destacado" badge when featured is true', () => {
            render(<PropertyCard {...defaultProps} featured={true} />)
            expect(screen.getByText('Destacado')).toBeInTheDocument()
        })

        it('does not render "Destacado" badge when featured is false', () => {
            render(<PropertyCard {...defaultProps} featured={false} />)
            expect(screen.queryByText('Destacado')).not.toBeInTheDocument()
        })

        it('renders "Nuevo" badge for even IDs', () => {
            render(<PropertyCard {...defaultProps} id={2} />)
            expect(screen.getByText('Nuevo')).toBeInTheDocument()
        })

        it('renders "Oportunidad" badge for cheap sale properties', () => {
            render(<PropertyCard {...defaultProps} price={100000} type="Venta" />)
            expect(screen.getByText('Oportunidad')).toBeInTheDocument()
        })

        it('does not render "Oportunidad" badge for rentals', () => {
            render(<PropertyCard {...defaultProps} price={100000} type="Alquiler" />)
            expect(screen.queryByText('Oportunidad')).not.toBeInTheDocument()
        })
    })

    describe('Favorites', () => {
        it('calls toggleFavorite when heart button is clicked', () => {
            render(<PropertyCard {...defaultProps} />)
            const favButton = screen.getByLabelText('Agregar a favoritos')
            fireEvent.click(favButton)
            expect(mockToggleFavorite).toHaveBeenCalledWith('123')
        })

        it('shows "Quitar de favoritos" label when favorited', () => {
            mockIsFavorite.mockReturnValue(true)
            render(<PropertyCard {...defaultProps} />)
            expect(screen.getByLabelText('Quitar de favoritos')).toBeInTheDocument()
        })
    })

    describe('Comparison', () => {
        it('calls addToCompare when compare button is clicked', () => {
            render(<PropertyCard {...defaultProps} />)
            const compareButton = screen.getByLabelText('Agregar a comparación')
            fireEvent.click(compareButton)
            expect(mockAddToCompare).toHaveBeenCalledWith('123')
        })

        it('calls removeFromCompare when already comparing', () => {
            mockIsInCompare.mockReturnValue(true)
            render(<PropertyCard {...defaultProps} />)
            const compareButton = screen.getByLabelText('Quitar de comparación')
            fireEvent.click(compareButton)
            expect(mockRemoveFromCompare).toHaveBeenCalledWith('123')
        })
    })

    describe('Image handling', () => {
        it('renders carousel when images are provided', () => {
            render(<PropertyCard {...defaultProps} images={['img1.jpg', 'img2.jpg']} />)
            expect(screen.getByTestId('thumbnail-carousel')).toBeInTheDocument()
        })

        it('renders camera icon when no images', () => {
            render(<PropertyCard {...defaultProps} imageUrl={undefined} images={[]} />)
            expect(screen.getByTestId('icon-camera')).toBeInTheDocument()
        })
    })

    describe('Currency', () => {
        it('defaults to U$S when no currency provided', () => {
            const { currency, ...propsWithoutCurrency } = defaultProps
            render(<PropertyCard {...propsWithoutCurrency} />)
            expect(screen.getByText(/U\$S/)).toBeInTheDocument()
        })

        it('renders custom currency', () => {
            render(<PropertyCard {...defaultProps} currency="$" price={35000} />)
            expect(screen.getByText('$ 35,000')).toBeInTheDocument()
        })
    })
})
