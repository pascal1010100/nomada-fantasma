'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import RegionFilter from './RegionFilter';
import RouteCard from './RouteCard';
import { mockRoutes } from '../mocks/routes';
import { Region, Route } from '../lib/types';
import { Compass, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
};
interface FilteredRoutesProps {
  region?: Region;
  searchQuery?: string;
}
export default function FilteredRoutes({ region, searchQuery = '' }: FilteredRoutesProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const filteredRoutes = mockRoutes.filter((route: Route) => {
    const matchesRegion = !region || route.region === region;
    const matchesSearch = 
      !searchQuery || 
      route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.tags && route.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="relative">
      {filteredRoutes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-electricBlue/10 to-cyberPurple/10 dark:from-electricBlue/5 dark:to-cyberPurple/5 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-8 h-8 text-cyberPurple" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No se encontraron resultados' : 'No hay rutas disponibles'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery 
              ? 'No encontramos ninguna ruta que coincida con tu búsqueda. Intenta con otros términos.'
              : 'Parece que no hay rutas disponibles en este momento. Vuelve a intentarlo más tarde.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => window.location.href = window.location.pathname}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyberPurple hover:bg-cyberPurple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple transition-colors"
            >
              Limpiar búsqueda
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRoutes.map((route) => (
            <motion.div 
              key={route.id}
              variants={itemVariants}
            >
              <RouteCard route={route} />
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Floating elements for visual interest */}
      {isMounted && (
        <>
          <div className="absolute -left-20 top-1/4 w-64 h-64 bg-cyberPurple/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 -z-10"></div>
          <div className="absolute -right-20 bottom-1/4 w-64 h-64 bg-electricBlue/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 -z-10"></div>
        </>
      )}
    </div>
  );
}
