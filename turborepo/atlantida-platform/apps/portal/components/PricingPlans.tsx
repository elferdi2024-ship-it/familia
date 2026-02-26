'use client';

/**
 * PricingPlans — Barrio.uy
 * Cards de planes con soporte para modo Fundador, toggle mensual/anual,
 * precios animados con ScrollingNumbers y FOMO "Lo que te perdés".
 *
 * Uso:
 *   import { PricingPlans } from '@/components/PricingPlans';
 *   <PricingPlans isFounderMode={true} currentPlan="free" onSelect={(planId, isAnnual) => ...} />
 *
 * Props:
 *   isFounderMode  — boolean. Si true, muestra precio con 30% OFF y CTA Fundador.
 *   currentPlan    — 'free' | 'pro' | 'premium'. Marca el plan actual del usuario.
 *   onSelect       — callback(planId: string, isAnnual?: boolean) llamado al hacer clic en un CTA.
 */

import { useState, useEffect } from 'react';

// ─── Constantes ───────────────────────────────────────────────────────────────

const FOUNDER_DISCOUNT = 0.30;
const ANNUAL_DISCOUNT  = 0.20;
const USD_RATE         = 40;

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Plan Base',
    segment: 'Para propietarios',
    tagline: 'Publicá tu primera propiedad y conocé la plataforma.',
    monthlyPrice: 0,
    highlight: false,
    accentColor: '#6b7280',
    cta: 'Plan Actual',
    ctaFounder: 'Plan Actual · 1 propiedad',
    includes: [
      '1 Propiedad activa',
      'Perfil Básico',
      'Panel de publicaciones y contactos',
      'Soporte por Email',
    ],
    missing: [
      'No sabés quién te contactó',
      'Desaparecés después de 7 días',
      'Sin badge de confianza',
      'Sin Analytics & CRM',
    ],
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    segment: 'Para profesionales',
    tagline: 'Tu cartera de propiedades con visibilidad real y leads desbloqueados.',
    monthlyPrice: 1600,
    highlight: true,
    popularBadge: 'Recomendado',
    accentColor: '#1e293b',
    cta: 'Empezar a crecer →',
    ctaFounder: 'Activar precio Fundador →',
    includes: [
      'Hasta 10 Propiedades',
      'Perfil Profesional (nombre, bio, tu foto)',
      'Destacás en el Feed con badge Pro',
      'Mayor visibilidad en Feed y búsqueda',
      'Badge de Verificado Pro ✓',
      'Soporte Prioritario',
    ],
    founderBonus: ['🏅 Badge Fundador Barrio.uy'],
    missing: [],
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    segment: 'Para agencias',
    tagline: 'Gestioná toda tu cartera sin límites, con CRM y máxima exposición.',
    monthlyPrice: 3600,
    highlight: false,
    accentColor: '#4c1d95',
    cta: 'Activar mi Agencia →',
    ctaFounder: 'Activar precio Fundador →',
    includes: [
      'Propiedades Ilimitadas',
      'Perfil Agencia (Logo, redes, portada)',
      'Página en el listado Inmobiliarias',
      'Máxima visibilidad en Feed y búsqueda',
      'Badge de Verificado Premium ✓',
      'Soporte 24/7',
      'Analytics & CRM básico',
    ],
    founderBonus: ['🏅 Badge Fundador Barrio.uy'],
    missing: [],
  },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PlanConfig {
  id: string;
  name: string;
  segment: string;
  tagline: string;
  monthlyPrice: number;
  highlight: boolean;
  popularBadge?: string;
  accentColor: string;
  cta: string;
  ctaFounder: string;
  includes: string[];
  founderBonus?: string[];
  missing: string[];
}

