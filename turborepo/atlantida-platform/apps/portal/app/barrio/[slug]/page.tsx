import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNeighborhoodBySlug, getAllNeighborhoods } from '@/lib/neighborhoods';
import { getSEOContent } from "@repo/lib/seo";
import Link from 'next/link';
import { ArrowRight, MapPin, TrendingUp, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const neighborhood = getNeighborhoodBySlug(slug);

    if (!neighborhood) {
        return { title: 'Barrio no encontrado | Barrio.uy' };
    }

    const title = `Vivir en ${neighborhood.name}, ${neighborhood.city} | Guía Inmobiliaria Barrio.uy`;
    const description = `Explorá ${neighborhood.name}. Precios de mercado, mejores zonas para vivir y oportunidades de inversión en ${neighborhood.city}, ${neighborhood.department}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
    };
}

export default async function NeighborhoodPage({ params }: Props) {
    const { slug } = await params;
    const neighborhood = getNeighborhoodBySlug(slug);

    if (!neighborhood) {
        notFound();
    }

    const seoData = getSEOContent(neighborhood.name);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1569431075133-4f9019688753?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MapPin className="w-3 h-3 text-primary-foreground" />
                        {neighborhood.department}, Uruguay
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {neighborhood.name}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {seoData?.intro || `Descubrí por qué ${neighborhood.name} es uno de los lugares más buscados de ${neighborhood.city}. Estilo de vida, servicios y las mejores propiedades.`}
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Market Stats */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Inteligencia de Mercado en {neighborhood.name}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Precio Promedio m²</span>
                                    <div className="text-2xl font-bold text-slate-900">USD 2.850</div>
                                    <div className="text-xs text-green-600 font-medium mt-1">↑ 4.2% este año</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Demanda Actual</span>
                                    <div className="text-2xl font-bold text-slate-900">Alta</div>
                                    <div className="text-xs text-slate-500 font-medium mt-1">Más de 500 clics diarios</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Rentabilidad Alquiler</span>
                                    <div className="text-2xl font-bold text-slate-900">5.8% anual</div>
                                    <div className="text-xs text-slate-500 font-medium mt-1">Ideal para inversores</div>
                                </div>
                            </div>
                        </section>

                        {/* Neighborhood Description */}
                        <section className="prose prose-slate max-w-none">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Un Barrio con Identidad Propia</h2>
                            <div className="text-slate-600 leading-relaxed text-lg space-y-6">
                                <p>
                                    {neighborhood.name} se destaca en {neighborhood.city} por su equilibrio perfecto entre servicios modernos y tradición uruguaya.
                                    Desde sus calles arboladas hasta su conectividad estratégica, vivir aquí significa estar cerca de todo lo que importa.
                                </p>
                                <p>
                                    La zona ofrece una amplia variedad de opciones gastronómicas, centros culturales y espacios verdes que fomentan una vida comunitaria activa y segura.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Conversion */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 font-primary">¿Buscás en {neighborhood.name}?</h3>

                            <div className="space-y-4">
                                <Link href={`/search?operation=Venta&neighborhood=${neighborhood.name}`} className="block">
                                    <Button className="w-full justify-between h-14 text-lg font-semibold rounded-2xl group shadow-md" size="lg">
                                        <span className="flex items-center gap-3">
                                            <Building2 className="w-5 h-5" />
                                            Ver Casas en Venta
                                        </span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>

                                <Link href={`/search?operation=Alquiler&neighborhood=${neighborhood.name}`} className="block">
                                    <Button variant="outline" className="w-full justify-between h-14 text-lg font-semibold rounded-2xl group border-2 border-slate-100 hover:bg-slate-50" size="lg">
                                        <span className="flex items-center gap-3">
                                            <Home className="w-5 h-5" />
                                            Ver Alquileres
                                        </span>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>

                            <hr className="my-8 border-slate-100" />

                            <div className="space-y-4">
                                <p className="text-sm font-medium text-slate-500 text-center px-4">
                                    ¿Sos propietario en {neighborhood.name}?
                                </p>
                                <Link href="/publish" className="block text-center text-primary font-bold hover:underline">
                                    Publicá tu propiedad gratis hoy →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer SEO Links */}
            <section className="bg-white border-t border-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Otros Barrios en Uruguay</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {getAllNeighborhoods().slice(0, 18).map((n) => (
                            <Link key={n.slug} href={`/barrio/${n.slug}`} className="text-sm text-slate-500 hover:text-primary transition-colors">
                                Propiedades en {n.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    return getAllNeighborhoods().map((n) => ({
        slug: n.slug,
    }));
}
