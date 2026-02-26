import { Metadata } from "next"
import { Shield } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Aviso Legal | Barrio.uy",
    description: "Propiedad intelectual, derechos de autor y aviso legal de la plataforma Barrio.uy.",
}

export default function AvisoLegalPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Aviso Legal</h1>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">

                    <section>
                        <p className="font-medium">
                            Última actualización: <strong>{new Date().toLocaleDateString("es-UY")}</strong>
                        </p>
                        <p className="mt-4">
                            El presente Aviso Legal regula la propiedad intelectual y el uso del software y la plataforma <strong>Barrio.uy</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">1. Propiedad del software y plataforma</h2>
                        <p>
                            El software, código fuente, diseño, arquitectura, bases de datos, algoritmos y toda la tecnología que compone <strong>Atlantida Platform</strong> (incluyendo Barrio.uy y cualquier producto derivado) son propiedad exclusiva de Atlantida Platform y/o sus titulares.
                        </p>
                        <p className="mt-4 text-rose-600 dark:text-rose-400 font-bold">
                            Queda terminantemente prohibido: copiar, reproducir, distribuir o modificar el código fuente sin autorización expresa; realizar ingeniería inversa o descompilar el software; crear obras derivadas sin licencia; extraer datos o lógica de negocio para replicar la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">2. Marcas y signos distintivos</h2>
                        <p>
                            Los nombres <strong>Barrio.uy</strong>, <strong>Atlantida Platform</strong> y los logotipos asociados son marcas registradas o en proceso de registro. Su uso no autorizado constituye infracción.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">3. Fase beta</h2>
                        <p>
                            La plataforma se encuentra en fase beta. El acceso y uso están sujetos a los <Link href="/terminos-y-condiciones" className="text-primary font-semibold hover:underline">Términos y Condiciones</Link> vigentes. Nos reservamos el derecho de modificar, suspender o restringir el servicio sin previo aviso durante esta etapa.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">4. Jurisdicción</h2>
                        <p>
                            Cualquier controversia derivada de este aviso legal será resuelta por los tribunales competentes de Montevideo, República Oriental del Uruguay, conforme a la legislación uruguaya.
                        </p>
                    </section>

                    <p className="text-sm text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
                        © 2024-2025 Atlantida Platform. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    )
}
