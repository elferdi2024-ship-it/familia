import { getAllNeighborhoods } from '@/lib/neighborhoods';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Explorar Barrios de Uruguay | Guía Inmobiliaria Barrio.uy',
    description: 'Descubrí los mejores barrios para vivir en Montevideo, Maldonado, Canelones y todo Uruguay. Información de mercado y propiedades destacadas por zona.',
};

export default function BarriosIndexPage() {
    const allNeighborhoods = getAllNeighborhoods();

    // Agrupar por departamento para una mejor visualización
    const grouped = allNeighborhoods.reduce((acc, n) => {
        if (!acc[n.department]) acc[n.department] = {};
        if (!acc[n.department][n.city]) acc[n.department][n.city] = [];
        acc[n.department][n.city].push(n);
        return acc;
    }, {} as Record<string, Record<string, any[]>>);

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Explorá Uruguay por Barrios
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl">
                        Seleccioná tu zona de interés para ver estadísticas de mercado, guías de vida y las mejores ofertas inmobiliarias disponibles.
                    </p>
                </div>

                <div className="space-y-16">
                    {Object.entries(grouped).map(([dept, cities]) => (
                        <section key={dept}>
                            <h2 className="text-2xl font-bold text-slate-900 border-b-2 border-primary w-fit pb-2 mb-8">
                                {dept}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Object.entries(cities).map(([city, hoods]) => (
                                    <div key={city} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {city}
                                        </h3>
                                        <ul className="space-y-2">
                                            {hoods.map((n) => (
                                                <li key={n.slug}>
                                                    <Link
                                                        href={`/barrio/${n.slug}`}
                                                        className="text-slate-500 hover:text-primary transition-colors flex items-center justify-between group"
                                                    >
                                                        <span>{n.name}</span>
                                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
