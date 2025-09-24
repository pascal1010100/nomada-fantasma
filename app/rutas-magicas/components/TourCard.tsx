'use client';

import { Tour } from '../mocks/tours/types';
import { Clock, Users, Zap, ArrowRight, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TourCardProps {
  tour: Tour;
  puebloSlug: string;
  className?: string;
}

const difficultyColors = {
  'Fácil': 'bg-green-100 text-green-800',
  'Moderado': 'bg-yellow-100 text-yellow-800',
  'Difícil': 'bg-red-100 text-red-800',
};

export default function TourCard({ tour, puebloSlug, className = '' }: TourCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full ${className}`}>
      {/* Imagen del tour con enlace */}
      <Link href={`/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tour.slug}`} className="block h-48 relative">
        <Image
          src={tour.images[0] || '/images/tours/default-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{tour.title}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[tour.difficulty]}`}>
              {tour.difficulty}
            </span>
          </div>
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {tour.summary}
        </p>

        {/* Detalles del tour */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-cyan-500" />
            <span>{tour.duration}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-2 text-cyan-500" />
            <span>Grupo: {tour.capacity.min}-{tour.capacity.max} personas</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
            <span className="line-clamp-1">{tour.meetingPoint}</span>
          </div>

          {/* Precio */}
          <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${tour.price.adult}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ persona</span>
                {tour.price.child && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Niños: ${tour.price.child}
                  </p>
                )}
              </div>
              
              <Link 
                href={`/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tour.slug}`}
                className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
                aria-label={`Ver detalles del tour ${tour.title}`}
              >
                Ver detalles
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
