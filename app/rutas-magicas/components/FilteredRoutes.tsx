'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import RegionFilter from './RegionFilter';
import RouteCard from './RouteCard';
import SearchBar from './SearchBar';
import { mockRoutes } from '../mocks/routes';
import { Region } from '../lib/types';
import { Compass, MapPin, ArrowRight, Search } from 'lucide-react';
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

export default function FilteredRoutes({ region }: { region?: Region }) {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRoutes = mockRoutes.filter(route => {
    // Filtrar por región si está seleccionada
    const matchesRegion = !region || route.region === region;
    
    // Filtrar por búsqueda (ignorar mayúsculas/minúsculas)
    const matchesSearch = !searchQuery || 
      route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.highlights.some(highlight => 
        highlight.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesRegion && matchesSearch;
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Explora Nuestras Rutas
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Descubre aventuras inolvidables en los destinos más sorprendentes del mundo.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              onSearch={setSearchQuery} 
              placeholder="Buscar rutas por nombre, descripción o características..."
            />
          </div>
        </div>
        
        <RegionFilter selectedRegion={region} />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {filteredRoutes.length === 0 ? (
          <motion.div 
            key="no-routes"
            className="relative bg-white dark:bg-gray-800/50 rounded-2xl p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-electricBlue/10 to-cyberPurple/10 mb-6">
              <Compass className="w-8 h-8 text-electricBlue dark:text-cyberPurple" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay rutas en esta región</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              No hemos encontrado rutas disponibles en la región seleccionada.
            </p>
            <motion.a
              href="/rutas-magicas"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-electricBlue to-cyberPurple rounded-lg hover:shadow-lg hover:shadow-electricBlue/20 dark:shadow-cyberPurple/10 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver todas las rutas
            </motion.a>
          </motion.div>
        ) : (
          <motion.div 
            key="routes-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
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
      </AnimatePresence>
      
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
