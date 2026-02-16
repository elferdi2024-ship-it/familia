"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { notifyLead } from "@/actions/notify-lead"
import { toast } from "sonner"
import { trackEvent } from "@/lib/tracking"

interface LeadFormData {
    propertyId: string
    propertyTitle: string
    propertyPrice?: number
    propertyType?: string
    agentId: string
    agentName?: string
    leadName: string
    leadEmail: string
    leadPhone?: string
    leadMessage: string
}

interface UseLeadSubmissionReturn {
    isSubmitting: boolean
    isSuccess: boolean
    submitLead: (data: LeadFormData) => Promise<boolean>
    reset: () => void
}

export function useLeadSubmission(): UseLeadSubmissionReturn {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const submitLead = async (data: LeadFormData): Promise<boolean> => {
        if (!db) {
            toast.error("Error de conexion. Intenta de nuevo.")
            return false
        }

        setIsSubmitting(true)
        try {
            const leadDoc = {
                propertyId: data.propertyId,
                propertyTitle: data.propertyTitle,
                agentId: data.agentId,
                agentName: data.agentName || "Usuario",
                leadName: data.leadName,
                leadEmail: data.leadEmail,
                leadPhone: data.leadPhone || null,
                leadMessage: data.leadMessage,
                createdAt: serverTimestamp(),
                status: "new",
                source: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "web",
            }

            await addDoc(collection(db, "leads"), leadDoc)

            const notifyResult = await notifyLead({
                ...leadDoc,
                createdAt: new Date().toISOString(),
            })

            if (!notifyResult.success) {
                toast.info("Consulta enviada. El agente te contactara pronto.")
            } else {
                toast.success("¡Consulta enviada exitosamente!")
            }

            trackEvent.leadSubmitted({
                propertyId: data.propertyId,
                propertyPrice: data.propertyPrice,
                propertyType: data.propertyType,
            })

            setIsSuccess(true)
            return true
        } catch (error) {
            console.error("Error submitting lead:", error)
            toast.error("No pudimos enviar tu consulta. Intenta de nuevo.")
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const reset = () => {
        setIsSuccess(false)
        setIsSubmitting(false)
    }

    return { isSubmitting, isSuccess, submitLead, reset }
}
