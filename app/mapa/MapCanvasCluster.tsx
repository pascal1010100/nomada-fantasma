// app/mapa/MapCanvasCluster.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import useSupercluster from "use-supercluster";
import { useRouter, useSearchParams } from "next/navigation";
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
const ALL_CATS: CategoryKey[] = CATEGORIES.map((c) => c.key);

const categoryColor = (cat?: string) =>
  CATEGORIES.find((c) => c.key === cat)?.color ?? "#38BDF8";

/** Pin neón por color (fábrica) */
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

  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], map.getZoom());
  }, [map, onChange]);

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

/** Helpers URL <-> Set (sin tipos raros) */
type SearchParamsLike = { get(name: string): string | null };

const parseCatsFromParams = (sp: SearchParamsLike) => {
  const v = sp.get("cats");
  if (v == null) return new Set<CategoryKey>(ALL_CATS); // sin param => todas activas
  if (v.trim() === "") return new Set<CategoryKey>();   // cats= => ninguna
  const raw = v.split(",").map((s) => s.trim());
  const valid = raw.filter((k): k is CategoryKey => (ALL_CATS as string[]).includes(k));
  return new Set<CategoryKey>(valid);
};

const setToSortedArray = (s: Set<CategoryKey>) => ALL_CATS.filter((k) => s.has(k));

export default function MapCanvasCluster({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();
  const mapRef = useRef<L.Map | null>(null);
  const pinNeonByColor = usePinNeonByColor();

  // Router/params para persistir filtros
  const router = useRouter();
  const searchParams = useSearchParams();

  // Cache de iconos por color (perf)
  const iconCacheRef = useRef<Map<string, L.DivIcon>>(new Map());
  const getIconByColor = useCallback(
    (hex: string) => {
      const cache = iconCacheRef.current;
      let ic = cache.get(hex);
      if (!ic) {
        ic = pinNeonByColor(hex);
        cache.set(hex, ic);
      }
      return ic;
    },
    [pinNeonByColor]
  );

  // Invalida tamaño al cambiar tema
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

  // Filtros por categoría — inicial desde URL
  const [activeCats, setActiveCats] = useState<Set<CategoryKey>>(() => {
    if (typeof window === "undefined") return new Set(ALL_CATS);
    return parseCatsFromParams(new URLSearchParams(window.location.search));
  });

  // Cuando cambien los params de la URL (navegación externa), sincroniza estado
  useEffect(() => {
    const next = parseCatsFromParams(searchParams);
    const same =
      next.size === activeCats.size &&
      setToSortedArray(next).every((k, i) => k === setToSortedArray(activeCats)[i]);
    if (!same) setActiveCats(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 🛠️ Toggle SIN efectos colaterales (solo cambia estado)
  const toggleCat = (key: CategoryKey) =>
    setActiveCats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  // ✍️ Efecto: escribe los filtros en la URL cuando `activeCats` cambie
  useEffect(() => {
    const current = parseCatsFromParams(searchParams);
    const same =
      current.size === activeCats.size &&
      setToSortedArray(current).every((k, i) => k === setToSortedArray(activeCats)[i]);
    if (same) return; // ya coincide la URL, no tocar

    const params = new URLSearchParams(searchParams.toString());
    const arr = setToSortedArray(activeCats);
    if (arr.length === ALL_CATS.length) params.delete("cats");
    else params.set("cats", arr.join(","));

    const pathname = typeof window !== "undefined" ? window.location.pathname : "/mapa";
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [activeCats, router, searchParams]);

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

  // Estado de bounds/zoom
  const [bounds, setBounds] = useState<[number, number, number, number]>(WORLD_BOUNDS_ARR);
  const [zoom, setZoom] = useState(HOME_ZOOM);

  const handleViewChange = useCallback((b: [number, number, number, number], z: number) => {
    setBounds((prev) => {
      if (prev[0] === b[0] && prev[1] === b[1] && prev[2] === b[2] && prev[3] === b[3]) return prev;
      return b;
    });
    setZoom((prev) => (prev === z ? prev : z));
  }, []);

  // Clustering
  const { clusters, supercluster } = useSupercluster({
    points: geoPoints as any,
    bounds,
    zoom,
    options: { radius: 60, maxZoom: 18 },
  });

  // (Opcional) encuadrar cuando cambien filtros
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map || !filteredPoints.length) return;
  //   const b = L.latLngBounds(filteredPoints.map((p) => L.latLng(p.lat, p.lng)));
  //   map.fitBounds(b, { padding: [40, 40], maxZoom: 13, animate: true });
  // }, [filteredPoints]);

  return (
    <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px] nf-map-skin">
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
          preferCanvas
        >
          <TileLayer url={tileUrl} attribution={tileAttrib} />

          {/* sincroniza bounds/zoom del mapa con el estado */}
          <SyncViewToState onChange={handleViewChange} />

          {/* Clusters + puntos */}
          {clusters.map((c: any, i: number) => {
            const [lng, lat] = c.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = c.properties;

            if (isCluster) {
              const clusterId = (c.id ?? c.properties?.cluster_id) as number | undefined;
              return (
                <Marker
                  key={`cluster-${clusterId ?? i}`}
                  position={[lat, lng]}
                  icon={clusterIcon(pointCount)}
                  eventHandlers={{
                    click: () => {
                      const target =
                        clusterId != null && supercluster
                          ? supercluster.getClusterExpansionZoom(clusterId)
                          : undefined;
                      const expansionZoom = Math.min(target ?? zoom + 2, 18);
                      mapRef.current?.flyTo([lat, lng], expansionZoom, { animate: true });
                    },
                  }}
                />
              );
            }

            const name = c.properties?.name as string | undefined;
            const cat = (c.properties?.category as CategoryKey) ?? "wifi";
            const icon = getIconByColor(categoryColor(cat));
            return (
              <Marker
                key={c.properties?.id ?? `pt-${lat}-${lng}-${i}`}
                position={[lat, lng]}
                icon={icon}
                title={name ?? `Punto ${cat}`}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                  {name ?? "Punto sin nombre"}
                </Tooltip>
                <Popup>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{name ?? "Punto sin nombre"}</div>
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

      {/* Cuadrícula náutica (encima de tiles, debajo de overlays) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[900] nf-map-grid" />

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
          { label: "Acercar", Icon: Plus, onClick: () => mapRef.current?.zoomIn() },
          { label: "Alejar", Icon: Minus, onClick: () => mapRef.current?.zoomOut() },
          {
            label: "Mi ubicación",
            Icon: Crosshair,
            onClick: () => {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const ll: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
                  mapRef.current?.flyTo(ll, Math.max(12, mapRef.current?.getZoom() ?? 12));
                },
                () => mapRef.current?.setView(HOME_CENTER, HOME_ZOOM, { animate: true }),
                { enableHighAccuracy: true, timeout: 5000 }
              );
            },
          },
          {
            label: "Volver al inicio",
            Icon: RotateCcw,
            onClick: () => mapRef.current?.setView(HOME_CENTER, HOME_ZOOM, { animate: true }),
          },
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
                ${
                  active
                    ? "bg-white/10 dark:bg-white/10 border-white/30 text-white"
                    : "bg-[color:var(--card,rgba(17,24,39,0.55))] border-[color:var(--border,#334155)] text-slate-200/80"
                }
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
