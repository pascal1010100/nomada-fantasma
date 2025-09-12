// app/mapa/page.tsx
import type { Metadata } from "next";
import MapCanvas from "./MapCanvas";
import { samplePoints } from "./points";
import HeaderHero from "./_HeaderHero"; // ⬅️ import directo (client boundary)

export const metadata: Metadata = {
  title: "Carta Fantasma · Mapa Nómada",
  description:
    "Carta náutica ciberpunk: Wi-Fi, hospedaje, cowork, bancos y puertos.",
};

export default function MapaPage() {
  return (
    <section className="container py-10 md:py-14">
      {/* ====== HERO (animado con Framer Motion en _HeaderHero) ====== */}
      <HeaderHero />

      {/* ====== MARCO DEL MAPA ====== */}
      <div
        className="
          relative overflow-hidden rounded-2xl border border-border/60
          shadow-md bg-background
        "
        aria-label="Mapa interactivo Nómada Fantasma"
      >
        {/* Cuadrícula sutil detrás (sin color-mix para compatibilidad) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 24px)",
          }}
        />

        {/* Contenido real del mapa */}
        <div className="relative">
          <MapCanvas points={samplePoints} />
        </div>
      </div>

      {/* Nota */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <strong>Siguiente paso:</strong> categorías reales, íconos por tipo y clustering.
      </p>
    </section>
  );
}
