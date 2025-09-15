// app/mapa/page.tsx
'use client';

import { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { samplePoints } from './points';
import { CategoryKey, CATEGORIES } from './types';

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
    <div className="mb-6 space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Buscar lugares..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background/50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

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
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filtrar puntos basados en categorías seleccionadas y búsqueda
  const filteredPoints = useMemo(() => {
    return samplePoints.filter(point => {
      // Filtrar por categorías seleccionadas
      const categoryMatch = selectedCategories.size === 0 || 
        selectedCategories.has(point.category);
      
      // Filtrar por búsqueda (solo por nombre por ahora)
      const searchMatch = searchQuery === '' || 
        point.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }, [selectedCategories, searchQuery]);

  // Alternar categoría seleccionada
  const toggleCategory = (category: CategoryKey) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Obtener ubicación del usuario
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no es compatible con tu navegador');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación. Asegúrate de haber otorgado los permisos necesarios.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="container relative z-0 py-6 md:py-10">
      <header className="mb-8">
        <motion.h1 
          className="mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Mapa Nómada
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Explora lugares con Wi-Fi, hospedaje, coworking, bancos y puertos para nómadas digitales.
        </motion.p>
      </header>

      <div className="space-y-6">
        {/* Filtros y búsqueda */}
        <MapFilters 
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Mapa */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg">
          <Suspense fallback={
            <div className="flex h-[60vh] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <MapClient 
              points={filteredPoints} 
              key={JSON.stringify(userLocation)} // Forzar remontaje al cambiar la ubicación
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
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Contador de resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredPoints.length} {filteredPoints.length === 1 ? 'lugar' : 'lugares'}
          </p>
          
          {selectedCategories.size > 0 && (
            <button
              onClick={() => setSelectedCategories(new Set())}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Mensaje de error de ubicación */}
        <AnimatePresence>
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{locationError}</span>
              <button 
                onClick={() => setLocationError(null)}
                className="ml-auto text-destructive/70 hover:text-destructive"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leyenda */}
      <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-4">
        <h3 className="mb-3 text-sm font-medium">Leyenda</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
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
    </div>
  );
}
