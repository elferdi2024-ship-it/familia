export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    image: string;
    category: string;
    readTime: string;
}

export const POSTS: Post[] = [
    {
        slug: "guia-compra-primera-vivienda-uruguay-2026",
        title: "Cómo comprar tu primera vivienda en Uruguay: Guía Completa 2026",
        excerpt: "Descubrí los requisitos, trámites y consejos clave para concretar el sueño de tu casa propia en Uruguay este año.",
        content: `
            Comprar una vivienda es una de las decisiones más importantes de la vida. En Uruguay, el mercado inmobiliario en 2026 ofrece diversas oportunidades, pero también requiere un conocimiento claro de los procesos legales y financieros.

            ## 1. Requisitos Básicos
            Para comenzar, debés contar con un ahorro previo que generalmente oscila entre el 10% y el 20% del valor de la propiedad si vas a solicitar un préstamo hipotecario.

            ## 2. El Préstamo Hipotecario
            Los bancos en Uruguay (BHU, BROU, Santander, Itaú, etc.) ofrecen diversas líneas de crédito. Es vital comparar las tasas (TEA) y los plazos.

            ## 3. Vivienda Promovida
            No olvides consultar por proyectos bajo la Ley 18.795, que ofrecen importantes beneficios fiscales y precios más competitivos.
            
            En DominioTotal te ayudamos a filtrar estas oportunidades de forma sencilla.
        `,
        date: "2026-02-17",
        author: "Equipo DominioTotal",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
        category: "Guías",
        readTime: "8 min"
    },
    {
        slug: "vivienda-promovida-que-necesitas-saber",
        title: "Vivienda Promovida: Beneficios y Oportunidades",
        excerpt: "Exploramos las ventajas de la Ley 18.795 y por qué es la opción preferida de los inversores y familias jóvenes.",
        content: `
            La Ley de Vivienda Promovida ha transformado el paisaje urbano de Montevideo. 
            
            ## Ventajas para el Comprador
            - Exoneración de ITP (2% del valor de catastro).
            - Exoneración de IVA en la primera venta.
            
            ## Para el Inversor
            Si comprás para alquilar, podés exonerar el IRPF por 10 años en zonas específicas.
        `,
        date: "2026-02-15",
        author: "Inversiones Inmobiliarias",
        image: "https://images.unsplash.com/photo-1460317442991-0ec239f33649?q=80&w=2000&auto=format&fit=crop",
        category: "Inversión",
        readTime: "6 min"
    },
    {
        slug: "mejores-barrios-montevideo-familias-2026",
        title: "Los 5 mejores barrios de Montevideo para vivir en familia",
        excerpt: "Analizamos seguridad, servicios y áreas verdes para determinar dónde conviene mudarse con niños este año.",
        content: `
            La ubicación es todo. Si tenés familia, estos barrios lideran el ranking:
            
            1. **Pocitos Nuevo**: Caminabilidad y servicios.
            2. **Carrasco**: Espacios verdes y tranquilidad.
            3. **Malvín**: Proximidad a la rambla y colegios.
            4. **Prado**: Historia y parques.
            5. **Parque Batlle**: El pulmón de la ciudad.
        `,
        date: "2026-02-10",
        author: "Urbanismo UY",
        image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=2000&auto=format&fit=crop",
        category: "Barrios",
        readTime: "10 min"
    }
];
