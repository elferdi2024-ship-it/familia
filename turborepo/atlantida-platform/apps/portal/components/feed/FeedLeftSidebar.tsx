"use client"

import Link from "next/link"
import { Trophy, PieChart, BadgeCheck, User2, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { db } from "@repo/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { CreatePostModal } from "./CreatePostModal"
import { AuthModal } from "@/components/auth/AuthModal"

export function FeedLeftSidebar() {
    const { user, loading } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)

    useEffect(() => {
        if (!user || !db) return

        const fetchProfile = async () => {
            try {
                const docSnap = await getDoc(doc(db!, "users", user.uid))
                if (docSnap.exists()) {
                    setProfile(docSnap.data())
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
            }
        }
        fetchProfile()
    }, [user])

    if (loading) {
        return (
            <aside className="hidden lg:flex flex-col w-72 shrink-0 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl sticky top-[80px] h-[300px] overflow-hidden shadow-sm items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            </aside>
        )
    }

    if (!user) {
        return (
            <aside className="hidden lg:flex flex-col w-72 shrink-0 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl sticky top-[80px] h-fit overflow-hidden shadow-sm">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                        <User2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">Únete a Barrio.uy</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">Inicia sesión para publicar en el feed, compartir tus listados y conectar con otros agentes.</p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <LogIn className="w-4 h-4" /> Iniciar Sesión
                    </button>
                </div>
                <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </aside>
        )
    }

    return (
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-black rounded-xl sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto custom-scroll">
            {/* Social Profile Section */}
            <div className="relative pb-0 border-b border-slate-200 dark:border-slate-800">
                {/* Cover Image */}
                <div className="h-24 bg-slate-900 relative overflow-hidden object-cover">
                    {profile?.coverPhotoURL ? (
                        <img src={profile.coverPhotoURL} alt="Cover" className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-800"></div>
                    )}
                </div>

                {/* Avatar */}
                <div className="absolute top-10 left-4">
                    <div className={`relative w-24 h-24 rounded-full border-4 border-white dark:border-black overflow-hidden bg-slate-100 dark:bg-slate-900 ring-2 ring-offset-2 dark:ring-offset-black ${profile?.plan === 'elite' ? 'ring-purple-500 shadow-xl shadow-purple-500/20' :
                            profile?.plan === 'pro' ? 'ring-emerald-500 shadow-2xl shadow-emerald-500/20' :
                                'ring-transparent'
                        }`}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || "Avatar"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User2 className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Badges Top Right */}
                <div className="mt-2 text-right pr-4 h-7 flex justify-end">
                    {profile?.agency && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-black text-[11px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
                            {profile.agency}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="px-4 mt-7 pb-5">
                    <div className="flex flex-col leading-tight mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-xl text-slate-900 dark:text-white truncate tracking-tight" title={user.displayName || "Agente"}>
                                {user.displayName || "Agente"}
                            </h3>
                            {(profile?.plan === 'elite' || profile?.plan === 'pro') && (
                                <BadgeCheck className={`w-6 h-6 shrink-0 ${profile?.plan === 'elite' ? 'text-purple-500' : 'text-emerald-500'
                                    }`} />
                            )}
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">
                            @{user.displayName?.toLowerCase().replace(/\s+/g, '') || "agente"}
                        </p>
                    </div>

                    {profile?.bio && (
                        <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-normal mb-3">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 mt-1.5">
                        <div className="flex items-baseline gap-1.5 cursor-pointer hover:underline">
                            <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-none">{profile?.followersCount || 0}</span>
                            <span className="text-[12px] text-slate-500">Siguiendo</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 cursor-pointer hover:underline">
                            <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-none">{profile?.listingCount || 0}</span>
                            <span className="text-[12px] text-slate-500">Listados</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="px-3 py-3 flex flex-col gap-1.5 w-full flex-grow">
                <Link href="/my-properties" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group w-full">
                    <PieChart className="w-6 h-6" strokeWidth={2} />
                    <span className="text-[15px] font-semibold shrink-0 tracking-tight">Dashboard</span>
                </Link>
                <Link href="/ranking" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group w-full">
                    <Trophy className="w-6 h-6" strokeWidth={2} />
                    <span className="text-[15px] font-semibold shrink-0 tracking-tight">Ranking</span>
                </Link>

                <div className="mt-6 px-1 w-full">
                    <h4 className="font-semibold text-[15px] text-slate-900 dark:text-white mb-3 tracking-tight">Barrios en tendencia</h4>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-lg px-3 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[12px] text-slate-500">Montevideo</span>
                                <span className="font-semibold text-[14px] dark:text-white">Pocitos</span>
                                <span className="text-[12px] text-slate-500">2,400 publicaciones</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-lg px-3 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[12px] text-slate-500">Montevideo</span>
                                <span className="font-semibold text-[14px] dark:text-white">Cordón</span>
                                <span className="text-[12px] text-slate-500">1,820 publicaciones</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-lg px-3 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[12px] text-slate-500">Tendencias</span>
                                <span className="font-semibold text-[14px] dark:text-white">#InvertirEnPozo</span>
                                <span className="text-[12px] text-slate-500">950 interacciones</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mx-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm py-3 rounded-lg transition-all hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95"
                >
                    Postear
                </button>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-5 text-[10px] text-slate-400 font-medium">
                    <Link href="#" className="hover:underline">Ayuda</Link>
                    <Link href="#" className="hover:underline">Políticas</Link>
                    <Link href="#" className="hover:underline">Privacidad</Link>
                    <p className="w-full text-center mt-2">© 2024 Barrio.uy</p>
                </div>
            </div>

            <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </aside>
    )
}
