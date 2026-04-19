'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/_hooks/useDebounce';
import { useState, useCallback, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilteredRoutesWrapper from './components/FilteredRoutesWrapper';
import { Region, Route } from './lib/types';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ParticlesBackground = dynamic(
  () => import('../mapa/components/ParticlesBackground'),
  { ssr: false }
);

interface RutasMagicasClientProps {
  routes: Route[];
}

export default function RutasMagicasClient({ routes }: RutasMagicasClientProps) {
  const t = useTranslations('Routes');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const region = searchParams.get('region') as Region | null;

  // Sincronizar el estado con los parámetros de la URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Actualizar la URL cuando cambia la búsqueda
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery) {
      params.set('q', debouncedSearchQuery);
    } else {
      params.delete('q');
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [debouncedSearchQuery, pathname, router, searchParams]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 nf-grid opacity-20" />
        <div className="absolute inset-0 nf-vignette" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative pt-28">
        <ParticlesBackground />

        <HeroSection onSearch={handleSearch} defaultQuery={searchQuery} />

        <main className="relative z-10">
          <div id="destinos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 scroll-mt-28">
            <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {t('sectionEyebrow')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('sectionTitle')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('sectionDescription')}
              </p>
            </div>
            <FilteredRoutesWrapper
              routes={routes}
              region={region || undefined}
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
