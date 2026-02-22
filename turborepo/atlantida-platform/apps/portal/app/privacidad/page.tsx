import { Metadata } from 'next'
import { FileText, Shield } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Política de Privacidad | MiBarrio.uy',
    description: 'Conocé cómo MiBarrio.uy protege y gestiona los datos de los agentes inmobiliarios conforme a la Ley N° 18.331.',
}

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Política de Privacidad</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">
                    <section>
                        <p className="font-medium">
                            Última actualización: <strong>{new Date().toLocaleDateString('es-UY')}</strong>
                        </p>
                        <p className="mt-4">
                            En MiBarrio.uy (el portal de gestión inmobiliaria de Barrio.uy), respetamos tu privacidad y estamos comprometidos con la protección de los datos de nuestros agentes y usuarios profesionales, en estricto cumplimiento con la <strong>Ley N° 18.331 de Protección de Datos Personales de la República Oriental del Uruguay</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Datos que recolectamos</h2>
                        <p className="mb-3">Para brindarte el servicio de plataforma (SaaS) y generación de leads, procesamos:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Datos de perfil profesional:</strong> Nombre, correo electrónico, teléfono, inmobiliaria vinculada, número de registro inmobiliario y foto de perfil.</li>
                            <li><strong>Datos de publicaciones:</strong> Información, fotos y ubicaciones de las propiedades que publicas en el portal para su difusión pública.</li>
                            <li><strong>Datos de pago (próximamente):</strong> Información de facturación procesada mediante plataformas de pago seguras (ej. Stripe). Nosotros no almacenamos los datos completos de tu tarjeta.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Uso de la información</h2>
                        <p className="mb-3">Tus datos como agente están destinados a:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Proporcionarte la funcionalidad del panel de administración y CRM interno.</li>
                            <li>Mostrar tu perfil de contacto al público general en Barrio.uy cuando alguien consulta una de tus propiedades.</li>
                            <li>Procesar cobros por suscripciones al servicio Pro.</li>
                            <li>Enviarte notificaciones inmediatas sobre nuevos leads interesados en tus propiedades.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Ejercicio de tus derechos</h2>
                        <p className="mb-3">
                            Puedes actualizar o rectificar los datos de tu perfil en cualquier momento desde el Dashboard. Para ejercer tus derechos de acceso, actualización, inclusión o supresión de datos conforme a la ley, puedes contactarnos en: <strong>privacidad@mibarrio.uy</strong>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
