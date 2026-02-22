import { Metadata } from 'next'
import { FileText, Shield } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Política de Privacidad | Barrio.uy',
    description: 'Conocé cómo Barrio.uy protege y gestiona tus datos personales conforme a la Ley N° 18.331 de Uruguay.',
}

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Política de Privacidad</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">
                    <section>
                        <p className="font-medium">
                            Última actualización: <strong>{new Date().toLocaleDateString('es-UY')}</strong>
                        </p>
                        <p className="mt-4">
                            En Barrio.uy (en adelante, "la Plataforma", "nosotros", "nuestro"), respetamos tu privacidad y estamos comprometidos con la protección de tus datos personales, en estricto cumplimiento con la <strong>Ley N° 18.331 de Protección de Datos Personales y Acción de Habeas Data de la República Oriental del Uruguay</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Datos que recolectamos</h2>
                        <p className="mb-3">Para brindarte nuestros servicios, podemos recolectar y procesar la siguiente información:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Datos de contacto:</strong> Nombre, dirección de correo electrónico y número de teléfono, recolectados a través de formularios de consulta (leads) o creación de cuenta.</li>
                            <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas y tiempo de estadía, mediante cookies y herramientas de analítica (ej. Google Analytics, Vercel Analytics).</li>
                            <li><strong>Preferencias de búsqueda:</strong> Historial de búsquedas, propiedades marcadas como favoritas y filtros utilizados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Uso de la información</h2>
                        <p className="mb-3">Tus datos personales son utilizados exclusivamente para los siguientes fines:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Facilitar el contacto entre usuarios interesados (compradores/inquilinos) y los agentes inmobiliarios o propietarios que publican en la Plataforma.</li>
                            <li>Personalizar y mejorar tu experiencia de usuario en Barrio.uy.</li>
                            <li>Enviar comunicaciones relacionadas con tu cuenta, alertas de búsqueda activa o respuestas a tus consultas.</li>
                            <li>Analizar el tráfico y comportamiento para optimizar el rendimiento y la seguridad del sitio.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Compartición de datos</h2>
                        <p className="mb-3">
                            Barrio.uy actúa primariamente como un nexo. Al enviar una consulta (lead) sobre una propiedad específica, entiendes y consientes que <strong>tus datos de contacto serán compartidos con el agente inmobiliario o propietario</strong> responsable de dicha publicación para que puedan responder a tu solicitud.
                        </p>
                        <p>
                            Fuera de este caso de uso central, no vendemos, alquilamos ni comercializamos tus datos personales a terceros. Podemos compartir información anonimizada con proveedores de servicios de infraestructura (ej. alojamiento cloud, analítica web) que operan bajo estrictos acuerdos de confidencialidad.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Base de Datos Registrada</h2>
                        <p>
                            De conformidad con la Ley N° 18.331, la base de datos de Barrio.uy se encuentra registrada (o en proceso de registro) ante la Unidad Reguladora y de Control de Datos Personales (URCDP) de Uruguay.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Ejercicio de tus derechos</h2>
                        <p className="mb-3">
                            Como titular de los datos, tienes derecho a solicitar en cualquier momento el <strong>acceso, rectificación, actualización, inclusión o supresión</strong> de tus datos personales.
                        </p>
                        <p>
                            Para ejercer estos derechos, o si tienes cualquier duda sobre nuestra política de privacidad, puedes contactarnos a través del correo electrónico: <strong>privacidad@barrio.uy</strong>. Responderemos a tu solicitud en los plazos establecidos por la normativa vigente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">6. Seguridad</h2>
                        <p>
                            Implementamos medidas técnicas y organizativas de seguridad a nivel de industria para proteger tus datos contra acceso, alteración, divulgación o destrucción no autorizados.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
