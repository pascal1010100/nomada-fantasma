import { Suspense } from 'react';
import HeroSection from './components/HeroSection';
import { Region } from './lib/types';
import FilteredRoutesWrapper from './components/FilteredRoutesWrapper';

export default function RutasMagicasPage({
  searchParams,
}: {
  searchParams: { region?: Region };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="relative overflow-hidden">
        <HeroSection />
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
              <FilteredRoutesWrapper region={searchParams?.region} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
