# Guía: Diferenciar Apps + Deploy en Vercel

## PARTE 1: DIFERENCIAR LAS APPS

### 1.1 Branding (Colores, Logo, Nombre)

Ya tienes los archivos `config/brand.ts` en cada app. Aquí está qué personalizar:

#### apps/portal/config/brand.ts
```typescript
export const brandConfig = {
  name: 'Barrio.uy',
  tagline: 'El Portal Inmobiliario de Uruguay',
  logo: '/logo-Barrio.uy.svg',

  // Colores del Portal (Azul vibrante)
  colors: {
    primary: '#0066FF',
    secondary: '#00D4AA',
    accent: '#FFB800',
    background: '#F8FAFC',
    text: '#1E293B',
  },

  domain: 'Barrio.uy.uy',

  contact: {
    email: 'info@Barrio.uy.uy',
    phone: '+598 99 123 456',
    whatsapp: '59899123456',
  },

  social: {
    facebook: 'https://facebook.com/Barrio.uy',
    instagram: 'https://instagram.com/Barrio.uy',
  },

  // Features específicos del portal
  features: {
    multiAgent: true,           // Múltiples agentes
    agentRegistration: true,    // Registro de agentes
    subscriptionPlans: true,    // Planes de pago
    featuredListings: true,     // Destacados pagos
    agentDashboard: true,       // Dashboard para agentes
  }
}
```

#### apps/inmobiliaria/config/brand.ts
```typescript
export const brandConfig = {
  name: 'MiBarrio.uy',
  tagline: 'Soluciones Inmobiliarias Premium',
  logo: '/logo-atlantida.svg',

  // Colores de Inmobiliaria (Azul oscuro elegante + Dorado)
  colors: {
    primary: '#1E3A5F',
    secondary: '#C9A961',
    accent: '#2563EB',
    background: '#FAFAFA',
    text: '#1A1A2E',
  },

  domain: 'mibarrio.uy',

  contact: {
    email: 'contacto@mibarrio.uy',
    phone: '+598 99 888 777',
    whatsapp: '59899888777',
    address: 'Av. Brasil 2587, Montevideo',
  },

  social: {
    facebook: 'https://facebook.com/mibarrio',
    instagram: 'https://instagram.com/mibarrio',
    linkedin: 'https://linkedin.com/company/mibarrio',
    youtube: 'https://youtube.com/@mibarrio',
  },

  // Features específicos de inmobiliaria
  features: {
    multiAgent: false,          // Solo propiedades propias
    agentRegistration: false,   // Sin registro externo
    subscriptionPlans: false,   // Sin planes
    virtualTours: true,         // Tours 360
    exclusiveContent: true,     // Contenido premium
    personalizedService: true,  // Servicio personalizado
  }
}
```

---

### 1.2 Landing Pages Diferentes

#### apps/portal/app/page.tsx (Marketplace)
```tsx
import { brandConfig } from '@/config/brand'
import { Button } from '@repo/ui'
import Link from 'next/link'

export default function PortalHome() {
  return (
    <main>
      {/* Hero del Marketplace */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Encuentra tu hogar ideal en Uruguay
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Miles de propiedades de los mejores agentes inmobiliarios
          </p>

          {/* Buscador principal */}
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl">
            {/* SearchBar component */}
          </div>
        </div>
      </section>

      {/* Stats del marketplace */}
      <section className="py-16 bg-white">
        <div className="container mx-auto grid grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">2,500+</p>
            <p className="text-gray-600">Propiedades</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">150+</p>
            <p className="text-gray-600">Agentes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">20+</p>
            <p className="text-gray-600">Ciudades</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">98%</p>
            <p className="text-gray-600">Satisfacción</p>
          </div>
        </div>
      </section>

      {/* CTA para agentes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres agente inmobiliario?</h2>
          <p className="text-gray-600 mb-8">
            Únete a la red de agentes más grande de Uruguay
          </p>
          <Link href="/agent-register">
            <Button size="lg">Registrarme como Agente</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
```

#### apps/inmobiliaria/app/page.tsx (Corporativo)
```tsx
import { brandConfig } from '@/config/brand'
import { Button } from '@repo/ui'
import Link from 'next/link'

export default function InmobiliariaHome() {
  return (
    <main>
      {/* Hero Elegante */}
      <section
        className="relative min-h-screen flex items-center"
        style={{ backgroundColor: brandConfig.colors.primary }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="relative container mx-auto px-4 text-center text-white">
          <p
            className="text-lg mb-4 tracking-widest"
            style={{ color: brandConfig.colors.secondary }}
          >
            BIENVENIDO A
          </p>
          <h1 className="text-6xl font-serif font-bold mb-6">
            {brandConfig.name}
          </h1>
          <p className="text-2xl mb-8 opacity-90">
            {brandConfig.tagline}
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/propiedades">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Ver Propiedades
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-sm tracking-widest mb-4"
              style={{ color: brandConfig.colors.secondary }}
            >
              SOBRE NOSOTROS
            </p>
            <h2 className="text-4xl font-serif mb-6">
              Excelencia en Bienes Raíces
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Con más de 15 años de experiencia en el mercado inmobiliario uruguayo,
              MiBarrio.uy se ha consolidado como referente en propiedades premium.
              Nuestro equipo de expertos ofrece un servicio personalizado y exclusivo.
            </p>
            <Link href="/nosotros">
              <Button variant="outline">Conocer más</Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="/about-image.jpg"
              alt="MiBarrio.uy"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Propiedades Destacadas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p
              className="text-sm tracking-widest mb-4"
              style={{ color: brandConfig.colors.secondary }}
            >
              EXCLUSIVAS
            </p>
            <h2 className="text-4xl font-serif">Propiedades Destacadas</h2>
          </div>
          {/* PropertyGrid con propiedades exclusivas */}
        </div>
      </section>

      {/* CTA Contacto */}
      <section
        className="py-20 text-white text-center"
        style={{ backgroundColor: brandConfig.colors.primary }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif mb-6">
            ¿Buscas una propiedad exclusiva?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestros asesores están listos para ayudarte
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              style={{
                backgroundColor: brandConfig.colors.secondary,
                color: brandConfig.colors.primary
              }}
            >
              Agendar Consulta
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
```

