'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isAtitlanTown = route.region === 'america' && 
      (route.slug.includes('san-') || route.slug === 'santiago-atitlan');
    
    const path = isAtitlanTown
      ? `/rutas-magicas/lago-atitlan/${route.slug}`
      : `/rutas-magicas/${route.slug}`;
      
    router.push(path);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isAtitlanTown = route.region === 'america' && 
        (route.slug.includes('san-') || route.slug === 'santiago-atitlan');
      
      const path = isAtitlanTown
        ? `/rutas-magicas/lago-atitlan/${route.slug}`
        : `/rutas-magicas/${route.slug}`;
        
      router.push(path);
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80",
        "border border-gray-200/50 dark:border-cyberPurple/30",
        "transform hover:-translate-y-1 transition-all duration-300",
        "h-full flex flex-col cursor-pointer backdrop-blur-sm",
        "hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:border-cyberPurple/50",
        "hover:shadow-cyberPurple/20 dark:hover:shadow-cyberPurple/30",
        route.isRecommended && "border-2 border-cyberPurple/50 shadow-lg shadow-cyberPurple/10",
        "cyber-card"
      )}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${route.title}`}
    >
      {/* Image with overlay */}
      <div className="relative h-52 overflow-hidden group">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ 
            backgroundImage: `url(${route.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyberPurple bg-clip-text text-transparent">
              {route.title}
            </h3>
            <span className="text-sm px-2 py-1 rounded-full bg-cyberPurple/10 text-cyberPurple font-medium">
              {getRegionFlag(route.region)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {route.summary}
          </p>
          
          {/* Highlights */}
          {route.highlights && route.highlights.length > 0 && (
            <div className="mt-3 space-y-1">
              {route.highlights.slice(0, 3).map((highlight, i) => (
                <div key={i} className="flex items-start">
                  <svg className="h-4 w-4 text-cyberPurple mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
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
              <button 
                className="relative z-10 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-cyberPurple rounded-lg hover:shadow-lg hover:shadow-cyan-400/20 dark:shadow-cyberPurple/10 transition-all duration-300 group/button glow-on-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e);
                }}
              >
                <span className="relative z-10 flex items-center">
                  <span className="group-hover/button:translate-x-0.5 transition-transform text-sm font-medium tracking-wide">Explorar</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover/button:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyberPurple/30 to-cyan-400/0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500" />
              </button>
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
