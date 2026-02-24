import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Términos y Condiciones | MiBarrio.uy",
    description: "Términos y condiciones legales para el uso de la plataforma MiBarrio.uy.",
    alternates: {
        canonical: "https://mibarrio.uy/terminos-y-condiciones",
    },
}

export default function TerminosLayout({ children }: { children: React.ReactNode }) {
    return children
}
