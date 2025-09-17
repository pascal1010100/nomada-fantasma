'use client';

import Link from 'next/link';
import { Route } from '../lib/types';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, ArrowRight, Users, Zap } from 'lucide-react';

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

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/20"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ 
            backgroundImage: `url(${route.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
        </div>
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <div className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-xs font-medium border border-gray-100 dark:border-gray-700/50">
            {getRegionFlag(route.region)} {route.region.charAt(0).toUpperCase() + route.region.slice(1)}
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-electricBlue to-cyberPurple text-white text-xs font-bold">
            ${route.price.toLocaleString()}
          </div>
        </div>
        
        {/* Rating */}
        <div className="absolute top-4 right-4 z-10 flex items-center bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {route.rating.toFixed(1)}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1">
          {route.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {route.summary}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 mb-4">
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            <span>{route.region.charAt(0).toUpperCase() + route.region.slice(1)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>{route.durationDays} {route.durationDays === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        
        {/* Action button */}
        <div className="relative pt-3 mt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Desde <span className="text-electricBlue dark:text-cyberPurple text-base font-bold">${route.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">por persona</span>
            </div>
            <motion.div
              className="relative overflow-hidden"
              whileHover="hover"
              initial={false}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-electricBlue/10 to-cyberPurple/10 rounded-lg scale-0 group-hover:scale-105 transition-transform duration-300" />
              <Link 
                href={`/rutas-magicas/${route.id}`}
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
        </div>
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
