"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

export default function MapCanvas(): JSX.Element {
  const center: [number, number] = [14.62, -90.56];

  return (
    <div className="relative rounded-3xl overflow-hidden map-surface h-[60vh] min-h-[420px]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Usamos CircleMarker para evitar assets de íconos por ahora */}
        <CircleMarker
          center={center}
          radius={8}
          pathOptions={{ color: "hsl(189 100% 58%)", fillOpacity: 0.35 }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            Centro aproximado
          </Tooltip>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}
