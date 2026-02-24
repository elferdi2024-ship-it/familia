"use client"

import Link from "next/link"
import { Users, Handshake, Trophy, PieChart, Megaphone, FileText, Edit, BadgeCheck, User2, LogIn, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { db } from "@repo/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { CreatePostModal } from "./CreatePostModal"

export function FeedLeftSidebar() {
    const { user, loading } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const planName = profile?.plan === 'elite' ? 'Plan Elite' : profile?.plan === 'pro' ? 'Plan Pro' : 'Plan Free'
    const planColor = profile?.plan === 'elite' ? 'orange' : profile?.plan === 'pro' ? 'indigo' : 'slate'

    if (loading) {
        return (
            <aside className="hidden lg:flex flex-col w-72 shrink-0 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl sticky top-[80px] h-[300px] overflow-hidden shadow-sm items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
            </aside>
        )
    }

    if (!user) {
        return (
            <aside className="hidden lg:flex flex-col w-72 shrink-0 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl sticky top-[80px] h-fit overflow-hidden shadow-sm">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                        <User2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">Únete a Barrio.uy</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">Inicia sesión para publicar en el feed, compartir tus listados y conectar con otros agentes.</p>
                    <Link href="/login" className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        <LogIn className="w-4 h-4" /> Iniciar Sesión
                    </Link>
                </div>
            </aside>
        )
    }

    return (
        <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-black sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto custom-scroll">
            {/* Social Profile Section */}
            <div className="relative pb-0 border-b border-slate-200 dark:border-slate-800">
                {/* Cover Image */}
                <div className="h-28 bg-slate-900 relative overflow-hidden object-cover">
                    {profile?.coverPhotoURL ? (
                        <img src={profile.coverPhotoURL} alt="Cover" className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-800"></div>
                    )}
                </div>

                {/* Avatar */}
                <div className="absolute top-12 left-4">
                    <div className={`relative w-28 h-28 rounded-full border-4 border-white dark:border-black overflow-hidden bg-slate-100 dark:bg-slate-900 ring-2 ring-offset-4 dark:ring-offset-black ${profile?.plan === 'elite' ? 'ring-purple-500 shadow-2xl shadow-purple-500/30' :
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
                <div className="mt-2 text-right pr-4 h-8 flex justify-end">
                    {profile?.agency && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-black text-[11px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm">
                            {profile.agency}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="px-4 mt-8 pb-6">
                    <div className="flex flex-col leading-tight mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-2xl text-slate-900 dark:text-white truncate tracking-tight" title={user.displayName || "Agente"}>
                                {user.displayName || "Agente"}
                            </h3>
                            {(profile?.plan === 'elite' || profile?.plan === 'pro') && (
                                <BadgeCheck className={`w-6 h-6 shrink-0 ${profile?.plan === 'elite' ? 'text-purple-500' : 'text-emerald-500'
                                    }`} />
                            )}
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium">
                            @{user.displayName?.toLowerCase().replace(/\s+/g, '') || "agente"}
                        </p>
                    </div>

                    {profile?.bio && (
                        <p className="text-[14px] text-slate-800 dark:text-slate-300 leading-normal mb-4">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 mt-2">
                        <div className="flex items-baseline gap-1.5 cursor-pointer hover:underline">
                            <span className="text-[15px] font-bold text-slate-900 dark:text-white leading-none">{profile?.followersCount || 0}</span>
                            <span className="text-[14px] text-slate-500">Siguiendo</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 cursor-pointer hover:underline">
                            <span className="text-[15px] font-bold text-slate-900 dark:text-white leading-none">{profile?.listingCount || 0}</span>
                            <span className="text-[14px] text-slate-500">Listados</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="px-2 py-4 flex flex-col gap-1 w-full flex-grow">
                <Link href="/my-properties" className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors group w-fit">
                    <PieChart className="w-6 h-6" strokeWidth={2} />
                    <span className="text-xl shrink-0 tracking-tight">Dashboard</span>
                </Link>
                <Link href="/ranking" className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors group w-fit">
                    <Trophy className="w-6 h-6" strokeWidth={2} />
                    <span className="text-xl shrink-0 tracking-tight">Ranking</span>
                </Link>

                <div className="mt-8 px-4 w-full pr-10">
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-4 tracking-tight">Barrios en Tendencia</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 -mx-4 px-4 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[13px] text-slate-500">Tendencia en Montevideo</span>
                                <span className="font-bold text-[15px] dark:text-white">Pocitos</span>
                                <span className="text-[13px] text-slate-500">2,400 publicaciones</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 -mx-4 px-4 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[13px] text-slate-500">Tendencia en Montevideo</span>
                                <span className="font-bold text-[15px] dark:text-white">Cordón</span>
                                <span className="text-[13px] text-slate-500">1,820 publicaciones</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/50 -mx-4 px-4 py-2 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-[13px] text-slate-500">Tendencias Inmobiliarias</span>
                                <span className="font-bold text-[15px] dark:text-white">#InvertirEnPozo</span>
                                <span className="text-[13px] text-slate-500">950 interacciones</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-[90%] mx-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-[17px] py-4 rounded-full transition-all hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95"
                >
                    Postear
                </button>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-6 text-[10px] text-slate-400 font-medium">
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
