"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

type AuthMode = "login" | "register"

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth()
    const [mode, setMode] = useState<AuthMode>("login")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Form State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError(null)
        try {
            await loginWithGoogle()
            onClose()
        } catch (err: any) {
            console.error("Error Google sign-in:", err?.code, err?.message, err)
            const code = err?.code
            if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
                setError("Cerraste la ventana de Google. Volvé a intentar si querés ingresar.")
            } else if (code === "auth/unauthorized-domain") {
                setError("Este sitio no está autorizado para ingresar con Google. Contactá al administrador.")
            } else if (code === "auth/account-exists-with-different-credential") {
                setError("Este correo ya está registrado con email y contraseña. Usá esa opción para ingresar.")
            } else if (code === "auth/network-request-failed") {
                setError("Error de conexión. Revisá tu internet e intentá de nuevo.")
            } else {
                setError(err?.message || "No se pudo iniciar sesión con Google. Intentalo de nuevo.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (mode === "login") {
                await loginWithEmail(email, password)
            } else {
                if (!name) {
                    throw new Error("El nombre es requerido para registrarse.")
                }
                await registerWithEmail(email, password, name)
            }
            onClose()
        } catch (err: any) {
            console.error(err)
            // Firebase Error Mapping
            if (err.code === "auth/invalid-credential") {
                setError("Email o contraseña incorrectos.")
            } else if (err.code === "auth/email-already-in-use") {
                setError("Este email ya está registrado.")
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.")
            } else {
                setError(err.message || "Ocurrió un error. Intentalo de nuevo.")
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setMode(mode === "login" ? "register" : "login")
        setError(null)
    }

    // Portal Mounting Effect
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Scroll Lock Effect
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!mounted) return null

    // We render into document.body to avoid stacking context issues
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    {/* Modal Container - Scrollable Wrapper */}
                    <div className="fixed inset-0 z-[10000] overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800 relative my-8"
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                                {mode === "login" ? "Bienvenido" : "Crear Cuenta"}
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                {mode === "login" ? "Ingresá para continuar" : "Registrate para guardar favoritos"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        >
                                            <span className="material-icons">close</span>
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading && !email ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                                {mode === "login" ? "Ingresar con Google" : "Registrarse con Google"}
                                            </>
                                        )}
                                    </button>

                                    <div className="relative my-6 text-center">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                                        </div>
                                        <span className="relative px-4 bg-white dark:bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-widest">O con mail</span>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {mode === "register" && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre</label>
                                                <input
                                                    type="text"
                                                    placeholder="Tu nombre completo"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                                            <input
                                                type="email"
                                                placeholder="tu@email.com"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contraseña</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                mode === "login" ? "Ingresar" : "Crear Cuenta"
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-slate-500 font-medium">
                                            {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}
                                            <button
                                                onClick={toggleMode}
                                                className="ml-2 text-primary hover:underline font-bold"
                                            >
                                                {mode === "login" ? "Registrate" : "Ingresá"}
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
