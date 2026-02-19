import { Metadata } from "next"
import { MortgageCalculatorClient } from "./MortgageCalculatorClient"

export const metadata: Metadata = {
    title: "Calculadora de Hipoteca Uruguay",
    description: "Calcula tu cuota mensual de hipoteca en Uruguay. Simula prestamos para compra de vivienda con tasas actualizadas de bancos uruguayos.",
    openGraph: {
        title: "Calculadora de Hipoteca Uruguay | MiBarrio.uy",
        description: "Simula tu cuota mensual y conoce cuanto podes pedir de prestamo hipotecario.",
    },
}

export default function MortgageCalculatorPage() {
    return <MortgageCalculatorClient />
}