---

### 1.3 Páginas Exclusivas por App

#### Solo en Portal (apps/portal/app/)
```
/agent-register/page.tsx    → Registro de agentes
/pricing/page.tsx           → Planes y precios
/dashboard/page.tsx         → Dashboard de agente
/my-listings/page.tsx       → Mis publicaciones
/analytics/page.tsx         → Analytics del agente
```

#### Solo en Inmobiliaria (apps/inmobiliaria/app/)
```
/nosotros/page.tsx          → Sobre MiBarrio.uy
/equipo/page.tsx            → Nuestro equipo
/servicios/page.tsx         → Servicios premium
/tasaciones/page.tsx        → Servicio de tasación
/virtual-tours/page.tsx     → Tours virtuales 360°
```

---

### 1.4 Estilos Globales Diferentes

#### apps/portal/app/globals.css
```css
@import "tailwindcss";

:root {
  --color-primary: #0066FF;
  --color-secondary: #00D4AA;
  --color-accent: #FFB800;
}

/* Estilo moderno y tech */
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}
```

#### apps/inmobiliaria/app/globals.css
```css
@import "tailwindcss";

:root {
  --color-primary: #1E3A5F;
  --color-secondary: #C9A961;
  --color-accent: #2563EB;
}

/* Estilo elegante y premium */
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
}
```

---

## PARTE 2: DEPLOY EN VERCEL

### 2.1 Preparar el Repositorio

```bash
# En tu monorepo local
cd d:\INMOBILIARIA\turborepo\atlantida-platform

# Inicializar git si no está
git init
git add .
git commit -m "Monorepo Turborepo completo"

# Conectar a GitHub
git remote add origin https://github.com/TU_USUARIO/atlantida-platform.git
git push -u origin main
```

### 2.2 Configurar Vercel - Paso a Paso

#### Proyecto 1: Portal (Marketplace)

1. Ve a [vercel.com](https://vercel.com) → "Add New Project"
2. Importa tu repo `atlantida-platform`
3. **Configuración importante:**
   ```
   Project Name: atlantida-portal
   Framework Preset: Next.js
   Root Directory: apps/portal          ← MUY IMPORTANTE
   Build Command: cd ../.. && npm run build:portal
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables de Entorno** (copiar de tu .env.local):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   NEXT_PUBLIC_ALGOLIA_APP_ID=xxx
   NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xxx
   ALGOLIA_ADMIN_KEY=xxx
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
   SENTRY_DSN=xxx
   RESEND_API_KEY=xxx
   ```

5. Click "Deploy"

#### Proyecto 2: Inmobiliaria (MiBarrio.uy)

1. Ve a Vercel → "Add New Project"
2. Importa el **mismo repo** `atlantida-platform`
3. **Configuración:**
   ```
   Project Name: atlantida-inmobiliaria
   Framework Preset: Next.js
   Root Directory: apps/inmobiliaria    ← DIFERENTE
   Build Command: cd ../.. && npm run build:inmobiliaria
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables de Entorno:** Las mismas (o diferentes si usan Firebase distintos)

5. Click "Deploy"

### 2.3 Configurar Dominios

#### En Vercel Dashboard → Project Settings → Domains

**Portal:**
```
Barrio.uy.uy
www.Barrio.uy.uy
```

**Inmobiliaria:**
```
mibarrio.uy
www.mibarrio.uy
```

### 2.4 Verificar Builds Automáticos

Vercel detectará automáticamente Turborepo y solo rebuildeará la app que cambió:

- Cambio en `apps/portal/` → Solo rebuild Portal
- Cambio en `apps/inmobiliaria/` → Solo rebuild Inmobiliaria
- Cambio en `packages/` → Rebuild ambos

### 2.5 vercel.json (Opcional - en raíz del monorepo)

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## CHECKLIST FINAL

### Diferenciación
- [ ] `config/brand.ts` personalizado en cada app
- [ ] Landing pages diferentes
- [ ] Colores/fonts diferentes
- [ ] Páginas exclusivas creadas
- [ ] Logos diferentes en `public/`

### Deploy Vercel
- [ ] Repo en GitHub
- [ ] Proyecto 1: Portal (Root: apps/portal)
- [ ] Proyecto 2: Inmobiliaria (Root: apps/inmobiliaria)
- [ ] Variables de entorno configuradas
- [ ] Dominios conectados
- [ ] Build exitoso en ambos

---

## URLs Finales

| App | Desarrollo | Producción |
|-----|------------|------------|
| Portal | localhost:3000 | Barrio.uy.uy |
| Inmobiliaria | localhost:3001 | mibarrio.uy |
