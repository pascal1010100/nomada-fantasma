// app/mapa/MapCanvas.tsx
"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import type { Point } from "./points";

type MapCanvasProps = {
  /** Puntos a pintar (puede venir vacío) */
  points?: Point[];
};

export default function MapCanvas({ points = [] }: MapCanvasProps) {
  const center: [number, number] = [14.62, -90.56];

  // Pin neón minimal (DivIcon) — coherente con la marca
  const pinNeon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
        <span style="
          display:inline-block;width:14px;height:14px;border-radius:9999px;
          background: rgba(56,189,248,.95);
          box-shadow:
            0 0 0 2px rgba(56,189,248,.45),
            0 0 10px rgba(56,189,248,.35),
            0 0 22px rgba(168,85,247,.25);
        "></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
    []
  );

  return (
    <div className="relative rounded-3xl overflow-hidden fade-border map-surface h-[60vh] min-h-[420px]">
      {/* MAPA */}
      <MapContainer
        center={center}
        zoom={4}
        minZoom={2}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // mantenemos tus controles custom
      >
        {/* Tiles base (OSM). El look NF lo aporta el overlay/vignette del wrapper */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Puntos */}
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinNeon} />
        ))}
      </MapContainer>

      {/* HUD estético (coherente con Hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[30] nf-map-overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[40] nf-map-vignette" />

      {/* Rosa náutica sutil */}
      <div aria-hidden className="compass-rose rose-tr z-[45]" />
    </div>
  );
}
