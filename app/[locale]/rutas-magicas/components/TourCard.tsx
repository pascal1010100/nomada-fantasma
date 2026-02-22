'use client';

import { normalizeId, normalizeSlug, Tour } from '@/app/lib/types';
import { Clock, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

interface TourCardProps {
  tour: Tour;
  puebloSlug: string;
  className?: string;
}

const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

const buttonTap = {
  scale: 0.98,
};

export default function TourCard({ tour, puebloSlug, className = '' }: TourCardProps) {
  const t = useTranslations('Tours');
  const tourSlug = (normalizeSlug(tour.slug) ?? normalizeId(tour.id))?.toLowerCase();
  const tourId = normalizeId(tour.id);
  if (!tourSlug) {
    return null;
  }
  const td = useTranslations(`Data.tours.${tourSlug}`);
  const locale = useLocale();

  // Fallback to original values if translation doesn't exist yet
  const name = td.has('name') ? td('name') : (tour.name ?? tour.title ?? 'Tour');
  const description = td.has('description') ? td('description') : tour.description;
  const meeting_point = td.has('meeting_point') ? td('meeting_point') : tour.meeting_point;
  const durationLabel = `${tour.duration_hours} ${t('hours', { count: tour.duration_hours })}`;
  const priceValue = (tour.price ?? tour.price_min ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-900/50 ${className}`}
    >
      {/* Imagen del tour con overlay y efecto de zoom */}
      <Link
        href={`/${locale}/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tourSlug}`}
        className="block h-48 relative overflow-hidden group"
        aria-label={t('detailsAria', { title: name })}
      >
        <Image
          src={tour.image_url || '/images/tours/default-tour.svg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-md">{name}</h3>
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Detalles del tour */}
        <div className="mt-auto space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate" title={durationLabel}>{durationLabel}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate" title={meeting_point}>{meeting_point}</span>
            </div>
          </div>

          {/* Precio y acciones */}
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Q{priceValue.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('perPerson')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="w-full"
                >
                  <Link
                    href={`/${locale}/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tourSlug}`}
                    className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 rounded-lg border border-cyan-200 dark:border-cyan-800 transition-colors"
                    aria-label={t('detailsAria', { title: name })}
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
                    href={`/${locale}/reservar/${tourId ?? tourSlug}`}
                    className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 rounded-lg shadow-sm transition-all"
                    aria-label={t('reservationAria', { title: name })}
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
