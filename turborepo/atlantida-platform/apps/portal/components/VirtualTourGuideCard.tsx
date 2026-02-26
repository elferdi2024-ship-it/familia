"use client"

import { useState } from "react"
import Link from "next/link"

type UserPlan = "free" | "pro" | "premium" | "elite"

const PLAN_CONFIG: Record<string, { locked: boolean; label: string; cta: string | null; ctaHref: string; badge: string | null; badgeColor: string }> = {
  free: {
    locked: true,
    label: "Plan Base",
    cta: "Mejorá a Pro para activar tours virtuales",
    ctaHref: "/publish/pricing",
    badge: null,
    badgeColor: "#7F8C8D",
  },
  pro: {
    locked: false,
    label: "Plan Pro",
    cta: null,
    ctaHref: "",
    badge: "✨ Tour guiado incluido",
    badgeColor: "#2471A3",
  },
  premium: {
    locked: false,
    label: "Plan Premium",
    cta: null,
    ctaHref: "",
    badge: "⭐ Incluido en Premium",
    badgeColor: "#1E8449",
  },
  elite: {
    locked: false,
    label: "Plan Premium",
    cta: null,
    ctaHref: "",
    badge: "⭐ Incluido en Premium",
    badgeColor: "#1E8449",
  },
}

const STEPS_STANDARD = [
  { icon: "📸", title: "Sacá fotos con la cámara normal", desc: "Una foto por cada espacio: living, cocina, dormitorios, baño, terraza. No necesitás ninguna app especial. Cuanto mejor la luz, mejor el resultado." },
  { icon: "🏷️", title: "Nombrá cada espacio al subir", desc: 'Al subir las fotos en Barrio.uy, escribís el nombre del espacio debajo de cada una: "Living", "Cocina", "Dormitorio principal". Eso arma el recorrido.' },
  { icon: "🔢", title: "Ordená el recorrido", desc: "Arrastrá las fotos para definir el orden. Recomendamos: entrada → living → cocina → dormitorios → baño." },
  { icon: "✅", title: "Publicá y activá el tour", desc: "Con 3 o más fotos nombradas, el tour queda activo. Tu aviso va a mostrar el badge '🏠 Tour virtual' en el listado." },
]

const STEPS_360 = [
  {
    icon: "📲",
    title: "Descargá la app según tu teléfono",
    desc: "Ambas apps son gratuitas y de Google. Hacen exactamente lo mismo: te guían para capturar una foto esférica completa del espacio.",
    linkAndroid: { label: "Google Camera (Android)", url: "https://play.google.com/store/apps/details?id=com.google.android.GoogleCamera", note: "Play Store — modo Photo Sphere en el menú «Más»" },
    linkIos: { label: "Google Street View (iPhone)", url: "https://apps.apple.com/app/google-street-view/id904418768", note: "App Store — usá el ícono de cámara dentro de la app" },
  },
  {
    icon: "🎯",
    title: "Posicionáte en el centro del cuarto",
    desc: "Parate en el medio del espacio que querés capturar. Mantené el teléfono vertical. La app te va a mostrar puntos naranjas en pantalla que tenés que apuntar uno por uno girando despacio.",
  },
  {
    icon: "🔄",
    title: "Girá lentamente siguiendo los puntos",
    desc: "La app te guía: apuntás al punto → hace clic automático → aparece el siguiente. Cubrís arriba, el medio y abajo. Todo el proceso dura unos 2-3 minutos por habitación.",
  },
  {
    icon: "💾",
    title: "Guardá la foto esférica",
    desc: "La app une todo automáticamente y te queda una sola imagen (foto equirectangular). Guardala en la mejor calidad. Pesa entre 5 y 15 MB.",
  },
  {
    icon: "🚀",
    title: "Subila en Barrio.uy como foto 360°",
    desc: "Al subir fotos en tu publicación, marcá la opción '360°' en esa imagen. Barrio.uy la muestra como visor interactivo donde el interesado puede mirar en todas direcciones.",
  },
]

type LinkButton = { label: string; url: string; note: string }
type StepWithLink = {
  icon: string
  title: string
  desc: string
  linkAndroid?: LinkButton
  linkIos?: LinkButton
}

