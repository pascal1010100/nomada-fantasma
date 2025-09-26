'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/_hooks/useDebounce';
import { useState, useCallback, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilteredRoutesWrapper from './components/FilteredRoutesWrapper';
import { Region } from './lib/types';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="relative overflow-hidden">
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
