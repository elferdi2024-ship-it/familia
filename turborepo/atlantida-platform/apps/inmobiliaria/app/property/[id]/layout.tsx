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
      title: `Propiedad | MiBarrio.uy`,
      description: "Encontrá tu próximo hogar en Uruguay.",
      type: "website",
      url: `https://mibarrio.uy/property/${id}`,
    },
    alternates: {
      canonical: `https://mibarrio.uy/property/${id}`,
    },
  }
}

export default function PropertyLayout({ children }: Props) {
  return <>{children}</>
}
