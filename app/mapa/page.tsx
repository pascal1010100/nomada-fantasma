// app/mapa/page.tsx
import type { Metadata } from "next";
import {
  Wifi,
  Bed,
  Coffee,
  CreditCard,
  Anchor,
  Filter,
  Compass,
} from "lucide-react";
import MapCanvas from "./MapCanvas";
import { samplePoints } from "./points";

export const metadata: Metadata = {
  title: "Mapa | Nómada Fantasma",
  description:
    "Carta náutica ciberpunk: Wi-Fi, hospedaje, cowork, bancos y puertos.",
};

export default function MapaPage() {
  return (
    <section className="container py-10 md:py-14">
      {/* Hero compacto con cuadrícula para que haga match con tu landing */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 backdrop-blur mb-8 md:mb-10">
        {/* Fondo de cuadrícula náutica (claro/oscuro adaptativo) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, color-mix(in oklab, var(--foreground) 16%, transparent) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, color-mix(in oklab, var(--foreground) 16%, transparent) 0 1px, transparent 1px 28px)",
          } as React.CSSProperties}
        />
        {/* Vignette suave */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, transparent 60%, rgba(0,0,0,0.25) 100%)",
            mixBlendMode: "multiply",
          }}
        />

        <header className="relative z-10 px-6 py-8 md:px-10 md:py-10 text-center">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full ring-1 ring-border/60 bg-background/60">
            <Compass className="h-5 w-5 opacity-80" />
          </div>

          {/* Título más creativo */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Carta Fantasma · Mapa Nómada
          </h1>

          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Un mapa con estética <em>barco fantasma digital</em>: cuadrícula
            náutica, neón y controles modernos.
          </p>

          {/* Pills (solo UI) */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button className="pill inline-flex items-center gap-2">
              <Wifi className="h-4 w-4 md:h-5 md:w-5" />
              Wi-Fi
            </button>
            <button className="pill inline-flex items-center gap-2">
              <Bed className="h-4 w-4 md:h-5 md:w-5" />
              Hospedaje
            </button>
            <button className="pill inline-flex items-center gap-2">
              <Coffee className="h-4 w-4 md:h-5 md:w-5" />
              Cowork/Café
            </button>
            <button className="pill inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
              Banco/ATM
            </button>
            <button className="pill inline-flex items-center gap-2">
              <Anchor className="h-4 w-4 md:h-5 md:w-5" />
              Puertos
            </button>

            <span className="ml-2 hidden items-center gap-2 text-xs text-muted-foreground sm:inline-flex">
              <Filter className="h-4 w-4" />
              (Interactividad en el siguiente paso)
            </span>
          </div>
        </header>
      </div>

      {/* Marco del mapa: borde y cuadrícula ligera detrás para continuidad visual */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-md bg-background">
        {/* Cuadrícula sutil detrás del mapa */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, color-mix(in oklab, var(--foreground) 14%, transparent) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, color-mix(in oklab, var(--foreground) 14%, transparent) 0 1px, transparent 1px 24px)",
          } as React.CSSProperties}
        />
        {/* Contenido real del mapa */}
        <div className="relative">
          <MapCanvas points={samplePoints} />
        </div>
      </div>

      {/* Nota */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <strong>Siguiente paso:</strong> categorías reales, íconos por tipo y
        clustering.
      </p>
    </section>
  );
}
