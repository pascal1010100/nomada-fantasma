// app/mapa/page.tsx
import type { Metadata } from "next";
import { Wifi, Bed, Coffee, CreditCard, Anchor, Filter } from "lucide-react";
import MapCanvas from "./MapCanvas"; // ⬅️ Import directo del Client Component

export const metadata: Metadata = {
  title: "Mapa | Nómada Fantasma",
  description:
    "Explora puntos útiles para nómadas: Wi-Fi, hospedaje, cowork, bancos y puertos.",
};

export default function MapaPage() {
  return (
    <section className="container py-12 md:py-16">
      {/* Encabezado */}
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mapa</h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra Wi-Fi, hospedaje, cowork, bancos y puertos — con el estilo
          náutico-tecnológico del Nómada Fantasma.
        </p>
      </header>

      {/* Filtros (stub visual, sin lógica aún) */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
        <button className="pill inline-flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          Wi-Fi
        </button>
        <button className="pill inline-flex items-center gap-2">
          <Bed className="h-4 w-4" />
          Hospedaje
        </button>
        <button className="pill inline-flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          Cowork/Café
        </button>
        <button className="pill inline-flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Banco/ATM
        </button>
        <button className="pill inline-flex items-center gap-2">
          <Anchor className="h-4 w-4" />
          Puertos
        </button>

        <span className="hidden sm:inline-flex items-center gap-2 text-xs text-muted-foreground ml-2">
          <Filter className="h-4 w-4" />
          (Interactividad en el siguiente paso)
        </span>
      </div>

      {/* Mapa real */}
      <MapCanvas />

      {/* Nota siguiente paso */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        <strong>Siguiente paso:</strong> marcadores reales, filtros y control de
        capas.
      </p>
    </section>
  );
}
