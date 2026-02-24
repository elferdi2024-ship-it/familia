import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Política de Privacidad | Barrio.uy",
    description:
        "Política de Privacidad de Barrio.uy. Conocé cómo recopilamos, usamos y protegemos tu información personal de acuerdo con la Ley N° 18.331 de Uruguay.",
    robots: { index: true, follow: true },
}

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-background-dark">
            <div className="max-w-3xl mx-auto px-6 py-16 pb-32">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 mb-10">
                    <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
                    <span>/</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Política de Privacidad</span>
                </nav>

                {/* Header */}
                <div className="mb-12">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                        Ley N° 18.331 — Uruguay
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Política de Privacidad
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Última actualización: Febrero 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-a:text-primary">

                    <p>
                        En <strong>Barrio.uy</strong> (en adelante "nosotros" o "la Plataforma") nos tomamos muy en serio la privacidad de nuestros usuarios (Buscadores, Propietarios y Agentes Inmobiliarios). Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información personal de acuerdo con la <strong>Ley N° 18.331 de Protección de Datos Personales y Acción de "Habeas Data"</strong> de la República Oriental del Uruguay.
                    </p>
                    <p>
                        Al utilizar nuestros servicios, usted acepta las prácticas descritas en este documento.
                    </p>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>1. Información que Recopilamos</h2>

                    <h3>1.1 Información que usted nos proporciona (Datos Activos)</h3>
                    <ul>
                        <li><strong>Registro de Usuarios:</strong> Nombre, dirección de correo electrónico, y datos derivados de la autenticación de terceros (ej. nombre, email y foto de perfil si inicia sesión mediante Google Auth).</li>
                        <li><strong>Perfiles de Agentes Inmobiliarios:</strong> Nombre de la empresa, teléfono de contacto, biografía, certificaciones o datos profesionales.</li>
                        <li><strong>Uso de Formularios de Contacto (Leads):</strong> Cuando usted como buscador contacta por una propiedad, recopilamos el nombre, email, número de teléfono (opcional) y el mensaje ingresado para hacérselo llegar al anunciante.</li>
                        <li><strong>Datos de Inmuebles:</strong> Direcciones, precios, fotografías e información descriptiva de las propiedades cargadas por los anunciantes.</li>
                    </ul>

                    <h3>1.2 Información recopilada automáticamente (Datos Pasivos)</h3>
                    <ul>
                        <li><strong>Datos de Navegación:</strong> Historial de propiedades vistas (favoritos, comparaciones), búsquedas guardadas, filtros más utilizados.</li>
                        <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo, tipo de dispositivo, duración de la sesión y páginas visitadas (usando Vercel Analytics).</li>
                        <li><strong>Cookies y Tecnologías Similares:</strong> Cookies propias para recordar preferencias (ej. Dark Mode) y mejorar la experiencia de uso.</li>
                    </ul>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>2. Uso de la Información</h2>
                    <ol>
                        <li><strong>Prestar el Servicio:</strong> Permitir la creación de cuenta, publicación de propiedades, y facilitar el contacto entre buscadores y anunciantes.</li>
                        <li><strong>Mejora del Producto:</strong> Analizar estadísticas agregadas (sin identificarlo personalmente) para optimizar velocidad, usabilidad y el algoritmo de búsquedas.</li>
                        <li><strong>Comunicaciones Operativas:</strong> Notificarle sobre nuevos Leads (en caso de ser agente), alertas de propiedades en favoritos que bajan de precio, o emails técnicos sobre su cuenta.</li>
                        <li><strong>Seguridad:</strong> Prevenir el fraude, el spam y verificar el comportamiento adecuado según nuestros Términos y Condiciones.</li>
                    </ol>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Barrio.uy NO vende, ni alquila bajo ningún concepto, las bases de datos de sus usuarios a terceros.
                    </p>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>3. Compartir Información a Terceros</h2>
                    <ul>
                        <li><strong>Al Anunciante:</strong> Si usted envía una consulta sobre una propiedad, sus datos de contacto serán compartidos únicamente con el Propietario o Agente responsable de ese anuncio.</li>
                        <li><strong>Proveedores Técnicos:</strong> Firebase (base de datos y autenticación), Vercel (alojamiento), Resend (correo transaccional). Estos proveedores actúan bajo normativas estrictas de protección de datos.</li>
                        <li><strong>Requerimiento Legal:</strong> Si la ley o un proceso legal formal dentro del territorio uruguayo nos obliga a divulgar información.</li>
                    </ul>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>4. Retención y Seguridad de Datos</h2>
                    <ul>
                        <li><strong>Almacenamiento Seguro:</strong> Infraestructura serverless de Google Cloud y Firebase Firestore. Transmisión cifrada (TLS 1.3 mínimo) y reglas de seguridad estrictas.</li>
                        <li><strong>Plazos de Retención:</strong> Conservaremos sus datos personales mientras mantenga activa su cuenta. Si solicita la eliminación, borraremos sus datos en un plazo razonable.</li>
                    </ul>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>5. Derechos ARCO (Uruguay)</h2>
                    <p>De acuerdo con la Ley N° 18.331, usted posee los siguientes derechos:</p>
                    <ul>
                        <li><strong>Acceso:</strong> Solicitar confirmación de si procesamos sus datos o pedir copia de los mismos.</li>
                        <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta.</li>
                        <li><strong>Cancelación/Supresión:</strong> Pedir que borremos su perfil y publicaciones.</li>
                        <li><strong>Oposición:</strong> Rechazar el uso de sus datos para fines no esenciales (ej. emails de marketing).</li>
                    </ul>
                    <p>Para ejercer cualquiera de estos derechos, contáctenos a: <a href="mailto:legal@barrio.uy">legal@barrio.uy</a>.</p>

                    <hr className="border-slate-200 dark:border-slate-700 my-8" />

                    <h2>6. Cookies y Almacenamiento Local</h2>
                    <p>
                        Barrio.uy utiliza <code>sessionStorage</code> y <code>localStorage</code> para mantener la sesión de Firebase activa, sincronizar favoritos y conservar el estado de formularios (wizard de publicación). Continuar usando el sitio implica la aceptación de estas tecnologías esenciales.
                    </p>

                    <h2>7. Cambios en esta Política</h2>
                    <p>
                        Esta Política puede ser modificada para mantenerse al día con cambios normativos o nuevas funcionalidades. Si aplicamos cambios sustantivos, le enviaremos un aviso por correo electrónico.
                    </p>
                </div>

                {/* CTA footer */}
                <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        ¿Tenés dudas sobre el manejo de tus datos personales?
                    </p>
                    <a
                        href="mailto:legal@barrio.uy"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Escribinos a legal@barrio.uy
                    </a>
                    <p className="text-xs text-slate-400 mt-4">
                        También podés consultar el registro de bases de datos en{" "}
                        <a href="https://www.urcdp.gub.uy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            urcdp.gub.uy
                        </a>
                    </p>
                </div>

                {/* Nav legal */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/terminos" className="text-xs text-slate-400 hover:text-primary transition-colors">
                        Ver Términos y Condiciones →
                    </Link>
                </div>
            </div>
        </main>
    )
}
