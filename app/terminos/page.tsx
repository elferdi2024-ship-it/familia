import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Términos y Condiciones | Barrio.uy",
    description:
        "Términos y Condiciones de uso de Barrio.uy. Conocé las reglas que rigen el uso de nuestra plataforma inmobiliaria, conforme a la normativa uruguaya.",
    robots: { index: true, follow: true },
}

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-background-dark">
            <div className="max-w-3xl mx-auto px-6 py-16 pb-32">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-10">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Términos y Condiciones</span>
                </nav>

                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                        Ley N° 17.250 — Uruguay
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Términos y Condiciones de Uso
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Última actualización: Febrero 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-a:text-primary">

                    <p>
                        Bienvenido a <strong>Barrio.uy</strong> (en adelante, "la Plataforma", "nosotros", o "nuestro"). Al acceder y utilizar nuestro sitio web, aplicaciones móviles y servicios relacionados, usted acepta estar sujeto a los siguientes Términos y Condiciones de Uso. Si no está de acuerdo con estos Términos, no debe utilizar nuestros servicios.
                    </p>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>1. Naturaleza del Servicio</h2>
                    <p>
                        Barrio.uy es una plataforma tecnológica que facilita el encuentro entre personas que buscan comprar o alquilar bienes raíces (Usuarios Buscadores) y personas o empresas que ofrecen bienes raíces (Anunciantes).
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Nosotros NO somos una inmobiliaria, no intervenimos en las transacciones, no cobramos comisiones por la compra, venta o alquiler de las propiedades ofertadas.
                    </p>

                    <h2>2. Registro y Cuentas de Usuario</h2>
                    <ul>
                        <li><strong>Veracidad:</strong> Usted certifica que la información proporcionada durante el registro es precisa, actual y completa.</li>
                        <li><strong>Seguridad:</strong> Usted es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
                        <li><strong>Edad mínima:</strong> Debe ser mayor de 18 años, o tener capacidad legal para contratar según las leyes de la República Oriental del Uruguay.</li>
                    </ul>

                    <h2>3. Condiciones para Anunciantes (Agentes y Propietarios)</h2>
                    <p>Al publicar una propiedad, usted declara y garantiza que:</p>
                    <ol>
                        <li>Tiene el derecho legal de ofrecer, vender o alquilar la propiedad listada.</li>
                        <li>La información provista (precio, ubicación, metros cuadrados, características) es real y precisa.</li>
                        <li>Las fotografías y videos subidos corresponden a la propiedad en su estado actual.</li>
                        <li>Es su responsabilidad mantener actualizado el estado de la propiedad y responder a los Leads de forma profesional.</li>
                    </ol>

                    <h2>4. Conducta del Usuario</h2>
                    <p>Usted se compromete a no utilizar Barrio.uy para:</p>
                    <ul>
                        <li>Publicar contenido falso, difamatorio, obsceno, discriminatorio o ilícito.</li>
                        <li>Evadir las medidas de seguridad de la plataforma (ej. scraping de datos, ataques DDoS).</li>
                        <li>Enviar correos no solicitados o hacer uso indebido de las herramientas de contacto.</li>
                        <li>Suplantar la identidad de otra persona, agente o empresa.</li>
                    </ul>

                    <h2>5. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido generado por la plataforma (diseño, software, logotipos, textos de interfaz) es propiedad exclusiva de Barrio.uy. Los contenidos publicados por los Anunciantes (fotos, descripciones) siguen siendo propiedad de los mismos; al publicar, nos otorgan una licencia no exclusiva para mostrar dicho contenido con el fin de promocionar la propiedad.
                    </p>

                    <h2>6. Limitación de Responsabilidad</h2>
                    <ul>
                        <li><strong>Transacciones:</strong> No somos responsables de los contratos o acuerdos financieros que se realicen entre Buscadores y Anunciantes.</li>
                        <li><strong>Exactitud de la Oferta:</strong> No garantizamos la fidelidad de la aplicabilidad real de la Ley de Vivienda Promovida (Ley 18.795) o la aceptación de garantías específicas estipuladas por el Anunciante.</li>
                    </ul>

                    <h2>7. Planes Premium y Pagos</h2>
                    <p>
                        El uso básico de Barrio.uy es gratuito. En caso de ofrecer Planes Premium, los pagos se procesarán a través de pasarelas seguras (ej. Stripe). Las obligaciones impositivas se regirán por la ley uruguaya.
                    </p>

                    <h2>8. Modificaciones de los Términos</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación. Su uso continuado de la plataforma implica la aceptación de los nuevos términos.
                    </p>

                    <h2>9. Ley Aplicable y Jurisdicción</h2>
                    <p>
                        Estos términos se rigen e interpretan de acuerdo con las leyes de la República Oriental del Uruguay, en especial la Ley N° 17.250 de Defensa del Consumidor. Cualquier disputa será resuelta en los tribunales de la ciudad de Montevideo, Uruguay.
                    </p>
                </div>

                {/* CTA footer */}
                <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        ¿Tenés consultas legales?
                    </p>
                    <a
                        href="mailto:legal@barrio.uy"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Contactar a legal@barrio.uy
                    </a>
                </div>

                {/* Nav legal */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/privacidad" className="text-xs text-slate-400 hover:text-primary transition-colors">
                        ← Ver Política de Privacidad
                    </Link>
                </div>
            </div>
        </main>
    )
}
