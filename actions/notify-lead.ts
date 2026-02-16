"use server"

import { sendLeadEmail } from "@/lib/mail"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { LeadSchema } from "@/lib/schemas"

export async function notifyLead(leadData: unknown) {
    // 1. Validate input with Zod
    const result = LeadSchema.safeParse(leadData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return {
            success: false,
            error: 'Datos inválidos',
            fieldErrors: errors,
        }
    }

    const validatedData = result.data

    // 2. Determine agent email
    let agentEmail = "agente-inmobiliario-demo@dominiotal.com"

    if (validatedData.agentId && validatedData.agentId !== "system" && db) {
        try {
            const agentDoc = await getDoc(doc(db, "users", validatedData.agentId))
            if (agentDoc.exists()) {
                const agentData = agentDoc.data()
                if (agentData.email) {
                    agentEmail = agentData.email
                }
            }
        } catch (error) {
            console.error("Error fetching agent email:", error)
        }
    }

    // 3. Send email via Resend
    try {
        await sendLeadEmail(agentEmail, validatedData)
        return { success: true }
    } catch (error) {
        console.error("Failed to send notification:", error)
        return { success: false, error: "No pudimos enviar tu consulta. Intenta de nuevo." }
    }
}
