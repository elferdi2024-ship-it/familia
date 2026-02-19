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
import { auth } from "@repo/lib/firebase"

interface AuthContextType {
    user: User | null
    loading: boolean
    loginWithGoogle: () => Promise<void>
    loginWithEmail: (email: string, password: string) => Promise<void>
    registerWithEmail: (email: string, password: string, name: string) => Promise<void>
    updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    loginWithEmail: async () => { },
    registerWithEmail: async () => { },
    updateUserProfile: async () => { },
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
            throw new Error("El servicio de autenticación no está disponible.")
        }
        const provider = new GoogleAuthProvider()
        try {
            // Reverting to popup as redirect is losing session state in this environment
            // COOP headers in next.config.ts should now allow this to work without 'popup-closed-by-user' error
            await signInWithPopup(auth, provider)
        } catch (error: any) {
            console.error("Error signing in with Google:", error)
            if (error.code === 'auth/unauthorized-domain') {
                console.error("This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase Console.")
            }
            throw error
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        if (!auth) throw new Error("Servicio de autenticación no disponible")
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error("Error signing in with Email:", error)
            throw error
        }
    }

    const registerWithEmail = async (email: string, password: string, name: string) => {
        if (!auth) throw new Error("Servicio de autenticación no disponible")
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
    const updateUserProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
        if (!auth || !auth.currentUser) throw new Error("No hay usuario autenticado")
        try {
            await updateProfile(auth.currentUser, profileData)
            // Trigger a refresh of the user state
            setUser({ ...auth.currentUser } as User)
        } catch (error) {
            console.error("Error updating profile:", error)
            throw error
        }
    }

    const logout = async () => {
        if (!auth) return
        try {
            await signOut(auth)
        } catch (error) {
            console.error("Error signing out:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, updateUserProfile, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
