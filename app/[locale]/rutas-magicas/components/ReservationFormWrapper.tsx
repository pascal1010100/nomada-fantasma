'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
// Cargar el componente de forma dinámica con SSR deshabilitado
function ReservationFormLoading() {
  const t = useTranslations('Reservation');

  return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-pulse">{t('loading')}</div>
    </div>
  );
}

const ReservationForm = dynamic(
  () => import('@/app/[locale]/rutas-magicas/components/ReservationForm'),
  {
    ssr: false,
    loading: () => <ReservationFormLoading />
  }
);

interface ReservationFormWrapperProps {
  tourId: string;
  price: number;
  maxCapacity: number;
  availableDays: string[];
}

export default function ReservationFormWrapper({
  tourId,
  price,
  maxCapacity,
  availableDays
}: ReservationFormWrapperProps) {
  const t = useTranslations('Reservation');
  // Asegurarse de que availableDays y startTimes sean arrays
  const safeAvailableDays = Array.isArray(availableDays) ? availableDays : [];

  const defaultAvailableDays = safeAvailableDays.length > 0
    ? safeAvailableDays
    : ['Todos los días'];

  return (
    <div className="reservation-form-container">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('wrapperTitle')}
      </h3>

      <ReservationForm
        tourId={tourId}
        price={price}
        maxCapacity={maxCapacity || 10}
        availableDays={defaultAvailableDays}
      />
    </div>
  );
}
