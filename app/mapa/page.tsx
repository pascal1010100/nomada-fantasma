// app/mapa/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2, AlertCircle, Compass, Wifi, Home, Anchor, Coffee, CreditCard, Sparkles, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';
import { RippleButton, Tooltip, LoadingSpinner } from '../components/ui';

const ParticlesBackground = dynamic(
  () => import('./components/ParticlesBackground'),
  { ssr: false }
);
import { samplePoints } from './points';
import { CategoryKey, CATEGORIES } from './types';
import { MapContent } from './components/MapContent';

// Definir las categorías con íconos y colores
const CATEGORY_ICONS = {
  wifi: Wifi,
  hospedaje: Home,
  cowork: Coffee,
  banco: CreditCard,
  puerto: Anchor,
  landmark: MapPin,
  activity: Compass,
};

// Carga dinámica del cliente del mapa para mejor rendimiento
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] w-full items-center justify-center rounded-2xl glass-enhanced">
      <LoadingSpinner variant="glow" size="lg" text="Cargando mapa..." />
    </div>
  ),
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
        <input
          type="text"
          placeholder="Buscar destinos, lugares, experiencias..."
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
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

export default function MapaPage() {
  const [searchQuery, setSearchQuery] = useState('');
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
              <span className="text-primary font-semibold">Explora el mundo nómada</span>
            </motion.div>

            {/* Título principal con efectos */}
            <motion.div className="mb-8">
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="block text-foreground">Mapa Interactivo</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Nómada Fantasma
                </span>
              </motion.h1>

              <motion.p
                className="max-w-2xl text-lg text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Descubre los mejores destinos para nómadas digitales en Guatemala.
                WiFi rápido, espacios de coworking y comunidad vibrante.
              </motion.p>

              {/* Stats rápidos */}
              <motion.div
                className="mt-6 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {[
                  { value: samplePoints.length, label: 'Lugares', icon: MapPin },
                  { value: '24/7', label: 'WiFi', icon: Wifi },
                  { value: '100%', label: 'Verificado', icon: Sparkles }
                ].map((stat, index) => (
                  <Tooltip key={index} content={`${stat.label} disponibles`} position="bottom">
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
                <LoadingSpinner variant="glow" size="lg" text="Cargando mapa..." />
              </div>
            }>
              <MapContent searchQuery={searchQuery}>
                {(filteredPoints) => (
                  <MapClient
                    points={filteredPoints}
                    key={userLocation ? JSON.stringify(userLocation) : 'no-location'}
                  />
                )}
              </MapContent>
            </Suspense>

            {/* Botón de ubicación mejorado */}
            <Tooltip content="Centrar en mi ubicación" position="left">
              <motion.button
                onClick={handleLocateMe}
                disabled={isLocating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-xl glass-enhanced shadow-lg transition-all hover:border-primary/50 disabled:opacity-50 group"
                aria-label="Centrar en mi ubicación"
              >
                {isLocating ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Navigation className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                )}
              </motion.button>
            </Tooltip>

            {/* Error notification */}
            <AnimatePresence>
              {locationError && (
                <motion.div
                  className="absolute bottom-6 left-1/2 z-[9999] -translate-x-1/2 transform max-w-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-enhanced rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{locationError}</span>
                    <button
                      onClick={() => setLocationError(null)}
                      className="text-red-600/70 hover:text-red-600 dark:text-red-400/70 dark:hover:text-red-400 transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                Leyenda del Mapa
              </h3>
              <span className="text-xs text-muted-foreground">
                {CATEGORIES.length} categorías
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CATEGORIES.map((category, index) => {
                const Icon = CATEGORY_ICONS[category.key as keyof typeof CATEGORY_ICONS] || MapPin;
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
                      {category.label}
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
              <h3 className="text-2xl font-bold mb-2">¿No encuentras lo que buscas?</h3>
              <p className="text-muted-foreground mb-6">
                Ayúdanos a mejorar el mapa sugiriendo nuevos lugares
              </p>
              <RippleButton
                variant="primary"
                onClick={() => window.location.href = '/contacto'}
              >
                <Sparkles className="w-4 h-4" />
                Sugerir un lugar
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
