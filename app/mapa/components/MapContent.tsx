'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { samplePoints } from '../points';

interface MapContentProps {
    searchQuery: string;
    children: (filteredPoints: typeof samplePoints) => React.ReactNode;
}

export function MapContent({ searchQuery, children }: MapContentProps) {
    const searchParams = useSearchParams();
    const townParam = searchParams?.get('town');

    // Filtrar puntos basados en la búsqueda y parámetro de pueblo
    const filteredPoints = useMemo(() => {
        let points = samplePoints.filter(point => {
            return point.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Si hay parámetro de pueblo, filtrar solo esos puntos
        if (townParam) {
            points = points.filter(p => p.townSlug === townParam);
        }

        return points;
    }, [searchQuery, townParam]);

    return <>{children(filteredPoints)}</>;
}
