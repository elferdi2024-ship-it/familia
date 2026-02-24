import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Vender Propiedad | Tasación Profesional en Uruguay | Barrio.uy",
    description: "Vende tu casa o apartamento en tiempo récord con Barrio.uy. Tasaciones profesionales basadas en datos reales y marketing inmobiliario de alta performance.",
    alternates: {
        canonical: "https://barrio.uy/vender",
    },
}

export default function VenderLayout({ children }: { children: React.ReactNode }) {
    return children
}
