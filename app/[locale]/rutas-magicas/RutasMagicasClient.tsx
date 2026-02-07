'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/_hooks/useDebounce';
import { useState, useCallback, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilteredRoutesWrapper from './components/FilteredRoutesWrapper';
import { Region } from './lib/types';
import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(
  () => import('../mapa/components/ParticlesBackground'),
  { ssr: false }
);

export default function RutasMagicasClient() {
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
    <div className="relative min-h-screen overflow-hidden">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <FilteredRoutesWrapper
              region={region || undefined}
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
