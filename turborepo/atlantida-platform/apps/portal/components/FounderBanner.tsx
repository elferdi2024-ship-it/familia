'use client';

/**
 * FounderBanner — Barrio.uy
 * Banner de lanzamiento con contador en tiempo real desde Firestore.
 *
 * Uso en la pricing page:
 *   import { FounderBanner } from '@/components/FounderBanner';
 *   <FounderBanner totalSlots={30} />
 *
 * Firestore esperado:
 *   config/launch → { founderSlotsUsed: number }
 *
 * Variables de entorno:
 *   NEXT_PUBLIC_FOUNDER_MODE = 'active' | 'closed' | 'disabled'
 */

import { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@repo/lib/firebase';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FounderMode = 'active' | 'closed' | 'disabled';

interface FounderBannerProps {
  totalSlots?: number;
}

// ─── Hook: contador en tiempo real ───────────────────────────────────────────

function useFounderSlots(totalSlots: number) {
  const [slotsUsed, setSlotsUsed] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!db) {
      setError(true);
      return () => {};
    }
    const ref = doc(db, 'config', 'launch');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSlotsUsed(typeof data.founderSlotsUsed === 'number' ? data.founderSlotsUsed : 0);
        } else {
          setSlotsUsed(0);
        }
      },
      () => setError(true)
    );
    return () => unsub();
  }, []);

  const slotsRemaining = slotsUsed !== null ? Math.max(0, totalSlots - slotsUsed) : null;
  const isSoldOut = slotsRemaining === 0;

  return { slotsRemaining, isSoldOut, error };
}

// ─── Hook: animación del número al cambiar ────────────────────────────────────

