import { z } from "zod"

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
