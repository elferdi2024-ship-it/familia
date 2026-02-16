"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore"

interface FavoritesContextType {
    favorites: string[]
    toggleFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = "atlantida_favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([])
    const [loaded, setLoaded] = useState(false)
    const { user } = useAuth()

    // 1. Initial load from localStorage (Guest mode)
    useEffect(() => {
        if (!user) {
            try {
                const stored = localStorage.getItem(STORAGE_KEY)
                if (stored) setFavorites(JSON.parse(stored))
            } catch { }
            setLoaded(true)
        }
    }, [user])

    // 2. Real-time sync with Firestore (User mode)
    useEffect(() => {
        if (!user || !db) return

        const docRef = doc(db, "users", user.uid)

        // Listen to changes in Firestore
        const unsubscribe = onSnapshot(docRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data()
                const cloudFavorites = data.favorites || []

                // On first load with user, check if we need to merge local favorites
                const localStored = localStorage.getItem(STORAGE_KEY)
                if (localStored) {
                    const localFavorites = JSON.parse(localStored)
                    const merged = Array.from(new Set([...cloudFavorites, ...localFavorites]))

                    if (merged.length > cloudFavorites.length) {
                        await setDoc(docRef, { favorites: merged }, { merge: true })
                        localStorage.removeItem(STORAGE_KEY)
                        setFavorites(merged)
                    } else {
                        setFavorites(cloudFavorites)
                    }
                } else {
                    setFavorites(cloudFavorites)
                }
            } else {
                // Initialize user document if it doesn't exist
                const localStored = localStorage.getItem(STORAGE_KEY)
                const initialFavorites = localStored ? JSON.parse(localStored) : []
                await setDoc(docRef, { favorites: initialFavorites }, { merge: true })
                if (localStored) localStorage.removeItem(STORAGE_KEY)
                setFavorites(initialFavorites)
            }
            setLoaded(true)
        })

        return () => unsubscribe()
    }, [user])

    // 3. Persist to localStorage (Only for guests)
    useEffect(() => {
        if (loaded && !user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
            } catch (error) {
                if ((error as DOMException)?.name === 'QuotaExceededError') {
                    console.warn('localStorage quota exceeded for favorites')
                }
            }
        }
    }, [favorites, loaded, user])

    const toggleFavorite = useCallback(async (id: string) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(x => x !== id)
            : [...favorites, id]

        setFavorites(newFavorites)

        if (user && db) {
            const docRef = doc(db, "users", user.uid)
            await setDoc(docRef, { favorites: newFavorites }, { merge: true })
        }
    }, [favorites, user])

    const isFavorite = useCallback((id: string) => {
        return favorites.includes(id)
    }, [favorites])

    const clearFavorites = useCallback(() => {
        setFavorites([])
    }, [])

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext)
    if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider")
    return ctx
}
