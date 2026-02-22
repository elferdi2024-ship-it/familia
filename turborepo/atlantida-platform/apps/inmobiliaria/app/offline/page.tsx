"use client"

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-8">
                <span className="material-icons text-amber-600 dark:text-amber-400 text-5xl">wifi_off</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                Sin Conexión
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
                No tenés conexión a internet en este momento. Revisá tu WiFi o datos móviles e intentá de nuevo.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
                Reintentar
            </button>
        </div>
    )
}
