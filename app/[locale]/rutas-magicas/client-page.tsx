'use client';

import { Suspense } from 'react';
import RutasMagicasClient from './RutasMagicasClient';

// Componente Skeleton simple
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className || ''}`} />
);

export default function RutasMagicasPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full min-h-screen">
        <Skeleton className="w-full h-screen" />
      </div>
    }>
      <RutasMagicasClient />
    </Suspense>
  );
}
