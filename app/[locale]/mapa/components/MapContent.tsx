'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { samplePoints, Category } from '../points';
import { atitlanTowns } from '../../rutas-magicas/lago-atitlan/data';

interface MapContentProps {
    searchQuery: string;
    children: (filteredPoints: typeof samplePoints) => React.ReactNode;
}

export function MapContent({ searchQuery, children }: MapContentProps) {
    const searchParams = useSearchParams();
    const townParam = searchParams?.get('town');
    const routeParam = searchParams?.get('route');

    // Filtrar puntos basados en la búsqueda y parámetro de pueblo
    const filteredPoints = useMemo(() => {
        // Si hay una ruta seleccionada, mostrar SOLO los puntos de esa ruta
        if (townParam && routeParam) {
            const town = atitlanTowns.find(t => t.slug === townParam);
            const route = town?.microRoutes.find(r => r.id === routeParam);

            if (route) {
                return route.points.map(p => ({
                    id: p.id,
                    name: p.title,
                    category: (p.type === 'viewpoint' ? 'landmark' :
                        p.type === 'activity' ? 'activity' :
                            p.type === 'food' ? 'wifi' : 'landmark') as Category, // Map types to categories
                    lat: p.lat,
                    lng: p.lng,
                    townSlug: townParam
                }));
            }
        }

        let points = samplePoints.filter(point => {
            return point.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Si hay parámetro de pueblo (pero no ruta), filtrar solo esos puntos
        if (townParam) {
            // Normalizar slugs para que coincidan (ej. san-marcos vs san-marcos-la-laguna)
            // Esto es un fix temporal, idealmente los slugs deberían coincidir exactamente
            points = points.filter(p => p.townSlug?.includes(townParam) || townParam.includes(p.townSlug || ''));
        }

        return points;
    }, [searchQuery, townParam, routeParam]);

    return <>{children(filteredPoints)}</>;
}
