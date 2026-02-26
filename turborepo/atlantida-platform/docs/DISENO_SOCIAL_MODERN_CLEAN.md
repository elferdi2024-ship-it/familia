# Guia visual social modern-clean

Esta guia define el lenguaje visual para `barrio.uy` en feed, dashboard y modulos de gestion.

## Principios

- Priorizar legibilidad y ritmo de lectura antes que decoracion.
- Evitar exceso de redondeo y microtexto en mayusculas.
- Mantener interacciones claras: hover suave, active corto, sin animaciones agresivas.
- Usar jerarquia semantica consistente en textos, chips y botones.

## Tokens recomendados

- `radius`: usar `rounded-lg` por defecto; `rounded-xl` solo para contenedores principales; `rounded-full` solo en avatares/badges puntuales.
- `tipografia`: preferir `font-semibold` para titulos y acciones; evitar `font-black` salvo numericas KPI.
- `labels`: preferir `text-xs` o `text-[11px]` con `font-medium/semibold`; evitar `uppercase tracking-widest` como default.
- `spacing`: usar bloques compactos (`gap-2`, `gap-3`, `p-4`, `p-5`) para evitar pantallas aireadas sin informacion.

## Botones y CTA

- Primario: `rounded-lg`, `font-semibold`, `transition-all active:scale-95`.
- Secundario: borde visible y contraste correcto en dark mode.
- Evitar estilo "pill" en exceso (`rounded-full`) fuera de casos de identidad puntual.

## Cards

- Base: `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg`.
- Hover desktop: leve (`hover:shadow-md` o `hover:bg-slate-50`) sin saltos bruscos.
- Acciones: botoneria con altura consistente (`h-10` o `h-11`) y layout estable.

## Skeleton y carga

- Usar shimmer discreto para mejorar percepcion de velocidad.
- Evitar spinners largos como unica señal de carga.

## Checklist rapido por pantalla

- Titulo principal legible y no sobredimensionado.
- Jerarquia visual clara (header -> contenido -> acciones).
- CTA primario visible sin competir con secundarios.
- Consistencia de radios, pesos tipograficos y estados hover/active.
