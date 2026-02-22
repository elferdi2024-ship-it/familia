import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
    BreadcrumbSchema,
    HomeBreadcrumb,
    SearchBreadcrumb,
    PropertyBreadcrumb,
    BlogBreadcrumb,
} from '@/components/BreadcrumbSchema'

describe('BreadcrumbSchema', () => {
    describe('BreadcrumbSchema base component', () => {
        it('renders JSON-LD script tag', () => {
            const { container } = render(
                <BreadcrumbSchema items={[{ name: 'Inicio', href: '/' }]} />
            )
            const script = container.querySelector('script[type="application/ld+json"]')
            expect(script).toBeTruthy()
        })

        it('generates correct BreadcrumbList schema', () => {
            const { container } = render(
                <BreadcrumbSchema items={[
                    { name: 'Inicio', href: '/' },
                    { name: 'Buscar', href: '/search' },
                ]} />
            )
            const script = container.querySelector('script[type="application/ld+json"]')
            const json = JSON.parse(script!.textContent!)

            expect(json['@context']).toBe('https://schema.org')
            expect(json['@type']).toBe('BreadcrumbList')
            expect(json.itemListElement).toHaveLength(2)
            expect(json.itemListElement[0].position).toBe(1)
            expect(json.itemListElement[0].name).toBe('Inicio')
            expect(json.itemListElement[0].item).toBe('https://mibarrio.uy/')
            expect(json.itemListElement[1].position).toBe(2)
            expect(json.itemListElement[1].name).toBe('Buscar')
        })
    })

    describe('HomeBreadcrumb', () => {
        it('renders single item for home', () => {
            const { container } = render(<HomeBreadcrumb />)
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(1)
            expect(json.itemListElement[0].name).toBe('Inicio')
        })
    })

    describe('SearchBreadcrumb', () => {
        it('renders Comprar path by default', () => {
            const { container } = render(<SearchBreadcrumb />)
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(3)
            expect(json.itemListElement[1].name).toBe('Comprar')
        })

        it('renders Alquilar path for rental operation', () => {
            const { container } = render(<SearchBreadcrumb operation="Alquiler" />)
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement[1].name).toBe('Alquilar')
            expect(json.itemListElement[1].item).toContain('/alquilar')
        })
    })

    describe('PropertyBreadcrumb', () => {
        it('renders full path without neighborhood', () => {
            const { container } = render(
                <PropertyBreadcrumb title="Casa Premium" id="abc123" />
            )
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(3) // Inicio > Propiedades > Title
            expect(json.itemListElement[2].name).toBe('Casa Premium')
            expect(json.itemListElement[2].item).toContain('/property/abc123')
        })

        it('includes neighborhood when provided', () => {
            const { container } = render(
                <PropertyBreadcrumb title="Casa" id="abc" neighborhood="Pocitos" />
            )
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(4)
            expect(json.itemListElement[2].name).toBe('Pocitos')
            expect(json.itemListElement[2].item).toContain('/comprar/pocitos')
        })
    })

    describe('BlogBreadcrumb', () => {
        it('renders blog list path without post', () => {
            const { container } = render(<BlogBreadcrumb />)
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(2) // Inicio > Blog
        })

        it('renders full path with post details', () => {
            const { container } = render(
                <BlogBreadcrumb postTitle="Mi Artículo" slug="mi-articulo" />
            )
            const json = JSON.parse(
                container.querySelector('script[type="application/ld+json"]')!.textContent!
            )
            expect(json.itemListElement).toHaveLength(3)
            expect(json.itemListElement[2].name).toBe('Mi Artículo')
            expect(json.itemListElement[2].item).toContain('/blog/mi-articulo')
        })
    })
})
