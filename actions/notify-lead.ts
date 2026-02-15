"use server"

import { sendLeadEmail } from "@/lib/mail"

export async function notifyLead(leadData: any) {
    // In a real app, retrieve the agent's email from Firestore using leadData.agentId
    // For now, we'll send to a placeholder or the agent email if provided in data

    // Simulating fetching agent email
    const agentEmail = "agente-inmobiliario-demo@dominiotal.com" // or leadData.agentEmail if available

    try {
        await sendLeadEmail(agentEmail, leadData)
        return { success: true }
    } catch (error) {
        console.error("Failed to send notification:", error)
        return { success: false, error: "Failed to send notification" }
    }
}
