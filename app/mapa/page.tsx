// app/mapa/page.tsx
import type { Metadata } from "next";
import HeaderHero from "./_HeaderHero";
import MapClient from "./MapClient";
import { samplePoints } from "./points";

export const metadata: Metadata = {
  title: "Carta Fantasma · Mapa Nómada",
  description:
    "Carta náutica ciberpunk: Wi-Fi, hospedaje, cowork, bancos y puertos.",
};

export default function MapaPage() {
  return (
    <section className="container relative z-0 py-10 md:py-14">
      <HeaderHero />
      <div className="relative z-0 overflow-hidden rounded-2xl border border-border/60 shadow-md bg-background">
        <MapClient points={samplePoints} />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <strong>Siguiente paso:</strong> categorías reales, íconos por tipo y clustering.
      </p>
    </section>
  );
}