function useAnimatedNumber(value: number | null) {
  const [displayed, setDisplayed] = useState<number | null>(value);
  const [animating, setAnimating] = useState(false);
  const prev = useRef<number | null>(value);

  useEffect(() => {
    if (value !== null && value !== prev.current) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayed(value);
        setAnimating(false);
        prev.current = value;
      }, 300);
      return () => clearTimeout(timer);
    } else if (value !== null && prev.current === null) {
      setDisplayed(value);
      prev.current = value;
    }
  }, [value]);

  return { displayed, animating };
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function FounderBanner({ totalSlots = 30 }: FounderBannerProps) {
  const mode = (process.env.NEXT_PUBLIC_FOUNDER_MODE ?? 'disabled') as FounderMode;
  const [showConditions, setShowConditions] = useState(false);

  const { slotsRemaining, isSoldOut, error } = useFounderSlots(totalSlots);
  const { displayed: displayedSlots, animating } = useAnimatedNumber(slotsRemaining);

  // No renderizar si está desactivado
  if (mode === 'disabled') return null;

  // Si hay error de Firestore, no mostrar el banner (fail silencioso)
  if (error) return null;

  // Modo "closed": cupos agotados — mensaje de cierre
  if (mode === 'closed' || isSoldOut) {
    return (
      <div className="founder-banner founder-banner--closed" role="status">
        <span className="founder-banner__medal">🏅</span>
        <span className="founder-banner__text">
          Los <strong>30 cupos Fundadores</strong> se agotaron. ¡Gracias por ser parte de Barrio.uy!
        </span>

        <style>{styles}</style>
      </div>
    );
  }

  // Modo "active": banner completo con contador
  return (
    <>
      <div className="founder-banner founder-banner--active" role="banner" aria-label="Oferta Fundadores">
        <div className="founder-banner__content">
          <span className="founder-banner__medal" aria-hidden="true">🏅</span>

          <div className="founder-banner__body">
            <p className="founder-banner__headline">
              Oferta Fundadores — <strong>30% OFF de por vida</strong>
            </p>
            <p className="founder-banner__sub">
              Los primeros {totalSlots} en suscribirse mantienen el precio especial para siempre. Sin asteriscos.
            </p>
          </div>

          <div className="founder-banner__slots" aria-live="polite" aria-atomic="true">
            {displayedSlots === null ? (
              <span className="founder-banner__slots-skeleton" aria-label="Cargando cupos" />
            ) : (
              <>
                <span
                  className={`founder-banner__slots-number${animating ? ' founder-banner__slots-number--animating' : ''}`}
                >
                  {displayedSlots}
                </span>
                <span className="founder-banner__slots-label">
                  cupos<br />restantes
                </span>
              </>
            )}
          </div>

          <button
            className="founder-banner__cta"
            onClick={() => setShowConditions(true)}
            aria-expanded={showConditions}
          >
            Ver condiciones
          </button>
        </div>

        {/* Barra de progreso de cupos */}
        {displayedSlots !== null && (
          <div className="founder-banner__progress" role="progressbar"
            aria-valuenow={totalSlots - displayedSlots}
            aria-valuemin={0}
            aria-valuemax={totalSlots}
            aria-label={`${totalSlots - displayedSlots} de ${totalSlots} cupos tomados`}
          >
            <div
              className="founder-banner__progress-fill"
              style={{ width: `${((totalSlots - displayedSlots) / totalSlots) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Modal de condiciones */}
      {showConditions && (
        <ConditionsModal totalSlots={totalSlots} onClose={() => setShowConditions(false)} />
      )}

      <style>{styles}</style>
    </>
  );
}

// ─── Modal de condiciones ─────────────────────────────────────────────────────

function ConditionsModal({ totalSlots, onClose }: { totalSlots: number; onClose: () => void }) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="founder-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="founder-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="founder-modal__box">
        <button className="founder-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>

        <h2 id="founder-modal-title" className="founder-modal__title">
          🏅 Condiciones del Programa Fundadores
        </h2>

        <ul className="founder-modal__list">
          <li>Los primeros <strong>{totalSlots} usuarios</strong> que activen un plan Pro o Premium durante el período de lanzamiento acceden a un <strong>descuento permanente del 30%</strong> sobre el precio de lista vigente.</li>
          <li>El descuento se mantiene <strong>de por vida</strong> mientras el plan esté activo y sin interrupciones de pago.</li>
          <li>Si el plan se cancela, el precio Fundador <strong>no se recupera</strong> al re-suscribirse.</li>
          <li>Los cupos son limitados y se asignan por <strong>orden de activación</strong>. Cuando el contador llega a 0, el precio vuelve al valor normal.</li>
          <li>Barrio.uy se reserva el derecho de cerrar anticipadamente la oferta si los cupos se agotan.</li>
        </ul>

        <button className="founder-modal__btn" onClick={onClose}>
          Entendido →
        </button>
      </div>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = `
  .founder-banner {
    font-family: 'DM Sans', system-ui, sans-serif;
    width: 100%;
    box-sizing: border-box;
  }

  /* Estado activo — paleta suave que armoniza con azul/naranja de marca */
  .founder-banner--active {
    background: linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fef08a 100%);
    border-bottom: 1px solid #eab308;
  }

  .founder-banner__content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    max-width: 960px;
    margin: 0 auto;
    flex-wrap: wrap;
    box-sizing: border-box;
  }

  .founder-banner__medal {
    font-size: 28px;
    flex-shrink: 0;
    filter: drop-shadow(0 2px 4px rgba(202,138,4,0.25));
  }

  .founder-banner__body {
    flex: 1 1 200px;
    min-width: 0;
    word-wrap: break-word;
  }

  .founder-banner__headline {
    margin: 0;
    font-size: 15px;
    color: #854d0e;
    line-height: 1.35;
    word-wrap: break-word;
  }

  .founder-banner__headline strong {
    color: #713f12;
    font-weight: 700;
  }

  .founder-banner__sub {
    margin: 3px 0 0;
    font-size: 12px;
    color: #a16207;
    line-height: 1.4;
    word-wrap: break-word;
  }

  /* Contador de cupos */
  .founder-banner__slots {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #eab308;
    border-radius: 10px;
    padding: 8px 14px;
    box-shadow: 0 2px 8px rgba(202,138,4,0.12);
    flex-shrink: 0;
  }

  .founder-banner__slots-number {
    font-size: 32px;
    font-weight: 800;
    color: #ca8a04;
    line-height: 1;
    transition: opacity 0.3s, transform 0.3s;
    display: inline-block;
  }

  .founder-banner__slots-number--animating {
    opacity: 0;
    transform: translateY(-6px);
  }

  .founder-banner__slots-label {
    font-size: 11px;
    color: #854d0e;
    font-weight: 600;
    line-height: 1.3;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .founder-banner__slots-skeleton {
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: linear-gradient(90deg, #fef08a 25%, #fef9c3 50%, #fef08a 75%);
    background-size: 200% 100%;
    animation: founder-skeleton 1.4s infinite;
  }

  /* CTA */
  .founder-banner__cta {
    background: linear-gradient(180deg, #eab308, #ca8a04);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(202,138,4,0.3);
  }

  .founder-banner__cta:hover {
    background: linear-gradient(180deg, #ca8a04, #a16207);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(202,138,4,0.35);
  }

  .founder-banner__cta:active {
    transform: translateY(0);
  }

  /* Barra de progreso */
  .founder-banner__progress {
    height: 3px;
    background: #fef08a;
    width: 100%;
  }

  .founder-banner__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #eab308, #ca8a04);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 2px 2px 0;
  }

  /* Estado cerrado */
  .founder-banner--closed {
    background: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }

  .founder-banner--closed .founder-banner__medal {
    font-size: 18px;
    opacity: 0.6;
    filter: none;
  }

  .founder-banner--closed .founder-banner__text {
    font-size: 13px;
    color: #6b7280;
  }

  /* Modal */
  .founder-modal__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: founder-fadein 0.2s ease;
  }

  .founder-modal__box {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    max-width: 480px;
    width: 100%;
    position: relative;
    border-top: 4px solid #eab308;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    animation: founder-slidein 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .founder-modal__close {
    position: absolute;
    top: 14px;
    right: 16px;
    background: none;
    border: none;
    font-size: 18px;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
  }

  .founder-modal__close:hover {
    color: #374151;
    background: #f3f4f6;
  }

  .founder-modal__title {
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .founder-modal__list {
    padding: 0;
    margin: 0 0 24px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .founder-modal__list li {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    padding-left: 20px;
    position: relative;
  }

  .founder-modal__list li::before {
    content: '·';
    position: absolute;
    left: 6px;
    color: #eab308;
    font-weight: 700;
    font-size: 18px;
    line-height: 1.3;
  }

  .founder-modal__btn {
    width: 100%;
    background: linear-gradient(180deg, #eab308, #ca8a04);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .founder-modal__btn:hover {
    background: linear-gradient(180deg, #ca8a04, #a16207);
  }

  /* Animaciones */
  @keyframes founder-skeleton {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes founder-fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes founder-slidein {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Mobile-first: apilar contenido para que nada se corte */
  @media (max-width: 768px) {
    .founder-banner__content {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
      padding: 16px 16px;
      gap: 14px;
    }

    .founder-banner__body {
      order: 1;
      flex: none;
    }

    .founder-banner__medal {
      order: 0;
      align-self: center;
      font-size: 24px;
    }

    .founder-banner__headline {
      font-size: 14px;
    }

    .founder-banner__sub {
      font-size: 12px;
      margin-top: 4px;
    }

    .founder-banner__slots {
      order: 2;
      justify-content: center;
      padding: 8px 12px;
    }

    .founder-banner__slots-number {
      font-size: 28px;
    }

    .founder-banner__cta {
      order: 3;
      width: 100%;
    }
  }

  @media (max-width: 600px) {
    .founder-banner__content {
      padding: 14px 12px;
      gap: 12px;
    }

    .founder-banner__headline {
      font-size: 13px;
    }

    .founder-banner__sub {
      display: block;
      font-size: 11px;
    }

    .founder-banner__slots {
      padding: 6px 10px;
    }

    .founder-banner__slots-number {
      font-size: 26px;
    }

    .founder-modal__box {
      padding: 24px 20px;
      margin: 16px;
    }
  }
`;
