'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Point } from '../points';
import type { CategoryKey } from '../constants';
import { atitlanTowns } from '../../rutas-magicas/lago-atitlan/data';
import { supabase } from '@/app/lib/supabase/client';

const includesAny = (value: string, terms: string[]) => terms.some((t) => value.includes(t));

const toCategory = (typeValue: string, amenities: string[]): CategoryKey => {
    const merged = [typeValue, ...amenities].join(' ');

    if (includesAny(merged, ['cowork', 'co-work', 'co work'])) return 'cowork';
    if (includesAny(merged, ['banco', 'atm', 'bank'])) return 'banco';
    if (includesAny(merged, ['puerto', 'muelle', 'dock', 'port'])) return 'puerto';
    if (includesAny(merged, ['actividad', 'activity', 'tour', 'adventure', 'hike', 'kayak'])) return 'activity';
    if (includesAny(merged, ['mirador', 'landmark', 'viewpoint', 'monument'])) return 'landmark';
    if (includesAny(merged, ['wifi', 'wi-fi', 'internet', 'fiber', 'fibre', 'starlink', 'cafe', 'coffee'])) return 'wifi';
    return 'hospedaje';
};

interface MapContentProps {
    searchQuery: string;
    children: (data: {
        points: Point[];
        isLoading: boolean;
        totalCount: number;
        visibleCount: number;
        hasRealData: boolean;
    }) => React.ReactNode;
    onMetaChange?: (meta: {
        totalCount: number;
        visibleCount: number;
        isLoading: boolean;
        hasRealData: boolean;
    }) => void;
}

export function MapContent({ searchQuery, children, onMetaChange }: MapContentProps) {
    const searchParams = useSearchParams();
    const townParam = searchParams?.get('town');
    const microRouteParam = searchParams?.get('microRoute');
    const [realPoints, setRealPoints] = useState<Point[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        const load = async () => {
            let placesQuery = supabase
                .from('places')
                .select('id,name,category,lat,lng,town_slug,is_active')
                .eq('is_active', true);
            if (townParam) {
                placesQuery = placesQuery.eq('town_slug', townParam);
            }

            const { data: placesData, error: placesError } = await placesQuery;
            if (cancelled) return;

            if (!placesError && placesData) {
                const mappedPlaces = placesData
                    .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
                    .map((item) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category as CategoryKey,
                        lat: item.lat as number,
                        lng: item.lng as number,
                        townSlug: item.town_slug || undefined
                    }));
                setRealPoints(mappedPlaces);
                setIsLoading(false);
                return;
            }

            // Fallback to accommodations while places is being rolled out in environments.
            let accommodationsQuery = supabase
                .from('accommodations')
                .select('id,name,lat,lng,pueblo_slug,type,amenities,is_active')
                .eq('is_active', true);
            if (townParam) {
                accommodationsQuery = accommodationsQuery.eq('pueblo_slug', townParam);
            }

            const { data: accommodationsData, error: accommodationsError } = await accommodationsQuery;
            if (cancelled) return;
            if (accommodationsError || !accommodationsData) {
                setRealPoints([]);
                setIsLoading(false);
                return;
            }

            const mapped = accommodationsData
                .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
                .map((item) => {
                    const typeValue = (item.type ?? '').toLowerCase();
                    const amenities = (item.amenities ?? []).map(a => a.toLowerCase());
                    const category = toCategory(typeValue, amenities);
                    return {
                        id: item.id,
                        name: item.name,
                        category,
                        lat: item.lat as number,
                        lng: item.lng as number,
                        townSlug: item.pueblo_slug || undefined
                    };
                });
            setRealPoints(mapped);
            setIsLoading(false);
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [townParam]);

    const basePoints = useMemo(() => {
        if (microRouteParam) {
            const town = townParam ? atitlanTowns.find(t => t.slug === townParam) : null;
            const route = town?.microRoutes.find(r => r.id === microRouteParam);

            if (route && town) {
                return route.points.map(p => ({
                    id: p.id,
                    name: p.title,
                    category: (p.type === 'viewpoint' ? 'landmark' :
                        p.type === 'activity' ? 'activity' :
                            p.type === 'food' ? 'wifi' : 'landmark') as CategoryKey,
                    lat: p.lat,
                    lng: p.lng,
                    townSlug: townParam || undefined
                }));
            }

            const townWithRoute = atitlanTowns.find(t => t.microRoutes.some(r => r.id === microRouteParam));
            const routeFromTown = townWithRoute?.microRoutes.find(r => r.id === microRouteParam);
            if (townWithRoute && routeFromTown) {
                return routeFromTown.points.map(p => ({
                    id: p.id,
                    name: p.title,
                    category: (p.type === 'viewpoint' ? 'landmark' :
                        p.type === 'activity' ? 'activity' :
                            p.type === 'food' ? 'wifi' : 'landmark') as CategoryKey,
                    lat: p.lat,
                    lng: p.lng,
                    townSlug: townWithRoute.slug
                }));
            }
        }

        let points = realPoints;

        if (townParam) {
            points = points.filter(p => p.townSlug?.includes(townParam) || townParam.includes(p.townSlug || ''));
        }

        return points;
    }, [townParam, microRouteParam, realPoints]);

    const filteredPoints = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) return basePoints;
        return basePoints.filter(point => point.name.toLowerCase().includes(normalizedQuery));
    }, [basePoints, searchQuery]);

    const meta = useMemo(() => ({
        totalCount: basePoints.length,
        visibleCount: filteredPoints.length,
        isLoading,
        hasRealData: basePoints.length > 0
    }), [basePoints.length, filteredPoints.length, isLoading]);

    useEffect(() => {
        onMetaChange?.(meta);
    }, [meta, onMetaChange]);

    return <>{children({
        points: filteredPoints,
        isLoading: meta.isLoading,
        totalCount: meta.totalCount,
        visibleCount: meta.visibleCount,
        hasRealData: meta.hasRealData
    })}</>;
}
