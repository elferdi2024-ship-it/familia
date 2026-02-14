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
  title: "DominioTotal — Propiedades en Uruguay",
  description: "Encontrá tu próximo hogar. 12.842 propiedades activas en Uruguay.",
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
                <Navbar />
                <main className="pb-20 md:pb-0">{children}</main>
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
