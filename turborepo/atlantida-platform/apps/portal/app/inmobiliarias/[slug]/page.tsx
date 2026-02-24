import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { AGENCIES, getAgencyBySlug } from "@/data/agencies"
import { BadgeCheck, Phone, Mail, MapPin, Building2, Globe } from "lucide-react"

export async function generateStaticParams() {
    return AGENCIES.map((a) => ({ slug: a.slug }))
}

export default async function InmobiliariaProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const agency = getAgencyBySlug(slug)

    if (!agency) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            <div className="h-20 shrink-0" aria-hidden />

            {/* Hero */}
            <header className="relative h-[40vh] min-h-[280px] max-h-[400px] overflow-hidden">
                <Image
                    src={agency.coverImage}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-slate-900/70" />
                <div className="absolute inset-0 flex items-end">
                    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 pt-24 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="flex items-end gap-4">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white dark:bg-slate-800 shrink-0">
                                <Image
                                    src={agency.logo}
                                    alt=""
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="pb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                                        {agency.name}
                                    </h1>
                                    {agency.verified && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
                                            <BadgeCheck className="w-3 h-3" />
                                            Verificada
                                        </span>
                                    )}
                                </div>
                                {agency.tagline && (
                                    <p className="text-slate-300 text-sm mt-0.5">{agency.tagline}</p>
                                )}
                            </div>
                        </div>
                        <a
                            href={agency.phone ? `https://wa.me/${agency.phone.replace(/\D/g, "")}` : "#contacto"}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shrink-0"
                        >
                            <Phone className="w-4 h-4" />
                            Consultar
                        </a>
                    </div>
                </div>
            </header>

            {/* Breadcrumb */}
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Estás en:{" "}
                        <Link href="/" className="text-slate-700 dark:text-slate-300 hover:underline">
                            Barrio.uy
                        </Link>
                        {" > "}
                        <Link href="/inmobiliarias" className="text-slate-700 dark:text-slate-300 hover:underline">
                            Inmobiliarias
                        </Link>
                        {" > "}
                        <span className="text-slate-900 dark:text-white font-medium">{agency.name}</span>
                    </p>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                {/* Acerca de */}
                <section className="mb-16">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                        Acerca de {agency.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                                {agency.longDescription || agency.description}
                            </p>
                            {agency.sinceYear && (
                                <p className="text-slate-500 dark:text-slate-500 text-sm mt-4">
                                    En el mercado desde {agency.sinceYear}.
                                    {agency.propertiesCount != null && (
                                        <> · {agency.propertiesCount} propiedades publicadas en Barrio.uy.</>
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <Image
                                src={agency.gallery[0] ?? agency.coverImage}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                    </div>
                </section>

                {/* Contacto */}
                <section id="contacto" className="mb-16">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                        Contacto
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {agency.phone && (
                            <a
                                href={`https://wa.me/${agency.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        WhatsApp
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Ver teléfono
                                    </p>
                                </div>
                            </a>
                        )}
                        {agency.email && (
                            <a
                                href={`mailto:${agency.email}`}
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Email
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        {agency.email}
                                    </p>
                                </div>
                            </a>
                        )}
                        {agency.address && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Dirección
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {agency.address}
                                        {agency.city && `, ${agency.city}`}
                                    </p>
                                </div>
                            </div>
                        )}
                        {agency.website && (
                            <a
                                href={agency.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                    <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Web
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                        Visitar sitio
                                    </p>
                                </div>
                            </a>
                        )}
                    </div>
                </section>

                {/* Sucursales */}
                {agency.branches && agency.branches.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                            Sucursales
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {agency.branches.map((branch, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                                >
                                    <Building2 className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {branch.name}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                            {branch.address}, {branch.city}
                                        </p>
                                        {branch.phone && (
                                            <a
                                                href={`https://wa.me/${branch.phone.replace(/\D/g, "")}`}
                                                className="text-sm text-primary font-medium mt-2 inline-flex items-center gap-1"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                {branch.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Galería */}
                {agency.gallery.length > 0 && (
                    <section id="galeria" className="mb-16">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                            Galería
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {agency.gallery.map((src, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800"
                                >
                                    <Image
                                        src={src}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 md:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            ¿Buscás propiedad con {agency.name}?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Explorá sus publicaciones en Barrio.uy o contactalos directamente.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Ver propiedades
                        </Link>
                        {agency.phone && (
                            <a
                                href={`https://wa.me/${agency.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                WhatsApp
                            </a>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const agency = getAgencyBySlug(slug)
    if (!agency) return { title: "Inmobiliaria no encontrada" }
    return {
        title: `${agency.name} | Inmobiliarias | Barrio.uy`,
        description: agency.description,
        openGraph: {
            title: `${agency.name} | Barrio.uy`,
            description: agency.description,
            images: [agency.coverImage],
        },
    }
}
