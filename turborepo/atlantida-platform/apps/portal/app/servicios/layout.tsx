import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Servicios Inmobiliarios de Vanguardia | Barrio.uy",
    description: "Descubre cómo Barrio.uy revoluciona el mercado inmobiliario en Uruguay con tecnología, análisis de datos y un enfoque centrado en el cliente.",
    alternates: {
        canonical: "https://barrio.uy/servicios",
    },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
    return children
}
