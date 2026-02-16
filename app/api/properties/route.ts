import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, limit, where, orderBy, Timestamp } from "firebase/firestore"
import { Property } from "@/lib/data"
import { SearchFiltersSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    // Parse and validate query params
    const rawFilters = {
        operation: searchParams.get("operation") || undefined,
        type: searchParams.get("type") || undefined,
        department: searchParams.get("department") || undefined,
        city: searchParams.get("city") || undefined,
        neighborhood: searchParams.get("neighborhood") || undefined,
        priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
        priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
        bedrooms: searchParams.get("bedrooms") || undefined,
        amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 24,
    }

    const validation = SearchFiltersSchema.safeParse(rawFilters)
    if (!validation.success) {
        return NextResponse.json(
            { error: "Parámetros inválidos", details: validation.error.flatten() },
            { status: 400 }
        )
    }

    const filters = validation.data
    const queryTerm = searchParams.get("q")

    if (!db) {
        return NextResponse.json({ error: "Database not initialized" }, { status: 500 })
    }

    try {
        const propertiesRef = collection(db, "properties")

        // Build Firestore query with as many server-side filters as possible
        const constraints: Parameters<typeof query>[1][] = []

        if (filters.operation) {
            constraints.push(where("operation", "==", filters.operation))
        }
        if (filters.department) {
            constraints.push(where("department", "==", filters.department))
        }
        if (filters.city) {
            constraints.push(where("city", "==", filters.city))
        }
        if (filters.neighborhood) {
            constraints.push(where("neighborhood", "==", filters.neighborhood))
        }

        // Firestore limits compound inequality filters, so we only use server-side equality filters
        // and do price/bedroom filtering client-side
        constraints.push(limit(200))

        const q = query(propertiesRef, ...constraints)
        const querySnapshot = await getDocs(q)

        let docs = querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                ...data,
                publishedAt: data.publishedAt instanceof Timestamp
                    ? data.publishedAt.toDate().toISOString()
                    : data.publishedAt || new Date().toISOString(),
            } as Property
        })

        // Client-side filtering for constraints Firestore can't handle natively
        if (filters.type) {
            const types = filters.type.split(",")
            docs = docs.filter(p => types.includes(p.type))
        }

        if (queryTerm) {
            const term = queryTerm.toLowerCase()
            docs = docs.filter(p =>
                p.title?.toLowerCase().includes(term) ||
                p.neighborhood?.toLowerCase().includes(term) ||
                p.city?.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            )
        }

        if (filters.priceMin) {
            docs = docs.filter(p => p.price >= filters.priceMin!)
        }
        if (filters.priceMax) {
            docs = docs.filter(p => p.price <= filters.priceMax!)
        }

        if (filters.bedrooms) {
            const bed = filters.bedrooms === "Mono" ? 0 : filters.bedrooms === "3+" ? 3 : parseInt(filters.bedrooms)
            docs = docs.filter(p => filters.bedrooms === "3+" ? p.bedrooms >= bed : p.bedrooms === bed)
        }

        if (filters.amenities && filters.amenities.length > 0) {
            docs = docs.filter(p => filters.amenities!.every(a => p.amenities?.includes(a)))
        }

        // Sort by newest
        docs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

        // Pagination
        const total = docs.length
        const page = filters.page
        const pageSize = filters.limit
        const totalPages = Math.ceil(total / pageSize)
        const start = (page - 1) * pageSize
        const paginatedDocs = docs.slice(start, start + pageSize)

        return NextResponse.json({
            properties: paginatedDocs,
            pagination: {
                page,
                limit: pageSize,
                total,
                totalPages,
                hasMore: page < totalPages,
            },
        })
    } catch (error) {
        console.error("API Error fetching properties:", error)
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }
}
