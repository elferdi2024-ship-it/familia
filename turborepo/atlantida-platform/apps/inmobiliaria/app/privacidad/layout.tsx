import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Privacidad | MiBarrio.uy",
    description: "Tu privacidad es lo más importante. Descubre cómo MiBarrio.uy cuida tus datos en todo momento.",
    alternates: {
        canonical: "https://mibarrio.uy/privacidad",
    },
}

export default function PrivacidadLayout({ children }: { children: React.ReactNode }) {
    return children
}
