'use client';

import { getToursByPueblo } from '../mocks/tours';
import TourCard from './TourCard';
import { Zap } from 'lucide-react';

interface ToursSectionProps {
  puebloSlug: string;
  className?: string;
}

export default function ToursSection({ puebloSlug, className = '' }: ToursSectionProps) {
  const tours = getToursByPueblo(puebloSlug);

  if (tours.length === 0) {
    return null; // No mostrar la sección si no hay tours
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/50 mr-3">
            <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tours y Experiencias
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard 
              key={tour.id} 
              tour={tour} 
              puebloSlug={puebloSlug}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿No encuentras lo que buscas? Pregunta por tours personalizados.
          </p>
        </div>
      </div>
    </section>
  );
}
