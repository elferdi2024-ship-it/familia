import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sobre Nosotros | MiBarrio.uy - Tu Plataforma Inmobiliaria Personal",
    description: "Conoce la historia detrás de MiBarrio.uy. Nuestra misión es empoderar a dueños e interesados con las mejores herramientas digitales de Uruguay.",
    alternates: {
        canonical: "https://mibarrio.uy/sobre-nosotros",
    },
}

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
    return children
}
