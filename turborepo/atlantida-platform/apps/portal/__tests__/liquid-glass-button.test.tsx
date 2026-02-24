import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LiquidGlassButton } from '../components/ui/liquid-glass-button'

describe('LiquidGlassButton Component', () => {
    it('renders text correctly', () => {
        render(<LiquidGlassButton href="#">Premium Access</LiquidGlassButton>)
        expect(screen.getByText('Premium Access')).toBeInTheDocument()
    })
})
