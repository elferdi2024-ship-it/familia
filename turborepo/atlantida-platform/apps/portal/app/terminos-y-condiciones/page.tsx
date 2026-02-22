import { Metadata } from 'next'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Términos y Condiciones | MiBarrio.uy',
    description: 'Condiciones de uso para agentes inmobiliarios y desarrolladores en MiBarrio.uy.',
}

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Scale className="w-6 h-6 text-amber-500" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Términos y Condiciones (Agentes)</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">

                    <section>
                        <p className="font-medium">
                            Última actualización: <strong>{new Date().toLocaleDateString('es-UY')}</strong>
                        </p>
                        <p className="mt-4">
                            Estos Términos y Condiciones regulan el uso de la plataforma <strong>MiBarrio.uy</strong> para agentes inmobiliarios, desarrolladores y propietarios independientes (en adelante, "el Anunciante").
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Publicación de Contenidos</h2>
                        <p>
                            El Anunciante es el <strong>único responsable</strong> por la veracidad, exactitud y legalidad de las propiedades publicadas en la plataforma, incluyendo precios, áreas, descripciones y el estado de exclusividad.
                        </p>
                        <p className="mt-2 text-rose-600 dark:text-rose-400 font-bold">
                            Está terminantemente prohibido publicar propiedades que ya hayan sido vendidas o alquiladas con el fin de retener leads ("bait and switch"). MiBarrio.uy se reserva el derecho de suspender o eliminar cuentas que incurran en estas prácticas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Propiedad Intelectual e Imágenes</h2>
                        <p>
                            Al subir fotografías, planos o renders, el Anunciante declara tener los derechos de autor correspondientes u ostentar la autorización expresa del creador de la imagen (Ley N° 17.616).
                        </p>
                        <p className="mt-2 text-rose-600 dark:text-rose-400 font-bold">
                            MiBarrio.uy no tolerará el "robo" de fotografías con marcas de agua de portales de la competencia y procederá a bajar las publicaciones reportadas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Ausencia de Comisión Intermediaria</h2>
                        <p>
                            MiBarrio.uy funciona bajo un modelo de suscripción (Freemium/SaaS) o pago por funcionalidades destacadas. <strong>No cobramos comisiones</strong> generadas por la concreción de ventas o alquileres originadas a través de nuestros leads, ni actuamos como corredor inmobiliario.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Cancelación de Suscripciones</h2>
                        <p>
                            En caso de tener una suscripción activa (Plan Pro), el Anunciante podrá cancelarla en cualquier momento desde su panel de control. El acceso a las funcionalidades Premium se mantendrá hasta el final del ciclo de facturación pagado, sin reembolsos prorrateados por cancelaciones a mitad de mes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Jurisdicción</h2>
                        <p>
                            Cualquier conflicto derivado de estos Términos será resuelto por los tribunales ordinarios de la ciudad de Montevideo, conforme a la legislación de la República Oriental del Uruguay.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
