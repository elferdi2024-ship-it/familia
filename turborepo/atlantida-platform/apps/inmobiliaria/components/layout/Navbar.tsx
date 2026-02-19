"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { Instagram, Phone, MessageCircle } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(!isHomePage)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const navLinks = [
    { href: "/search", label: "Propiedades" },
    { href: "/servicios", label: "Servicios" },
    { href: "/vender", label: "Vender" },

    { href: "/favorites", label: "Favoritos" },
    { href: "/blog", label: "Blog" },
    ...(user ? [{ href: "/my-properties", label: "Mis Publicaciones" }] : []),
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? "bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 py-3 shadow-sm"
      : "bg-transparent py-0"
      }`}>
      {/* Top Contact Bar */}
      <div className={`transition-all duration-500 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-10 opacity-100 bg-slate-900/40 backdrop-blur-sm border-b border-white/10"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between text-white/80">
          <div className="flex items-center gap-6">
            <a href="tel:+59899123456" className="flex items-center gap-2 text-[11px] font-bold tracking-widest hover:text-white transition-colors group">
              <Phone className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span>+598 99 123 456</span>
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://wa.me/59899123456" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold tracking-widest hover:text-white transition-colors group">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">WHATSAPP</span>
            </a>
            <div className="w-px h-3 bg-white/10"></div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-bold tracking-widest hover:text-white transition-colors group">
              <Instagram className="w-3.5 h-3.5 text-[#E4405F] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">INSTAGRAM</span>
            </a>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "" : "py-5"}`}>
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/mibarrio-isotype.png"
              alt="MiBarrio.uy"
              className={`h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-110 ${!isScrolled ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] brightness-0 invert" : ""}`}
            />
          </Link>
          <div className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "#" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  className={`relative px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${isActive
                    ? isScrolled ? "text-primary bg-primary/5" : "text-white bg-white/10"
                    : isScrolled
                      ? "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-primary/5"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  href={link.href}
                >
                  {link.label}
                  {link.href === "/blog" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  )}
                  {isActive && (
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${isScrolled ? "bg-primary" : "bg-white"}`}></span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link href="/publish" className={`px-5 py-2 text-sm font-bold transition-colors rounded-lg ${pathname.startsWith("/publish")
                ? isScrolled ? "text-primary bg-primary/5" : "text-white bg-white/10"
                : isScrolled
                  ? "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-primary/5"
                  : "text-white/90 hover:text-white hover:bg-white/10"
                }`}>
                Publicar
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`px-5 py-2 text-sm font-bold transition-colors rounded-lg ${isScrolled
                  ? "text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-primary/5"
                  : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
              >
                Publicar
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold leading-none capitalize ${isScrolled ? "text-slate-900 dark:text-white" : "text-white underline underline-offset-4 decoration-primary/50"}`}>{user.displayName?.split(' ')[0]}</span>
                  <button onClick={logout} className={`text-[10px] font-bold transition-colors uppercase tracking-wider ${isScrolled ? "text-slate-400 hover:text-primary" : "text-white/60 hover:text-white"}`}>Salir</button>
                </div>
                <Link href="/my-properties" className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden bg-slate-100 hover:border-primary transition-all">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-icons flex items-center justify-center h-full text-slate-400">person</span>
                  )}
                </Link>
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
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="material-icons" aria-hidden="true">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" role="navigation" aria-label="Menú móvil" className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-primary/10 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-6 gap-6 font-bold uppercase tracking-wider">
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/search">Propiedades</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/servicios">Servicios</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/vender">Vender mi Propiedad</Link>

            {user && (
              <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary" href="/my-properties">Mis Publicaciones</Link>
            )}
            <Link onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary flex items-center justify-between" href="/blog">
              Blog Inmobiliario
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded-full">NUEVO</span>
            </Link>
            <div className="h-px bg-primary/10"></div>
            {user ? (
              <Link onClick={() => setIsMobileMenuOpen(false)} className="text-primary" href="/publish">Publicar Propiedad</Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setShowAuthModal(true)
                }}
                className="text-primary text-left"
              >
                Publicar Propiedad
              </button>
            )}

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
