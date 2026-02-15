import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { SavedSearchesProvider } from "@/contexts/SavedSearchesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PublishProvider } from "@/contexts/PublishContext";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dominiototal.vercel.app'),
  title: {
    default: "DominioTotal — Propiedades en Uruguay",
    template: "%s | DominioTotal"
  },
  description: "Encontrá tu próximo hogar. 12.842 propiedades activas en Uruguay.",
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://dominiototal.vercel.app',
    siteName: 'DominioTotal',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <FavoritesProvider>
            <SavedSearchesProvider>
              <PublishProvider>
                <div className="json-ld-container">
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "RealEstateAgent",
                        "name": "DominioTotal",
                        "url": "https://dominiototal.vercel.app",
                        "logo": "https://dominiototal.vercel.app/logo.png",
                        "image": "https://dominiototal.vercel.app/og-image.jpg",
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
                        "priceRange": "$$$"
                      })
                    }}
                  />
                </div>
                <Navbar />
                <main className="pt-24 md:pt-28 pb-20 md:pb-0">{children}</main>
                <Footer />
                <BottomTabBar />
              </PublishProvider>
            </SavedSearchesProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
