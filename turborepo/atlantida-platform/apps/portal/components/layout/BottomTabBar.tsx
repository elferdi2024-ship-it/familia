"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { useRef, useState } from "react"
import { Home, Search, CircleUser, Rss, SquarePen, Flame, BriefcaseBusiness } from "lucide-react"
import { CreatePostModal } from "@/components/feed/CreatePostModal"

const baseTabs = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/search?filters=open", icon: Search, label: "Buscar" },
    { href: "/feed", icon: Rss, label: "Feed" },
    { href: "/publish", icon: SquarePen, label: "Publicar" },
    { href: "/my-properties", icon: CircleUser, label: "Perfil" },
]

export function BottomTabBar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showFeedQuickActions, setShowFeedQuickActions] = useState(false)
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const feedLongPressTriggeredRef = useRef(false)

    // Hide on property detail pages - Definitively
    const isPropertyPage = pathname?.includes("/property/") || pathname?.startsWith("/property")

    if (isPropertyPage) {
        return null
    }

    const startFeedLongPress = () => {
        feedLongPressTriggeredRef.current = false
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
        }
        longPressTimerRef.current = setTimeout(() => {
            feedLongPressTriggeredRef.current = true
            setShowFeedQuickActions(true)
        }, 450)
    }

    const clearFeedLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
            longPressTimerRef.current = null
        }
    }

    const handleFeedPrimaryTap = () => {
        if (feedLongPressTriggeredRef.current) return
        router.push("/feed")
    }

    return (
        <>
            {showFeedQuickActions && (
                <>
                    <button
                        aria-label="Cerrar acciones rápidas del feed"
                        className="md:hidden fixed inset-0 z-[70] bg-black/20 backdrop-blur-[1px]"
                        onClick={() => setShowFeedQuickActions(false)}
                    />
                    <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-20 z-[80] w-[92%] max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-2 shadow-2xl">
                        <button
                            onClick={() => {
                                setShowFeedQuickActions(false)
                                if (!user) {
                                    setShowAuthModal(true)
                                    return
                                }
                                setIsCreatePostOpen(true)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-900 dark:text-slate-100"
                        >
                            <SquarePen className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">Publicar en el feed</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowFeedQuickActions(false)
                                router.push("/feed?filter=trending")
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-900 dark:text-slate-100"
                        >
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-semibold">Ver tendencias</span>
                        </button>
                        <button
                            onClick={() => {
                                setShowFeedQuickActions(false)
                                if (!user) {
                                    setShowAuthModal(true)
                                    return
                                }
                                router.push("/my-properties")
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-900 dark:text-slate-100"
                        >
                            <BriefcaseBusiness className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold">Mis publicaciones</span>
                        </button>
                    </div>
                </>
            )}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-1">
                    {baseTabs.map(tab => {
                        const isSearchTab = tab.href.startsWith("/search")
                        const isActive = tab.href === "/"
                            ? pathname === "/"
                            : isSearchTab
                                ? pathname.startsWith("/search")
                                : pathname.startsWith(tab.href)

                        const requiresAuth = tab.href === "/my-properties" || tab.href === "/publish"

                        const content = (
                            <>
                                {tab.icon === CircleUser && user?.photoURL ? (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${isActive ? "border-primary" : "border-slate-300 dark:border-slate-600"}`}>
                                        <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <tab.icon className={`transition-all ${isActive ? "w-6 h-6" : "w-5 h-5"}`} />
                                )}

                                <span className={`text-[9px] font-semibold leading-none mt-1 ${isActive ? "font-bold" : ""
                                    }`}>
                                    {tab.label}
                                </span>
                            </>
                        )

                        if (requiresAuth && !user) {
                            return (
                                <button
                                    key={tab.href}
                                    onClick={() => setShowAuthModal(true)}
                                    className={`relative flex flex-col items-center justify-center min-w-[64px] rounded-xl transition-all ${isActive
                                        ? "text-primary dark:text-white"
                                        : "text-slate-400 dark:text-slate-500"
                                        }`}
                                >
                                    {content}
                                </button>
                            )
                        }

                        if (tab.href === "/feed") {
                            return (
                                <button
                                    key={tab.href}
                                    onClick={handleFeedPrimaryTap}
                                    onTouchStart={startFeedLongPress}
                                    onTouchEnd={clearFeedLongPress}
                                    onTouchCancel={clearFeedLongPress}
                                    onMouseDown={startFeedLongPress}
                                    onMouseUp={clearFeedLongPress}
                                    onMouseLeave={clearFeedLongPress}
                                    className={`relative flex flex-col items-center justify-center min-w-[64px] rounded-xl transition-all ${isActive
                                        ? "text-primary dark:text-white"
                                        : "text-slate-400 dark:text-slate-500"
                                        }`}
                                >
                                    {content}
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`relative flex flex-col items-center justify-center min-w-[64px] rounded-xl transition-all ${isActive
                                    ? "text-primary dark:text-white"
                                    : "text-slate-400 dark:text-slate-500"
                                    }`}
                            >
                                {content}
                            </Link>
                        )
                    })}
                </div>
            </nav>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
        </>
    )
}
