'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Point } from '../points';
import type { CategoryKey } from '../constants';
import { atitlanTowns } from '../../rutas-magicas/lago-atitlan/data';
import { supabase } from '@/app/lib/supabase/client';

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
    const routeParam = searchParams?.get('route');
    const [realPoints, setRealPoints] = useState<Point[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        const resolvedTownParam = townParam || (routeParam && atitlanTowns.some(t => t.slug === routeParam) ? routeParam : null);
        const load = async () => {
            let query = supabase
                .from('accommodations')
                .select('id,name,lat,lng,pueblo_slug,type,amenities,is_active')
                .eq('is_active', true);
            if (resolvedTownParam) {
                query = query.eq('pueblo_slug', resolvedTownParam);
            }
            const { data, error } = await query;
            if (cancelled) return;
            if (error || !data) {
                setRealPoints([]);
                setIsLoading(false);
                return;
            }
            const mapped = data
                .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
                .map((item) => {
                    const typeValue = (item.type ?? '').toLowerCase();
                    const amenities = (item.amenities ?? []).map(a => a.toLowerCase());
                    const isCowork = typeValue.includes('cowork') || amenities.some(a => a.includes('cowork'));
                    const category: CategoryKey = isCowork ? 'cowork' : 'hospedaje';
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
    }, [townParam, routeParam]);

    const basePoints = useMemo(() => {
        if (routeParam) {
            const town = townParam ? atitlanTowns.find(t => t.slug === townParam) : null;
            const route = town?.microRoutes.find(r => r.id === routeParam);

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

            if (!townParam) {
                const townWithRoute = atitlanTowns.find(t => t.microRoutes.some(r => r.id === routeParam));
                const routeFromTown = townWithRoute?.microRoutes.find(r => r.id === routeParam);
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
        }

        let points = realPoints;

        const resolvedTownParam = townParam || (routeParam && atitlanTowns.some(t => t.slug === routeParam) ? routeParam : null);
        if (resolvedTownParam) {
            points = points.filter(p => p.townSlug?.includes(resolvedTownParam) || resolvedTownParam.includes(p.townSlug || ''));
        }

        return points;
    }, [townParam, routeParam, realPoints]);

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
