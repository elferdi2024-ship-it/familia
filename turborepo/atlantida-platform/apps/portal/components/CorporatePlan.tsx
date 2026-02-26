'use client';

/**
 * CorporatePlan — Barrio.uy
 * Bloque de plan corporativo con tabs Formulario / WhatsApp.
 *
 * Uso (al pie de la pricing page, debajo de los 3 cards):
 *   import { CorporatePlan } from '@/components/CorporatePlan';
 *   <CorporatePlan onFormSubmit={async (data) => { await addDoc(...); }} />
 *
 * WhatsApp: +598 98 300 491 con mensaje pre-cargado.
 */

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@repo/lib/firebase';

// ─── Config ───────────────────────────────────────────────────────────────────

const WA_NUMBER = '59898300491';
const WA_MESSAGE = encodeURIComponent(
  'Hola, necesito un plan corporativo para Barrio.uy — manejo más de 1000 propiedades'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const PROPERTY_RANGES = [
  '1.000 – 5.000 propiedades',
  '5.000 – 20.000 propiedades',
  '+20.000 propiedades',
];

const FEATURES = [
  { icon: '∞', label: 'Propiedades ilimitadas', desc: 'Sin techo en tu cartera activa' },
  { icon: '⚡', label: 'Onboarding dedicado', desc: 'Migración y setup a cargo nuestro' },
  { icon: '🔌', label: 'Integración API', desc: 'Conectá tu sistema a Barrio.uy' },
  { icon: '💬', label: 'Soporte 24/7 directo', desc: 'Línea exclusiva sin tickets' },
  { icon: '📊', label: 'Analytics avanzado', desc: 'Reportes por portafolio' },
  { icon: '🏷️', label: 'Precio acordado', desc: 'Tarifa negociada con el equipo' },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  company: string;
  range: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  range?: string;
}

interface CorporatePlanProps {
  /** Callback al enviar el formulario. Si no se pasa, se usa Firestore corporate_leads por defecto. */
  onFormSubmit?: (data: FormData) => Promise<void>;
}

// ─── Iconos ───────────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── ContactForm ──────────────────────────────────────────────────────────────

function ContactForm({
  onSuccess,
  onFormSubmit,
}: {
  onSuccess: () => void;
  onFormSubmit?: (data: FormData) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>({ name: '', email: '', company: '', range: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function update(key: keyof FormData, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Requerido';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.range) e.range = 'Seleccioná un rango';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (onFormSubmit) {
        await onFormSubmit(form);
      } else {
        await new Promise(r => setTimeout(r, 1000)); // simulación si no hay handler
      }
      onSuccess();
    } catch {
      setErrors({ name: 'Error al enviar. Intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="corp-form" noValidate>
      <div className="corp-form__row">
        <div className="corp-form__field">
          <label className="corp-form__label">Nombre <span className="corp-form__required">*</span></label>
          <input className={`corp-form__input${errors.name ? ' corp-form__input--error' : ''}`}
            type="text" placeholder="Juan García"
            value={form.name} onChange={e => update('name', e.target.value)} />
          {errors.name && <span className="corp-form__error">{errors.name}</span>}
        </div>
        <div className="corp-form__field">
          <label className="corp-form__label">Email <span className="corp-form__required">*</span></label>
          <input className={`corp-form__input${errors.email ? ' corp-form__input--error' : ''}`}
            type="email" placeholder="juan@inmobiliaria.com"
            value={form.email} onChange={e => update('email', e.target.value)} />
          {errors.email && <span className="corp-form__error">{errors.email}</span>}
        </div>
      </div>

      <div className="corp-form__field">
        <label className="corp-form__label">Empresa / Inmobiliaria <span className="corp-form__optional">(opcional)</span></label>
        <input className="corp-form__input" type="text" placeholder="Real Estate SA"
          value={form.company} onChange={e => update('company', e.target.value)} />
      </div>

      <div className="corp-form__field">
        <label className="corp-form__label">Cantidad de propiedades <span className="corp-form__required">*</span></label>
        <select className={`corp-form__select${errors.range ? ' corp-form__input--error' : ''}`}
          value={form.range} onChange={e => update('range', e.target.value)}>
          <option value="" disabled>Seleccioná un rango</option>
          {PROPERTY_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {errors.range && <span className="corp-form__error">{errors.range}</span>}
      </div>

      <div className="corp-form__field">
        <label className="corp-form__label">Mensaje <span className="corp-form__optional">(opcional)</span></label>
        <textarea className="corp-form__textarea" rows={3}
          placeholder="Contanos más sobre tu operación, sistema actual, necesidades especiales..."
          value={form.message} onChange={e => update('message', e.target.value)} />
      </div>

      <button type="submit" className="corp-form__submit" disabled={loading}>
        {loading ? <><span className="corp-spinner" aria-hidden="true" /> Enviando...</> : 'Enviar consulta →'}
      </button>
    </form>
  );
}

// ─── SuccessScreen ────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="corp-success" role="status" aria-live="polite">
      <div className="corp-success__icon" aria-hidden="true">✓</div>
      <h3 className="corp-success__title">¡Consulta enviada!</h3>
      <p className="corp-success__text">
        El equipo de Barrio.uy te va a contactar dentro de las próximas{' '}
        <strong>24 horas hábiles</strong>.
      </p>
      <button className="corp-success__reset" onClick={onReset}>
        Enviar otra consulta
      </button>
    </div>
  );
}

// ─── WhatsAppPanel ────────────────────────────────────────────────────────────

function WhatsAppPanel() {
  return (
    <div className="corp-wa">
      <div className="corp-wa__notice">
        <div className="corp-wa__avatar" aria-hidden="true">
          <WhatsAppIcon />
        </div>
        <div>
          <p className="corp-wa__title">Escribinos directamente</p>
          <p className="corp-wa__sub">
            Te respondemos en menos de 2 horas en días hábiles.
            El mensaje se pre-carga automáticamente.
          </p>
        </div>
      </div>

      <div className="corp-wa__preview-label">Mensaje que se va a enviar</div>
      <div className="corp-wa__bubble" role="img" aria-label="Mensaje pre-cargado">
        &quot;Hola, necesito un plan corporativo para Barrio.uy — manejo más de 1000 propiedades&quot;
      </div>

      <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="corp-wa__btn">
        <WhatsAppIcon />
        Abrir WhatsApp →
      </a>

      <p className="corp-wa__number">
        +598 98 300 491 · Solo para consultas corporativas (+1.000 propiedades)
      </p>
    </div>
  );
}

// ─── CorporatePlan (export principal) ────────────────────────────────────────

export function CorporatePlan({ onFormSubmit }: CorporatePlanProps) {
  const [tab, setTab] = useState<'form' | 'whatsapp'>('form');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = onFormSubmit ?? (async (data: FormData) => {
    if (!db) throw new Error('Firestore no disponible');
    await addDoc(collection(db, 'corporate_leads'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  });

  return (
    <section className="corp" aria-labelledby="corp-heading">
      <div className="corp__card">

        {/* ── Header oscuro ── */}
        <div className="corp__header">
          <div className="corp__header-deco-1" aria-hidden="true" />
          <div className="corp__header-deco-2" aria-hidden="true" />

          <div className="corp__header-inner">
            <div className="corp__pill">🏢 Plan Corporativo</div>

            <h2 id="corp-heading" className="corp__heading">
              ¿Manejás más de<br />1.000 propiedades?
            </h2>
            <p className="corp__sub">
              Trabajamos planes a medida para desarrolladores, portales
              y grandes redes de franquicias.
            </p>

            <div className="corp__features">
              {FEATURES.map((f, i) => (
                <div key={i} className="corp__feature">
                  <span className="corp__feature-icon" aria-hidden="true">{f.icon}</span>
                  <span className="corp__feature-label">{f.label}</span>
                  <span className="corp__feature-desc">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="corp__body">
          {/* Tabs */}
          <div className="corp__tabs" role="tablist">
            {(['form', 'whatsapp'] as const).map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`corp__tab${tab === t ? ' corp__tab--active' : ''}`}
                onClick={() => { setTab(t); setSubmitted(false); }}
              >
                {t === 'form' ? '📋 Completar formulario' : '💬 WhatsApp directo'}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div role="tabpanel" className="corp__panel">
            {tab === 'form' && (
              submitted
                ? <SuccessScreen onReset={() => setSubmitted(false)} />
                : <ContactForm onSuccess={() => setSubmitted(true)} onFormSubmit={handleFormSubmit} />
            )}
            {tab === 'whatsapp' && <WhatsAppPanel />}
          </div>
        </div>
      </div>

      <style>{CSS}</style>
    </section>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .corp { font-family: 'DM Sans', system-ui, sans-serif; padding: 20px 0 60px; }

  .corp__card {
    border-radius: 24px; overflow: hidden;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 8px 40px rgba(0,0,0,0.07);
  }

  /* Header */
  .corp__header {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
    padding: 40px 40px 36px;
    position: relative; overflow: hidden;
  }

  .corp__header-deco-1 {
    position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(59,130,246,0.12);
  }

  .corp__header-deco-2 {
    position: absolute; bottom: -20px; right: 80px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(99,102,241,0.1);
  }

  .corp__header-inner { position: relative; }

  .corp__pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #ffffff; border-radius: 99px;
    padding: 6px 14px; margin-bottom: 16px;
    font-size: 12px; font-weight: 800; color: #0f172a;
    text-transform: uppercase; letter-spacing: 0.07em;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .corp__heading {
    margin: 0 0 10px; font-size: clamp(22px, 3vw, 30px);
    font-weight: 800; color: #fff; line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .corp__sub {
    margin: 0 0 28px; font-size: 15px; color: #93c5fd;
    line-height: 1.6; max-width: 420px;
  }

  .corp__features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media (min-width: 480px) {
    .corp__features { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 768px) {
    .corp__features { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 600px) {
    .corp__header { padding: 28px 20px 24px; }
  }

  .corp__feature {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 14px 16px;
    transition: background 0.2s;
    display: flex; flex-direction: column; gap: 4px;
    backdrop-blur: sm;
  }

  .corp__feature:hover { background: rgba(255,255,255,0.18); }

  .corp__feature-icon  { font-size: 20px; margin-bottom: 2px; opacity: 0.9; }
  .corp__feature-label { font-size: 13px; font-weight: 700; color: #ffffff; }
  .corp__feature-desc  { font-size: 13px; line-height: 1.4; color: #cbd5e1; }

  /* Body */
  .corp__body { padding: 32px 40px 36px; background: #fff; }

  @media (max-width: 600px) { .corp__body { padding: 24px 20px 28px; } }

  /* Tabs — full width en móvil */
  .corp__tabs {
    display: flex; gap: 0;
    background: #f1f5f9; border-radius: 10px; padding: 4px;
    margin-bottom: 28px;
    width: 100%;
  }

  @media (min-width: 520px) {
    .corp__tabs { width: fit-content; }
  }

  .corp__tab {
    flex: 1;
    padding: 10px 12px; border-radius: 8px; border: none;
    background: transparent; color: #64748b;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: inherit;
    min-width: 0;
  }

  @media (min-width: 520px) {
    .corp__tab { flex: none; padding: 9px 18px; font-size: 13px; }
  }

  .corp__tab--active {
    background: #fff; color: #0f172a;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .corp__panel { animation: corp-fadein 0.22s ease; max-width: 520px; }

  /* Form */
  .corp-form { display: flex; flex-direction: column; gap: 14px; }

  .corp-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  @media (max-width: 520px) { .corp-form__row { grid-template-columns: 1fr; } }

  .corp-form__field { display: flex; flex-direction: column; gap: 5px; }

  .corp-form__label { font-size: 12px; font-weight: 600; color: #374151; }

  .corp-form__required { color: #ef4444; }
  .corp-form__optional  { color: #9ca3af; font-weight: 400; }

  .corp-form__input,
  .corp-form__select,
  .corp-form__textarea {
    padding: 10px 12px; border-radius: 8px;
    border: 1.5px solid #e2e8f0;
    font-size: 14px; color: #111827; outline: none;
    transition: border-color 0.2s; font-family: inherit;
    background: #fff;
  }

  .corp-form__input:focus,
  .corp-form__select:focus,
  .corp-form__textarea:focus { border-color: #2563eb; }

  .corp-form__input--error { border-color: #ef4444 !important; }

  .corp-form__textarea { resize: vertical; line-height: 1.5; }

  .corp-form__error { font-size: 11px; color: #ef4444; }

  .corp-form__submit {
    padding: 13px 0; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .corp-form__submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.45);
  }

  .corp-form__submit:disabled { background: #93c5fd; cursor: not-allowed; box-shadow: none; transform: none; }

  /* Spinner */
  .corp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%;
    animation: corp-spin 0.7s linear infinite;
    display: inline-block;
  }

  /* Success */
  .corp-success {
    text-align: center; padding: 32px 16px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    animation: corp-fadein 0.25s ease;
  }

  .corp-success__icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff; font-size: 24px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(16,185,129,0.35);
  }

  .corp-success__title { margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; }
  .corp-success__text  { margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; max-width: 300px; }

  .corp-success__reset {
    margin-top: 4px; background: none;
    border: 1.5px solid #e2e8f0; border-radius: 8px;
    padding: 8px 20px; font-size: 13px; color: #64748b;
    cursor: pointer; font-family: inherit; transition: border-color 0.2s;
  }

  .corp-success__reset:hover { border-color: #94a3b8; }

  /* WhatsApp */
  .corp-wa { display: flex; flex-direction: column; gap: 16px; }

  .corp-wa__notice {
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 14px; padding: 18px 20px;
    display: flex; gap: 12px; align-items: flex-start;
  }

  .corp-wa__avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: #25D366; color: #fff; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  .corp-wa__title { margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #166534; }
  .corp-wa__sub   { margin: 0; font-size: 13px; color: #16a34a; line-height: 1.5; }

  .corp-wa__preview-label {
    font-size: 11px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .corp-wa__bubble {
    background: #dcfce7; border: 1px solid #bbf7d0;
    border-radius: 4px 16px 16px 16px;
    padding: 12px 16px; font-size: 14px; color: #166534; line-height: 1.5;
    position: relative;
  }

  .corp-wa__btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 14px 0; border-radius: 10px;
    background: #25D366; color: #fff;
    font-size: 15px; font-weight: 700; text-decoration: none;
    box-shadow: 0 4px 14px rgba(37,211,102,0.35);
    transition: all 0.2s; font-family: inherit;
  }

  .corp-wa__btn:hover {
    background: #22c55e;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,211,102,0.45);
  }

  .corp-wa__number {
    margin: 0; font-size: 11px; color: #9ca3af; text-align: center;
  }

  /* Animations */
  @keyframes corp-spin    { to { transform: rotate(360deg); } }
  @keyframes corp-fadein  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
