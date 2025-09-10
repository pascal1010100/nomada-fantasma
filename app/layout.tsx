// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nómada Fantasma",
  description: "Cartógrafo de lo imposible",
  metadataBase: new URL("https://nomadafantasma.example.com"),
  applicationName: "Nómada Fantasma",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Nómada Fantasma",
    description: "Cartógrafo de lo imposible",
    url: "https://nomadafantasma.example.com",
    siteName: "Nómada Fantasma",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nómada Fantasma" }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nómada Fantasma",
    description: "Cartógrafo de lo imposible",
    images: ["/og-image.png"],
  },
  category: "travel",
  creator: "Nómada Fantasma",
  publisher: "Nómada Fantasma",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e9ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

/* Evita flash de tema antes de hidratar */
const THEME_INIT = `
(function() {
  try {
    var ls = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var shouldDark = ls ? ls === 'dark' : systemDark;
    var root = document.documentElement;
    if (shouldDark) root.classList.add('dark'); else root.classList.remove('dark');
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{THEME_INIT}</Script>
      </head>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <Navbar />
        <main id="main" className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
