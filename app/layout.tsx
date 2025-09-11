// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import ChatBotton from "./components/chatBotton";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nómada Fantasma",
  description: "Cartografía náutica-tecnológica para nómadas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* CSS de Leaflet para el mapa (necesario para tiles/controles) */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} min-h-dvh bg-background text-foreground antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <ChatBotton variant="ghost" />
        <Footer />
      </body>
    </html>
  );
}
