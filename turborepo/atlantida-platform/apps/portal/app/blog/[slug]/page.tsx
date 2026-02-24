import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { POSTS } from "@/data/posts"

export async function generateStaticParams() {
    return POSTS.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const post = POSTS.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
            {/* Spacer for fixed navbar */}
            <div className="h-20 shrink-0" aria-hidden />

            {/* Compact hero - same tone as blog landing */}
            <header className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium mb-6 transition-colors"
                    >
                        <span className="material-icons text-base">arrow_back</span>
                        Blog
                    </Link>
                    <span className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md mb-4">
                        {post.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-snug">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-slate-500 dark:text-slate-400 text-sm">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime} de lectura</span>
                        <span>·</span>
                        <span>{post.author}</span>
                    </div>
                </div>
            </header>

            {/* Featured image */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 896px) 100vw, 896px"
                    />
                </div>
            </div>

            {/* Content - editorial, readable sizes */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="prose prose-slate dark:prose-invert max-w-none
                    prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-700
                    prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-[15px]
                    prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:text-[15px]
                    prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                ">
                    <div className="space-y-6 content-renderer">
                        {post.content.split("\n\n").map((paragraph, i) => {
                            if (paragraph.trim().startsWith("##")) {
                                const trimmed = paragraph.trim().replace(/^#+\s*/, "")
                                const firstLine = trimmed.split("\n")[0].trim()
                                const rest = trimmed.split("\n").slice(1).join("\n").trim()
                                return (
                                    <div key={i} className="first:mt-0 mt-10">
                                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                                            {firstLine}
                                        </h2>
                                        {rest ? (
                                            <div className="space-y-2 mt-4">
                                                {rest.split("\n").map((line, j) => {
                                                    const lineTrim = line.trim()
                                                    if (!lineTrim) return null
                                                    if (lineTrim.startsWith("-")) {
                                                        const text = lineTrim.replace(/^-\s*/, "")
                                                        return (
                                                            <div key={j} className="flex gap-3 text-slate-600 dark:text-slate-400 text-[15px]">
                                                                <span className="text-primary shrink-0">·</span>
                                                                <span>
                                                                    {text.split("**").map((part, k) =>
                                                                        k % 2 === 1 ? (
                                                                            <strong key={k} className="text-slate-900 dark:text-white font-semibold">{part}</strong>
                                                                        ) : (
                                                                            part
                                                                        )
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                    return (
                                                        <p key={j} className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                                                            {lineTrim.split("**").map((part, k) =>
                                                                k % 2 === 1 ? (
                                                                    <strong key={k} className="text-slate-900 dark:text-white font-semibold">{part}</strong>
                                                                ) : (
                                                                    part
                                                                )
                                                            )}
                                                        </p>
                                                    )
                                                })}
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            }
                            if (paragraph.trim().startsWith("-")) {
                                return (
                                    <ul key={i} className="space-y-2 my-4 list-none pl-0">
                                        {paragraph.split("\n").map((li, j) => (
                                            <li
                                                key={j}
                                                className="flex gap-3 text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed"
                                            >
                                                <span className="text-primary mt-1.5 shrink-0">·</span>
                                                <span>
                                                    {li
                                                        .replace(/^-\s*/, "")
                                                        .split("**")
                                                        .map((part, idx) =>
                                                            idx % 2 === 1 ? (
                                                                <strong
                                                                    key={idx}
                                                                    className="text-slate-900 dark:text-white font-semibold"
                                                                >
                                                                    {part}
                                                                </strong>
                                                            ) : (
                                                                part
                                                            )
                                                        )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                            return (
                                <p key={i} className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                                    {paragraph.split("**").map((part, idx) =>
                                        idx % 2 === 1 ? (
                                            <strong
                                                key={idx}
                                                className="text-slate-900 dark:text-white font-semibold"
                                            >
                                                {part}
                                            </strong>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                            )
                        })}
                    </div>
                </div>

                {/* CTA - minimal, like blog landing */}
                <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                ¿Buscás tu próxima propiedad?
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Explorá opciones con filtros y datos de mercado en Barrio.uy.
                            </p>
                        </div>
                        <Link
                            href="/search"
                            className="shrink-0 px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Ver propiedades
                        </Link>
                    </div>
                </div>

                <div className="mt-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                    Publicado por {post.author}
                </div>
            </div>
        </article>
    )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const post = POSTS.find((p) => p.slug === slug)

    if (!post) return { title: "Post no encontrado" }

    return {
        title: `${post.title} | Blog Barrio.uy`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    }
}
