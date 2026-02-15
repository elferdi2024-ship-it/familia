"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CompareBar } from "@/components/CompareBar"
import { FavoriteButton } from "@/components/FavoriteButton"
import { PROPERTY_TYPES, OPERATIONS } from "@/lib/data"

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
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-20 md:pb-0">

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[480px] md:h-[75vh] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            alt="Montevideo Rambla"
            fill
            priority
            className="object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfMvv_cucSUX8J5YIBk8CNdN5fwhks2Wz-19l-yVR41J3stvX6VKPim3D-D0wU0Q2DhyzYt5CdbR5xmft3ey8k8Ve3kOgLI0mCSsBQ8KZpH4Fwf2pEjsNoJ13p5sGPsiI7q6GTS5nfUR1t2ZUFNj0TfsYWFEZrSxIeTkeSKCYU5i9mVE3ErMJjVtPcvvYnM-RaD6RVL7ULsqdhhY-LL55GwxE8GbYF0UI4H-71Ohgq824SjzrDA_J3Y0fZM-td_bKUSyWjBURm-9XF"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
        </div>
        <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 text-center text-white">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-3 md:mb-4 tracking-tight">
            Encontrá tu próximo hogar.
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-medium opacity-90 mb-6 md:mb-10">
            12.842 propiedades activas en Uruguay
          </p>

          {/* Search Capsule with Dropdowns */}
          <div className="bg-white dark:bg-background-dark rounded-2xl md:rounded-full shadow-2xl max-w-3xl mx-auto overflow-visible">
            {/* Mobile: stacked rows — Desktop: single row */}
            <div className="flex flex-col md:flex-row md:items-center md:h-[64px] p-2 gap-2 md:gap-0">

              {/* Row 1 (mobile) / Left section (desktop): Dropdowns */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Property Type Dropdown */}
                <div ref={typeRef} className="relative">
                  <button
                    onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowOpDropdown(false) }}
                    className={`flex items-center gap-1.5 h-11 px-3 md:px-4 rounded-xl md:rounded-full text-sm font-bold transition-all border ${showTypeDropdown || selectedTypes.length > 0
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary/50"
                      }`}
                  >
                    <span className="material-icons text-lg">home_work</span>
                    <span className="max-w-[120px] truncate">{typeLabel}</span>
                    <span className="material-icons text-base">{showTypeDropdown ? "expand_less" : "expand_more"}</span>
                  </button>

                  {/* Type Dropdown Panel */}
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* "Todos" option */}
                      <button
                        onClick={() => setSelectedTypes([])}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${selectedTypes.length === 0
                          ? "text-primary bg-primary/5"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                      >
                        Todos
                        {selectedTypes.length === 0 && (
                          <span className="material-icons text-primary text-lg">check</span>
                        )}
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2"></div>
                      {PROPERTY_TYPES.map(t => {
                        const isSelected = selectedTypes.includes(t)
                        return (
                          <button
                            key={t}
                            onClick={() => toggleType(t)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${isSelected
                              ? "text-primary bg-primary/5"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                              }`}
                          >
                            {t}
                            {isSelected && (
                              <span className="material-icons text-primary text-lg">check</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Operation Dropdown */}
                <div ref={opRef} className="relative">
                  <button
                    onClick={() => { setShowOpDropdown(!showOpDropdown); setShowTypeDropdown(false) }}
                    className={`flex items-center gap-1.5 h-11 px-3 md:px-4 rounded-xl md:rounded-full text-sm font-bold transition-all border ${showOpDropdown
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary/50"
                      }`}
                  >
                    <span className="truncate">{operation}</span>
                    <span className="material-icons text-base">{showOpDropdown ? "expand_less" : "expand_more"}</span>
                  </button>

                  {/* Operation Dropdown Panel */}
                  {showOpDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {OPERATIONS.map(op => (
                        <button
                          key={op}
                          onClick={() => { setOperation(op); setShowOpDropdown(false) }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${operation === op
                            ? "text-primary bg-primary/5 font-bold"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                          {op}
                          {operation === op && (
                            <span className="material-icons text-primary text-lg">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider (desktop only) */}
              <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {/* Row 2 (mobile) / Right section (desktop): Search input */}
              <div className="flex items-center h-12 md:h-full flex-1 min-w-0 px-3 md:px-1">
                <span className="material-icons text-slate-400 mr-2">search</span>
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-base font-medium outline-none min-w-0"
                  placeholder="Barrio, ciudad o calle..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Link
                  href={`/search?${searchParams.toString()}`}
                  className="bg-primary text-white w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform flex-shrink-0 ml-2"
                >
                  <span className="material-icons">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust + Activity Strip */}
      <CompareBar />

      {/* Category Discovery Chips */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar md:flex-wrap md:justify-center md:overflow-visible md:pb-0">
          {[
            { icon: "apartment", label: "Apartamentos" },
            { icon: "home", label: "Casas" },
            { icon: "waves", label: "Frente al mar" },
            { icon: "trending_up", label: "Inversión" },
            { icon: "landscape", label: "Chacras y Campos" },
            { icon: "location_city", label: "Proyectos" }
          ].map((cat, i) => (
            <button key={i} className="flex-none flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-background-dark border border-primary/20 hover:border-primary transition-all shadow-sm">
              <span className="material-icons text-primary text-lg">{cat.icon}</span>
              <span className="text-sm font-bold">{cat.label}</span>
            </button>
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
            <Link href="/search" className="bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 max-w-fit text-sm md:text-base">
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

    </div>
  )
}
