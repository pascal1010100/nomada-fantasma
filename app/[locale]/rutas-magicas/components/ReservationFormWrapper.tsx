'use client';

import dynamic from 'next/dynamic';
import { Tour } from '../mocks/tours/types';

// Cargar el componente de forma dinámica con SSR deshabilitado
const ReservationForm = dynamic(
  () => import('@/app/[locale]/rutas-magicas/components/ReservationForm'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">Cargando formulario de reserva...</div>
      </div>
    )
  }
);

interface ReservationFormWrapperProps {
  tourId: string;
  price: number;
  childPrice?: number;
  maxCapacity: number;
  availableDays: string[];
  startTimes: string[];
}

export default function ReservationFormWrapper({
  tourId,
  price,
  childPrice,
  maxCapacity,
  availableDays,
  startTimes
}: ReservationFormWrapperProps) {
  // Asegurarse de que availableDays y startTimes sean arrays
  const safeAvailableDays = Array.isArray(availableDays) ? availableDays : [];
  const safeStartTimes = Array.isArray(startTimes) ? startTimes : [];

  // Si no hay días disponibles, usar la fecha de hoy como predeterminada
  const defaultAvailableDays = safeAvailableDays.length > 0
    ? safeAvailableDays
    : (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return [tomorrow.toISOString().split('T')[0]];
      })();

  // Si no hay horarios, usar algunos por defecto
  const defaultStartTimes = safeStartTimes.length > 0
    ? safeStartTimes
    : ['06:00', '08:00', '10:00', '14:00'];

  return (
    <div className="reservation-form-container">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Reserva tu tour
      </h3>

      <ReservationForm
        tourId={tourId}
        price={price}
        childPrice={childPrice}
        maxCapacity={maxCapacity || 10}
        availableDays={defaultAvailableDays}
        startTimes={defaultStartTimes}
      />
    </div>
  );
}
