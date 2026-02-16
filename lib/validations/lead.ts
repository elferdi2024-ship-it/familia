import { z } from "zod"

// Lead form validation
export const LeadSchema = z.object({
    propertyId: z.string().min(1, "Propiedad requerida"),
    propertyTitle: z.string().min(1, "Título de propiedad requerido"),
    propertyPrice: z.number().optional(),
    propertyCurrency: z.string().optional(),
    propertyImage: z.string().optional(),
    agentId: z.string().min(1, "ID de agente requerido"),
    leadName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
    leadEmail: z.string().email("Email inválido"),
    leadPhone: z.string().optional(),
    leadMessage: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
})

export type LeadInput = z.infer<typeof LeadSchema>
export type LeadFormData = z.infer<typeof LeadSchema>
