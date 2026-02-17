"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Camera, Heart, Bed, Ruler, MapPin, ArrowRight, BookOpen } from "lucide-react"
import { CompareBar } from "@/components/CompareBar"
import { FavoriteButton } from "@/components/FavoriteButton"
import { PROPERTY_TYPES, OPERATIONS } from "@/lib/data"
import { POSTS } from "@/data/posts"

// ───── Page Component ─────

export default function HomePage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [operation, setOperation] = useState("Venta")
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showOpDropdown, setShowOpDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const typeRef = useRef<HTMLDivElement>(null)
  const opRef = useRef<HTMLDivElement>(null)

  // Click-outside to close dropdowns
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setShowTypeDropdown(false)
      if (opRef.current && !opRef.current.contains(e.target as Node)) setShowOpDropdown(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function toggleType(t: string) {
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const typeLabel = selectedTypes.length === 0
    ? "Tipo"
    : selectedTypes.length <= 2
      ? selectedTypes.join(", ")
      : `${selectedTypes.slice(0, 2).join(", ")}…`

  const searchParams = new URLSearchParams()
  searchParams.set("operation", operation)
  if (selectedTypes.length > 0) searchParams.set("type", selectedTypes.join(","))
  if (searchQuery) searchParams.set("q", searchQuery)

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-32 md:pb-0">

      {/* Hero Section v4 - AUTHORITY & DATA */}
      <section className="relative h-[75vh] min-h-[600px] md:h-[85vh] md:min-h-[700px] flex flex-col items-center justify-start pt-32 md:justify-center md:pt-0 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            alt="Montevideo Hub"
            fill
            priority
            className="object-cover"
            src="/portada.webp"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background-light dark:to-background-dark"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 md:px-6 text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/20">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Más de 12.800 propiedades activas en Uruguay
          </div>

          <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-7xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            Encontrá tu próximo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-300">Hogar en Uruguay</span>
          </h1>

          <p className="mb-10 text-lg font-medium text-slate-200 md:text-xl">
            La forma más rápida y segura de comprar o alquilar tu propiedad.
          </p>

          <div className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-1">

              {/* Selector de Operación (Venta/Alquiler) */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl md:rounded-full md:ml-1 shrink-0">
                {OPERATIONS.map((op) => (
                  <button
                    key={op}
                    onClick={() => setOperation(op)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${operation === op
                      ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
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
              <Link
                href={`/search?${searchParams.toString()}`}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 md:py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 font-bold transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 shrink-0"
              >
                <Search className="h-4 w-4 md:hidden" />
                <span className="uppercase tracking-widest text-xs md:text-sm">Buscar</span>
                <ArrowRight className="h-4 w-4 hidden md:block" />
              </Link>
            </div>
          </div>

          {/* Social Proof / System Live Status Mini UX */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 md:gap-12 animate-in fade-in duration-1000 delay-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-black uppercase tracking-widest opacity-70">Sistema en Vivo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-primary">12.432</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Inmuebles Analizados</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-primary">USD 2.840</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">m² Promedio Montevideo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-500">842</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Oportunidades Detectadas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust + Activity Strip */}
      <CompareBar />

      {/* Category Discovery Chips v4 */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Explorá por estilo</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">¿Qué estás buscando hoy?</h2>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {[
            { icon: "apartment", label: "Apartamentos", color: "text-blue-500", bg: "bg-blue-50", href: "/search?type=Apartamento" },
            { icon: "home", label: "Casas", color: "text-emerald-500", bg: "bg-emerald-50", href: "/search?type=Casa" },
            { icon: "waves", label: "Frente al mar", color: "text-cyan-500", bg: "bg-cyan-50", href: "/search?badge=Frente+al+Mar" },
            { icon: "trending_up", label: "Inversión", color: "text-orange-500", bg: "bg-orange-50", href: "/search?viviendaPromovida=true" },
            { icon: "landscape", label: "Chacras y Campos", color: "text-amber-600", bg: "bg-amber-50", href: "/search?type=Terreno" },
            { icon: "location_city", label: "Proyectos", color: "text-indigo-500", bg: "bg-indigo-50", href: "/search?badge=Premium" }
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative flex-none flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-full ${cat.bg} dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <span className={`material-icons text-2xl ${cat.color}`}>{cat.icon}</span>
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tendencias Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Tendencias</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">Las oportunidades más destacadas de la semana</p>
          </div>
          <Link className="text-primary font-bold text-sm flex items-center gap-1 hover:underline flex-shrink-0" href="/search">
            Ver todas <span className="material-icons text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Card 1 */}
          <Link href="/property/1" className="group bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5">
            <div className="relative h-48 lg:h-56 overflow-hidden">
              <Image
                alt="Property 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEJL59RDkUIGnT_zx8qvtK149oNbqK-iGLf-hD98LcRBkKWlWomv_W8zISMZFidif7IRaPeTsuBL6LsESki71K0EilOmQzzRCDlcbw_JTLPhaFdUZHaunqJWURtlX8jhzKpCGYhrnwUEAZjBuV1v85D_5XFIOvPDhO9_HSxWmPY49j7vBkgSkZpx7junf5SAvdenu7SZgWgAmtRJlmf9QuhLwlV5QtaYbnjbc3NWUNPyRs92psFkg3uNLFx5SYCGqFwux7XocDHArR"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">Bajó de Precio</span>
              </div>
              <FavoriteButton propertyId="1" className="absolute top-4 right-4" />
            </div>
            <div className="p-5">
              <div className="text-[22px] font-extrabold text-primary mb-1 tracking-tight">USD 245.000</div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">Penthouse en Pocitos Nuevo</h3>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-icons text-xs">bed</span> 2</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">shower</span> 2</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">square_foot</span> 85m²</span>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="material-icons text-xs">place</span> Montevideo
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Hoy 14:20</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/property/2" className="group bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5">
            <div className="relative h-48 overflow-hidden">
              <Image
                alt="Property 2"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhNgn4o9KHFe6kCK3VPbGgmCNk_y9ReURtDqsHiNql-LJjibPWWhU8bhazbwM6feV965D2d4iDY8LF3Hqc3NdaP4mFryfu0X1mJeMysodlsi6jqJJKPsU-rs_-9srHS23FR-bV2oSwxA6_hVtg-RwzASCNc9XDVzc0sV1pfwZXyWslZf4uslSuFUyxmvxHYdeMj-bfrL_MwC7gjU1nYCcZO2EJEQaHlxYX8LV5bnPHjweEn6JyOvRuBK-Uvbf0iwJfPJI3vn1RSeTh"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">Oportunidad</span>
              </div>
              <FavoriteButton propertyId="2" className="absolute top-4 right-4" />
            </div>
            <div className="p-5">
              <div className="text-[22px] font-extrabold text-primary mb-1 tracking-tight">USD 580.000</div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">Casa Minimalista La Barra</h3>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-icons text-xs">bed</span> 4</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">shower</span> 3</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">square_foot</span> 210m²</span>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="material-icons text-xs">place</span> Punta del Este
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Hoy 11:05</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/property/3" className="group bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5">
            <div className="relative h-48 overflow-hidden">
              <Image
                alt="Property 3"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC67YJs7ZtyNE-aVoI_g6d-pFIVB7iEcoQwUGCuZDnckFYqGia63pNcIgoF42QruuhmdL9N2LhxoexeCOYwoyLR2_to3mPFzqszIOnNeippVJAfKObPkULgJBxCsii96Ft81Qffu5yjqu3hWa-KGm9tNESWcf4bSZvUaG6QrWM6VJSmioaU7SkWXANKh4k9BRXNgFpn7Isxz4s8PHRQ9gGoHJNgW3co8lY6Rw5VHq3rZen_pBMRz-XH3VSFfAYrSMoEeGyMMT8PDTKp"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">Bajó de Precio</span>
              </div>
              <FavoriteButton propertyId="3" className="absolute top-4 right-4" />
            </div>
            <div className="p-5">
              <div className="text-[22px] font-extrabold text-primary mb-1 tracking-tight">USD 168.000</div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">Apartamento Cordón Sur</h3>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-icons text-xs">bed</span> 1</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">shower</span> 1</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">square_foot</span> 45m²</span>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="material-icons text-xs">place</span> Montevideo
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Ayer</span>
              </div>
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/property/4" className="group bg-white dark:bg-background-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-primary/5">
            <div className="relative h-48 overflow-hidden">
              <Image
                alt="Property 4"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZNRkuH34MD4uYE56vWNPE8LTxrq4Mze_JxKxRp-wRiC29veMX3Qju4BpQNga_XL-Sm93009bpOyxtmvkDGN0cI3A4JPRniG0BpJwj3cVNbnd_S2sYTCgofXvwD5_689UEGiNLij4c5sRwLP5Ipf9YpW3gy42WbIqWzrkzuPAzSPHc4Tf2Dws99TlwBo35H-z4jxmnAlOk_GtEFJzjkxnk_l7zltr0VTFuLCyFQrbiemdmNvtV78g_XmMX6-qXD4JX1ghviIUDot41"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">Recién Ingresado</span>
              </div>
              <FavoriteButton propertyId="4" className="absolute top-4 right-4" />
            </div>
            <div className="p-5">
              <div className="text-[22px] font-extrabold text-primary mb-1 tracking-tight">USD 315.000</div>
              <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">Loft de Diseño en Ciudad Vieja</h3>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1"><span className="material-icons text-xs">bed</span> 1</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">shower</span> 1</span>
                <span className="flex items-center gap-1"><span className="material-icons text-xs">square_foot</span> 120m²</span>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="material-icons text-xs">place</span> Montevideo
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Hace 2 horas</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Map/Region Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 mb-12 md:mb-20">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-primary/10">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 md:mb-4">¿Buscás por zona?</h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-6 md:mb-8 font-medium">
              Explorá el mercado uruguayo con nuestro mapa interactivo. Encontrá las mejores zonas para vivir o invertir en Montevideo, Maldonado, Canelones y más.
            </p>
            <Link href="/search?view=map" className="bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 max-w-fit text-sm md:text-base">
              <span className="material-icons">map</span>
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

      {/* Featured Blog Section */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <BookOpen className="w-3 h-3" /> Conocimiento Inmobiliario
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic">
                Mercado, Tendencias & <span className="text-primary">Noticias</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Nuestros expertos analizan el mercado para que tomes la mejor decisión al comprar o invertir en Uruguay.
              </p>
            </div>
            <Link
              href="/blog"
              className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/20 flex items-center gap-2 group"
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
                className="group flex flex-col bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
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
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">{post.category}</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">{post.date}</span>
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                    Leer más <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
