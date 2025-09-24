'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TourNotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Tour no encontrado</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Lo sentimos, no pudimos encontrar el tour que estás buscando. Puede que el enlace esté roto o que el tour ya no esté disponible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver atrás
          </button>
          <Link 
            href="/rutas-magicas"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-cyan-700 dark:text-cyan-400 bg-white dark:bg-gray-800 border border-cyan-200 dark:border-cyan-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Ver todos los destinos
          </Link>
        </div>
      </div>
    </div>
  );
}
