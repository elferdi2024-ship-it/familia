// Barrio.uy - Marketplace Brand Configuration
// Este es el marketplace donde múltiples agentes pueden publicar propiedades

import type { BrandConfig } from '@repo/types'

export const brandConfig: BrandConfig = {
  name: 'Barrio.uy',
  slug: 'barrio',
  logo: '/barrio-logo.png',
  primaryColor: '#0066FF',
  secondaryColor: '#00D4AA',
  domain: 'barrio.uy',
  contact: {
    email: 'info@barrio.uy',
    phone: '+598 99 123 456',
    whatsapp: '59899123456',
    address: 'Montevideo, Uruguay'
  },
  social: {
    facebook: 'https://facebook.com/barrio.uy',
    instagram: 'https://instagram.com/barrio.uy',
    linkedin: 'https://linkedin.com/company/barrio-uy'
  }
}

// Portal-specific features (Barrio.uy)
export const portalFeatures = {
  multiAgent: true,           // Múltiples agentes pueden publicar
  agentRegistration: true,    // Los agentes pueden registrarse
  subscription: true,         // Sistema de suscripciones
  featuredListings: true,     // Propiedades destacadas (pagadas)
  analytics: true,            // Analytics para agentes
  leadManagement: true,       // Gestión de leads para agentes
}

export const seoConfig = {
  title: 'Barrio.uy - El Portal Inmobiliario de Uruguay',
  description: 'Encuentra tu próximo hogar en Uruguay. Miles de propiedades en venta y alquiler de los mejores agentes inmobiliarios.',
  keywords: ['inmuebles uruguay', 'casas en venta', 'apartamentos montevideo', 'alquiler uruguay', 'barrio.uy'],
}
