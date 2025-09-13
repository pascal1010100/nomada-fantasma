// app/mapa/MapCanvasCluster.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import useSupercluster from "use-supercluster";
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

type MapCanvasProps = { points?: Point[] };

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
const WORLD_BOUNDS_ARR: [number, number, number, number] = [-180, -85, 180, 85];

/** Paleta/categorías */
const CATEGORIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi, color: "#00E5FF" },
  { key: "hospedaje", label: "Hospedaje", icon: Bed, color: "#FACC15" },
  { key: "cowork", label: "Cowork", icon: Coffee, color: "#E879F9" },
  { key: "banco", label: "Banco/ATM", icon: CreditCard, color: "#34D399" },
  { key: "puerto", label: "Puerto", icon: Anchor, color: "#EF4444" },
] as const;
type CategoryKey = (typeof CATEGORIES)[number]["key"];

const categoryColor = (cat?: string) =>
  CATEGORIES.find((c) => c.key === cat)?.color ?? "#38BDF8";

/** Pin neón por color */
const usePinNeonByColor = () =>
  useMemo(
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

/** Icono de cluster (burbuja con contador y glow) */
const clusterIcon = (count: number) =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;transform:translate(-50%,-50%);">
        <style>
          @keyframes pulse { 0%{transform:scale(.95);opacity:.9} 70%{transform:scale(1.25);opacity:0} 100%{opacity:0} }
        </style>
        <div style="
          width:36px;height:36px;border-radius:9999px;
          background: radial-gradient(50% 50% at 50% 50%, #0ff, #0ff2 60%, #0ff0 70%);
          box-shadow: 0 0 0 1px #0ff7, 0 8px 24px #0ff5, inset 0 0 18px #0ff6;
          display:flex;align-items:center;justify-content:center;
          color:#001018;font-weight:700;font-size:13px;
        ">${count}</div>
        <div style="
          position:absolute;inset:-8px;border-radius:9999px;filter:blur(6px);
          background: radial-gradient(50% 50%, #0ff3, #a855f74d 60%, transparent 70%);
          animation:pulse 2.2s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

/** Mantiene zoom/bounds sincronizados con el estado */
function SyncViewToState({
  onChange,
}: {
  onChange: (b: [number, number, number, number], z: number) => void;
}) {
  const map = useMap();

  // set inicial al montar
  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
  }, [map, onChange]);

  // actualizar en cada movimiento / fin de zoom
  useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
    },
    zoomend: () => {
      const b = map.getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
    },
  });

  return null;
}

export default function MapCanvasCluster({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();
  const mapRef = useRef<L.Map | null>(null);
  const pinNeonByColor = usePinNeonByColor();

  // Recalcular tamaño al cambiar tema
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

  // Acciones UI
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

  // Filtros por categoría
  const [activeCats, setActiveCats] = useState<Set<CategoryKey>>(
    () => new Set(CATEGORIES.map((c) => c.key))
  );
  const toggleCat = (key: CategoryKey) =>
    setActiveCats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const filteredPoints = useMemo(
    () => points.filter((p) => activeCats.has(p.category as CategoryKey)),
    [points, activeCats]
  );

  // GeoJSON para clustering
  const geoPoints = useMemo(
    () =>
      filteredPoints.map((p) => ({
        type: "Feature" as const,
        properties: { id: p.id, category: p.category, name: p.name },
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      })),
    [filteredPoints]
  );

  // Estado de bounds/zoom (inicia amplio para primer render)
  const [bounds, setBounds] = useState<[number, number, number, number]>(WORLD_BOUNDS_ARR);
  const [zoom, setZoom] = useState(HOME_ZOOM);

  // 🔧 Handler MEMOIZADO para evitar bucles de render
  const handleViewChange = useCallback(
    (b: [number, number, number, number], z: number) => {
      // Evitar sets redundantes
      setBounds((prev) => {
        if (
          prev[0] === b[0] &&
          prev[1] === b[1] &&
          prev[2] === b[2] &&
          prev[3] === b[3]
        ) {
          return prev;
        }
        return b;
      });
      setZoom((prev) => (prev === z ? prev : z));
    },
    []
  );

  // Clustering
  const { clusters, supercluster } = useSupercluster({
    points: geoPoints as any,
    bounds,
    zoom,
    options: { radius: 60, maxZoom: 18 },
  });

  return (
    <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px]">
      {/* MAPA */}
      <div className="absolute inset-0 z-[20]">
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

          {/* 🔁 Sincroniza bounds/zoom del mapa con el estado (handler memoizado) */}
          <SyncViewToState onChange={handleViewChange} />

          {/* Clusters + puntos */}
          {clusters.map((c: any, i: number) => {
            const [lng, lat] = c.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = c.properties;

            if (isCluster) {
              const clusterId = c.id ?? c.properties?.cluster_id;
              return (
                <Marker
                  key={`cluster-${clusterId ?? i}`}
                  position={[lat, lng]}
                  icon={clusterIcon(pointCount)}
                  eventHandlers={{
                    click: () => {
                      const expansionZoom = Math.min(
                        supercluster?.getClusterExpansionZoom(clusterId) ?? (zoom + 2),
                        18
                      );
                      mapRef.current?.flyTo([lat, lng], expansionZoom, { animate: true });
                    },
                  }}
                />
              );
            }

            const name = c.properties?.name as string | undefined;
            const cat = (c.properties?.category as CategoryKey) ?? "wifi";
            const icon = pinNeonByColor(categoryColor(cat));
            return (
              <Marker
                key={c.properties?.id ?? `pt-${lat}-${lng}-${i}`}
                position={[lat, lng]}
                icon={icon}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                  {name ?? "Punto sin nombre"}
                </Tooltip>
                <Popup>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {name ?? "Punto sin nombre"}
                    </div>
                    <div className="text-xs opacity-80">
                      Categoría: <span className="font-medium">{cat}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Overlays/branding */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1000] nf-map-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1100] nf-map-vignette" />

      <div aria-hidden className="compass-rose rose-tr absolute z-[1200]" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 z-[1200] opacity-15"
      >
        <Skull className="h-8 w-8" />
      </div>

      {/* Norte */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-4 z-[1200] opacity-60"
        title="Rumbo Norte"
      >
        <div className="rounded-full bg-[color:var(--card,rgba(17,24,39,0.7))] border border-[color:var(--border,#334155)] px-2 py-1 text-xs backdrop-blur">
          N
        </div>
      </div>

      {/* Controles */}
      <div
        className="
          absolute z-[1100] flex flex-col gap-2
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

      {/* Filtros de categorías */}
      <div
        className="
          absolute z-[1150] right-[calc(env(safe-area-inset-right)+14px)]
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
