// app/mapa/MapClient.tsx
"use client";

import dynamic from "next/dynamic";
import type { Point } from "./points";

type Props = {
  points?: Point[];
  initialCenter?: [number, number];
  compact?: boolean;
  zoom?: number;
  hideControls?: boolean;
  hideFilters?: boolean;
  hideAtmosphere?: boolean;
};

import { useTranslations } from 'next-intl';

const LeafletMap = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => {
    const t = useTranslations('Map');
    return (
      <div className="relative rounded-3xl overflow-hidden h-[62vh] min-h-[420px] grid place-items-center border border-border/60 bg-card/30">
        <span className="text-sm text-muted-foreground">{t('locating')}</span>
      </div>
    );
  },
});

export default function MapClient(props: Props) {
  return <LeafletMap {...props} />;
}
