// app/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="mx-auto w-[min(1200px,96%)] rounded-3xl border border-border/60 bg-card/60 px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nómada Fantasma
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href="mailto:hola@nomadafantasma.io"
              className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
            >
              <Mail className="h-4 w-4" />
              hola@nomadafantasma.io
            </a>
            <span className="opacity-40">•</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Remoto · GT
            </span>
            <span className="opacity-40">•</span>
            <Link href="/contacto" className="underline-offset-2 hover:underline">
              Página de contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
