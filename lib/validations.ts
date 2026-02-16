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

// Search filters validation
export const SearchFiltersSchema = z.object({
  operation: z.string().optional(),
  type: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  bedrooms: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(24),
})

export type SearchFilters = z.infer<typeof SearchFiltersSchema>

// Nearby places validation
export const NearbyPlacesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})
