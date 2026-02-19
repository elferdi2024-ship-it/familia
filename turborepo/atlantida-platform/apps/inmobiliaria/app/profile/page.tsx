"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useSavedSearches } from "@/contexts/SavedSearchesContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, loading, logout } = useAuth()
    const { favorites } = useFavorites()
    const { searches } = useSavedSearches()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark pt-24 md:pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {/* Profile Header */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-6xl text-slate-300 flex items-center justify-center h-full">person</span>
                                )}
                            </div>
                            <button className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                                <span className="material-icons text-xl">edit</span>
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{user.displayName || "Usuario de MiBarrio.uy"}</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{user.email}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Miembro Premium</span>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Validado ✅</span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="px-6 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link href="/favorites" className="group">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                    <span className="material-icons">favorite</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Mis Favoritos</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{favorites.length} propiedades guardadas</p>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                Accedé rápidamente a las casas y apartamentos que más te gustaron.
                            </p>
                            <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-2 transition-transform">
                                Ver favoritos <span className="material-icons ml-1">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    <Link href="/saved-searches" className="group">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    <span className="material-icons">search</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Mis Búsquedas</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{searches.length} búsquedas activas</p>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                Recibí alertas sobre propiedades que coinciden con tus filtros.
                            </p>
                            <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-2 transition-transform">
                                Ver búsquedas <span className="material-icons ml-1">chevron_right</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Account Settings Placeholder */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configuración del Perfil</h3>
                    </div>
                    <div className="p-4">
                        {[
                            { icon: "notifications", label: "Notificaciones por Email", value: "Activadas" },
                            { icon: "security", label: "Privacidad y Seguridad", value: "Gestionar" },
                            { icon: "language", label: "Idioma y Región", value: "Español (UY)" },
                            { icon: "help_outline", label: "Centro de Ayuda", value: "" },
                        ].map((item, i) => (
                            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <span className="material-icons text-slate-400 group-hover:text-primary transition-colors">{item.icon}</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400">{item.value}</span>
                                    <span className="material-icons text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