interface PricingPlansProps {
  isFounderMode?: boolean;
  currentPlan?: 'free' | 'pro' | 'premium';
  onSelect?: (planId: string, isAnnual?: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPrice(base: number, isAnnual: boolean, applyFounder: boolean): number {
  let p = base;
  if (applyFounder) p = p * (1 - FOUNDER_DISCOUNT);
  if (isAnnual)     p = p * (1 - ANNUAL_DISCOUNT);
  return Math.round(p);
}

function approxUSD(uyu: number): number {
  return Math.round(uyu / USD_RATE);
}

// ─── ScrollingNumber ──────────────────────────────────────────────────────────

function ScrollingNumber({ value }: { value: string }) {
  return (
    <span className="pricing-scrolling-number">
      {value.split('').map((char, i) => (
        <AnimatedDigit key={i} char={char} />
      ))}
    </span>
  );
}

function AnimatedDigit({ char }: { char: string }) {
  const [current, setCurrent] = useState(char);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (char !== current) {
      setLeaving(true);
      const t = setTimeout(() => {
        setCurrent(char);
        setLeaving(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [char]);

  return (
    <span className={`pricing-digit${leaving ? ' pricing-digit--leaving' : ''}`}>
      {current}
    </span>
  );
}

// ─── BillingToggle ────────────────────────────────────────────────────────────

function BillingToggle({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pricing-toggle">
      <span className={`pricing-toggle__label${!isAnnual ? ' pricing-toggle__label--active' : ''}`}>
        Mensual
      </span>
      <button
        className={`pricing-toggle__switch${isAnnual ? ' pricing-toggle__switch--on' : ''}`}
        onClick={onToggle}
        role="switch"
        aria-checked={isAnnual}
        aria-label="Cambiar facturación a anual"
      >
        <span className="pricing-toggle__knob" />
      </button>
      <span className={`pricing-toggle__label${isAnnual ? ' pricing-toggle__label--active' : ''}`}>
        Anual
      </span>
      {isAnnual && (
        <span className="pricing-toggle__badge">−20%</span>
      )}
    </div>
  );
}

// ─── PlanCard ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isAnnual,
  isFounderMode,
  isCurrent,
  onSelect,
}: {
  plan: PlanConfig;
  isAnnual: boolean;
  isFounderMode: boolean;
  isCurrent: boolean;
  onSelect?: (id: string, isAnnual?: boolean) => void;
}) {
  const applyFounder = isFounderMode && plan.monthlyPrice > 0;
  const price        = calcPrice(plan.monthlyPrice, isAnnual, applyFounder);
  const basePrice    = calcPrice(plan.monthlyPrice, isAnnual, false);
  const normalMonthly = plan.monthlyPrice;

  const cta = isFounderMode && plan.monthlyPrice > 0 ? plan.ctaFounder : plan.cta;

  return (
    <div
      className={`pricing-card${plan.highlight ? ' pricing-card--highlight' : ''}${isCurrent ? ' pricing-card--current' : ''}`}
      style={{ '--accent': plan.accentColor } as React.CSSProperties}
    >
      {plan.popularBadge && (
        <div className="pricing-card__popular">{plan.popularBadge}</div>
      )}

      <div className="pricing-card__segment">{plan.segment}</div>
      <h3 className="pricing-card__name">{plan.name}</h3>
      <p className="pricing-card__tagline">{plan.tagline}</p>

      {/* ── Precio ── */}
      <div className="pricing-card__price-block">
        {plan.monthlyPrice === 0 ? (
          <div className="pricing-card__price-row">
            <span className="pricing-card__price">UYU 0</span>
            <span className="pricing-card__price-suffix">/mes</span>
          </div>
        ) : (
          <>
            {/* Precio tachado */}
            <div className="pricing-card__price-old">
              {applyFounder ? (
                <>
                  <span className="pricing-card__strikethrough">
                    UYU {basePrice.toLocaleString('es-UY')}
                  </span>
                  <span className="pricing-card__founder-badge">−30% 🏅</span>
                </>
              ) : isAnnual ? (
                <>
                  <span className="pricing-card__strikethrough">
                    UYU {normalMonthly.toLocaleString('es-UY')}
                  </span>
                  <span className="pricing-card__annual-badge">−20%</span>
                </>
              ) : null}
            </div>

            {/* Precio principal */}
            <div className="pricing-card__price-row">
              <span className="pricing-card__price-currency">UYU</span>
              <span className={`pricing-card__price${applyFounder ? ' pricing-card__price--founder' : ''}`}>
                <ScrollingNumber value={price.toLocaleString('es-UY')} />
              </span>
              <span className="pricing-card__price-suffix">/mes</span>
            </div>

            <p className="pricing-card__usd">
              aprox. {approxUSD(price)} USD{isAnnual ? '/mes (cobro anual)' : ''}
            </p>
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <button
        className={`pricing-card__cta${isCurrent ? ' pricing-card__cta--current' : ''}${applyFounder ? ' pricing-card__cta--founder' : ''}`}
        onClick={() => !isCurrent && onSelect?.(plan.id, isAnnual)}
        disabled={isCurrent}
        aria-label={isCurrent ? `Plan actual: ${plan.name}` : `Suscribirse a ${plan.name}`}
      >
        {cta}
      </button>

      <hr className="pricing-card__divider" />

      {/* ── Inclusiones ── */}
      <p className="pricing-card__section-label">Inclusiones clave</p>
      <ul className="pricing-card__list">
        {plan.includes.map((item, i) => (
          <li key={i} className="pricing-card__list-item pricing-card__list-item--check">
            <span className="pricing-card__check">✓</span>
            <span>{item}</span>
          </li>
        ))}
        {isFounderMode && plan.founderBonus?.map((item, i) => (
          <li key={`f${i}`} className="pricing-card__list-item pricing-card__list-item--founder">
            <span className="pricing-card__check pricing-card__check--founder">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* ── Lo que te perdés ── */}
      {plan.missing.length > 0 && (
        <>
          <hr className="pricing-card__divider pricing-card__divider--danger" />
          <p className="pricing-card__section-label pricing-card__section-label--danger">Lo que te perdés</p>
          <ul className="pricing-card__list">
            {plan.missing.map((item, i) => (
              <li key={i} className="pricing-card__list-item pricing-card__list-item--missing">
                <span className="pricing-card__cross">✖</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ─── PricingPlans (export principal) ─────────────────────────────────────────

export function PricingPlans({
  isFounderMode = false,
  currentPlan = 'free',
  onSelect,
}: PricingPlansProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h1 className="pricing-h1">Publicá y crecé con Barrio.uy</h1>
        <p className="pricing-sub">
          El plan correcto para cada etapa — desde el primer anuncio hasta la agencia consolidada.
        </p>
        <BillingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(v => !v)} />
      </div>

      <div className="pricing-grid">
        {PLANS.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isAnnual={isAnnual}
            isFounderMode={isFounderMode}
            isCurrent={plan.id === currentPlan}
            onSelect={onSelect}
          />
        ))}
      </div>

      <style>{CSS}</style>
    </section>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
// Paleta adulta: slate/indigo oscuro, violeta contenido, sin tonos infantiles.

const CSS = `
  .pricing-section {
    font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
    padding: 0 0 48px;
    max-width: 1100px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 40px;
  }

  @media (min-width: 900px) {
    .pricing-header { margin-bottom: 56px; }
  }

  .pricing-h1 {
    margin: 0 0 12px;
    font-size: clamp(26px, 4.5vw, 38px);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.2;
    padding: 0 8px;
  }

  .pricing-sub {
    margin: 0 0 28px;
    font-size: 15px;
    line-height: 1.5;
    color: #64748b;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 8px;
  }

  .pricing-toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    padding: 8px 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    flex-wrap: nowrap;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    .pricing-toggle {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
      row-gap: 8px;
      padding: 10px 12px;
    }
  }

  .pricing-toggle__label {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    transition: color 0.2s;
  }

  .pricing-toggle__label--active { color: #0f172a; }

  .pricing-toggle__switch {
    width: 44px; height: 24px;
    border-radius: 999px; border: none;
    background: #cbd5e1;
    cursor: pointer;
    position: relative;
    transition: background 0.25s;
    flex-shrink: 0;
  }

  .pricing-toggle__switch--on { background: #334155; }

  .pricing-toggle__knob {
    position: absolute;
    top: 2px; left: 2px;
    width: 20px; height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }

  .pricing-toggle__switch--on .pricing-toggle__knob { transform: translateX(20px); }

  .pricing-toggle__badge {
    background: #f1f5f9;
    color: #475569;
    font-size: 11px;
    font-weight: 600;
    border-radius: 999px;
    padding: 3px 8px;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    align-items: start;
    width: 100%;
  }

  @media (min-width: 640px) {
    .pricing-grid { max-width: 400px; margin: 0 auto; }
  }

  @media (min-width: 900px) {
    .pricing-grid {
      grid-template-columns: repeat(3, 1fr);
      max-width: none;
      margin: 0;
      gap: 28px;
    }
  }

  .pricing-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 28px 24px 28px;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  @media (max-width: 480px) {
    .pricing-card {
      border-radius: 14px;
      padding: 22px 16px 20px;
    }
  }

  .pricing-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .pricing-card--highlight {
    background: #0f172a;
    border-color: #1e293b;
    box-shadow: 0 8px 32px rgba(15,23,42,0.25);
  }

  @media (min-width: 900px) {
    .pricing-card--highlight {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(15,23,42,0.3);
    }
    .pricing-card--highlight:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(15,23,42,0.35);
      border-color: #334155;
    }
  }

  .pricing-card__popular {
    position: absolute;
    top: -12px; left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #334155;
    font-size: 10px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 999px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .pricing-card__segment {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 6px;
  }

  .pricing-card--highlight .pricing-card__segment { color: #94a3b8; }

  .pricing-card__name {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #0f172a;
  }

  @media (max-width: 480px) {
    .pricing-card__name { font-size: 18px; }
  }

  .pricing-card--highlight .pricing-card__name { color: #fff; }

  .pricing-card__tagline {
    margin: 0 0 22px;
    font-size: 13px;
    line-height: 1.5;
    color: #64748b;
  }

  .pricing-card--highlight .pricing-card__tagline { color: #94a3b8; }

  .pricing-card__price-block { margin-bottom: 22px; }

  .pricing-card__price-old {
    display: flex; align-items: center; gap: 8px;
    min-height: 22px; margin-bottom: 2px;
  }

  .pricing-card__strikethrough {
    font-size: 13px; color: #94a3b8;
    text-decoration: line-through;
  }

  .pricing-card--highlight .pricing-card__strikethrough { color: #64748b; }

  .pricing-card__founder-badge {
    background: #334155;
    color: #f8fafc;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    padding: 2px 8px;
  }

  .pricing-card__annual-badge {
    background: #f1f5f9;
    color: #475569;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    padding: 2px 8px;
  }

  .pricing-card__price-row {
    display: flex; align-items: flex-end; gap: 4px;
  }

  .pricing-card__price-currency {
    font-size: 13px; font-weight: 600;
    color: #64748b;
    margin-bottom: 6px;
  }

  .pricing-card--highlight .pricing-card__price-currency { color: #94a3b8; }

  .pricing-card__price {
    font-size: 40px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1;
  }

  @media (max-width: 480px) {
    .pricing-card__price { font-size: 34px; }
  }

  .pricing-card__price--founder { color: #f59e0b; }

  .pricing-card--highlight .pricing-card__price { color: #fff; }
  .pricing-card--highlight .pricing-card__price--founder { color: #fcd34d; }

  .pricing-card__price-suffix {
    font-size: 13px; color: #64748b;
    margin-bottom: 6px;
  }

  .pricing-card--highlight .pricing-card__price-suffix { color: #94a3b8; }

  .pricing-card__usd {
    margin: 6px 0 0;
    font-size: 12px;
    color: #94a3b8;
  }

  .pricing-card--highlight .pricing-card__usd { color: #64748b; }

  .pricing-scrolling-number { display: inline-flex; align-items: flex-end; }

  .pricing-digit {
    display: inline-block;
    overflow: hidden;
    transition: opacity 0.25s, transform 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  .pricing-digit--leaving {
    opacity: 0;
    transform: translateY(-6px);
  }

  .pricing-card__cta {
    width: 100%;
    padding: 13px 0;
    border-radius: 10px;
    border: 1px solid transparent;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 22px;
    transition: background 0.2s, transform 0.1s;
    font-family: inherit;
  }

  @media (max-width: 480px) {
    .pricing-card__cta {
      min-height: 44px;
      padding: 11px 0;
      font-size: 13px;
    }
  }

  .pricing-card__cta:hover:not(:disabled) {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  .pricing-card--highlight .pricing-card__cta {
    background: #fff;
    color: #0f172a;
  }

  .pricing-card--highlight .pricing-card__cta:hover:not(:disabled) {
    background: #f8fafc;
  }

  .pricing-card__cta--current {
    background: transparent !important;
    border-color: #e2e8f0;
    color: #94a3b8 !important;
    cursor: default;
    transform: none !important;
  }

  .pricing-card--highlight .pricing-card__cta--current {
    border-color: #475569;
    color: #94a3b8 !important;
  }

  .pricing-card__cta--founder {
    background: #334155 !important;
    color: #fff !important;
  }

  .pricing-card__divider {
    border: none;
    border-top: 1px solid #f1f5f9;
    margin: 0 0 18px;
  }

  .pricing-card--highlight .pricing-card__divider { border-color: #1e293b; }

  .pricing-card__divider--danger { border-color: #fee2e2; }

  .pricing-card__section-label {
    margin: 0 0 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }

  .pricing-card--highlight .pricing-card__section-label { color: #64748b; }
  .pricing-card__section-label--danger { color: #dc2626; }

  .pricing-card__list {
    padding: 0; margin: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pricing-card__list-item {
    display: flex; gap: 10px; align-items: flex-start;
    font-size: 13px;
    line-height: 1.45;
    color: #334155;
  }

  .pricing-card--highlight .pricing-card__list-item { color: #cbd5e1; }

  .pricing-card__list-item--founder {
    font-weight: 600;
    color: #475569;
  }

  .pricing-card--highlight .pricing-card__list-item--founder { color: #e2e8f0; }

  .pricing-card__list-item--missing { color: #94a3b8; font-size: 12px; }

  .pricing-card__check {
    color: #059669;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .pricing-card--highlight .pricing-card__check { color: #34d399; }

  .pricing-card__check--founder { color: #64748b; }
  .pricing-card--highlight .pricing-card__check--founder { color: #94a3b8; }

  .pricing-card__cross {
    color: #dc2626;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .dark .pricing-h1 { color: #f8fafc; }
  .dark .pricing-sub { color: #94a3b8; }
  .dark .pricing-toggle { background: #1e293b; border-color: #334155; }
  .dark .pricing-toggle__label--active { color: #f1f5f9; }
  .dark .pricing-toggle__switch--on { background: #475569; }
`;
