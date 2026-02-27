import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/providers/theme-provider";
import ChatButton from "../components/ChatButton";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Configuración de fuentes
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});

// Metadata de la aplicación (Podemos hacer esto dinámico después)
export const metadata: Metadata = {
  metadataBase: new URL('https://nomadafantasma.com'),
  title: "Nómada Fantasma",
  description: "Cartografía náutica-tecnológica para nómadas digitales.",
  keywords: ["nómada", "mapas", "navegación", "viajes", "tecnología", "cyberpunk"],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_ES", // TODO: Dynamic locale
    url: "https://nomadafantasma.com",
    title: "Nómada Fantasma",
    description: "Cartografía náutica-tecnológica para nómadas digitales.",
    siteName: "Nómada Fantasma",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nómada Fantasma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nómada Fantasma",
    description: "Cartografía náutica-tecnológica para nómadas digitales.",
    images: ["/og-image.jpg"],
    creator: "@nomadafantasma",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d8e4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'es'].includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  // `getMessages` expects an options object; passing the locale string directly does
  // nothing because the function reads `opts?.locale`. We need to use
  // `{ locale }` so the correct translation file is loaded.
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* CSS de Leaflet para el mapa */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative z-0 flex-1">
              <Navbar />
              <main id="main" className="relative z-0">
                {children}
              </main>
              <Footer />
            </div>
            <ChatButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
