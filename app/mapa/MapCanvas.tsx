// app/mapa/MapCanvas.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Skull } from "lucide-react";
import type { Point } from "./points";
import { MapControls } from "./components/MapControls";
import { CategoryFilter } from "./components/CategoryFilter";
import { useMapControls } from "./hooks/useMapControls";
import { 
  CATEGORIES, 
  HOME_CENTER, 
  HOME_ZOOM, 
  TILE_URLS, 
  TILE_ATTRIBUTION,
  PIN_STYLES,
  WORLD_BOUNDS,
  type CategoryKey
} from "./constants";

interface MapCanvasProps {
  points?: Point[];
}

function useThemeDark(): boolean {
  const [isDark, setIsDark] = React.useState(false);
  
  React.useEffect(() => {
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

const categoryColor = (cat?: string) => {
  const found = CATEGORIES.find((c) => c.key === cat);
  return found?.color ?? "#38BDF8";
};

const PinNeonIcon = ({ color = "#38BDF8" }: { color?: string }) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="${PIN_STYLES.container}">
        <style>${PIN_STYLES.pulseAnimation}</style>
        <div style="
          position:absolute;inset:0;border-radius:9999px;
          background: radial-gradient(40% 40% at 50% 50%, ${color}, ${color}36 60%, ${color}00 70%);
          box-shadow: 0 0 0 1px ${color}6B, 0 6px 18px ${color}52;
        "></div>
        <div style="
          position:absolute;inset:-6px;border-radius:9999px;filter:blur(4px);
          background: radial-gradient(50% 50% at 50% 50%, ${color}33, ${color}24 60%, ${color}00 70%);
          animation: nfPulse 2.4s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export default function MapCanvas({ points = [] }: MapCanvasProps) {
  const isDark = useThemeDark();
  const mapRef = useRef<L.Map | null>(null);
  const { activeCats, toggleCat } = useMapControls();

  // Invalidate size when theme changes
  React.useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [isDark]);

  // Map controls
  const zoomIn = React.useCallback(() => mapRef.current?.zoomIn(), []);
  const zoomOut = React.useCallback(() => mapRef.current?.zoomOut(), []);
  
  const recenter = React.useCallback(() => {
    mapRef.current?.setView(HOME_CENTER, HOME_ZOOM, { animate: true });
  }, []);
  
  const locate = React.useCallback(() => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        mapRef.current?.flyTo(ll, Math.max(12, mapRef.current?.getZoom() ?? 12));
      },
      () => recenter(),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [recenter]);

  // Filter points based on active categories
  const filteredPoints = React.useMemo(() => {
    if (activeCats.size === 0) return [];
    
    return points.filter((p) => {
      const category = (p as any).category as CategoryKey | undefined;
      return activeCats.has(category || 'wifi');
    });
  }, [points, activeCats]);

  return (
    <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px] z-0">
      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          ref={mapRef}
          center={HOME_CENTER}
          zoom={HOME_ZOOM}
          minZoom={2}
          maxZoom={18}
          maxBounds={L.latLngBounds(
            L.latLng(WORLD_BOUNDS.southWest[0], WORLD_BOUNDS.southWest[1]),
            L.latLng(WORLD_BOUNDS.northEast[0], WORLD_BOUNDS.northEast[1])
          )}
          maxBoundsViscosity={0.9}
          worldCopyJump={false}
          zoomControl={false}
          scrollWheelZoom
          attributionControl
          className="h-full w-full"
        >
          <TileLayer 
            url={isDark ? TILE_URLS.dark : TILE_URLS.light} 
            attribution={TILE_ATTRIBUTION} 
          />
          
          {filteredPoints.map((p, i) => {
            const category = ((p as any).category as CategoryKey) || 'wifi';
            return (
              <Marker
                key={p.id ?? `${p.lat}-${p.lng}-${i}`}
                position={[p.lat, p.lng]}
                icon={PinNeonIcon({ color: categoryColor(category) })}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* Overlay HUD (non-interactive) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 nf-map-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 nf-map-vignette" />

      {/* Compass rose and ghost mark */}
      <div aria-hidden className="compass-rose rose-tr absolute z-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 z-[40] opacity-15"
      >
        <Skull className="h-8 w-8" />
      </div>

      {/* North indicator */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-4 z-[40] opacity-60"
        title="Rumbo Norte"
      >
        <div className="rounded-full bg-[color:var(--card,rgba(17,24,39,0.7))] border border-[color:var(--border,#334155)] px-2 py-1 text-xs backdrop-blur">
          N
        </div>
      </div>

      {/* Map Controls */}
      <MapControls 
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onLocate={locate}
        onRecenter={recenter}
      />

      {/* Category Filters */}
      <CategoryFilter 
        activeCats={activeCats}
        onToggleCategory={toggleCat}
      />
    </div>
  );
}
