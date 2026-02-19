"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ComparisonContextType {
    selectedIds: string[]
    addToCompare: (id: string) => void
    removeFromCompare: (id: string) => void
    clearCompare: () => void
    isInCompare: (id: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dominio_compare_ids')
        if (saved) {
            try {
                setSelectedIds(JSON.parse(saved))
            } catch (e) {
                console.error("Error parsing comparison ids", e)
            }
        }
    }, [])

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('dominio_compare_ids', JSON.stringify(selectedIds))
    }, [selectedIds])

    const addToCompare = (id: string) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) return prev
            if (prev.length >= 3) {
                // Remove the first one and add the new one
                return [...prev.slice(1), id]
            }
            return [...prev, id]
        })
    }

    const removeFromCompare = (id: string) => {
        setSelectedIds(prev => prev.filter(i => i !== id))
    }

    const clearCompare = () => {
        setSelectedIds([])
    }

    const isInCompare = (id: string) => selectedIds.includes(id)

    return (
        <ComparisonContext.Provider value={{
            selectedIds,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare
        }}>
            {children}
        </ComparisonContext.Provider>
    )
}

export const useComparison = () => {
    const context = useContext(ComparisonContext)
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider')
    }
    return context
}
