"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Heart,
  Bed,
  Bath,
  Ruler,
  MapPin,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Rss,
  Building2,
  Home,
  Waves,
  Trees,
  Landmark,
} from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PROPERTY_TYPES, OPERATIONS } from "@/lib/data";
import { POSTS } from "@/data/posts";
import { Typewriter } from "@/components/ui/typewriter";

// Below-the-fold / animation-heavy components: separate chunk to improve LCP and TTI
const MagneticWrapper = dynamic(
  () => import("@repo/ui").then((m) => ({ default: m.MagneticWrapper })),
  { ssr: true }
);
const RevealText = dynamic(
  () => import("@repo/ui").then((m) => ({ default: m.RevealText })),
  { ssr: true }
);
const TiltCard = dynamic(
  () => import("@repo/ui").then((m) => ({ default: m.TiltCard })),
  { ssr: true }
);

// ───── Page Component ─────

export default function HomePage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [operation, setOperation] = useState("Venta");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showOpDropdown, setShowOpDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const typeRef = useRef<HTMLDivElement>(null);
  const opRef = useRef<HTMLDivElement>(null);

  // Click-outside to close dropdowns
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node))
        setShowTypeDropdown(false);
      if (opRef.current && !opRef.current.contains(e.target as Node))
        setShowOpDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleType(t: string) {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  const typeLabel =
    selectedTypes.length === 0
      ? "Tipo"
      : selectedTypes.length <= 2
        ? selectedTypes.join(", ")
        : `${selectedTypes.slice(0, 2).join(", ")}…`;

  const searchParams = new URLSearchParams();
  searchParams.set("operation", operation);
  if (selectedTypes.length > 0)
    searchParams.set("type", selectedTypes.join(","));
  if (searchQuery) searchParams.set("q", searchQuery);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-32 md:pb-0">
      {/* Hero Section v5 - WOW FACTOR */}
      <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Uruguay Propiedades"
            fill
            priority
            className="object-cover scale-105"
            src="/portada.webp"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 text-center text-white mt-6 md:mt-10 flex flex-col items-center">
          {/* <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md border border-white/10 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform cursor-default">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Más de 12.800 propiedades activas
          </div> */}

          <h1 className="mb-4 md:mb-7 text-4xl sm:text-5xl font-display font-semibold tracking-tight text-white md:text-[4.5rem] lg:text-[6rem] leading-[1.08] md:leading-[1.08] drop-shadow-2xl flex flex-col items-center min-h-[120px] md:min-h-[170px]">
            <span className="text-center px-4">¿Qué estás buscando hoy? 🏠</span>
            <span className="mt-2 md:mt-4 inline-block px-8 md:px-12 py-2 md:py-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 text-emerald-400 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              <Typewriter
                text={["Alquilar", "Comprar", "Vender"]}
                speed={70}
                deleteSpeed={40}
                waitTime={2000}
              />
            </span>
          </h1>

          <RevealText
            text="Conectamos a miles de compradores con las mejores agencias y agentes del país."
            as="p"
            className="mb-12 text-lg font-medium text-slate-300 md:text-2xl max-w-2xl mx-auto"
            duration={0.6}
            delay={0.6}
          />

          <div className="md:hidden mb-4 w-full max-w-sm">
            <Link
              href="/feed"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Rss className="w-4 h-4" />
              Ir al Feed
            </Link>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2 md:p-3 rounded-xl md:rounded-2xl shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-1">
              {/* Selector de Operación (Venta/Alquiler) */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg md:rounded-xl md:ml-1 shrink-0">
                {OPERATIONS.map((op) => (
                  <button
                    key={op}
                    onClick={() => setOperation(op)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${operation === op
                      ? "bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Input de búsqueda */}
              <div className="flex-1 flex items-center px-4 py-3 md:py-0 border-y md:border-y-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                <input
                  className="w-full bg-transparent border-none focus:outline-none text-sm md:text-base font-medium placeholder-slate-400 text-slate-900 dark:text-white truncate"
                  placeholder="¿Dónde quieres vivir? (Barrio, calle...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Botón de acción principal */}
              <MagneticWrapper>
                <Link
                  href={`/search?${searchParams.toString()}`}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 md:py-3 rounded-lg md:rounded-xl flex items-center justify-center gap-2 font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 shrink-0"
                >
                  <Search className="h-4 w-4 md:hidden" />
                  <span className="text-xs md:text-sm">
                    Buscar
                  </span>
                  <ArrowRight className="h-4 w-4 hidden md:block" />
                </Link>
              </MagneticWrapper>
            </div>
          </div>

          {/* Social Proof / System Live Status Mini UX */}
          {/* <div className="mt-14 flex flex-wrap justify-center items-center gap-6 md:gap-12 animate-in fade-in duration-1000 delay-1000">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-black uppercase tracking-widest opacity-80 backdrop-blur-md bg-black/20 px-3 py-1 rounded-full">
                Red Nacional
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                12.432
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">
                Inmuebles Analizados
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                USD 2.840
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">
                m² Promedio Montevideo
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                500+
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">
                Agentes Asociados
              </span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Trust + Activity Strip */}
      {/* <CompareBar /> */}

      {/* Category Discovery Chips v4 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <span className="text-[11px] font-semibold text-primary mb-2">
            Explorá por estilo
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            ¿Qué estás buscando hoy?
          </h2>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {[
            {
              icon: Building2,
              label: "Apartamentos",
              color: "text-blue-500",
              bg: "bg-blue-50",
              href: "/search?type=Apartamento",
            },
            {
              icon: Home,
              label: "Casas",
              color: "text-emerald-500",
              bg: "bg-emerald-50",
              href: "/search?type=Casa",
            },
            {
              icon: Waves,
              label: "Frente al mar",
              color: "text-cyan-500",
              bg: "bg-cyan-50",
              href: "/search?badge=Frente+al+Mar",
            },
            {
              icon: TrendingUp,
              label: "Inversión",
              color: "text-orange-500",
              bg: "bg-orange-50",
              href: "/search?viviendaPromovida=true",
            },
            {
              icon: Trees,
              label: "Chacras y Campos",
              color: "text-amber-600",
              bg: "bg-amber-50",
              href: "/search?type=Terreno",
            },
            {
              icon: Landmark,
              label: "Proyectos",
              color: "text-indigo-500",
              bg: "bg-indigo-50",
              href: "/search?badge=Premium",
            },
            {
              icon: Building2,
              label: "Inmobiliarias",
              color: "text-slate-600",
              bg: "bg-slate-100",
              href: "/inmobiliarias",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
            className="group relative flex-none flex flex-col items-center gap-3 px-7 py-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/40 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                className={`w-14 h-14 rounded-full ${cat.bg} dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}
              >
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Services CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden text-white shadow-2xl">
          {/* Video Background */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            >
              <source src="/flotantes-barrio.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 z-10 pointer-events-none"></div>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-white/10 border border-white/20 text-[11px] font-semibold mb-6 backdrop-blur-md">
                Servicios Integrales
              </span>
              <h2 className="text-3xl md:text-5xl font-semibold mb-6 leading-tight tracking-tight">
                Publicá y Vendé <br />
                <span className="text-primary">en Todo el País</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md font-medium">
                Ofrecemos soluciones completas para propietarios e inversores.
                Desde mantenimiento legal hasta gestión de reformas.
              </p>

              <Link
                href="/servicios"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10 gap-2"
              >
                Ver Todos los Servicios
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Small feature cards */}
              <Link
                href="/servicios"
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Propietarios</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Gestión, mantenimiento y tranquilidad total para tu inmueble.
                </p>
              </Link>
              <Link
                href="/servicios"
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Inversores</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Análisis de rentabilidad y oportunidades off-market.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destacadas Section - BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-16 gap-4">
          <div>
            <RevealText
              as="h2"
              text="Destacadas"
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight"
            />
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">
              Las oportunidades más destacadas de la semana
            </p>
          </div>
          <MagneticWrapper>
            <Link
              className="px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors w-fit self-start sm:self-auto"
              href="/search"
            >
              Explorar Portfolio <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[340px] md:auto-rows-[380px] gap-4 md:gap-6">
          {/* Card 1 - Highlight (Col 2, Row 2) */}
          <TiltCard className="md:col-span-2 lg:col-span-2 md:row-span-2 group bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-slate-200/50 dark:border-slate-800/50">
            <Link href="/property/1" className="block w-full h-full relative">
              <div className="absolute inset-0">
                <Image
                  alt="Property 1"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEJL59RDkUIGnT_zx8qvtK149oNbqK-iGLf-hD98LcRBkKWlWomv_W8zISMZFidif7IRaPeTsuBL6LsESki71K0EilOmQzzRCDlcbw_JTLPhaFdUZHaunqJWURtlX8jhzKpCGYhrnwUEAZjBuV1v85D_5XFIOvPDhO9_HSxWmPY49j7vBkgSkZpx7junf5SAvdenu7SZgWgAmtRJlmf9QuhLwlV5QtaYbnjbc3NWUNPyRs92psFkg3uNLFx5SYCGqFwux7XocDHArR"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>
              </div>
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm shadow-primary/30">
                  Bajó de Precio
                </span>
              </div>
              <div className="absolute top-6 right-6 z-10 bg-white/10 backdrop-blur-md rounded-full shadow-lg">
                <FavoriteButton
                  propertyId="1"
                  className="relative group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-8 z-10 text-white">
                <div className="text-3xl font-bold mb-2 opacity-90 drop-shadow-md">
                  USD 245.000
                </div>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-4 drop-shadow-lg group-hover:text-primary transition-colors">
                  Penthouse en Pocitos Nuevo
                </h3>
                <div className="flex items-center gap-6 text-sm font-semibold opacity-80 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-xl w-max">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-[18px] h-[18px]" /> 2
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-[18px] h-[18px]" /> 2
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-[18px] h-[18px]" /> 85m²
                  </span>
                </div>
              </div>
            </Link>
          </TiltCard>

          {/* Card 2 - Normal (Col 1, Row 1) */}
          <TiltCard className="md:col-span-1 lg:col-span-1 md:row-span-1 group bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-slate-200/50 dark:border-slate-800/50">
            <Link href="/property/2" className="block w-full h-full relative">
              <div className="absolute inset-0">
                <Image
                  alt="Property 2"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhNgn4o9KHFe6kCK3VPbGgmCNk_y9ReURtDqsHiNql-LJjibPWWhU8bhazbwM6feV965D2d4iDY8LF3Hqc3NdaP4mFryfu0X1mJeMysodlsi6jqJJKPsU-rs_-9srHS23FR-bV2oSwxA6_hVtg-RwzASCNc9XDVzc0sV1pfwZXyWslZf4uslSuFUyxmvxHYdeMj-bfrL_MwC7gjU1nYCcZO2EJEQaHlxYX8LV5bnPHjweEn6JyOvRuBK-Uvbf0iwJfPJI3vn1RSeTh"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              </div>
              <div className="absolute top-5 left-5 z-10">
                <span className="bg-orange-500 text-white text-[10px] font-semibold px-3 py-1.5 rounded-md shadow-lg">
                  Oportunidad
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-white">
                <div className="text-xl font-bold mb-1 drop-shadow-sm">
                  USD 580.000
                </div>
                <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2">
                  Casa Minimalista La Barra
                </h3>
                <div className="flex items-center gap-3 text-xs font-semibold opacity-80 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit">
                  <span className="flex items-center gap-1">
                    <Bed className="w-[14px] h-[14px]" /> 4
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-[14px] h-[14px]" /> 3
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="w-[14px] h-[14px]" /> 210m²
                  </span>
                </div>
              </div>
            </Link>
          </TiltCard>

          {/* Card 3 - Normal (Col 1, Row 1) */}
          <TiltCard className="md:col-span-1 lg:col-span-1 md:row-span-1 group bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-slate-200/50 dark:border-slate-800/50">
            <Link href="/property/3" className="block w-full h-full relative">
              <div className="absolute inset-0">
                <Image
                  alt="Property 3"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out grayscale-[0.2] group-hover:grayscale-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC67YJs7ZtyNE-aVoI_g6d-pFIVB7iEcoQwUGCuZDnckFYqGia63pNcIgoF42QruuhmdL9N2LhxoexeCOYwoyLR2_to3mPFzqszIOnNeippVJAfKObPkULgJBxCsii96Ft81Qffu5yjqu3hWa-KGm9tNESWcf4bSZvUaG6QrWM6VJSmioaU7SkWXANKh4k9BRXNgFpn7Isxz4s8PHRQ9gGoHJNgW3co8lY6Rw5VHq3rZen_pBMRz-XH3VSFfAYrSMoEeGyMMT8PDTKp"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-white">
                <div className="text-xl font-bold mb-1 drop-shadow-sm">
                  USD 168.000
                </div>
                <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-1">
                  Apartamento Cordón Sur
                </h3>
                <div className="flex items-center gap-3 text-xs font-semibold opacity-80 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit">
                  <span className="flex items-center gap-1">
                    <Bed className="w-[14px] h-[14px]" /> 1
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-[14px] h-[14px]" /> 1
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler className="w-[14px] h-[14px]" /> 45m²
                  </span>
                </div>
              </div>
            </Link>
          </TiltCard>

          {/* Card 4 - Wide (Col 2, Row 1) */}
          <TiltCard className="md:col-span-3 lg:col-span-2 md:row-span-1 group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-200/50 dark:border-slate-800/50">
            <Link
              href="/property/4"
              className="block w-full h-full relative flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-[45%] h-56 md:h-full shrink-0 overflow-hidden">
                <Image
                  alt="Property 4"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNRkuH34MD4uYE56vWNPE8LTxrq4Mze_JxKxRp-wRiC29veMX3Qju4BpQNga_XL-Sm93009bpOyxtmvkDGN0cI3A4JPRniG0BpJwj3cVNbnd_S2sYTCgofXvwD5_689UEGiNLij4c5sRwLP5Ipf9YpW3gy42WbIqWzrkzuPAzSPHc4Tf2Dws99TlwBo35H-z4jxmnAlOk_GtEFJzjkxnk_l7zltr0VTFuLCyFQrbiemdmNvtV78g_XmMX6-qXD4JX1ghviIUDot41"
                  sizes="50vw"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-center bg-slate-50 dark:bg-slate-900 z-10 relative">
                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-md self-start mb-4 border border-green-500/20 shadow-sm backdrop-blur-sm">
                  Recién Ingresado
                </span>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  USD 315.000
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 leading-tight mb-4 group-hover:text-primary transition-colors">
                  Loft de Diseño en C. Vieja
                </h3>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-semibold mt-auto h-fit">
                  <span className="flex items-center gap-1 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg">
                    <Bed className="w-[16px] h-[16px]" /> 1
                  </span>
                  <span className="flex items-center gap-1 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg">
                    <Bath className="w-[16px] h-[16px]" /> 1
                  </span>
                  <span className="flex items-center gap-1 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg">
                    <Ruler className="w-[16px] h-[16px]" /> 120m²
                  </span>
                </div>
              </div>
            </Link>
          </TiltCard>
        </div>
      </section>

      {/* Map/Region Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 mb-12 md:mb-20">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 border border-primary/10">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 md:mb-4">
              ¿Buscás por zona?
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-6 md:mb-8 font-medium">
              Explorá el mercado uruguayo con nuestro mapa interactivo. Encontrá
              las mejores zonas para vivir o invertir en Montevideo, Maldonado,
              Canelones y más.
            </p>
            <Link
              href="/search?view=map"
              className="bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 max-w-fit text-sm md:text-base active:scale-[0.98]"
            >
              <MapPin className="w-4 h-4" />
              Abrir Mapa de Uruguay
            </Link>
          </div>
          <div className="flex-1 w-full aspect-video md:aspect-auto md:h-[300px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative shadow-inner">
            <Image
              alt="Map view"
              fill
              className="object-cover opacity-50 grayscale hover:grayscale-0 hover:opacity-70 transition-all duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5OgF16dr7RxAptUPvW5ivyrNiH34TAXd-bEAIchYWUzfaYR2GykCeLwwhsc9ikzFWm20CwG4_xTvYJVzYGyhJlCH5VIUCnEdF2sazDDI8K6qX-HpRwi_dAZ_YwaMSIL_E8poiBa0SqgFeSMUjt1zhlUHuA3mdWlCNcM0QUvTorxk85L5M8AoRm1e46h78GQvEUssvHeOb1CJqYAlwCOAmnl8Zmn869pjwkhsstq_JiukKl2WeJsvoZvARbKvoi0esc_Dt8h_phZqC"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-primary rounded-full absolute"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Barrio Feed CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30 p-8 md:p-12 shadow-2xl border border-white/5">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-[60px]"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center justify-items-start">
            <div className="w-full text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/20 border border-primary/30 text-primary text-[11px] font-semibold mb-6 backdrop-blur-md">
                <Rss className="w-3 h-3" /> Nuevo
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight tracking-tight">
                Barrio <span className="text-primary">Feed</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                El feed social inmobiliario de Uruguay. Descubrí bajadas de precio, propiedades nuevas y opiniones de agentes verificados de tu barrio.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/feed"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/30 text-sm"
                >
                  <Rss className="w-4 h-4" />
                  Ir al Feed
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Mini Feed Preview Cards */}
            <div className="space-y-3">
              {[
                { type: "🔥 Bajó de precio", text: "Apto en Cordón — USD 125.000", badge: "Ley 18.795", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/20" },
                { type: "🏠 Nueva publicación", text: "Penthouse en Pocitos — USD 285.000", badge: "Elite", color: "from-blue-500/20 to-primary/20", border: "border-blue-500/20" },
                { type: "📊 Actualización", text: "Pocitos, Cordón y P. Rodó: los barrios más...", badge: "", color: "from-slate-500/20 to-slate-600/20", border: "border-slate-500/20" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-r ${item.color} backdrop-blur-sm rounded-lg p-4 border ${item.border} hover:scale-[1.01] transition-transform cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-white/70">{item.type}</span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white/80">{item.badge}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white/90 truncate">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary text-[11px] font-semibold mb-4">
                <BookOpen className="w-3 h-3" /> Conocimiento Inmobiliario
              </div>
              <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4 italic">
                Mercado, Tendencias &{" "}
                <span className="text-primary">Noticias</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Nuestros expertos analizan el mercado para que tomes la mejor
                decisión al comprar o invertir en Uruguay.
              </p>
            </div>
            <Link
              href="/blog"
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20 flex items-center gap-2 group active:scale-[0.98]"
            >
              Ir al Blog Completo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {POSTS.slice(0, 3).map((post, i) => (
              <Link
                key={i}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-semibold rounded-md">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-[11px] font-semibold text-primary mb-3">
                    {post.date}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-primary font-semibold text-sm">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
