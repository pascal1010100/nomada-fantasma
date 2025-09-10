// app/mapa/page.tsx
import type { Metadata } from "next";
import {
  Wifi,
  Bed,
  Coffee,
  CreditCard,
  Anchor,
  MapPin,
  Compass,
  Filter,
} from "lucide-react";

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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Mapa
        </h1>
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

      {/* Contenedor del mapa (placeholder visual) */}
      <div className="relative rounded-3xl overflow-hidden fade-border map-surface h-[60vh] min-h-[420px]">
        {/* Placeholder mientras integramos el mapa real */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 grid place-items-center rounded-full ring-1 ring-border/60">
              <Compass className="h-5 w-5 opacity-80" />
            </div>
            <h2 className="text-lg font-medium">Mapa interactivo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              En el siguiente paso cargaremos el mapa real con React Leaflet,
              filtros y marcadores.
            </p>
          </div>
        </div>

        {/* Base estética para mantener coherencia con el Hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-30"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 35%, hsl(var(--primary) / .18), transparent 60%)",
          }}
        />

        {/* Marca de centro aproximado (solo estética por ahora) */}
        <div className="absolute right-4 bottom-4 pill inline-flex items-center gap-2 text-xs">
          <MapPin className="h-4 w-4" />
          Centro: 14.62°N · 90.56°W
        </div>
      </div>

      {/* Nota siguiente paso */}
      <p className="mt-4 text-xs text-muted-foreground text-center">
        <strong>Siguiente paso:</strong> instalar la librería del mapa y
        reemplazar este placeholder por el mapa real con marcadores e iconos.
      </p>
    </section>
  );
}
