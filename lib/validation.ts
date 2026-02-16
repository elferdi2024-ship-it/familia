import { z } from "zod"

export const LeadSchema = z.object({
  propertyId: z.string().min(1, "Propiedad requerida"),
  propertyTitle: z.string().min(1),
  agentId: z.string().min(1),
  leadName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  leadEmail: z.string().email("Email inválido"),
  leadPhone: z.string().optional(),
  leadMessage: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

export type LeadInput = z.infer<typeof LeadSchema>

export const PublishStep1Schema = z.object({
  address: z.string().min(5, "Ingresa una ubicación válida"),
  type: z.string().min(1),
  operation: z.string().min(1),
})

export const PublishStep2Schema = z.object({
  images: z.array(z.string()).min(1, "Sube al menos una foto"),
  price: z.number().positive("Ingresa un precio válido"),
})
