"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import {
    onAuthStateChanged,
    User,
    signOut,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
    user: User | null
    loading: boolean
    loginWithGoogle: () => Promise<void>
    loginWithEmail: (email: string, password: string) => Promise<void>
    registerWithEmail: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    loginWithEmail: async () => { },
    registerWithEmail: async () => { },
    logout: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!auth || !auth.onAuthStateChanged) {
            setLoading(false)
            return
        }

        // Handle Redirect Result
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log("User signed in via redirect:", result.user)
                    alert(`¡Éxito! Volviste de Google como: ${result.user.email}`) // Debug success
                } else {
                    console.log("No redirect result found.")
                    alert("Alerta de Depuración: Volviste a la página, pero 'getRedirectResult' devolvió NULL. La sesión no se recuperó.")
                }
            })
            .catch((error) => {
                console.error("Error handling redirect result:", error)
                alert(`Error al volver de Google: ${error.message}`)
            })

        let cancelled = false

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!cancelled) {
                setUser(currentUser)
                setLoading(false)
                if (currentUser) {
                    // alert(`AuthStateChanged detectó usuario: ${currentUser.email}`) // Debug auth state
                }
            }
        })

        return () => {
            cancelled = true
            unsubscribe()
        }
    }, [])

    const loginWithGoogle = async () => {
        if (!auth) {
            console.error("Firebase auth is not initialized. Check your .env.local configuration.")
            alert("Error: Firebase Auth no está inicializado. Faltan variables de entorno.") // Alert if auth missing
            throw new Error("El servicio de autenticación no está disponible.")
        }
        const provider = new GoogleAuthProvider()
        try {
            alert("Iniciando redirección a Google...") // Debug start of flow
            // Using redirect instead of popup for better mobile compatibility
            await signInWithRedirect(auth, provider)
        } catch (error: any) {
            console.error("Error signing in with Google:", error)
            alert(`Error al iniciar Google Login: ${error.message}`)
            if (error.code === 'auth/unauthorized-domain') {
                console.error("This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase Console.")
                alert("Dominio no autorizado en Firebase Console. Por favor agrégalo en Authentication > Settings > Authorized domains.")
            }
            throw error
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error("Error signing in with Email:", error)
            throw error
        }
    }

    const registerWithEmail = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                await sendEmailVerification(auth.currentUser)
            }
        } catch (error) {
            console.error("Error registering with Email:", error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error("Error signing out:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
