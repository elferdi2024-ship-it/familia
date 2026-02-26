'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@repo/lib/firebase';
import { FounderBanner } from '@/components/FounderBanner';
import { PricingPlans } from '@/components/PricingPlans';
import { CorporatePlan } from '@/components/CorporatePlan';

const founderMode = process.env.NEXT_PUBLIC_FOUNDER_MODE === 'active';

export default function PricingPage() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'premium'>('free');

  useEffect(() => {
    if (!user || !db) return;
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const plan = snap.data()?.plan as string | undefined;
          if (plan === 'pro' || plan === 'premium') setCurrentPlan(plan);
          else if (plan === 'elite') setCurrentPlan('premium');
          else setCurrentPlan('free');
        }
      })
      .catch(() => setCurrentPlan('free'));
  }, [user?.uid]);

  const handleSelectPlan = async (planId: string, isAnnual?: boolean) => {
    if (!user) {
      toast.error('Debes iniciar sesión para contratar un plan');
      return;
    }
    if (planId === 'free') {
      toast.info('Ya tienes el plan base');
      return;
    }

    try {
      const response = await fetch('/api/mercadopago/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          isYearly: isAnnual ?? false,
          ...(founderMode && { coupon: 'FUNDADOR30' }),
        }),
      });
      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error ?? 'No se pudo iniciar el checkout');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar el pago con Mercado Pago');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-x-hidden">
      {/* Fondo sutil: gradiente suave solo en desktop para dar profundidad */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-slate-100/80 via-transparent to-slate-50/60 dark:from-slate-900/50 dark:via-transparent dark:to-slate-950 z-0" aria-hidden />
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-6 pb-20 sm:px-6 sm:pt-8 md:pb-24">
        <Link
          href="/publish"
          className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors gap-1.5 mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Volver a Publicar
        </Link>

        <FounderBanner totalSlots={30} />

        {user && (
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tu plan actual:</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-sm font-bold text-slate-900 dark:text-white">
              {currentPlan === 'free' && 'Plan Base'}
              {currentPlan === 'pro' && 'Plan Pro'}
              {currentPlan === 'premium' && 'Plan Premium'}
            </span>
            <Link href="/my-properties" className="text-sm font-semibold text-primary hover:underline ml-auto">
              Ver mi dashboard →
            </Link>
          </div>
        )}

        <section className="mt-10 sm:mt-14">
          <PricingPlans
            isFounderMode={founderMode}
            currentPlan={currentPlan}
            onSelect={handleSelectPlan}
          />
        </section>

        <CorporatePlan />
      </div>
    </div>
  );
}
