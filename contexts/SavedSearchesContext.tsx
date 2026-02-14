"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"

const STORAGE_KEY = "dt_saved_searches"

export interface SavedSearch {
    id: string
    label: string
    operation: string
    propertyTypes: string[]
    query: string
    department: string
    city: string
    neighborhood: string
    priceMin: string
    priceMax: string
    bedrooms: string
    createdAt: string
}

interface SavedSearchesContextType {
    searches: SavedSearch[]
    saveSearch: (search: Omit<SavedSearch, "id" | "createdAt">) => void
    removeSearch: (id: string) => void
    clearSearches: () => void
}

const SavedSearchesContext = createContext<SavedSearchesContextType>({
    searches: [],
    saveSearch: () => { },
    removeSearch: () => { },
    clearSearches: () => { },
})

export const useSavedSearches = () => useContext(SavedSearchesContext)

export function SavedSearchesProvider({ children }: { children: ReactNode }) {
    const [searches, setSearches] = useState<SavedSearch[]>([])
    const [loaded, setLoaded] = useState(false)
    const { user } = useAuth()

    // 1. Initial load from localStorage (Guest mode)
    useEffect(() => {
        if (!user) {
            try {
                const stored = localStorage.getItem(STORAGE_KEY)
                if (stored) setSearches(JSON.parse(stored))
            } catch { }
            setLoaded(true)
        }
    }, [user])

    // 2. Real-time sync with Firestore (User mode)
    useEffect(() => {
        if (!user || !db) return

        const docRef = doc(db, "users", user.uid)

        const unsubscribe = onSnapshot(docRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data()
                const cloudSearches = data.savedSearches || []

                // Merge local searches if they exist
                const localStored = localStorage.getItem(STORAGE_KEY)
                if (localStored) {
                    const localSearches = JSON.parse(localStored)
                    // Simple merge by ID, cloud wins in case of conflicts
                    const existingIds = new Set(cloudSearches.map((s: SavedSearch) => s.id))
                    const toMerge = localSearches.filter((s: SavedSearch) => !existingIds.has(s.id))

                    if (toMerge.length > 0) {
                        const merged = [...cloudSearches, ...toMerge]
                        await setDoc(docRef, { savedSearches: merged }, { merge: true })
                        localStorage.removeItem(STORAGE_KEY)
                        setSearches(merged)
                    } else {
                        setSearches(cloudSearches)
                    }
                } else {
                    setSearches(cloudSearches)
                }
            } else {
                // Initialize
                const localStored = localStorage.getItem(STORAGE_KEY)
                const initial = localStored ? JSON.parse(localStored) : []
                await setDoc(docRef, { savedSearches: initial }, { merge: true })
                if (localStored) localStorage.removeItem(STORAGE_KEY)
                setSearches(initial)
            }
            setLoaded(true)
        })

        return () => unsubscribe()
    }, [user])

    // 3. Persist to localStorage (Guest only)
    useEffect(() => {
        if (loaded && !user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
        }
    }, [searches, loaded, user])

    const saveSearch = useCallback(async (search: Omit<SavedSearch, "id" | "createdAt">) => {
        const newSearch: SavedSearch = {
            ...search,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        }

        const newSearches = [newSearch, ...searches]
        setSearches(newSearches)

        if (user && db) {
            const docRef = doc(db, "users", user.uid)
            await setDoc(docRef, { savedSearches: newSearches }, { merge: true })
        }
    }, [searches, user])

    const removeSearch = useCallback(async (id: string) => {
        const newSearches = searches.filter(s => s.id !== id)
        setSearches(newSearches)

        if (user && db) {
            const docRef = doc(db, "users", user.uid)
            await setDoc(docRef, { savedSearches: newSearches }, { merge: true })
        }
    }, [searches, user])

    const clearSearches = useCallback(() => {
        setSearches([])
    }, [])

    return (
        <SavedSearchesContext.Provider value={{ searches, saveSearch, removeSearch, clearSearches }}>
            {children}
        </SavedSearchesContext.Provider>
    )
}
