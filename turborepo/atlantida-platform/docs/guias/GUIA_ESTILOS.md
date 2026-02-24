# Guía de Estilos y Componentes (Design System)
**Plataforma Barrio.uy / MiBarrio.uy v4.0**

Este documento es la "fuente de verdad" para todo el equipo de diseño y desarrollo frontend. Barrio.uy está construido sobre un stack moderno (**Next.js 16 + Tailwind CSS 4.0 + shadcn/ui**) y nuestro principal objetivo es ofrecer una experiencia *Premium, Rápida y Mobile-First*.

---

## 1. Principios de Diseño

1. **Mobile-First Real:** Diseñamos interfaces para ser navegadas con el pulgar («Thumb Zone»). El escalado a escritorio (*Desktop*) es secundario.
2. **Speed is a Feature:** La percepción de velocidad lo es todo. Favorecemos los *skeleton loaders* por sobre los *spinners* que bloquean pantalla.
3. **Progressive Disclosure:** Mostrar lo justo y necesario al principio. La información compleja (filtros avanzados, datos legales) se despliega sólo si el usuario la requiere.
4. **Dark Mode Nativo:** El soporte para modo oscuro no es opcional, es un requerimiento base. Todos los componentes deben estar preparados para invertir sus colores grises y fondos sutilmente.

---

## 2. Paleta de Colores (Tokens)

Utilizamos variables CSS puras inyectadas en la configuración global para el ruteo de estilos con Tailwind. La identidad principal de Barrio gira en torno a tonos Azules (Confianza) y Ámbar (Llamados a la Acción).

```css
/* Base / Theme HSL variables (globals.css) */
@layer base {
  :root {
    /* Fondos y Texto base */
    --background: 0 0% 100%;       /* #FFFFFF */
    --foreground: 0 0% 3.9%;       /* #0a0a0a */
    
    /* Superficies de Tarjetas / Modales */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    /* Colores Principales (Barrio.uy Blue) */
    --primary: 221 83% 53%;        /* #2563eb */
    --primary-foreground: 210 40% 98%; /* #f8fafc */

    /* Colores Secundarios (Barrio.uy Amber) */
    --secondary: 41 96% 50%;       /* #f59e0b - Botones "Contactar", "Publicar" */
    --secondary-foreground: 0 0% 3.9%;

    /* Estados de Feedback */
    --muted: 210 40% 96.1%;        /* #f1f5f9 - Para fondos sutiles/badges */
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    /* UI Construct */
    --destructive: 0 84.2% 60.2%;  /* #ef4444 - Borrados técnicos, leads perdidos */
    --success: 160 84% 39%;        /* #10b981 - Vivienda promovida badge */
    
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221 83% 53%;          /* Mismo que Primary (Focus states) */
    --radius: 0.75rem;            /* 12px para border-radius de tarjetas */
  }

  /* Modo Oscuro (Dark Theme) */
  .dark {
    --background: 222.2 84% 4.9%;  /* #020817 */
    --foreground: 210 40% 98%;     /* #f8fafc */
    
    --card: 222.2 84% 4.9%;
    --border: 217.2 32.6% 17.5%;
    
    /* Adaptamos primario a un azul más claro para evitar contraste quemado */
    --primary: 217.2 91.2% 59.8%;  /* #3b82f6 */
    /* Más variables en el CSS principal ... */
  }
}
```

---

## 3. Tipografía

**Fuente Principal:** `Inter` (cargada via `next/font/google` para evitar Layout Shifts).
Es una tipografía sin serifa, legible en tamaños pequeños en móvil y elegante en escritorio.

### Escalas de jerarquía Tailwind (H1-H4 y Small Text):
*   **Hero Headers (H1):** `text-4xl md:text-5xl font-extrabold tracking-tight`
    *   *Uso:* Título del Buscador Principal o Landing.
*   **Page Titles (H2):** `text-2xl md:text-3xl font-semibold tracking-tight`
    *   *Uso:* Página de Detalle de Inmueble (Ej: "Apartamento 2 Dormitorios Pocitos").
*   **Card Headings (H3):** `text-lg font-medium`
    *   *Uso:* Nombres de propiedades en las tarjetas de la cuadrícula (Grid/List).
*   **Body Text:** `text-base font-normal text-muted-foreground`
    *   *Uso:* Descripciones largas de la propiedad.
*   **Badges / Meta:** `text-xs font-medium`
    *   *Uso:* Botones "Vivienda Promovida", Precio por m2, y etiquetas de estado.

---

## 4. Uso de Componentes (shadcn/ui overrides)

Basamos nuestros componentes en *shadcn/ui* y *Radix UI*, pero les aplicamos nuestra identidad.

1.  **Botones (`Button.tsx`)**
    *   *Touch Targets:* En vistas Mobile, cualquier botón clickeable no debe tener un height inferior a `h-11` (44px) para asegurar el toque cómodo del pulgar.
    *   *Botones Primarios (Contactar):* Fondo secondary (`bg-secondary`), redondeado amplio (`rounded-lg` o `rounded-full`). No usar mayúsculas cerradas.
    *   *Botones Secundarios:* Útiles para "Ver más filtros". Fondo outline (`variant='outline'`).
2.  **Tarjetas de Propiedades (`PropertyCard.tsx`)**
    *   Diseño "Card" de shadcn con Radius de `0.75rem`.
    *   La sombra (Box Shadow) debe ser sutil en light mode (`shadow-sm` o `shadow-md`) y cambiar a un `border` sólido y difuminado en dark mode.
    *   La fotografía principal utiliza siempre `aspect-video` (16:9) o `aspect-[4/3]`.
3.  **Formularios (Inputs y Textareas)**
    *   Uso estricto de `React Hook Form` y esquemas de `Zod` para mostrar errores de validación *debajo* del input en color rojo (`text-destructive`).
    *   En móvil (`max-width: 768px`), el input debe setearse en `text-base` (16px) **para evitar que iOS Safari haga auto-zooming engañoso al tocar el campo de texto**.

---

## 5. Tono de Voz y Copywriting (Micro-copy)

Barrio.uy se posiciona como una marca **Cercana, Premium y Transparente**.

*   **Pronombre:** Tratamos de "Vos" a los buscadores y agentes, dándole la impronta moderna de Uruguay. (Ej: *"Publicá tu apartamento gratis"*).
*   **Evitar argot inmobiliario excluyente:** En vez de "Propiedad Horizontal Ley XXX", priorizar "Apto. bajo régimen común" o añadir Tooltips aclaratorios (Ej: "?: Exoneración de IVA y ITP").
*   **Verbos Orientados a la Acción:**
    *   *En lugar de "Enviar mensaje"* -> **"Contactar al Agente"** o **"Hablar por WhatsApp"**.
    *   *En lugar de "Buscar"* -> **"Ver propiedades"**.
*   **Errores Empáticos (Empty States):** Si una búsqueda de filtros no arroja resultados, evitar mensajes fríos y caóticos como ("0 Resultados Error 404"). Sustituir por: *"No encontramos propiedades exactas para esta búsqueda. ¡Quitá un filtro o guardá esta alerta para avisarte cuando publiquen una!"*
