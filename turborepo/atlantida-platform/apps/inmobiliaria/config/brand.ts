// MiBarrio.uy - Exclusive Real Estate Brand Configuration
// Este es el sitio web exclusivo de la inmobiliaria MiBarrio.uy

import type { BrandConfig } from '@repo/types'

export const brandConfig: BrandConfig = {
  name: 'MiBarrio.uy',
  slug: 'mibarrio',
  logo: '/mibarrio-logo.png',
  primaryColor: '#1E3A5F',      // Azul profesional
  secondaryColor: '#C9A961',    // Dorado elegante
  domain: 'mibarrio.uy',
  contact: {
    email: 'contacto@mibarrio.uy',
    phone: '+598 99 888 777',
    whatsapp: '59899888777',
    address: 'Av. Brasil 2587, Montevideo, Uruguay'
  },
  social: {
    facebook: 'https://facebook.com/mibarrio.uy',
    instagram: 'https://instagram.com/mibarrio.uy',
    linkedin: 'https://linkedin.com/company/mibarrio-uy',
    youtube: 'https://youtube.com/@mibarriouy'
  }
}

// Inmobiliaria-specific features (MiBarrio.uy)
export const inmobiliariaFeatures = {
  multiAgent: false,          // Solo propiedades de MiBarrio.uy
  agentRegistration: false,   // No hay registro de agentes externos
  subscription: false,        // Sin sistema de suscripciones
  featuredListings: false,    // Todas las propiedades son del mismo agente
  analytics: false,           // Sin analytics públicos
  leadManagement: true,       // Gestión de leads para la inmobiliaria
  exclusiveContent: true,     // Contenido exclusivo de la marca
  virtualTours: true,         // Tours virtuales premium
}

export const seoConfig = {
  title: 'MiBarrio.uy - Inmobiliaria Premium en Uruguay',
  description: 'Propiedades exclusivas en las mejores zonas de Uruguay. Servicio personalizado y asesoramiento experto en bienes raíces.',
  keywords: ['inmobiliaria premium uruguay', 'propiedades exclusivas', 'mibarrio.uy', 'bienes raices montevideo'],
}

// Estilos específicos de la marca
export const brandStyles = {
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter'
  },
  borderRadius: '0.5rem',
  shadows: {
    card: '0 4px 20px rgba(30, 58, 95, 0.1)',
    button: '0 2px 10px rgba(30, 58, 95, 0.2)'
  }
}
