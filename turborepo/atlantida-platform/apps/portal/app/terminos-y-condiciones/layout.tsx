import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Términos y Condiciones | Barrio.uy",
    description: "Términos y condiciones de uso de la plataforma Barrio.uy. Transparencia y reglas claras para todos nuestros usuarios.",
    alternates: {
        canonical: "https://barrio.uy/terminos-y-condiciones",
    },
}

export default function TerminosLayout({ children }: { children: React.ReactNode }) {
    return children
}
