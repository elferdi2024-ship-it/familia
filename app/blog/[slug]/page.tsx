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
        <article className="min-h-screen bg-white dark:bg-slate-950 pb-20">
            {/* Post Hero */}
            <header className="relative h-[60vh] lg:h-[80vh] flex items-center justify-center pt-20">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 shadow-inner"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                    >
                        <span className="material-icons text-sm">arrow_back</span>
                        Regresar al Blog
                    </Link>

                    <h1 className="text-4xl lg:text-7xl font-black text-white leading-[1.1] animate-in slide-in-from-bottom-4 duration-700">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">event</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">schedule</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{post.readTime} de lectura</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-primary">person</span>
                            <span className="text-sm font-bold uppercase tracking-widest">{post.author}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-6 -mt-32 relative z-20">
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 lg:p-16 shadow-2xl shadow-black/10 border border-slate-100 dark:border-slate-800">
                    <div className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                        prose-li:text-slate-600 dark:prose-li:text-slate-400
                        prose-strong:text-slate-900 dark:prose-strong:text-white
                        prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                        prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    ">
                        <div className="space-y-8 text-lg leading-relaxed content-renderer">
                            {post.content.split('\n\n').map((paragraph, i) => {
                                if (paragraph.trim().startsWith('##')) {
                                    return (
                                        <h2 key={i} className="text-3xl font-black text-slate-900 dark:text-white pt-8 pb-2 border-b border-primary/10">
                                            {paragraph.replace('##', '').trim()}
                                        </h2>
                                    )
                                }
                                if (paragraph.trim().startsWith('-')) {
                                    return (
                                        <ul key={i} className="space-y-4 my-6">
                                            {paragraph.split('\n').map((li, j) => (
                                                <li key={j} className="flex gap-4 text-slate-600 dark:text-slate-400">
                                                    <span className="text-primary font-black">•</span>
                                                    {li.replace('-', '').trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }
                                return (
                                    <p key={i} className="text-slate-600 dark:text-slate-400">
                                        {paragraph.split('**').map((part, idx) =>
                                            idx % 2 === 1 ? <strong key={idx} className="text-slate-900 dark:text-white font-black">{part}</strong> : part
                                        )}
                                    </p>
                                )
                            })}
                        </div>
                    </div>

                    {/* Post-content CTA */}
                    <div className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
                        <div className="bg-primary/5 rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-8 border border-primary/10">
                            <div className="flex-1 text-center lg:text-left space-y-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">¿Buscas tu próxima propiedad?</h3>
                                <p className="text-slate-500 text-sm">Explora las mejores opciones en {post.slug.includes('montevideo') ? 'Montevideo' : 'Uruguay'} con filtros inteligentes y datos reales de mercado.</p>
                            </div>
                            <Link
                                href="/search"
                                className="bg-primary text-white px-8 py-4 font-bold rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                Ver Propiedades
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Simplified Author Box */}
                <div className="mt-12 flex items-center justify-center gap-4 text-slate-400">
                    <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">Publicado por {post.author}</span>
                    <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800"></span>
                </div>
            </div>
        </article>
    )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params
    const post = POSTS.find((p) => p.slug === slug)

    if (!post) return { title: 'Post no encontrado' }

    return {
        title: `${post.title} | Blog DominioTotal`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    }
}
