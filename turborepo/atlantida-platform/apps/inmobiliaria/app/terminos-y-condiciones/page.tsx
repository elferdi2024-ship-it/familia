import { Metadata } from 'next'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Términos y Condiciones | Barrio.uy',
    description: 'Conocé las reglas de uso y las responsabilidades al utilizar la plataforma Barrio.uy.',
}

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Scale className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Términos y Condiciones</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">

                    <section>
                        <p className="font-medium">
                            Última actualización: <strong>{new Date().toLocaleDateString('es-UY')}</strong>
                        </p>
                        <p className="mt-4">
                            Te damos la bienvenida a Barrio.uy. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes Términos y Condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no utilices la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Naturaleza del Servicio</h2>
                        <p>
                            Barrio.uy es una plataforma tecnológica que <strong>actúa exclusivamente como un espacio virtual intermediario</strong>. Nuestro servicio conecta a usuarios interesados en inmuebles con agentes inmobiliarios, desarrolladores y propietarios independientes que publican sus anuncios.
                        </p>
                        <p className="mt-2">
                            <strong>Barrio.uy NO es una inmobiliaria</strong>, no participa en las negociaciones comerciales, no cobra comisiones por transacción inmobiliaria y no actúa como agente de retención o intermediario financiero.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Publicaciones y Exactitud de la Información</h2>
                        <p className="mb-3">
                            Toda la información sobre los inmuebles (precios, descripciones, disponibilidad, métricas de "Vivienda Promovida" y fotografías) <strong>es suministrada exclusivamente por los anunciantes</strong>.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Barrio.uy no asegura ni audita la veracidad, exactitud o legalidad de las publicaciones.</li>
                            <li>El usuario comprador o inquilino tiene la responsabilidad exclusiva de corroborar la información, situación registral y jurídica del inmueble antes de realizar cualquier adelanto de dinero o firmar un contrato.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Propiedad Intelectual de Contenidos</h2>
                        <p>
                            Al subir fotografías, textos o videos a la plataforma, el anunciante declara y garantiza ser el titular de los derechos de autor (Ley N° 17.616) o contar con la licencia requerida para su uso comercial. El anunciante otorga a Barrio.uy una licencia no exclusiva para reproducir y mostrar dicho contenido dentro del contexto de la plataforma.
                        </p>
                        <p className="mt-2">
                            Barrio.uy se reserva el derecho de eliminar cualquier contenido que a su exclusivo criterio vulnere derechos de terceros o resulte ofensivo/ilegal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Límites de Responsabilidad</h2>
                        <p>
                            Barrio.uy no será responsable por:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Daños, perjuicios o pérdidas sufridas por transacciones frustradas, fraudes o engaños cometidos por terceros anunciantes o usuarios.</li>
                            <li>Lucro cesante resultante del uso o incapacidad de uso de la plataforma.</li>
                            <li>Caídas del servicio, ataques de ransomware a infraestructura cloud, o errores temporales de software.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Datos Personales</h2>
                        <p>
                            El uso de datos personales está regido por nuestra <a href="/privacidad" className="text-primary hover:underline font-bold">Política de Privacidad</a>, alineada a la normativa uruguaya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">6. Modificaciones y Ley Aplicable</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos Términos en cualquier momento. El uso continuado del sitio implicará la aceptación de dichos cambios.
                        </p>
                        <p className="mt-2">
                            Estos términos se rigen por las leyes de la República Oriental del Uruguay. Cualquier controversia será sometida a los tribunales competentes de la ciudad de Montevideo.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
