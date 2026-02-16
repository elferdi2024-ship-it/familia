// Re-export everything from validation.ts for backwards compatibility
export {
  LeadSchema,
  PublishStep1Schema,
  PublishStep2Schema,
  PropertySchema,
  SearchFiltersSchema,
  NearbyPlacesSchema,
} from './validation'

export type {
  LeadInput,
  LeadFormData,
  PropertyFormData,
  SearchFilters,
} from './validation'
