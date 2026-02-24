"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { useState } from "react"

const baseTabs = [
    { href: "/", icon: "home", label: "Inicio" },
    { href: "/search?filters=open", icon: "search", label: "Buscar" },
    { href: "/publish", icon: "add_circle", label: "Publicar" },
    { href: "/favorites", icon: "favorite", label: "Favoritos" },
    { href: "/my-properties", icon: "account_circle", label: "Perfil" },
]

export function BottomTabBar() {
    const pathname = usePathname()
    const { favorites } = useFavorites()
    const { user } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    // Hide on property detail pages - Definitively
    const isPropertyPage = pathname?.includes("/property/") || pathname?.startsWith("/property")

    if (isPropertyPage) {
        return null
    }

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-1">
                    {baseTabs.map(tab => {
                        const isActive = tab.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(tab.href)

                        const requiresAuth = tab.href === "/publish" || tab.href === "/my-properties"

                        const content = (
                            <>
                                {tab.icon === "account_circle" && user?.photoURL ? (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${isActive ? "border-primary" : "border-slate-300 dark:border-slate-600"}`}>
                                        <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <span className={`material-icons transition-all ${isActive ? "text-[26px]" : "text-[22px]"
                                        }`}>
                                        {tab.icon === "favorite" && isActive ? "favorite" :
                                            tab.icon === "favorite" ? "favorite_border" : tab.icon}
                                    </span>
                                )}

                                {/* Badge for favorites count */}
                                {tab.icon === "favorite" && favorites.length > 0 && (
                                    <span className="absolute -top-0.5 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                                        {favorites.length}
                                    </span>
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
        </>
    )
}
