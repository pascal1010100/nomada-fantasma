'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Route } from '../lib/types';
import { motion, useInView } from 'framer-motion';
import { Star, MapPin, Calendar, ArrowRight, Users, Zap, Heart } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface RouteCardProps {
  route: Route;
}

const getRegionFlag = (region: string) => {
  switch (region) {
    case 'europe':
      return '🇪🇺';
    case 'asia':
      return '🌏';
    case 'america':
      return '🌎';
    default:
      return '📍';
  }
};

import type { Variants } from 'framer-motion';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.1
    }
  }
};

export default function RouteCard({ route }: RouteCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div 
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800",
        route.slug === 'lago-atitlan' 
          ? "border-2 border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/20" 
          : "border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-gray-900/20",
        "transition-all duration-500 ring-1 ring-transparent hover:ring-electricBlue/30 dark:hover:ring-cyberPurple/30",
        "relative"
      )}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image with overlay */}
      <div className="relative h-52 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${route.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          initial={{ scale: 1 }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 6, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent" />
        </motion.div>
        
        {/* Top badges */}
        <motion.div 
          className="absolute top-4 left-4 right-4 flex justify-between z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {route.slug === 'lago-atitlan' && (
            <motion.div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 text-xs font-bold shadow-lg shadow-amber-500/30">
                🌟 Recomendado
              </span>
            </motion.div>
          )}
          <motion.div 
            className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-xs font-medium border border-gray-100 dark:border-gray-700/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getRegionFlag(route.region)} {route.region.charAt(0).toUpperCase() + route.region.slice(1)}
          </motion.div>
          <motion.div 
            className="px-3 py-1 rounded-full bg-gradient-to-r from-electricBlue to-cyberPurple text-white text-xs font-bold shadow-lg shadow-electricBlue/20"
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            ${route.price.toLocaleString()}
          </motion.div>
        </motion.div>
        
        {/* Rating and Favorite */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <motion.div 
            className="flex items-center bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
              {route.rating.toFixed(1)}
            </span>
          </motion.div>
          <motion.button 
            className="p-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-md"
            whileHover={{ scale: 1.1, color: '#ec4899' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Añadir a favoritos"
          >
            <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <motion.h3 
          className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1"
          whileHover={{ color: 'var(--electricBlue)' }}
          transition={{ duration: 0.3 }}
        >
          {route.title}
        </motion.h3>
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {route.summary}
        </motion.p>
        
        {/* Meta info */}
        <motion.div 
          className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.2 }
            }
          }}
        >
          <motion.div 
            className="flex items-center group"
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-electricBlue dark:text-cyberPurple" />
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              {route.region.charAt(0).toUpperCase() + route.region.slice(1)}
            </span>
          </motion.div>
          <motion.div 
            className="flex items-center group"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-electricBlue dark:text-cyberPurple" />
            <span className="group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              {route.durationDays} {route.durationDays === 1 ? 'día' : 'días'}
            </span>
          </motion.div>
        </motion.div>
        
        {/* Action button */}
        <motion.div 
          className="relative pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/50"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.3 }
            }
          }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="opacity-70">Desde</span>{' '}
              <span className="text-electricBlue dark:text-cyberPurple text-base font-bold">
                ${route.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                por persona
              </span>
            </motion.div>
            <motion.div
              className="relative overflow-hidden group/button"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              initial={false}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-electricBlue/20 to-cyberPurple/20 rounded-lg scale-0 group-hover/button:scale-105"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
              <Link 
                href={`/rutas-magicas/${route.slug}`}
                className="relative z-10 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-electricBlue to-cyberPurple rounded-lg hover:shadow-lg hover:shadow-electricBlue/20 dark:shadow-cyberPurple/10 transition-all duration-300 group/button"
              >
                <span className="relative z-10 flex items-center">
                  <span className="group-hover/button:translate-x-0.5 transition-transform">Ver detalles</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover/button:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-electricBlue/0 via-cyberPurple/30 to-electricBlue/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500" />
              </Link>
            </motion.div>
          </div>
          
          {/* Quick action buttons */}
          <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="text-xs text-cyberPurple dark:text-cyberPurple-300 hover:text-electricBlue dark:hover:text-electricBlue transition-colors flex items-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Aquí iría la lógica para guardar en favoritos
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Guardar
            </button>
            
            <button 
              className="text-xs text-gray-500 hover:text-cyberPurple dark:text-gray-400 dark:hover:text-cyberPurple-300 transition-colors flex items-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Aquí iría la lógica para compartir
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Additional Info */}
      <div className="px-5 pb-5 -mt-2">
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-cyberPurple flex-shrink-0" />
            <span className="text-sm">
              {route.groupSize.min}-{route.groupSize.max} travelers
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="text-sm capitalize">{route.difficulty?.toLowerCase() || 'medium'}</span>
          </div>
        </div>
      </div>
      
      {/* Highlights */}
      {route.highlights.length > 0 && (
        <div className="px-5 pb-4 -mt-2">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">HIGHLIGHTS</div>
          <ul className="space-y-1.5">
            {route.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-cyberPurple mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
