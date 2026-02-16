import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchContent } from "@/components/search/SearchContent"
import { getSEOContent } from "@/lib/seo-content"

interface Props {
    params: Promise<{ barrio: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { barrio } = await params
    const decodedBarrio = decodeURIComponent(barrio)
    const capitalizedBarrio = decodedBarrio.charAt(0).toUpperCase() + decodedBarrio.slice(1)

    return {
        title: `Alquiler de Apartamentos y Casas en ${capitalizedBarrio} | DominioTotal`,
        description: `Encontrá tu próximo alquiler en ${capitalizedBarrio}, Montevideo. Variedad de garantías (ANDA, CGN) y precios por m².`,
        openGraph: {
            title: `Alquileres en ${capitalizedBarrio}`,
            description: `Los mejores apartamentos y casas para alquilar en ${capitalizedBarrio}.`,
        }
    }
}

export default async function AlquilarBarrioPage({ params }: Props) {
    const { barrio } = await params
    const decodedBarrio = decodeURIComponent(barrio)
    const capitalizedBarrio = decodedBarrio.charAt(0).toUpperCase() + decodedBarrio.slice(1)
    const seoContent = getSEOContent(capitalizedBarrio)

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Cargando propiedades...</div></div>}>
            <SearchContent
                initialOperation="Alquiler"
                initialNeighborhood={capitalizedBarrio}
                seoTitle={`Alquileres en ${capitalizedBarrio}`}
                seoDescription={seoContent?.intro || `Encontrá las mejores opciones de casas y apartamentos para alquilar en el barrio ${capitalizedBarrio}, Montevideo.`}
            />
        </Suspense>
    )
}

export async function generateStaticParams() {
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
