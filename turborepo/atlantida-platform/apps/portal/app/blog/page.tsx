"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"
import { POSTS, type Post } from "@/data/posts"

const CATEGORIES = Array.from(new Set(POSTS.map((p) => p.category))).sort()

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState<"featured" | "newest" | "popular">("newest")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    const filteredPosts = useMemo(() => {
        let list = [...POSTS]
        if (selectedCategory) list = list.filter((p) => p.category === selectedCategory)
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            list = list.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            )
        }
        if (activeTab === "newest" || activeTab === "featured") {
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }
        if (activeTab === "popular") {
            const parseMin = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0
            list.sort((a, b) => parseMin(b.readTime) - parseMin(a.readTime))
        }
        return list
    }, [selectedCategory, search, activeTab])

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 md:pt-28">
            {/* Header minimal */}
            <header className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Blog
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-base max-w-xl">
                        Guías, análisis y tendencias del mercado inmobiliario en Uruguay.
                    </p>

                    {/* Tabs */}
                    <nav className="mt-8 flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 -mb-px">
                        {(["featured", "newest", "popular"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                            >
                                {tab === "featured" && "Destacados"}
                                {tab === "newest" && "Recientes"}
                                {tab === "popular" && "Populares"}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
                {/* Search + Categories */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="search"
                            placeholder="Buscar artículos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 text-sm"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === null
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            Todos
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedCategory === cat
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPosts.map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-16">
                        No hay artículos que coincidan con tu búsqueda.
                    </p>
                )}
            </main>

            {/* Newsletter - minimal */}
            <section className="border-t border-slate-200 dark:border-slate-800 mt-20">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Novedades en tu correo
                    </h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                        Recibí análisis y guías del mercado inmobiliario uruguayo.
                    </p>
                    <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                            required
                        />
                        <button
                            type="submit"
                            className="px-5 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Suscribirme
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}

function ArticleCard({ post }: { post: Post }) {
    return (
        <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md">
                    {post.category}
                </span>
            </Link>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                </p>
                <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 text-sm font-medium text-slate-900 dark:text-white hover:underline inline-flex items-center gap-1"
                >
                    Leer más
                    <span className="material-icons text-sm">arrow_forward</span>
                </Link>
            </div>
        </article>
    )
}
