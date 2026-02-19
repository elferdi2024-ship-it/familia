"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@repo/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
import { toast } from "sonner"
import { Property } from "@/lib/data"
import { Lead } from "@/types"

export function useAgentDashboard() {
    const { user, updateUserProfile } = useAuth()
    const [properties, setProperties] = useState<Property[]>([])
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)

    // Profile State
    const [profileName, setProfileName] = useState("")
    const [profilePhoto, setProfilePhoto] = useState("")
    const [profilePhone, setProfilePhone] = useState("")
    const [profileAgency, setProfileAgency] = useState("")
    const [profileHours, setProfileHours] = useState("")
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

    const fetchData = useCallback(async () => {
        if (!user || !db) return

        try {
            setLoading(true)
            // 1. Fetch Properties
            const qProps = query(
                collection(db, "properties"),
                where("userId", "==", user.uid)
            )
            const propsSnap = await getDocs(qProps)
            const props = propsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Property))

            props.sort((a, b) => {
                const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                return dateB - dateA;
            })
            setProperties(props)

            // 2. Fetch Leads
            const qLeads = query(
                collection(db, "leads"),
                where("agentId", "==", user.uid)
            )
            const leadsSnap = await getDocs(qLeads)
            const leadsData = leadsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Lead))

            leadsData.sort((a, b) => {
                const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime()
                const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime()
                return dateB - dateA
            })
            setLeads(leadsData)

            // 3. Fetch Extended Profile
            const docSnap = await getDoc(doc(db, "users", user.uid))
            if (docSnap.exists()) {
                const data = docSnap.data()
                setProfileName(data.displayName || user.displayName || "")
                setProfilePhone(data.phoneNumber || data.phone || "")
                setProfileAgency(data.agencyName || "")
                setProfileHours(data.officeHours || data.workingHours || "") // Handle different field names
                setProfilePhoto(data.photoURL || user.photoURL || "")
            } else {
                setProfileName(user.displayName || "")
                setProfilePhoto(user.photoURL || "")
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            toast.error("Error al cargar datos del dashboard")
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user, fetchData])

    const updateProfile = async (data: {
        name: string,
        phone: string,
        agency: string,
        hours: string,
        photo: string
    }) => {
        if (!user || !db) return false

        setIsUpdatingProfile(true)
        try {
            await updateUserProfile({
                displayName: data.name,
                photoURL: data.photo
            })

            await import("firebase/firestore").then(m => m.setDoc(doc(db!, "users", user.uid), {
                displayName: data.name,
                photoURL: data.photo,
                phoneNumber: data.phone, // Standardized field name
                phone: data.phone, // Keep legacy field just in case
                agencyName: data.agency,
                officeHours: data.hours, // Standardized field name
                workingHours: data.hours, // Keep legacy field just in case
                updatedAt: new Date().toISOString()
            }, { merge: true }))

            await fetchData() // Refresh local state
            toast.success("Perfil actualizado con éxito")
            return true
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Error al actualizar perfil")
            return false
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const deleteProperty = async (id: string) => {
        if (!db) return
        try {
            await import("firebase/firestore").then(m => m.deleteDoc(doc(db!, "properties", id)))
            setProperties(prev => prev.filter(p => p.id !== id))
            toast.success("Propiedad eliminada")
        } catch (error) {
            console.error("Error deleting property:", error)
            toast.error("Error al eliminar propiedad")
        }
    }

    const markLeadAsContacted = async (leadId: string) => {
        if (!db) return
        try {
            const leadRef = doc(db, "leads", leadId)
            await updateDoc(leadRef, { status: "contacted" })
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: "contacted" } : l))
            toast.success("Lead marcado como contactado")
        } catch (error) {
            console.error("Error updating lead:", error)
            toast.error("Error al actualizar lead")
        }
    }

    return {
        properties,
        leads,
        loading,
        profile: {
            name: profileName,
            phone: profilePhone,
            agency: profileAgency,
            hours: profileHours,
            photo: profilePhoto
        },
        updateProfile,
        deleteProperty,
        markLeadAsContacted,
        isUpdatingProfile,
        refresh: fetchData
    }
}
