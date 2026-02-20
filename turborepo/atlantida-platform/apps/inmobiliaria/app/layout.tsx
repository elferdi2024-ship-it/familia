import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { SavedSearchesProvider } from "@/contexts/SavedSearchesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublishProvider } from "@/contexts/PublishContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ComparisonFloatingBar } from "@/components/ComparisonFloatingBar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@repo/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mibarrio.uy'),
  title: {
    default: "MiBarrio.uy Soluciones Inmobiliarias — Propiedades en Uruguay | Comprar, Alquilar, Vender",
    template: "%s | MiBarrio.uy"
  },
  description: "La mejor plataforma inmobiliaria de Uruguay. Busca casas, apartamentos y terrenos en venta o alquiler. Vivienda Promovida, garantias transparentes y busqueda inteligente.",
  keywords: [
    "inmobiliaria uruguay", "propiedades montevideo", "alquilar apartamento",
    "comprar casa uruguay", "vivienda promovida", "ley 18795",
    "alquiler pocitos", "venta apartamento montevideo", "inmuebles uruguay",
    "garantia anda", "garantia cgn", "MiBarrio.uy"
  ],
  alternates: {
    canonical: 'https://mibarrio.uy',
  },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://mibarrio.uy',
    siteName: 'MiBarrio.uy',
    title: 'MiBarrio.uy Soluciones Inmobiliarias — Propiedades en Uruguay',
    description: 'Encontrá tu próximo hogar. La mejor experiencia mobile para buscar propiedades en Uruguay.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'MiBarrio.uy - Plataforma Inmobiliaria Uruguay',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiBarrio.uy — Propiedades en Uruguay',
    description: 'Busca casas y apartamentos en venta o alquiler en Uruguay.',
    images: ['/logo-mibarrio-alpha.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verificacion-google-aqui',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon-redondel.png" />
        <link rel="apple-touch-icon" href="/icon-redondel.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MiBarrio.uy" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* Skip link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold">
          Saltar al contenido principal
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FavoritesProvider>
              <SavedSearchesProvider>
                <PublishProvider>
                  <ComparisonProvider>
                    <div className="json-ld-container">
                      <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                          __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "RealEstateAgent",
                            "name": "MiBarrio.uy Soluciones Inmobiliarias",
                            "url": "https://mibarrio.vercel.app",
                            "logo": "https://mibarrio.vercel.app/logo-mibarrio-alpha.png",
                            "image": "https://mibarrio.vercel.app/logo-mibarrio-alpha.png",
                            "description": "Encontrá tu próximo hogar en Uruguay. Inmobiliaria líder en Montevideo, Canelones y Maldonado.",
                            "address": {
                              "@type": "PostalAddress",
                              "streetAddress": "Av. 18 de Julio 1234",
                              "addressLocality": "Montevideo",
                              "addressRegion": "Montevideo",
                              "postalCode": "11100",
                              "addressCountry": "UY"
                            },
                            "geo": {
                              "@type": "GeoCoordinates",
                              "latitude": -34.9011,
                              "longitude": -56.1645
                            },
                            "telephone": "+598 99 123 456",
                            "priceRange": "$$$",
                            "sameAs": [
                              "https://www.instagram.com/MiBarrio.uy",
                              "https://www.facebook.com/MiBarrio.uy"
                            ]
                          })
                        }}
                      />
                    </div>
                    <Suspense fallback={<div className="h-16" />}>
                      <Navbar />
                    </Suspense>
                    <main id="main-content" className="pb-20 md:pb-0">{children}</main>
                    <Footer />
                    <BottomTabBar />
                    <ComparisonFloatingBar />
                    <Toaster
                      position="top-center"
                      richColors
                      closeButton
                      toastOptions={{
                        duration: 4000,
                        className: 'font-sans rounded-2xl border-white/10 shadow-2xl backdrop-blur-md',
                      }}
                    />
                  </ComparisonProvider>
                </PublishProvider>
              </SavedSearchesProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
