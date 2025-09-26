"use client";

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import HeroSection from './components/HeroSection';
import { Region } from './lib/types';
import FilteredRoutesWrapper from './components/FilteredRoutesWrapper';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function RutasMagicasPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get initial search query from URL
  const initialSearch = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Update URL when debounced search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearchQuery) {
      params.set('q', debouncedSearchQuery);
    } else {
      params.delete('q');
    }
    
    // Only update URL if the query has actually changed
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [debouncedSearchQuery, pathname, router, searchParams]);
  
  // Handle search from the search bar
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Obtener el parámetro de región de manera segura
  const region = searchParams.get('region') as Region | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="relative overflow-hidden">
        <HeroSection onSearch={handleSearch} />
        <main className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <Suspense fallback={
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-electricBlue to-cyberPurple opacity-20"></div>
                  <p className="text-gray-500 dark:text-gray-400">Cargando rutas...</p>
                </div>
              </div>
            }>
              <FilteredRoutesWrapper region={region || undefined} searchQuery={searchQuery} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
