// app/mapa/MapClient.tsx
"use client";

import dynamic from "next/dynamic";
import type { Point } from "./points";

type Props = { points?: Point[] };

const LeafletMap = dynamic(() => import("./MapCanvasCluster"), {
  ssr: false,
  loading: () => (
    <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px] grid place-items-center border border-border/60 bg-card/30">
      <span className="text-sm text-muted-foreground">Cargando mapa…</span>
    </div>
  ),
});

export default function MapClient({ points = [] }: Props) {
  return <LeafletMap points={points} />;
}
