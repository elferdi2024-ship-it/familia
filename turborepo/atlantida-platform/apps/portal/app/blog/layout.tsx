export const metadata = {
    title: "Blog Inmobiliario | Barrio.uy Uruguay",
    description:
        "Guías, consejos y análisis del mercado inmobiliario en Uruguay. Todo lo que necesitas saber para comprar, alquilar o invertir.",
}

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
