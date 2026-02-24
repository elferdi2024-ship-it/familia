import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Privacidad | Barrio.uy",
    description: "Conoce cómo protegemos tus datos y tu privacidad en Barrio.uy. Nuestra prioridad es la seguridad de tu información personal.",
    alternates: {
        canonical: "https://barrio.uy/privacidad",
    },
}

export default function PrivacidadLayout({ children }: { children: React.ReactNode }) {
    return children
}
