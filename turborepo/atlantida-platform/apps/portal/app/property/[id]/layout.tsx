import type { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Propiedad ${id}`,
    description: "Encontrá tu próximo hogar en Uruguay. Ver detalles, fotos y contactar al agente.",
    openGraph: {
      title: `Propiedad | Barrio.uy`,
      description: "Encontrá tu próximo hogar en Uruguay.",
      type: "website",
      url: `https://barrio.uy/property/${id}`,
    },
    alternates: {
      canonical: `https://barrio.uy/property/${id}`,
    },
  }
}

export default function PropertyLayout({ children }: Props) {
  return <>{children}</>
}
