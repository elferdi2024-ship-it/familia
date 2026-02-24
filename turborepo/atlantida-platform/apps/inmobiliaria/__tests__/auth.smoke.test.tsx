import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../components/ui/button'

describe('Auth Smoke Tests (Inmobiliaria)', () => {
    it('renders a primary action button intended for auth', () => {
        render(<Button>Iniciar Sesion</Button>)
        expect(screen.getByText('Iniciar Sesion')).toBeInTheDocument()
    })
})
