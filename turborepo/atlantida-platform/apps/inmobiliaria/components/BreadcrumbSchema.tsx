"use client"

interface BreadcrumbItem {
    name: string
    href: string
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://mibarrio.uy${item.href}`
        }))
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
    )
}

// Pre-built breadcrumbs for common pages
export function HomeBreadcrumb() {
    return <BreadcrumbSchema items={[{ name: "Inicio", href: "/" }]} />
}

export function SearchBreadcrumb({ operation }: { operation?: string }) {
    return (
        <BreadcrumbSchema items={[
            { name: "Inicio", href: "/" },
            { name: operation === "Alquiler" ? "Alquilar" : "Comprar", href: operation === "Alquiler" ? "/alquilar" : "/comprar" },
            { name: "Resultados", href: "/search" },
        ]} />
    )
}

export function PropertyBreadcrumb({ title, id, neighborhood }: { title: string; id: string; neighborhood?: string }) {
    const items: BreadcrumbItem[] = [
        { name: "Inicio", href: "/" },
        { name: "Propiedades", href: "/search" },
    ]
    if (neighborhood) {
        items.push({ name: neighborhood, href: `/comprar/${neighborhood.toLowerCase().replace(/\s+/g, '-')}` })
    }
    items.push({ name: title, href: `/property/${id}` })

    return <BreadcrumbSchema items={items} />
}

export function BlogBreadcrumb({ postTitle, slug }: { postTitle?: string; slug?: string }) {
    const items: BreadcrumbItem[] = [
        { name: "Inicio", href: "/" },
        { name: "Blog", href: "/blog" },
    ]
    if (postTitle && slug) {
        items.push({ name: postTitle, href: `/blog/${slug}` })
    }

    return <BreadcrumbSchema items={items} />
}
