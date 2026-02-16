"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Property } from "@/lib/data"

interface SearchFilters {
  operation?: string
  type?: string
  department?: string
  city?: string
  neighborhood?: string
  priceMin?: string
  priceMax?: string
  bedrooms?: string
  amenities?: string[]
  q?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface UsePropertiesReturn {
  properties: Property[]
  isLoading: boolean
  error: string | null
  pagination: PaginationInfo | null
  fetchProperties: (page?: number) => Promise<void>
  loadMore: () => Promise<void>
}

export function useProperties(filters: SearchFilters, pageSize = 24): UsePropertiesReturn {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProperties = useCallback(async (page = 1) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.operation) params.set('operation', filters.operation)
      if (filters.type) params.set('type', filters.type)
      if (filters.department) params.set('department', filters.department)
      if (filters.city) params.set('city', filters.city)
      if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
      if (filters.priceMin) params.set('priceMin', filters.priceMin)
      if (filters.priceMax) params.set('priceMax', filters.priceMax)
      if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
      if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','))
      if (filters.q) params.set('q', filters.q)
      params.set('page', page.toString())
      params.set('limit', pageSize.toString())

      const response = await fetch(`/api/properties?${params}`, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error('Error al cargar propiedades')
      }

      const data = await response.json()

      if (page === 1) {
        setProperties(data.properties || [])
      } else {
        setProperties(prev => [...prev, ...(data.properties || [])])
      }

      setPagination(data.pagination || null)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Error desconocido')
      if (page === 1) setProperties([])
    } finally {
      setIsLoading(false)
    }
  }, [filters, pageSize])

  const loadMore = useCallback(async () => {
    if (!pagination?.hasMore || isLoading) return
    await fetchProperties(pagination.page + 1)
  }, [pagination, isLoading, fetchProperties])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties(1)
    }, 300) // debounce

    return () => {
      clearTimeout(timer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchProperties])

  return { properties, isLoading, error, pagination, fetchProperties, loadMore }
}
