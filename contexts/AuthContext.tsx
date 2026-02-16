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

        let cancelled = false

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!cancelled) {
                setUser(currentUser)
                setLoading(false)
                if (currentUser) {
                    console.log("AuthStateChanged detectó usuario:", currentUser.email)
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
            alert("Error: Firebase Auth no está inicializado. Faltan variables de entorno.")
            throw new Error("El servicio de autenticación no está disponible.")
        }
        const provider = new GoogleAuthProvider()
        try {
            console.log("Intentando signInWithPopup...")
            // Reverting to popup as redirect is losing session state in this environment
            // COOP headers in next.config.ts should now allow this to work without 'popup-closed-by-user' error
            const result = await signInWithPopup(auth, provider)
            alert(`¡Éxito! Login correcto con: ${result.user.email}`)
        } catch (error: any) {
            console.error("Error signing in with Google:", error)
            alert(`Error al iniciar Google Login: ${error.message}`)
            if (error.code === 'auth/unauthorized-domain') {
                console.error("This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase Console.")
                alert("Dominio no autorizado en Firebase Console. Por favor agrégalo en Authentication > Settings > Authorized domains.")
            }
            if (error.code === 'auth/popup-closed-by-user') {
                alert("El popup se cerró antes de terminar. Si no lo cerraste tú, puede ser un bloqueador de ventanas emergentes.")
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
