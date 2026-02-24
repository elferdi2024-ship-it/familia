"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { AGENCIES, type Agency } from "@/data/agencies"
import { BadgeCheck, Search, Phone, MessageCircle } from "lucide-react"

export default function InmobiliariasPage() {
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        if (!search.trim()) return AGENCIES
        const q = search.trim().toLowerCase()
        return AGENCIES.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.tagline?.toLowerCase().includes(q) ||
                a.description.toLowerCase().includes(q) ||
                a.city.toLowerCase().includes(q) ||
                a.neighborhood?.toLowerCase().includes(q)
        )
    }, [search])

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 md:pt-28">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Inmobiliarias
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-base max-w-xl">
                        Encontrá agentes y empresas verificadas. Los que tienen badge destacan con suscripción activa en Barrio.uy.
                    </p>

                    <div className="mt-8 relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Buscar por nombre, ciudad o palabra clave..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 text-sm"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filtered.map((agency) => (
                        <AgencyCard key={agency.id} agency={agency} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-16">
                        No hay inmobiliarias que coincidan con tu búsqueda.
                    </p>
                )}
            </main>
        </div>
    )
}

function AgencyCard({ agency }: { agency: Agency }) {
    return (
        <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
            <Link href={`/inmobiliarias/${agency.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image
                    src={agency.coverImage}
                    alt={agency.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {agency.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Verificada
                    </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-white dark:bg-slate-800 shrink-0">
                        <Image
                            src={agency.logo}
                            alt=""
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Link
                        href={`/inmobiliarias/${agency.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white text-xs font-semibold hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                        Ver perfil
                    </Link>
                </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                    <Link href={`/inmobiliarias/${agency.slug}`} className="hover:text-primary transition-colors">
                        {agency.name}
                        {agency.tagline && (
                            <span className="text-slate-500 dark:text-slate-400 font-normal block text-sm mt-0.5">
                                {agency.tagline}
                            </span>
                        )}
                    </Link>
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                    {agency.description}
                </p>

                {agency.gallery.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex -space-x-1 overflow-hidden rounded-lg ring-2 ring-slate-100 dark:ring-slate-800">
                            {agency.gallery.slice(0, 3).map((src, i) => (
                                <div key={i} className="relative w-12 h-12 shrink-0">
                                    <Image
                                        src={src}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            ))}
                        </div>
                        <Link
                            href={`/inmobiliarias/${agency.slug}#galeria`}
                            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                        >
                            Ver más
                        </Link>
                    </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    {agency.phone && (
                        <a
                            href={`https://wa.me/${agency.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Teléfono
                        </a>
                    )}
                    <Link
                        href={`/inmobiliarias/${agency.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Consultar
                    </Link>
                </div>
            </div>
        </article>
    )
}
