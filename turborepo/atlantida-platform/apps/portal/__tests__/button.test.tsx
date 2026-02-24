import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../components/ui/button'

describe('Button Component', () => {
    it('renders without crashing', () => {
        render(<Button>Click Me</Button>)
        expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('applies destructive variant correctly', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>)
        expect(container.firstChild).toHaveClass('bg-destructive')
    })
})
