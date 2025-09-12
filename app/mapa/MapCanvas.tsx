// app/mapa/MapCanvas.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ScaleControl,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import type { Point } from "./points";
import { Plus, Minus, RotateCcw, Crosshair, Skull } from "lucide-react";

type MapCanvasProps = { points?: Point[] };

/* Detecta tema oscuro según la clase .dark en <html> */
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

/* Controles custom (zoom + localizar + reset) */
function Controls({
  onLocate,
  onReset,
}: {
  onLocate: () => void;
  onReset: () => void;
}) {
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
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
        className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform glow-aqua grid place-items-center"
        title="Acercar"
      >
        <Plus className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <button
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
        className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform glow-aqua grid place-items-center"
        title="Alejar"
      >
        <Minus className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <button
        aria-label="Mi ubicación"
        onClick={onLocate}
        className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform grid place-items-center"
        title="Mi ubicación"
      >
        <Crosshair className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <button
        aria-label="Recentrar vista"
        onClick={onReset}
        className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-card/70 border border-border backdrop-blur shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform grid place-items-center"
        title="Volver al inicio"
      >
        <RotateCcw className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  );
}

export default function MapCanvas({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();
  const [myPos, setMyPos] = useState<L.LatLngLiteral | null>(null);

  // Tiles claro/oscuro
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttrib = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : "&copy; OpenStreetMap contributors";

  // Límites del mundo
  const worldBounds = useMemo(
    () => L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)),
    []
  );

  // Pin neón para points
  const pinNeon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:16px;height:16px;transform:translate(-50%,-50%);">
            <style>@keyframes nfPulse{0%{transform:scale(.9);opacity:.9}70%{transform:scale(1.35);opacity:0}100%{opacity:0}}</style>
            <div style="position:absolute;inset:0;border-radius:9999px;background:radial-gradient(40% 40% at 50% 50%, rgba(56,189,248,1), rgba(56,189,248,.22) 60%, rgba(56,189,248,0) 70%);box-shadow:0 0 0 1px rgba(56,189,248,.42), 0 6px 18px rgba(56,189,248,.32);"></div>
            <div style="position:absolute;inset:-6px;border-radius:9999px;filter:blur(4px);background:radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,.22), rgba(168,85,247,.14) 60%, rgba(168,85,247,0) 70%);animation:nfPulse 2.4s ease-out infinite;"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    []
  );

  // Ref del mapa (React Leaflet v4 permite ref)
  const mapRef = useRef<L.Map | null>(null);
  const center = useMemo<L.LatLngExpression>(() => [14.62, -90.56], []);
  const reset = () => mapRef.current?.setView(center, 5, { animate: true });

  const locate = () => {
    if (!navigator.geolocation) return reset();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPos(p);
        mapRef.current?.setView(
          p,
          Math.max(10, mapRef.current?.getZoom() ?? 5),
          { animate: true }
        );
      },
      () => reset(),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Recalcular tamaño al cambiar tema
  useEffect(() => {
    mapRef.current?.invalidateSize();
  }, [isDark]);

  return (
    <div className="relative overflow-hidden rounded-3xl h-[60vh] min-h-[420px] bg-background border border-border/60 shadow-md">
      {/* Mapa (capa base) */}
      <div className="absolute inset-0 z-[20]">
        <MapContainer
          ref={mapRef as any}                  // << capturamos la instancia del mapa
          whenReady={() => mapRef.current?.invalidateSize()}  // << firma sin argumentos (ok TS)
          center={center}
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
            detectRetina
            keepBuffer={2}
            updateInterval={100}
            opacity={0.94} /* deja respirar el overlay */
          />

          {/* Puntos */}
          {points.map((p, i) => (
            <Marker
              key={(p as any).id ?? `${p.lat}-${p.lng}-${i}`}
              position={[p.lat, p.lng]}
              icon={pinNeon}
            />
          ))}

          {/* Mi ubicación (si disponible) */}
          {myPos && (
            <CircleMarker
              center={myPos}
              radius={6}
              pathOptions={{
                color: "rgba(56,189,248,1)",
                fillColor: "rgba(56,189,248,.5)",
                fillOpacity: 0.6,
              }}
            />
          )}

          {/* Escala + controles */}
          <ScaleControl position="bottomleft" />
          <Controls onLocate={locate} onReset={reset} />
        </MapContainer>
      </div>

      {/* Overlays de estilo (encima visualmente, pero NO capturan eventos) */}
      <div
        aria-hidden
        className="nf-map-overlay pointer-events-none absolute inset-0 z-[60]"
      />
      <div
        aria-hidden
        className="nf-map-vignette pointer-events-none absolute inset-0 z-[70]"
      />

      {/* Marca mínima */}
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
        className="pointer-events-none absolute right-3 bottom-3 z-[1200] opacity-20"
      >
        <Skull className="h-8 w-8" />
      </div>
    </div>
  );
}
