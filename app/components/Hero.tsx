// app/components/hero.tsx
import CTA from "./ui/CTA";
import { Compass } from "lucide-react";

export default function Hero() {
  return (
    <section className="container py-24">
      <div className="relative map-surface hero-halo rounded-3xl fade-border px-6 py-14 sm:py-20 text-center">
        {/* Coordenadas tipo “mapa” */}
        <div className="absolute left-4 top-4 pill hidden sm:inline-flex items-center gap-2 z-10">
          <Compass className="h-4 w-4 opacity-80" />
          <span className="text-xs opacity-80">N 19.43° · W 99.13°</span>
        </div>

        {/* Contenido principal sobre la superficie de mapa */}
        <div className="relative z-10">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-neon-gradient">
            Nómada Fantasma
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Cartógrafo de lo imposible
          </p>

          <CTA />

          <ul className="mt-12 space-y-3 text-muted-foreground">
            <li>🪐 Explora destinos únicos</li>
            <li>🕯️ Descubre rutas secretas</li>
            <li>⚓ Navegar sin límites</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
