"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  ScaleControl,
  useMap,
  Marker,
} from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { Plus, Minus, LocateFixed, RefreshCcw } from "lucide-react";

/* Elimina el control nativo si Leaflet lo montó */
function KillDefaultZoom(): null {
  const map = useMap();
  useEffect(() => {
   
    if (map?.zoomControl?.remove) map.zoomControl.remove();
  }, [map]);
  return null;
}

/* Controles custom: zoom + locate + reset */
function ZoomControls({
  setUserPos,
  defaultCenter,
  defaultZoom,
}: {
  setUserPos: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  defaultCenter: [number, number];
  defaultZoom: number;
}): JSX.Element {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: [number, number] = [coords.latitude, coords.longitude];
        setUserPos(pos);
        map.flyTo(pos, Math.max(map.getZoom(), 12), { duration: 0.8 });
      },
      () => {
        // si falla la geo, no hacemos nada (UX silenciosa por ahora)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const reset = () => map.flyTo(defaultCenter, defaultZoom, { duration: 0.8 });

  return (
    <div
      className="
        absolute
        left-[calc(env(safe-area-inset-left)+12px)]
        top-[calc(env(safe-area-inset-top)+12px)]
        z-[1100] flex flex-col gap-2
      "
    >
      <button
        type="button"
        aria-label="Acercar mapa"
        onClick={() => map.zoomIn()}
        className="btn-ghost h-10 w-10 p-0 rounded-2xl grid place-items-center focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <Plus className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Alejar mapa"
        onClick={() => map.zoomOut()}
        className="btn-ghost h-10 w-10 p-0 rounded-2xl grid place-items-center focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <Minus className="h-5 w-5" />
      </button>

      {/* separador óptico */}
      <div className="mx-auto h-0.5 w-6 rounded-full bg-border/50" />

      <button
        type="button"
        aria-label="Ubicarme"
        onClick={locate}
        className="btn-ghost h-10 w-10 p-0 rounded-2xl grid place-items-center focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <LocateFixed className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Resetear vista"
        onClick={reset}
        className="btn-ghost h-10 w-10 p-0 rounded-2xl grid place-items-center focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <RefreshCcw className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function MapCanvas(): JSX.Element {
  const defaultCenter: [number, number] = [14.62, -90.56];
  const defaultZoom = 5;

  const [isDark, setIsDark] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // tema
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // tiles minimal (CARTO sin labels)
  const lightUrl =
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
  const darkUrl =
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
  const attribution =
    '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // ícono con pulso para "mi ubicación"
  const pulseIcon = useMemo(
    () =>
      L.divIcon({
        className: "nf-pulse-icon",
        html: `<span class="nf-pulse"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    []
  );

  return (
    <div className="relative rounded-3xl overflow-hidden map-surface h-[60vh] min-h-[420px]">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer url={isDark ? darkUrl : lightUrl} attribution={attribution} />
        <ScaleControl position="bottomleft" />

        <KillDefaultZoom />
        <ZoomControls
          setUserPos={setUserPos}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />

        {/* Marcador base (referencia del centro) */}
        <CircleMarker
          center={defaultCenter}
          radius={8}
          pathOptions={{ color: "hsl(189 100% 58%)", fillOpacity: 0.35 }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            Centro aproximado
          </Tooltip>
        </CircleMarker>

        {/* Mi ubicación (si el usuario lo permite) */}
        {userPos && (
          <Marker position={userPos} icon={pulseIcon}>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              Tu ubicación aproximada
            </Tooltip>
          </Marker>
        )}
      </MapContainer>

      {/* Overlays Nómada: grid mayor + batimetría + halo + rosa + viñeta */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex: 401 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--carto-grid-h,216 30% 20%) / ${isDark ? "0.12" : "0.16"}) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--carto-grid-h,216 30% 20%) / ${isDark ? "0.12" : "0.16"}) 1px, transparent 1px),
              linear-gradient(to right, hsl(var(--carto-grid-h,216 30% 20%) / ${isDark ? "0.22" : "0.28"}) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--carto-grid-h,216 30% 20%) / ${isDark ? "0.22" : "0.28"}) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
            mixBlendMode: isDark ? ("screen" as const) : ("multiply" as const),
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(135deg,
                ${isDark ? "rgba(125,211,252,.05)" : "rgba(56,189,248,.06)"} 0 28px,
                transparent 28px 56px
              ),
              repeating-linear-gradient(315deg,
                ${isDark ? "rgba(216,180,254,.04)" : "rgba(168,85,247,.05)"} 0 36px,
                transparent 36px 72px
              )
            `,
            mixBlendMode: isDark ? ("screen" as const) : ("multiply" as const),
            opacity: isDark ? 0.18 : 0.14,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(700px 360px at 50% 48%,
              ${isDark ? "hsl(189 100% 58% / .10)" : "hsl(193 88% 44% / .10)"} 0%,
              transparent 60%)`,
            mixBlendMode: isDark ? ("screen" as const) : ("multiply" as const),
          }}
        />
        <svg className="absolute right-6 top-6 w-24 h-24 opacity-35 dark:opacity-28" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="26" fill="none" stroke="hsl(var(--accent) / .22)" strokeWidth="1" />
          {[...Array(16)].map((_, i) => {
            const a = (i * 22.5 * Math.PI) / 180;
            const x1 = 50 + Math.cos(a) * 16;
            const y1 = 50 + Math.sin(a) * 16;
            const x2 = 50 + Math.cos(a) * 26;
            const y2 = 50 + Math.sin(a) * 26;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="hsl(var(--accent) / .20)" strokeWidth={i % 4 === 0 ? 1.2 : 0.8} />
            );
          })}
          <text x="50" y="12" textAnchor="middle" fontSize="8" fill="hsl(var(--accent) / .42)">N</text>
        </svg>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0) 65%, rgba(0,0,0,.08) 100%)" }}
        />
      </div>
    </div>
  );
}
