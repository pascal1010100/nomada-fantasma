// app/mapa/MapCanvas.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import type { Point } from "./points";
import { Plus, Minus, Ship, Skull } from "lucide-react";

type MapCanvasProps = {
  /** Puntos a pintar (puede venir vacío) */
  points?: Point[];
};

function useThemeDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();

    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => update();
    mq?.addEventListener?.("change", onChange);

    return () => {
      obs.disconnect();
      mq?.removeEventListener?.("change", onChange);
    };
  }, []);
  return isDark;
}

/** Controles modernos (zoom + recenter) */
function ZoomUI() {
  const map = useMap();
  return (
    <div
      className="
        absolute z-[1100] flex flex-col gap-2
        left-[calc(env(safe-area-inset-left)+14px)]
        top-[calc(env(safe-area-inset-top)+14px)]
      "
    >
      <button
        type="button"
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
        className="btn-ghost h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform glow-aqua"
        title="Acercar"
      >
        <Plus className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
        className="btn-ghost h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform glow-aqua"
        title="Alejar"
      >
        <Minus className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        aria-label="Recentrar"
        onClick={() => map.setView([14.62, -90.56], 5, { animate: true })}
        className="btn-ghost h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform"
        title="Volver al inicio"
      >
        <Ship className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  );
}

export default function MapCanvas({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();

  // Basemaps: claro ↔ oscuro (noWrap para evitar "mundo repetido")
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttrib = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : "&copy; OpenStreetMap contributors";

  // Límites del mundo para que no se desborde
  const worldBounds = useMemo(
    () => L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
    []
  );

  // Pin neón (tu diseño original)
  const pinNeon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:16px;height:16px;transform:translate(-50%,-50%);">
            <style>
              @keyframes nfPulse { 0%{transform:scale(.9);opacity:.9} 70%{transform:scale(1.35);opacity:0} 100%{opacity:0} }
            </style>
            <div style="
              position:absolute;inset:0;border-radius:9999px;
              background: radial-gradient(40% 40% at 50% 50%, rgba(56,189,248,1), rgba(56,189,248,.22) 60%, rgba(56,189,248,0) 70%);
              box-shadow: 0 0 0 1px rgba(56,189,248,.42), 0 6px 18px rgba(56,189,248,.32);
            "></div>
            <div style="
              position:absolute;inset:-6px;border-radius:9999px;filter:blur(4px);
              background: radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,.22), rgba(168,85,247,.14) 60%, rgba(168,85,247,0) 70%);
              animation: nfPulse 2.4s ease-out infinite;
            "></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    []
  );

  // Recalcular tamaño del mapa al cambiar de tema o al montar
  useEffect(() => {
    // Leaflet se reajusta automáticamente, pero invalidamos por si acaso
    setTimeout(() => {
      const panes = document.querySelectorAll(".leaflet-container");
      panes.forEach((el: any) => el._leaflet_id && (el as any).dispatchEvent(new Event("resize")));
    }, 50);
  }, [isDark]);

  return (
    <div className="relative overflow-hidden rounded-3xl fade-border h-[60vh] min-h-[420px] bg-background">
      {/* === Estética “barco fantasma digital” (capas visuales) === */}
      <style>{`
        @keyframes nfSweepRotate { to { transform: rotate(360deg); } }
        @keyframes scanDrift {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 0 8px, 0 0, 0 0; }
        }
        .nf-grid{
          position:absolute; inset:0; pointer-events:none;
          opacity:.18;
          background-image:
            repeating-linear-gradient(0deg, color-mix(in oklab, var(--foreground) 16%, transparent) 0 1px, transparent 1px 28px),
            repeating-linear-gradient(90deg, color-mix(in oklab, var(--foreground) 16%, transparent) 0 1px, transparent 1px 28px);
        }
        .dark .nf-grid{ opacity:.12; }

        .nf-vignette{
          position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(120% 80% at 50% 0%, transparent 60%, rgba(0,0,0,0.25) 100%);
          mix-blend-mode: multiply;
        }

        .nf-scanlines{
          position:absolute; inset:0; pointer-events:none;
          background:
            repeating-linear-gradient(180deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px),
            radial-gradient(100% 60% at 50% -10%, rgba(56,189,248,.08), transparent 60%);
          animation: scanDrift 6s linear infinite;
          mix-blend-mode: overlay;
          opacity:.35;
        }

        .nf-sonar-sweep{
          position:absolute; inset:-20%;
          pointer-events:none;
          background: conic-gradient(from -60deg at 46% 40%, hsl(var(--primary) / .16), transparent 35%);
          filter: blur(12px);
          mix-blend-mode: screen;
          animation: nfSweepRotate 12s linear infinite;
        }
        html:not(.dark) .nf-sonar-sweep{ mix-blend-mode: plus-lighter; filter: blur(10px); }
      `}</style>

      {/* Cuadrícula detrás del mapa para continuidad con la página */}
      <div aria-hidden className="nf-grid" />
      <div className="absolute inset-0 z-[20]">
        <MapContainer
          center={[14.62, -90.56]}
          zoom={5}
          minZoom={2}
          maxZoom={18}
          maxBounds={worldBounds}
          maxBoundsViscosity={0.9}
          worldCopyJump={false}
          zoomControl={false}
          scrollWheelZoom
          attributionControl
          preferCanvas
          className="h-full w-full"
        >
          <TileLayer
            url={tileUrl}
            attribution={tileAttrib}
            noWrap
            updateInterval={100}
            keepBuffer={2}
            detectRetina
          />

          {points.map((p, i) => (
            <Marker
              key={(p as any).id ?? `${p.lat}-${p.lng}-${i}`}
              position={[p.lat, p.lng]}
              icon={pinNeon}
            />
          ))}

          <ZoomUI />
        </MapContainer>
      </div>

      {/* Capas HUD */}
      <div aria-hidden className="nf-vignette absolute inset-0 z-[1000]" />
      <div aria-hidden className="nf-scanlines absolute inset-0 z-[1025]" />
      <div aria-hidden className="nf-sonar-sweep absolute inset-0 z-[1050]" />

      {/* Marca y brújula */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 z-[1200] opacity-75"
        title="Rumbo Norte"
      >
        <div className="rounded-full bg-card/70 border border-border px-2 py-1 text-xs backdrop-blur">
          N
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 z-[1200] opacity-15"
      >
        <Skull className="h-8 w-8" />
      </div>
    </div>
  );
}
