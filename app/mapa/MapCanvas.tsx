// app/mapa/MapCanvas.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import type { Point } from "./points";
import {
  Plus,
  Minus,
  Crosshair,
  RotateCcw,
  Skull,
  Wifi,
  Bed,
  Coffee,
  CreditCard,
  Anchor,
} from "lucide-react";

/**
 * Espera que cada Point tenga (id, lat, lng, category?: 'wifi'|'stay'|'coffee'|'atm'|'harbor')
 * Si no tiene category, cae en 'wifi' por defecto.
 */
type MapCanvasProps = {
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

const HOME_CENTER: L.LatLngExpression = [14.62, -90.56];
const HOME_ZOOM = 5;
const WORLD_BOUNDS = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

const CATEGORIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi, color: "#00E5FF" },     // azul neón
  { key: "hospedaje", label: "Hospedaje", icon: Bed, color: "#FACC15" }, // dorado farol
  { key: "cowork", label: "Cowork", icon: Coffee, color: "#E879F9" }, // magenta
  { key: "banco", label: "Banco/ATM", icon: CreditCard, color: "#34D399" }, // verde tesoro
  { key: "puerto", label: "Puerto", icon: Anchor, color: "#EF4444" }, // rojo faro/peligro
] as const;


type CategoryKey = (typeof CATEGORIES)[number]["key"];

const categoryColor = (cat?: string) => {
  const found = CATEGORIES.find((c) => c.key === cat);
  return found?.color ?? "#38BDF8";
};

export default function MapCanvas({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();
  const mapRef = useRef<L.Map | null>(null);

  // Invalida tamaño cuando cambia el tema
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [isDark]);

  // Tiles
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const tileAttrib =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // DivIcon neón por categoría
  const pinNeonByColor = useMemo(
    () => (hex = "#38BDF8") =>
      L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:16px;height:16px;transform:translate(-50%,-50%);">
            <style>
              @keyframes nfPulse { 0%{transform:scale(.9);opacity:.9} 70%{transform:scale(1.35);opacity:0} 100%{opacity:0} }
            </style>
            <div style="
              position:absolute;inset:0;border-radius:9999px;
              background: radial-gradient(40% 40% at 50% 50%, ${hex}, ${hex}36 60%, ${hex}00 70%);
              box-shadow: 0 0 0 1px ${hex}6B, 0 6px 18px ${hex}52;
            "></div>
            <div style="
              position:absolute;inset:-6px;border-radius:9999px;filter:blur(4px);
              background: radial-gradient(50% 50% at 50% 50%, ${hex}33, ${hex}24 60%, ${hex}00 70%);
              animation: nfPulse 2.4s ease-out infinite;
            "></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    []
  );

  // UI Actions
  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const recenter = () =>
    mapRef.current?.setView(HOME_CENTER, HOME_ZOOM, { animate: true });
  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        mapRef.current?.flyTo(ll, Math.max(12, mapRef.current?.getZoom() ?? 12));
      },
      () => recenter(),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // === FILTROS DE CATEGORÍA ===
  const [activeCats, setActiveCats] = useState<Set<CategoryKey>>(
    () => new Set(CATEGORIES.map((c) => c.key))
  );

  const toggleCat = (key: CategoryKey) =>
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const filteredPoints = useMemo(
    () =>
      points.filter((p) =>
        activeCats.has(((p as any).category as CategoryKey) ?? "wifi")
      ),
    [points, activeCats]
  );

  return (
    <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px] z-0">
      {/* MAPA */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          center={HOME_CENTER}
          zoom={HOME_ZOOM}
          minZoom={2}
          maxZoom={18}
          maxBounds={WORLD_BOUNDS}
          maxBoundsViscosity={0.9}
          worldCopyJump={false}
          zoomControl={false}
          scrollWheelZoom
          attributionControl
          className="h-full w-full"
        >
          <TileLayer url={tileUrl} attribution={tileAttrib} />
          {filteredPoints.map((p, i) => {
            const cat = ((p as any).category as CategoryKey) ?? "wifi";
            const icon = pinNeonByColor(categoryColor(cat));
            return (
              <Marker
                key={p.id ?? `${p.lat}-${p.lng}-${i}`}
                position={[p.lat, p.lng]}
                icon={icon}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* Overlays HUD (no bloquean eventos) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 nf-map-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 nf-map-vignette" />

      {/* Rosa náutica y marca fantasma */}
      <div aria-hidden className="compass-rose rose-tr absolute z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 z-[40] opacity-15"
      >
        <Skull className="h-8 w-8" />
      </div>

      {/* Norte */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-4 z-[40] opacity-60"
        title="Rumbo Norte"
      >
        <div className="rounded-full bg-[color:var(--card,rgba(17,24,39,0.7))] border border-[color:var(--border,#334155)] px-2 py-1 text-xs backdrop-blur">
          N
        </div>
      </div>

      {/* CONTROLES */}
      <div
        className="
          absolute z-[30] flex flex-col gap-2
          left-[calc(env(safe-area-inset-left)+14px)]
          top-[calc(env(safe-area-inset-top)+14px)]
        "
      >
        {[
          { label: "Acercar", Icon: Plus, onClick: zoomIn },
          { label: "Alejar", Icon: Minus, onClick: zoomOut },
          { label: "Mi ubicación", Icon: Crosshair, onClick: locate },
          { label: "Volver al inicio", Icon: RotateCcw, onClick: recenter },
        ].map(({ label, Icon, onClick }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={onClick}
            className="
              h-10 w-10 rounded-full
              bg-[color:var(--card,rgba(17,24,39,0.7))]
              border border-[color:var(--border,#334155)]
              backdrop-blur shadow-md
              hover:scale-[1.03] active:scale-95 transition-transform
              ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
              text-slate-100/90
            "
            title={label}
          >
            <Icon className="h-5 w-5 mx-auto" />
          </button>
        ))}
      </div>

      {/* FILTROS DE CATEGORÍAS */}
      <div
        className="
          absolute z-[30] right-[calc(env(safe-area-inset-right)+14px)]
          top-[calc(env(safe-area-inset-top)+14px)]
          flex items-center gap-2 flex-wrap
          max-w-[72vw]
        "
      >
        {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
          const active = activeCats.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleCat(key)}
              className={`
                group flex items-center gap-1 rounded-full px-3 py-1.5 text-xs
                transition-all backdrop-blur
                border
                ${active
                  ? "bg-white/10 dark:bg-white/10 border-white/30 text-white"
                  : "bg-[color:var(--card,rgba(17,24,39,0.55))] border-[color:var(--border,#334155)] text-slate-200/80"}
                hover:scale-[1.02] active:scale-95
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
              `}
              title={label}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: active ? color : "#64748B" }}
              />
              <Icon className="h-3.5 w-3.5 opacity-90" />
              <span className="opacity-90">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
