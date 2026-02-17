"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { PropertyType, OperationType, GuaranteeType, Property } from "@/lib/data"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export interface PublishData {
    // Step 1: Basic Info
    type: PropertyType | string
    operation: OperationType | string
    address: string
    neighborhood: string
    city: string
    department: string
    latitude?: number
    longitude?: number

    // Step 2: Details & Media
    images: string[]
    bedrooms: number
    bathrooms: number
    area: number
    price: number
    currency: "USD" | "UYU"
    gastosComunes: number | null
    description: string
    viviendaPromovida: boolean
    guarantees: GuaranteeType[]

    // Step 3: Social & Features
    amenities: string[]
    agentPhone?: string
    utilityStatus: {
        saneamiento: "conectado" | "pozo" | "pendiente"
        gas: "cañería" | "supergas" | "sin servicio"
        agua: "OSE" | "pozo"
        electricidad: "UTE" | "solar" | "mixto"
    }
    floorplanUrl?: string
}

const initialData: PublishData = {
    type: "Apartamento",
    operation: "Venta",
    address: "",
    neighborhood: "",
    city: "Montevideo",
    department: "Montevideo",
    latitude: -34.9011,
    longitude: -56.1645,
    images: [],
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    price: 0,
    currency: "USD",
    gastosComunes: null,
    description: "",
    viviendaPromovida: false,
    guarantees: [],
    amenities: [],
    agentPhone: "",
    utilityStatus: {
        saneamiento: "conectado",
        gas: "cañería",
        agua: "OSE",
        electricidad: "UTE",
    },
    floorplanUrl: "",
}

interface PublishContextType {
    data: PublishData
    updateData: (newData: Partial<PublishData>) => void
    resetData: () => void
    isEditing: boolean
    editingId: string | null
    startEditing: (id: string) => Promise<void>
}

const PublishContext = createContext<PublishContextType | undefined>(undefined)

const STORAGE_KEY = "dt_publish_session"

export function PublishProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<PublishData>(initialData)
    const [isLoaded, setIsLoaded] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const isEditing = !!editingId

    // Load from sessionStorage to avoid data loss on refresh
    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                setData(JSON.parse(saved))
            } catch (e) {
                console.error("Error loading publish session", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Persist to sessionStorage
    useEffect(() => {
        if (isLoaded) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }, [data, isLoaded])

    const updateData = (newData: Partial<PublishData>) => {
        setData(prev => ({ ...prev, ...newData }))
    }

    const startEditing = async (id: string) => {
        if (!db) return
        try {
            const docRef = doc(db, "properties", id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const property = { id: docSnap.id, ...docSnap.data() } as Property
                setEditingId(id)
                setData({
                    type: property.type,
                    operation: property.operation,
                    address: property.address || "",
                    neighborhood: property.neighborhood,
                    city: property.city,
                    department: property.department,
                    latitude: property.latitude || (property as any).geolocation?.lat,
                    longitude: property.longitude || (property as any).geolocation?.lng,
                    images: property.images,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    area: property.area,
                    price: property.price,
                    currency: property.currency,
                    gastosComunes: property.gastosComunes,
                    description: property.description,
                    viviendaPromovida: property.viviendaPromovida,
                    guarantees: property.acceptedGuarantees || [],
                    amenities: property.amenities,
                    agentPhone: property.agentPhone || "",
                    utilityStatus: property.utilityStatus || {
                        saneamiento: "conectado",
                        gas: "cañería",
                        agua: "OSE",
                        electricidad: "UTE",
                    },
                    floorplanUrl: property.floorplanUrl || "",
                })
            }
        } catch (error) {
            console.error("Error fetching property for edit:", error)
        }
    }

    const resetData = () => {
        setData(initialData)
        setEditingId(null)
        sessionStorage.removeItem(STORAGE_KEY)
    }

    return (
        <PublishContext.Provider value={{ data, updateData, resetData, isEditing, editingId, startEditing }}>
            {children}
        </PublishContext.Provider>
    )
}

export function usePublish() {
    const context = useContext(PublishContext)
    if (!context) throw new Error("usePublish must be used within PublishProvider")
    return context
}
