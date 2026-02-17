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
        content: `Comprar tu primera vivienda en Uruguay es un hito emocionante, pero el camino puede parecer complejo si no conoces las reglas del juego. En 2026, el mercado inmobiliario uruguayo presenta una estabilidad envidiable y nuevas herramientas digitales que facilitan la búsqueda, pero hay pilares fundamentales que todo comprador primerizo debe dominar.

        ## 1. El Ahorro Previo: La Piedra Angular
        La mayoría de los bancos en Uruguay (BHU, BROU, Santander, Itaú, BBVA) financian entre el 80% y el 90% del valor de la propiedad. Esto significa que **necesitas tener ahorrado al menos el 10% o 20% del valor total**, más un 5% adicional para gastos de escrituración, timbres y honorarios profesionales (escribano e inmobiliaria).

        ## 2. Tipos de Financiamiento Hipotecario
        Existen principalmente dos unidades de cuenta para tu préstamo:
        - **Unidades Indexadas (UI):** Ajustan según la inflación. Es la opción más común y predecible a largo plazo.
        - **Dólares (USD):** Recomendado solo si tus ingresos son en la misma moneda para evitar el riesgo cambiario.
        
        *Tip técnico:* Siempre compara la Tasa Efectiva Anual (TEA) y no te quedes con la primera oferta. El BHU suele tener productos específicos para ahorristas jóvenes.

        ## 3. Gastos de Compra que Nadie te Dice
        Además del precio de la casa, debes considerar:
        - **ITP (Impuesto a las Trasmisiones Patrimoniales):** 2% del valor real (catastro).
        - **Honorarios del Escribano:** Generalmente el 3% + IVA.
        - **Comisión Inmobiliaria:** 3% + IVA.
        - **Gastos Hipotecarios:** Tasación, seguro de vida y gastos administrativos del banco.

        ## 4. La Ley de Vivienda Promovida (Ley 18.795)
        Si buscas una vivienda nueva, esta ley es tu mejor aliada. Ofrece exoneraciones impositivas brutales:
        - **Exoneración de ITP** en la compra.
        - **Exoneración de IVA** en el precio de venta (ya incluido en el precio final, que suele ser más bajo).
        - **Exoneración de Impuesto al Patrimonio** por 10 años.

        ## 5. El Rol de DominioTotal
        Nuestra plataforma te permite filtrar específicamente por "Vivienda Promovida" y calcular el costo de tu hipoteca en tiempo real. No pierdas tiempo en portales lentos; la velocidad de respuesta es clave cuando aparece una oportunidad única en barrios de alta demanda como Pocitos o Centro.`,
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
        content: `La Ley de Vivienda Promovida (antes conocida como Vivienda Social) ha revolucionado el mercado inmobiliario uruguayo desde su creación en 2011. Su objetivo: facilitar el acceso a la vivienda y reactivar zonas estratégicas de Montevideo y del interior.

        ## ¿Qué es exactamente una Vivienda Promovida?
        Son proyectos de obra nueva que reciben beneficios fiscales del Estado a cambio de cumplir con ciertos estándares de calidad y ubicación. Esto se traduce en **precios de venta entre un 10% y 15% más bajos** que los proyectos de mercado libre.

        ## Beneficios Impositivos para Compradores Finales
        Si vas a vivir en la propiedad, el beneficio más inmediato es el ahorro del **ITP (2% del valor de catastro)**. Además, al ser proyectos enfocados en la clase media y joven, suelen tener amenidades modernas como gimnasios, coworks y áreas de parrilla en la azotea, manteniendo bajos los costos de mantenimiento (gastos comunes).

        ## El Dorado para Inversores
        Uruguay es un imán para inversores regionales. Bajo esta ley, si compras para alquilar:
        - **Exoneración total de IRPF o IRNR** sobre los alquileres por 10 años.
        - **Exoneración de Impuesto al Patrimonio**.
        
        Esto eleva la rentabilidad neta anual (yield) de un promedio de 4.5% a un sólido **6.5% - 7%**, convirtiéndolo en un refugio de valor excepcionalmente seguro.

        ## Zonas con Mayor Potencial
        Históricamente, el Centro y Cordón han sido los reyes de la Vivienda Promovida. Sin embargo, en 2026 vemos un crecimiento masivo en **La Blanqueada, Prado y el barrio Sur**, donde la calidad de vida y la conectividad están atrayendo a una nueva ola de residentes tech-savvy.

        En la sección de búsqueda de DominioTotal, busca el badge dorado para identificar estas propiedades premium con beneficios fiscales.`,
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
        content: `Montevideo es una ciudad de vecindarios, cada uno con su propia alma. Pero cuando hay niños en la ecuación, las prioridades cambian: plazas seguras, cercanía a colegios y una rambla accesible se vuelven fundamentales. Este es nuestro ranking 2026:

        ## 1. Malvín: El equilibrio perfecto
        Sigue siendo el favorito de la clase media profesional. Tiene un ambiente de "barrio de toda la vida" pero con una oferta comercial y de servicios modernizada. Su rambla es más tranquila que la de Pocitos, ideal para paseos nocturnos en familia.

        ## 2. Pocitos Nuevo: Conectividad y Lifestyle
        Aunque es denso en edificios, la zona próxima al Montevideo Shopping y el WTC ofrece una micro-ciudad donde todo está a 10 minutos caminando. Excelente oferta de colegios bilingües y centros deportivos de primer nivel.

        ## 3. Prado: La nostalgia verde
        Para quienes prefieren casas amplias con jardín y techos altos. El Prado es el pulmón histórico de la ciudad. El Jardín Botánico y el Rosedal son el patio de juegos más grande que cualquier familia podría desear. En 2026, estamos viendo una gentrificación positiva con nuevos cafés y coworks.

        ## 4. Parque Batlle: Salud y Deporte
        Vivir rodeado de centros de salud y el complejo deportivo más grande del país (Estadio Centenario, pista de atletismo) es una ventaja logística enorme. Es un barrio céntrico pero que respira aire puro gracias a su inmenso arbolado.

        ## 5. El Pinar / Ciudad de la Costa: El "Escape" diario
        Aunque técnicamente fuera de Montevideo, en 2026 la conectividad ha mejorado tanto que muchas familias eligen vivir cerca de la playa y el bosque, trabajando de forma híbrida. Es la opción número uno para quienes buscan desconexión total después de las 6 PM.

        En DominioTotal te permitimos explorar estas zonas en nuestro mapa interactivo, viendo qué servicios y puntos de interés hay alrededor de cada propiedad para que tu decisión familiar sea basada en datos reales.`,
        date: "2026-02-10",
        author: "Urbanismo UY",
        image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=2000&auto=format&fit=crop",
        category: "Barrios",
        readTime: "10 min"
    }
];