function StepCard({ step, index, siteName }: { step: StepWithLink; index: number; siteName: string }) {
  const hasLinks = step.linkAndroid || step.linkIos
  return (
    <div className="flex gap-3.5 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
        {step.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</span>
        </div>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc.replace(/Barrio\.uy/g, siteName)}</p>
        {hasLinks && (
          <div className="flex flex-col gap-2 mt-3">
            {step.linkAndroid && (
              <a
                href={step.linkAndroid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-primary text-white no-underline hover:bg-primary/90 transition-colors"
              >
                <span className="text-lg">🤖</span>
                <div>
                  <div className="text-[13px] font-bold">{step.linkAndroid.label}</div>
                  <div className="text-[11px] opacity-90">{step.linkAndroid.note}</div>
                </div>
              </a>
            )}
            {step.linkIos && (
              <a
                href={step.linkIos.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-700 text-white no-underline hover:bg-slate-600 transition-colors"
              >
                <span className="text-lg">🍎</span>
                <div>
                  <div className="text-[13px] font-bold">{step.linkIos.label}</div>
                  <div className="text-[11px] opacity-90">{step.linkIos.note}</div>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function LockedOverlay({ cta, ctaHref }: { cta: string; ctaHref: string }) {
  return (
    <div className="absolute inset-0 rounded-2xl bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10 p-6">
      <div className="text-4xl">🔒</div>
      <p className="text-white font-bold text-base text-center drop-shadow-sm">
        Feature exclusiva de Plan Pro y Premium
      </p>
      <Link
        href={ctaHref}
        className="px-6 py-2.5 rounded-3xl font-bold text-sm bg-white text-primary shadow-lg hover:bg-slate-100 transition-colors"
      >
        {cta} →
      </Link>
    </div>
  )
}

interface VirtualTourGuideCardProps {
  userPlan?: UserPlan
  /** Nombre del sitio (Barrio.uy, MiBarrio.uy, etc.) */
  siteName?: string
}

export function VirtualTourGuideCard({ userPlan = "free", siteName = "Barrio.uy" }: VirtualTourGuideCardProps) {
  const [tab, setTab] = useState<"360" | "standard">("360")
  const config = PLAN_CONFIG[userPlan] ?? PLAN_CONFIG.free
  const hasPremium360 = userPlan === "premium" || userPlan === "elite"
  const is360Locked = !hasPremium360

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
        {config.locked && <LockedOverlay cta={config.cta!} ctaHref={config.ctaHref} />}

        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Tour Virtual de tu propiedad
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mostrá cada espacio como si el interesado estuviera ahí
              </p>
            </div>
          </div>
          {config.badge && (
            <span
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: config.badgeColor }}
            >
              {config.badge}
            </span>
          )}
        </div>

        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
            {[
              { id: "360" as const, label: "🌐 360° con app de Google", sublabel: "Recomendado" },
              { id: "standard" as const, label: "📸 Fotos por separado", sublabel: "Opción alternativa" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2 px-2 rounded-lg border-none cursor-pointer transition-all text-left ${
                  tab === t.id
                    ? "bg-white dark:bg-slate-900 shadow-md"
                    : "bg-transparent"
                }`}
              >
                <div className={`text-[13px] font-bold ${tab === t.id ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}>
                  {t.label}
                </div>
                <div className={`text-[11px] font-semibold ${tab === t.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                  {t.sublabel}
                </div>
              </button>
            ))}
          </div>

          {/* Descripción del tab */}
          {tab === "360" && (
            is360Locked ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                  <strong>El modo 360° es exclusivo de Plan Premium.</strong> En Plan Pro mantenés el tour guiado por habitaciones con fotos normales.
                </p>
                <Link
                  href="/publish/pricing"
                  className="inline-flex mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Activar Premium →
                </Link>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                  <strong>La mejor experiencia, con apps gratuitas de Google.</strong> En Android usás <strong>Google Camera</strong>; en iPhone usás <strong>Google Street View</strong>. Las dos funcionan igual: te guían para girar y arman la foto 360° automáticamente. <strong>No necesitás cámara especial.</strong>
                </p>
              </div>
            )
          )}
          {tab === "standard" && (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mb-4">
              <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                <strong>Sin apps extras.</strong> Subís las fotos normales que ya tenés y nombrás cada espacio. El resultado es un recorrido guiado por habitaciones, sin el efecto 360° interactivo. Ideal si todavía no pudiste instalar la app de Google.
              </p>
            </div>
          )}

          {/* Pasos */}
          <div className="flex flex-col gap-2.5">
            {(tab === "360" ? (is360Locked ? [] : STEPS_360) : STEPS_STANDARD).map((step, i) => (
              <StepCard key={i} step={step} index={i} siteName={siteName} />
            ))}
            {tab === "360" && is360Locked && (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-600 dark:text-slate-300">
                Cambiá a Premium para ver la guía completa de captura 360° y habilitar el visor inmersivo.
              </div>
            )}
          </div>

          {/* Requisitos */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Requisitos
            </p>
            <div className="flex flex-wrap gap-2">
              {(tab === "360"
                ? [hasPremium360 ? "⭐ Plan Premium" : "🔒 Solo Plan Premium", "🤖 Android o iPhone", "📲 App gratuita de Google", "💡 Buena luz en el cuarto", "⏱️ 2-3 min por habitación"]
                : ["✅ Plan Pro o Premium", "📸 Mínimo 3 fotos", "🏷️ Nombre de cada espacio", "💡 Buena luz natural"]
              ).map((req, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* CTA si desbloqueado */}
          {!config.locked && (
            <div className="mt-4 flex gap-2 flex-wrap">
              <Link
                href="/publish"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-3xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                📤 Publicar propiedad con tour →
              </Link>
              <Link
                href="/my-properties"
                className="px-5 py-2.5 rounded-3xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Ver mis propiedades
              </Link>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center leading-relaxed">
        Los tours virtuales generan <strong className="text-emerald-600 dark:text-emerald-400">3× más contactos</strong> que avisos sin tour.
      </p>
    </div>
  )
}
