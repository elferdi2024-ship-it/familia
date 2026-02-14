"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function PublishSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl text-center border border-slate-100 dark:border-slate-800"
            >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-green-600 dark:text-green-400 text-4xl">check_circle</span>
                </div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">¡Aviso Publicado!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    Tu propiedad ya está en proceso de revisión. En breve estará disponible para miles de compradores.
                </p>

                <div className="space-y-3">
                    <Link href="/my-properties" className="w-full block bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        Ir a Mis Propiedades
                    </Link>
                    <Link href="/" className="w-full block text-slate-500 font-bold py-4 hover:text-primary transition-colors">
                        Volver al Inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
