'use client';

import { Tour } from '../mocks/tours/types';
import { Clock, Users, Zap, ArrowRight, MapPin, Star, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TourCardProps {
  tour: Tour;
  puebloSlug: string;
  className?: string;
}

const difficultyColors = {
  'Fácil': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-400' },
  'Moderado': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400' },
  'Difícil': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400' },
};

const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

const buttonTap = {
  scale: 0.98,
};

import { useTranslations } from 'next-intl';

export default function TourCard({ tour, puebloSlug, className = '' }: TourCardProps) {
  const t = useTranslations('Tours');
  const td = useTranslations(`Data.tours.${tour.id}`);

  // Fallback to original values if translation doesn't exist yet
  // This helps when not all tours are in the translation files
  const title = td.has('title') ? td('title') : tour.title;
  const summary = td.has('summary') ? td('summary') : tour.summary;
  const duration = td.has('duration') ? td('duration') : tour.duration;
  const meetingPoint = td.has('meetingPoint') ? td('meetingPoint') : tour.meetingPoint;

  // Map difficulty to localized strings
  const getLocalizedDifficulty = (diff: string) => {
    switch (diff) {
      case 'Fácil': return t('difficulty.easy');
      case 'Moderado': return t('difficulty.medium');
      case 'Difícil': return t('difficulty.hard');
      default: return diff;
    }
  };

  const localizedDifficulty = getLocalizedDifficulty(tour.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-900/50 ${className}`}
    >
      {/* Badge de popularidad */}
      {tour.isPopular && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-amber-600 text-amber-900">
            <Star className="w-3.5 h-3.5 mr-1" />
            {t('popular')}
          </span>
        </div>
      )}

      {/* Imagen del tour con overlay y efecto de zoom */}
      <Link
        href={`/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tour.slug}`}
        className="block h-48 relative overflow-hidden group"
        aria-label={t('detailsAria', { title })}
      >
        <Image
          src={tour.images[0] || '/images/tours/default-tour.jpg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md">{title}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColors[tour.difficulty as keyof typeof difficultyColors]?.bg || 'bg-gray-100'} ${difficultyColors[tour.difficulty as keyof typeof difficultyColors]?.text || 'text-gray-800'}`}>
              {localizedDifficulty}
            </span>
            {tour.rating && (
              <span className="inline-flex items-center text-xs bg-black/30 text-white px-2 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-400 mr-1" fill="currentColor" />
                {tour.rating}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {summary}
        </p>

        {/* Detalles del tour */}
        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate" title={duration}>{duration}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate">{t('maxCapacity', { max: tour.capacity.max })}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate" title={meetingPoint}>{meetingPoint}</span>
            </div>

            {tour.availability && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
                <span className="truncate">{tour.availability}</span>
              </div>
            )}
          </div>

          {/* Precio y acciones */}
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${tour.price.adult.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('perPerson')}</span>
                  {tour.price.child && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('children', { price: `$${tour.price.child.toLocaleString()}` })}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="w-full"
                >
                  <Link
                    href={`/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tour.slug}`}
                    className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 rounded-lg border border-cyan-200 dark:border-cyan-800 transition-colors"
                    aria-label={t('detailsAria', { title })}
                  >
                    {t('viewDetails')}
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="w-full"
                >
                  <Link
                    href={`/reservar/${tour.id}`}
                    className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 rounded-lg shadow-sm transition-all"
                    aria-label={t('reservationAria', { title })}
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    {t('book')}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
