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

        ## 5. El Rol de MiBarrio.uy
        Nuestra plataforma te permite filtrar específicamente por "Vivienda Promovida" y calcular el costo de tu hipoteca en tiempo real. No pierdas tiempo en portales lentos; la velocidad de respuesta es clave cuando aparece una oportunidad única en barrios de alta demanda como Pocitos o Centro.`,
        date: "2026-02-17",
        author: "Equipo MiBarrio.uy",
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

        En la sección de búsqueda de MiBarrio.uy, busca el badge dorado para identificar estas propiedades premium con beneficios fiscales.`,
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

        En MiBarrio.uy te permitimos explorar estas zonas en nuestro mapa interactivo, viendo qué servicios y puntos de interés hay alrededor de cada propiedad para que tu decisión familiar sea basada en datos reales.`,
        date: "2026-02-10",
        author: "Urbanismo UY",
        image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=2000&auto=format&fit=crop",
        category: "Barrios",
        readTime: "10 min"
    },
    {
        slug: "precio-m2-montevideo-2026-analisis-por-barrio",
        title: "Precio del m² en Montevideo 2026: Análisis por Barrio",
        excerpt: "Una radiografía completa de los valores inmobiliarios en la capital uruguaya para tomar decisiones de compra e inversión inteligentes.",
        content: `Comprar una propiedad exige entender a fondo las dinámicas de precios del mercado local. A la hora de invertir en Montevideo durante 2026, el valor del metro cuadrado (m²) muestra fluctuaciones interesantes según la zona, la antigüedad del edificio y los servicios cercanos.

        ## La Estrella del Mercado: Zona Costera
        Los barrios tradicionales frente al Río de la Plata siguen liderando el tope de precios en Uruguay, siendo refugios seguros de capital:
        - **Puerto Buceo & Punta Carretas:** Promedian entre **USD 3.200 y USD 3.800 por m²** en propiedades premium y obra nueva. La demanda internacional de corporativos impulsa esta zona.
        - **Pocitos & Malvín:** Mantienen un valor estable rondando los **USD 2.600 a USD 2.900**. Son barrios con altísima liquidez (se alquilan y venden muy rápido).
        - **Carrasco:** Sigue siendo altamente exclusivo, con valores muy variables dependiendo de si es "Carrasco Sur" (más de USD 3.500/m²) o norte, pero en expansión hacia proyectos de barrios privados.

        ## El "Middle Market": Centro, Cordón y Tres Cruces
        El boom de la vivienda promovida ha transformado completamente estos barrios. Aquí, los inversores apuntan menos a la revalorización de la tierra y más al *Yield* (rentabilidad mensual del alquiler):
        - **Cordón Soho & Sur:** Se afianza como el barrio millennial por excelencia. Valores de pozo en torno a los **USD 2.200 a USD 2.500 / m²**.
        - **Centro:** Ligeramente más económico, entre **USD 1.900 y USD 2.100**, excelente opción para estudiantes universitarios del interior.
        - **Tres Cruces / Parque Batlle:** Debido a la cercanía a centros de salud (ideal para sector médico), el valor ronda los **USD 2.300 / m²**.

        ## La "Nueva Ola" en Expansión: Este y Oeste
        - **La Blanqueada:** Es, a nivel de rentabilidad pura, "el nuevo Cordón". Precios competitivos (aprox. **USD 2.000 / m²**) pero con alquileres sumamente demandados que elevan el retorno sobre inversión (ROI).
        - **Ciudad de la Costa:** Empujada por el trabajo remoto, zonas como Carrasco Este o Avenida de las Américas están unificando el mercado suburbano. 

        ## Conclusión: ¿Por dónde empezar?
        Hacer el cálculo manual puede ser tedioso. En Barrio.uy utilizamos algoritmos paramétricos: cada vez que entras a ver una propiedad, te decimos si el precio que piden está "Acorde al Mercado", si está "Barato" o si está "Caro", basándonos en bases de datos actualizadas con las verdaderas operaciones de compraventa de la zona.`,
        date: "2026-02-21",
        author: "Data Analytics Team",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop",
        category: "Métricas",
        readTime: "8 min"
    },
    {
        slug: "alquilar-uruguay-garantias-cgn-anda-porto-seguro",
        title: "Alquilar en Uruguay: Garantías CGN vs ANDA vs Aseguradoras Privadas",
        excerpt: "Comparamos las garantías de alquiler más utilizadas en Uruguay para que sepas cuál te conviene, cuánto cuestan y cómo gestionarlas.",
        content: `Uno de los mayores obstáculos (y primeras preguntas) al momento de buscar alquiler en Uruguay es la clásica frase: *"¿Qué garantía aceptan?"*. Tener esto resulto antes de buscar tu próximo apartamento te ahorrará muchísimos dolores de cabeza. Vamos a analizar las tres grandes familias de garantías disponibles en 2026.

        ## 1. La Contaduría General de la Nación (CGN)
        Es la garantía pública por excelencia. La CGN retiene mes a mes el monto del alquiler directamente de tu liquidación de sueldo.
        - **Ventaja:** Muy valorada por los propietarios porque el cobro es casi automático y súper seguro. 
        - **Costo para el inquilino:** Retención del 3% del alquiler.
        - **Requisitos:** Tienes que ser empleado público o trabajar en una empresa privada que tenga convenio explícito con el SGA (Servicio de Garantía de Alquileres).
        - **Límites:** El valor del alquiler líquido no puede superar aprox. el 30%-40% de tus ingresos nominales.

        ## 2. ANDA (Asociación Nacional de Afiliados)
        El monstruo del mundo privado. Al igual que CGN, retienen de tu salario para pagarle al dueño.
        - **Ventaja para el dueño:** Absolutamente invulnerable. ANDA paga el día 10 del mes, pague o no el inquilino.
        - **Desventaja para el inquilino:** Es comparativamente cara. Como inquilino vas a pagar un ~3% del alquiler mensual de cargo administrativo, pero **además tenés que pagar la cuota social de ANDA** todos los meses. 
        - **Requisito:** Ser socio, tener 3 meses de antigüedad laboral y recibo de sueldo oficial.

        ## 3. Aseguradoras Privadas (Porto Seguro, Sura, Mapfre, BSE)
        El sistema más ágil y el que más ha crecido en los últimos 5 años impulsado por el público joven y extranjeros.
        - **¿Cómo funciona?** Pagás una póliza de seguro anual (que suele costar el valor de **un mes o un mes y medio de alquiler**). Listo. 
        - **Ventaja enorme:** Si tenés el dinero de frente y podés demostrar ingresos contables (incluso si sos empresa, extranjero residente o profesional independiente), el trámite sale en 48hs. No impacta en tu recibo de sueldo mes a mes.
        - **Costo:** El mencionado pago anual o financiado en cuotas con tarjeta de crédito.

        ## 4. El Nuevo Régimen: Alquiler Sin Garantía (LUC)
        Implementado mediante la Ley de Urgente Consideración, permite alquilar sin presentar garantía alguna.
        - El propietario y el inquilino pactan libremente, pero tiene reglas de desalojo **exprés** (mucho más rápidas si hay falta de pago u honorarios).
        - Es ideal para personas sanas financieramente pero "sin papeles locales" todavía.

        ## El Superpoder de Barrio.uy
        Para evitar frustraciones, hemos diseñado la plataforma de Barrio.uy para que puedas **filtrar la grilla de resultados exclusivamente por la garantía que vos tenés**. Si tienes Porto Seguro, filtra por Porto Seguro y te mostraremos únicamente los dueños o agencias dispuestos a cerrar trato contigo hoy mismo.`,
        date: "2026-02-22",
        author: "Equipo MiBarrio.uy",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
        category: "Guías",
        readTime: "7 min"
    }
];
