// app/mapa/page.tsx
'use client';

import { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2, AlertCircle, Compass, Wifi, Home, Anchor, Coffee, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(
  () => import('./components/ParticlesBackground'),
  { ssr: false }
);
import { samplePoints } from './points';
import { CategoryKey, CATEGORIES } from './types';

// Definir las categorías con íconos y colores
const CATEGORY_ICONS = {
  wifi: Wifi,
  hospedaje: Home,
  cowork: Coffee,
  banco: CreditCard,
  puerto: Anchor,
};

// Carga dinámica del cliente del mapa para mejor rendimiento
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] w-full items-center justify-center rounded-2xl bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

// Componente para los filtros
interface MapFiltersProps {
  selectedCategories: Set<CategoryKey>; 
  onCategoryToggle: (cat: CategoryKey) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MapFilters({ 
  selectedCategories, 
  onCategoryToggle,
  searchQuery,
  onSearchChange 
}: MapFiltersProps) {
  return (
    <div className="mb-8 space-y-6 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

      {/* Barra de búsqueda */}
      <motion.div 
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Buscar destinos, lugares o categorías..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm py-3 pl-11 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
        />
      </motion.div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            onClick={() => onCategoryToggle(category.key as CategoryKey)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategories.has(category.key as CategoryKey)
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <category.icon className="h-3.5 w-3.5" />
            {category.label}
            {selectedCategories.has(category.key as CategoryKey) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MapaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(new Set());
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no es compatible con tu navegador');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación. Asegúrate de que los permisos estén habilitados.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Filtrar puntos basados en la búsqueda y categorías seleccionadas
  const filteredPoints = useMemo(() => {
    return samplePoints.filter(point => {
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.size === 0 || 
                            (point.category && selectedCategories.has(point.category));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  const toggleCategory = (category: CategoryKey) => {
    setSelectedCategories(prev => {
      const newCategories = new Set(prev);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return newCategories;
    });
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 nf-grid opacity-20" />
        <div className="absolute inset-0 nf-vignette" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>
      <div className="relative overflow-hidden">

        {/* Efecto de partículas sutiles */}
        <ParticlesBackground />

        <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyberPurple dark:text-cyberPurple-300 bg-cyberPurple/5 dark:bg-cyberPurple/10 rounded-full border border-cyberPurple/10 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyberPurple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyberPurple"></span>
            </span>
            Explora el mapa
          </motion.div>

          {/* Título principal */}
          <motion.div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="block text-gray-900 dark:text-white">Mapa</span>
              <span className="block mt-2 bg-gradient-to-r from-cyberPurple to-electricBlue bg-clip-text text-transparent">
                Nómada Fantasma
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 md:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Descubre los mejores destinos para nómadas digitales en Guatemala
            </motion.p>
          </motion.div>
        </div>

        {/* Filtros y búsqueda */}
        <MapFilters 
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Mapa */}
        <motion.div 
          className="relative mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl overflow-hidden border border-border/60 bg-background shadow-lg">
            <Suspense fallback={
              <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <MapClient 
                points={filteredPoints} 
                key={userLocation ? JSON.stringify(userLocation) : 'no-location'}
              />
            </Suspense>

            {/* Botón de ubicación */}
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="absolute bottom-4 right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-background p-2 shadow-lg transition-colors hover:bg-muted disabled:opacity-50"
              aria-label="Centrar en mi ubicación"
              title="Centrar en mi ubicación"
            >
              {isLocating ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Compass className="h-5 w-5 text-foreground" />
              )}
            </button>

            <AnimatePresence>
              {locationError && (
                <motion.div 
                  className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 transform"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{locationError}</span>
                    <button 
                      onClick={() => setLocationError(null)}
                      className="ml-auto text-destructive/70 hover:text-destructive"
                      aria-label="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Leyenda */}
          <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-4">
            <h3 className="mb-3 text-sm font-medium">Leyenda</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category.key} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-muted-foreground">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
