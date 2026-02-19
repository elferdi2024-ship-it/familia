import Link from "next/link"
import Image from "next/image"
import { POSTS } from "@/data/posts"

export const metadata = {
    title: "Blog Inmobiliario | MiBarrio.uy Uruguay",
    description: "Guías, consejos y análisis del mercado inmobiliario en Uruguay. Todo lo que necesitas saber para comprar, alquilar o invertir.",
}

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Premium Blog Hero */}
            <header className="bg-slate-900 py-24 lg:py-32 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <span className="px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full text-primary text-xs font-black uppercase tracking-[0.3em] mb-8 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            MiBarrio.uy Insights
                        </span>
                        <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            Mercado <span className="text-primary">&</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400">Tendencias</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            Descubrí las mejores estrategias, guías de inversión y noticias <br className="hidden lg:block" />
                            clave del mercado inmobiliario uruguayo.
                        </p>
                    </div>
                </div>
            </header>

            {/* Posts Grid */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {POSTS.map((post, idx) => (
                        <article
                            key={post.slug}
                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3"
                        >
                            <Link href={`/blog/${post.slug}`} className="relative h-72 lg:h-80 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-icons text-sm text-primary/50">calendar_month</span>
                                        {post.date}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="material-icons text-sm text-primary/50">schedule</span>
                                        {post.readTime}
                                    </span>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors leading-[1.2]">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
                                >
                                    Sigue leyendo
                                    <span className="material-icons text-sm">arrow_right_alt</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Premium Newsletter CTA */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-32 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 lg:p-20 shadow-2xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 space-y-8">
                            <span className="material-icons text-5xl text-primary mb-4 p-4 bg-primary/5 rounded-3xl">mark_email_read</span>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Únete a la élite inmobiliaria</h2>
                            <p className="text-slate-500 text-lg max-w-xl mx-auto">
                                Analizamos miles de datos para enviarte solo lo que importa: oportunidades únicas y tendencias reales.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto pt-4">
                                <input
                                    type="email"
                                    placeholder="Tu correo mejor calificado"
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 px-8 py-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white font-medium border border-slate-100 dark:border-slate-700 transition-all"
                                    required
                                />
                                <button className="bg-primary text-white px-10 py-5 font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-primary/20">
                                    Suscribirme ahora
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Respetamos tu privacidad • Cancelación en un clic</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
