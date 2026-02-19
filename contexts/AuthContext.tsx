"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import {
    onAuthStateChanged,
    User,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Auth } from "firebase/auth"

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
        if (!auth) {
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
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error("Error signing in with Google:", error)
            if ((error as { code?: string }).code === 'auth/unauthorized-domain') {
                console.error("This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase Console.")
            }
            throw error
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        if (!auth) throw new Error("El servicio de autenticación no está disponible.")
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.error("Error signing in with Email:", error)
            throw error
        }
    }

    const registerWithEmail = async (email: string, password: string, name: string) => {
        if (!auth) throw new Error("El servicio de autenticación no está disponible.")
        try {
            await createUserWithEmailAndPassword(auth, email, password)
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
        if (!auth?.currentUser) throw new Error("No hay usuario autenticado")
        try {
            await updateProfile(auth.currentUser, profileData)
            if (auth.currentUser) {
                setUser({ ...auth.currentUser } as User)
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            throw error
        }
    }

    const logout = async () => {
        if (!auth) throw new Error("El servicio de autenticación no está disponible.")
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
