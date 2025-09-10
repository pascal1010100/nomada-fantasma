// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
        {/* CSS de Leaflet para el mapa (necesario para los tiles y controles) */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity=""
          crossOrigin=""
        />
        {/* Si usas un ThemeProvider propio, déjalo manejar el tema.
            Si no, más adelante te paso un snippet anti-FOUC si lo necesitas. */}
      </head>
      <body
        className={`${inter.variable} min-h-dvh bg-background text-foreground antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
