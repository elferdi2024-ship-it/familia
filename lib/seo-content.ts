export interface SEOBarrioContent {
    intro: string
    advantages: string[]
    averagePrice: string
    buyerProfile: string
}

export const SEO_BARRIOS_DATA: Record<string, SEOBarrioContent> = {
    "Pocitos": {
        intro: "Pocitos es el barrio con mayor demanda de Montevideo, combinando una rambla espectacular con una oferta gastronómica y de servicios inigualable.",
        advantages: [
            "Conectividad total con el resto de la ciudad.",
            "Seguridad y ambiente familiar.",
            "Cercanía a centros comerciales y playas."
        ],
        averagePrice: "USD 2.800 / m²",
        buyerProfile: "Familias jóvenes, inversores y profesionales que buscan status y comodidad."
    },
    "Cordón": {
        intro: "El corazón joven de la ciudad. Cordón se ha transformado en el polo cultural y universitario por excelencia, ideal para quienes buscan vivir el ritmo urbano.",
        advantages: [
            "Zona de Vivienda Promovida (beneficios fiscales).",
            "Cercanía a facultades y centros de estudio.",
            "Infinidad de bares, cafés y movida nocturna."
        ],
        averagePrice: "USD 2.100 / m²",
        buyerProfile: "Estudiantes, jóvenes profesionales e inversores de renta rápida."
    },
    "Malvín": {
        intro: "Tradición y tranquilidad frente al mar. Malvín conserva ese aire de barrio residencial pero con edificios modernos de alta categoría.",
        advantages: [
            "Playas amplias y tranquilas.",
            "Grandes espacios verdes y parques.",
            "Excelente oferta educativa privada."
        ],
        averagePrice: "USD 2.500 / m²",
        buyerProfile: "Familias consolidadas que buscan paz sin alejarse de la costa."
    },
    "Centro": {
        intro: "Vivir donde todo sucede. El Centro de Montevideo ofrece una infraestructura histórica única y la mayor concentración de oficinas y servicios del país.",
        advantages: [
            "Cercanía a Ciudad Vieja y Puerto.",
            "Transporte público hacia todos los puntos.",
            "Precios competitivos para vivienda y oficinas."
        ],
        averagePrice: "USD 1.900 / m²",
        buyerProfile: "Público práctico, empresas y compradores de primera vivienda."
    },
    "Punta Carretas": {
        intro: "Punta Carretas es sinónimo de exclusividad y sofisticación. Con el shopping como epicentro y el club de golf rodeándolo, es una de las zonas más premium.",
        advantages: [
            "Entorno arbolado y residencial de alta gama.",
            "Gastronomía de primer nivel.",
            "Cercanía a la Rambla de Montevideo."
        ],
        averagePrice: "USD 3.200 / m²",
        buyerProfile: "Perfiles de alto poder adquisitivo y extranjeros."
    },
    "Carrasco": {
        intro: "La zona más exclusiva y verde de la capital. Casas señoriales y un estilo de vida relajado junto al mar definen a este emblemático barrio.",
        advantages: [
            "Seguridad y privacidad.",
            "Los mejores colegios internacionales.",
            "Centros comerciales de diseño y lujo."
        ],
        averagePrice: "USD 3.500 / m²",
        buyerProfile: "Familias consolidadas y ejecutivos de multinacionales."
    },
    "Buceo": {
        intro: "El nuevo centro de negocios. Buceo combina el dinamismo del World Trade Center con el encanto del Puerto del Buceo.",
        advantages: [
            "Cercanía a Montevideo Shopping y WTC.",
            "Mix perfecto entre oficinas y residencias.",
            "Vistas espectaculares al puerto."
        ],
        averagePrice: "USD 2.600 / m²",
        buyerProfile: "Empresarios, solteros y parejas jóvenes."
    },
    "Parque Rodó": {
        intro: "Bohemio, verde y universitario. Un barrio con alma propia, famoso por su gran parque y su cercanía a las facultades de ingeniería y economía.",
        advantages: [
            "Gran pulmón verde de la ciudad.",
            "Ambiente creativo y relajado.",
            "Cercanía a la Playa Ramírez."
        ],
        averagePrice: "USD 2.300 / m²",
        buyerProfile: "Interesados en la cultura, estudiantes y amantes de la naturaleza."
    }
}

export function getSEOContent(barrio: string): SEOBarrioContent | null {
    // Normalizar texto para búsqueda
    const normalized = Object.keys(SEO_BARRIOS_DATA).find(
        key => key.toLowerCase() === barrio.toLowerCase()
    )
    return normalized ? SEO_BARRIOS_DATA[normalized] : null
}
