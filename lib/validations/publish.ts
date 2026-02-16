import { z } from "zod"

// Publish wizard step validations
export const PublishStep1Schema = z.object({
    address: z.string().min(5, "Ingresa una ubicación válida"),
    type: z.string().min(1, "Selecciona un tipo de propiedad"),
    operation: z.string().min(1, "Selecciona una operación"),
})

export const PublishStep2Schema = z.object({
    images: z.array(z.string()).min(1, "Sube al menos una foto"),
    price: z.number().positive("Ingresa un precio válido"),
})
