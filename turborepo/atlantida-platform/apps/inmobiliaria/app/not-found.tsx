import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-icons text-primary text-5xl">explore_off</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                404
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3">
                Pagina no encontrada
            </h2>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                Lo sentimos, la pagina que buscas no existe o fue movida.
                Intenta buscar propiedades o volver al inicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-[0.98] transition-all"
                >
                    Ir al Inicio
                </Link>
                <Link
                    href="/search"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Buscar Propiedades
                </Link>
            </div>
        </div>
    )
}
