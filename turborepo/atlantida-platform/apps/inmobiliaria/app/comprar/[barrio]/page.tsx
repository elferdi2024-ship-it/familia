import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchContent } from "@/components/search/SearchContent"
import { getSEOContent } from "@repo/lib/seo"

interface Props {
    params: Promise<{ barrio: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { barrio } = await params
    const decodedBarrio = decodeURIComponent(barrio)
    const capitalizedBarrio = decodedBarrio.charAt(0).toUpperCase() + decodedBarrio.slice(1)

    return {
        title: `Casas y Apartamentos en Venta en ${capitalizedBarrio} | MiBarrio.uy`,
        description: `Encontrá tu próximo hogar en ${capitalizedBarrio}, Montevideo. Precios actualizados, fotos reales e inteligencia de mercado.`,
        openGraph: {
            title: `Propiedades en Venta en ${capitalizedBarrio}`,
            description: `Las mejores oportunidades inmobiliarias en ${capitalizedBarrio}.`,
        }
    }
}

export default async function ComprarBarrioPage({ params }: Props) {
    const { barrio } = await params
    const decodedBarrio = decodeURIComponent(barrio)
    const capitalizedBarrio = decodedBarrio.charAt(0).toUpperCase() + decodedBarrio.slice(1)
    const seoContent = getSEOContent(capitalizedBarrio)

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Cargando propiedades...</div></div>}>
            <SearchContent
                initialOperation="Venta"
                initialNeighborhood={capitalizedBarrio}
                seoTitle={`Propiedades en Venta en ${capitalizedBarrio}`}
                seoDescription={seoContent?.intro || `Explorá las mejores opciones de casas y apartamentos en venta en el barrio ${capitalizedBarrio}, Montevideo.`}
            />
        </Suspense>
    )
}

export async function generateStaticParams() {
    // Barrios principales para pre-renderizado SEO
    return [
        { barrio: 'pocitos' },
        { barrio: 'punta-carretas' },
        { barrio: 'carrasco' },
        { barrio: 'buceo' },
        { barrio: 'cordon' },
        { barrio: 'centro' },
        { barrio: 'ciudad-vieja' },
        { barrio: 'parque-rodo' },
        { barrio: 'malvin' },
        { barrio: 'punta-gorda' },
        { barrio: 'la-blanqueada' },
        { barrio: 'tres-cruces' },
        { barrio: 'aguada' },
        { barrio: 'palermo' },
        { barrio: 'barrio-sur' },
        { barrio: 'parque-batlle' },
        { barrio: 'larranaga' },
        { barrio: 'union' },
        { barrio: 'sayago' },
        { barrio: 'penarol' }
    ]
}
