"use client";

import dynamic from 'next/dynamic';
import type { Point } from '../../mapa/points';

interface TownMapProps {
    townPoints: Point[];
    townCenter: [number, number];
}

const MapClient = dynamic(() => import('../../mapa/MapClient'), {
    ssr: false,
    loading: () => (
        <div className="h-[300px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-500">Cargando mapa...</span>
        </div>
    ),
});

export default function TownMap({ townPoints, townCenter }: TownMapProps) {
    return (
        <MapClient
            points={townPoints}
            initialCenter={townCenter}
            compact={true}
            zoom={14}
            hideControls={false}
            hideFilters={true}
            hideAtmosphere={true}
        />
    );
}
