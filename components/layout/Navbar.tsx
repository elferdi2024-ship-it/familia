"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/search", label: "Propiedades" },
    { href: "/compare", label: "Comparar" },
    { href: "/favorites", label: "Favoritos" },
    { href: "/saved-searches", label: "Búsquedas" },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? "bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 py-3"
      : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-extrabold tracking-tighter text-primary group-hover:scale-105 transition-transform">
              DOMINIO<span className="text-slate-400 font-light">TOTAL</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "#" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  className={`relative px-4 py-2 rounded-lg transition-all ${isActive
                    ? "text-primary bg-primary/5"
                    : "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-primary/5"
                    }`}
                  href={link.href}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/publish" className={`px-5 py-2 text-sm font-bold transition-colors rounded-lg ${pathname.startsWith("/publish")
              ? "text-primary bg-primary/5"
              : "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-primary/5"
              }`}>
              Publicar
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-none capitalize">{user.displayName?.split(' ')[0]}</span>
                  <button onClick={logout} className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-wider">Salir</button>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden bg-slate-100">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-icons flex items-center justify-center h-full text-slate-400">person</span>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-[0.98] transition-all"
              >
                Ingresar
              </button>
            )}
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary/5 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-primary/10 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6 font-bold uppercase tracking-wider">
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/search">Propiedades</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/compare">Comparar</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="#">Servicios</Link>
            <div className="h-px bg-primary/10"></div>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="text-primary" href="/publish">Publicar Propiedad</Link>

            {user ? (
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 overflow-hidden bg-slate-100">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons flex items-center justify-center h-full text-slate-400">person</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{user.displayName}</p>
                    <button onClick={logout} className="text-xs font-bold text-primary">Cerrar sesión</button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setShowAuthModal(true)
                }}
                className="bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20"
              >
                Ingresar a mi cuenta
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  )
}
