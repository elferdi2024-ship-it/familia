import { z } from "zod"

// Full property validation
export const PropertySchema = z.object({
    title: z.string().min(10, "El título debe tener al menos 10 caracteres").max(200),
    description: z.string().min(20, "La descripción debe tener al menos 20 caracteres").max(5000),
    type: z.enum(["Casa", "Apartamento", "Terreno", "Local Comercial", "Oficina", "Chacra o Campo", "Garaje o Cochera"]),
    operation: z.enum(["Venta", "Alquiler", "Alquiler Temporal"]),
    price: z.number().positive("El precio debe ser mayor a 0"),
    currency: z.enum(["USD", "UYU"]).default("USD"),
    department: z.string().min(1, "Departamento requerido"),
    city: z.string().min(1, "Ciudad requerida"),
    neighborhood: z.string().optional(),
    address: z.string().min(3, "Dirección requerida"),
    bedrooms: z.number().int().min(0).max(20),
    bathrooms: z.number().int().min(0).max(20),
    area: z.number().positive("El área debe ser mayor a 0"),
    totalArea: z.number().positive().optional(),
    garages: z.number().int().min(0).max(10).optional(),
    images: z.array(z.string().url()).min(1, "Se requiere al menos 1 imagen").max(20),
    amenities: z.array(z.string()).optional(),
    viviendaPromovida: z.boolean().optional(),
    acceptedGuarantees: z.array(z.string()).optional(),
    acceptsPets: z.boolean().optional(),
    furnished: z.boolean().optional(),
    expenses: z.number().min(0).optional(),
})

export type PropertyFormData = z.infer<typeof PropertySchema>

// Nearby places validation
export const NearbyPlacesSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
})
