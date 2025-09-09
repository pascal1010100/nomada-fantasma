// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nómada Fantasma",
  description: "Cartógrafo de lo imposible",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nómada Fantasma — Cartógrafo de lo imposible
        </footer>
      </body>
    </html>
  );
}
