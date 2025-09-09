import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Navbar from "./components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nómada Fantasma",
  description: "barco pirata",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Navbar en todas las páginas */}
        <Navbar />

        {/* Contenido dinámico */}
        {children}
      </body>
    </html>
  );
}
