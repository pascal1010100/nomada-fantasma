// app/reservar/page.tsx
import { Suspense } from 'react';
import ReservarClient from './ReservarClient';
import { LoadingSpinner } from '../../components/ui';

export const metadata = {
  title: 'Reservar - Nómada Fantasma',
  description: 'Reserva tu próxima aventura con Nómada Fantasma',
};

export default function ReservarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ReservarClient />
    </Suspense>
  );
}
