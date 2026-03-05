// app/[locale]/mapa/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, X, Wifi, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { RippleButton, Tooltip, LoadingSpinner } from '../../components/ui';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ParticlesBackground = dynamic(
  () => import('./components/ParticlesBackground'),
  { ssr: false }
);
import { CATEGORIES, type CategoryKey } from './constants';
import { MapContent } from './components/MapContent';
import { atitlanTowns } from '../rutas-magicas/lago-atitlan/data';

// Carga dinámica del cliente del mapa para mejor rendimiento
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center rounded-2xl glass-enhanced">
        <LoadingSpinner variant="glow" size="lg" text="Cargando..." />
      </div>
    );
  },
});

// Componente para la búsqueda mejorado
interface MapSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MapSearch({
  searchQuery,
  onSearchChange
}: MapSearchProps) {
  const t = useTranslations('Map');
  const searchInputId = 'map-search-input';
  return (
    <div className="mb-8 max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
      <motion.div
        className="relative input-liquid rounded-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 z-10">
          <Search className="h-5 w-5 text-primary" />
        </div>
        <label htmlFor={searchInputId} className="visually-hidden">
          {t('search')}
        </label>
        <input
          id={searchInputId}
          type="text"
          placeholder={t('search')}
          aria-label={t('search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-border/50 glass-enhanced py-4 pl-14 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60 transition-all"
        />
        {searchQuery && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={t('clearSearch')}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

export default function MapaPage() {
  const t = useTranslations('Map');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMeta, setMapMeta] = useState<{
    totalCount: number;
    visibleCount: number;
    isLoading: boolean;
    hasRealData: boolean;
  } | null>(null);
  const getCategoryLabel = (key: CategoryKey, fallback: string) => {
    try {
      return t(`categories.${key}`);
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const legacyRoute = searchParams?.get('route');
    if (!legacyRoute) return;

    const isTown = atitlanTowns.some((town) => town.slug === legacyRoute);
    const townWithMicroRoute = atitlanTowns.find((town) =>
      town.microRoutes.some((route) => route.id === legacyRoute)
    );

    const params = new URLSearchParams(searchParams.toString());
    params.delete('route');
    if (isTown) params.set('town', legacyRoute);
    else if (townWithMicroRoute) params.set('microRoute', legacyRoute);

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 nf-grid opacity-20" />
        <div className="absolute inset-0 nf-vignette" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative">
        {/* Efecto de partículas sutiles */}
        <ParticlesBackground />

        <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary font-semibold">{t('badge')}</span>
            </motion.div>

            {/* Título principal con efectos */}
            <motion.div className="mb-8">
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="block text-foreground">{t('titleTop')}</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {t('titleGradient')}
                </span>
              </motion.h1>

              <motion.p
                className="max-w-2xl text-lg text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {t('description')}
              </motion.p>

              {/* Stats rápidos */}
              <motion.div
                className="mt-6 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {[
                  { value: mapMeta?.isLoading ? '—' : (mapMeta?.totalCount ?? 0), label: t('stats.places'), icon: MapPin },
                  { value: '24/7', label: t('stats.wifi'), icon: Wifi },
                  { value: '100%', label: t('stats.verified'), icon: Sparkles }
                ].map((stat, index) => (
                  <Tooltip key={index} content={`${stat.label}`} position="bottom">
                    <motion.div
                      className="glass-enhanced rounded-xl px-4 py-2 flex items-center gap-2 cursor-help hover:scale-105 transition-transform"
                      whileHover={{ y: -2 }}
                    >
                      <stat.icon className="w-4 h-4 text-primary" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                    </motion.div>
                  </Tooltip>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Búsqueda */}
        <MapSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Mapa Container */}
        <motion.div
          className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-border/60 glass-enhanced shadow-2xl">
            {/* Scan line effect */}
            <div className="scan-line absolute inset-0 pointer-events-none opacity-20 z-10" />

            <Suspense fallback={
              <div className="flex h-[60vh] w-full items-center justify-center">
                <LoadingSpinner variant="glow" size="lg" text={t('locating')} />
              </div>
            }>
              <MapContent searchQuery={searchQuery} onMetaChange={setMapMeta}>
                {({ points, isLoading, totalCount, visibleCount }) => (
                  <>
                    <MapClient
                      points={points}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 z-[500] flex items-center justify-center bg-background/40 backdrop-blur-sm">
                        <LoadingSpinner variant="glow" size="lg" text={t('loadingPoints')} />
                      </div>
                    )}
                    {!isLoading && visibleCount === 0 && (
                      <div className="absolute inset-0 z-[400] flex items-center justify-center">
                        <div className="glass-enhanced rounded-2xl px-6 py-4 border border-border/60 text-center max-w-md">
                          <div className="text-sm font-semibold">
                            {totalCount === 0 ? t('empty.title') : t('empty.noResultsTitle')}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {totalCount === 0 ? t('empty.description') : t('empty.noResultsDescription')}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </MapContent>
            </Suspense>

          </div>

          {/* Leyenda mejorada */}
          <motion.div
            className="mt-8 rounded-2xl glass-enhanced p-6 border border-border/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t('legend.title')}
              </h3>
              <span className="text-xs text-muted-foreground">
                {t('legend.categories', { count: CATEGORIES.length })}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CATEGORIES.map((category, index) => {
                const Icon = category.icon || MapPin;
                const label = getCategoryLabel(category.key, category.label);
                return (
                  <motion.div
                    key={category.key}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0 shadow-lg"
                      style={{
                        backgroundColor: category.color,
                        boxShadow: `0 0 10px ${category.color}40`
                      }}
                    />
                    <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-foreground font-medium truncate">
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-8 mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="glass-enhanced rounded-2xl p-8 border border-border/60">
              <h3 className="text-2xl font-bold mb-2">{t('cta.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('cta.description')}
              </p>
              <RippleButton
                variant="primary"
                onClick={() => window.location.href = `/${locale}/contacto`}
              >
                <Sparkles className="w-4 h-4" />
                {t('cta.button')}
              </RippleButton>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient animation CSS */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
