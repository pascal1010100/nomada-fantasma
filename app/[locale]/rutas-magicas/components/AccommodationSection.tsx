'use client';

import React, { useState } from 'react';
import { Accommodation, AccommodationType } from '../mocks/atitlanData';
import AccommodationCard from './AccommodationCard';
import { Hotel, Home, Tent, MapPin } from 'lucide-react';

interface AccommodationSectionProps {
    accommodations?: Accommodation[];
    townName: string;
    townSlug: string;
}

type FilterType = 'all' | AccommodationType;

const AccommodationSection: React.FC<AccommodationSectionProps> = ({ accommodations, townName, townSlug }) => {
    const [filter, setFilter] = useState<FilterType>('all');

    // If no accommodations, show the placeholder state (unchanged from original design)
    if (!accommodations || accommodations.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800/30">
                    <div className="flex items-center justify-center h-40 mb-4 bg-white/50 dark:bg-gray-600/50 rounded-lg">
                        <Hotel className="w-16 h-16 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hoteles</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Próximamente: Encuentra hoteles y hostales en {townName}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800/30">
                    <div className="flex items-center justify-center h-40 mb-4 bg-white/50 dark:bg-gray-600/50 rounded-lg">
                        <Home className="w-16 h-16 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hostales</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Próximamente: Opciones económicas y ambiente viajero
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800/30">
                    <div className="flex items-center justify-center h-40 mb-4 bg-white/50 dark:bg-gray-600/50 rounded-lg">
                        <MapPin className="w-16 h-16 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Camping</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Próximamente: Zonas de camping y glamping
                    </p>
                </div>
            </div>
        );
    }

    // Filter logic
    const filteredAccommodations = filter === 'all'
        ? accommodations
        : accommodations.filter(acc => acc.type === filter);

    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'Todos' },
        { id: 'hotel', label: 'Hoteles' },
        { id: 'hostel', label: 'Hostales' },
        { id: 'camping', label: 'Camping' },
    ];

    return (
        <div className="space-y-8">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`
              px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border
              ${filter === f.id
                                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-transparent shadow-lg shadow-purple-500/20 scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400'
                            }
            `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccommodations.length > 0 ? (
                    filteredAccommodations.map((accommodation) => (
                        <AccommodationCard
                            key={accommodation.id}
                            accommodation={accommodation}
                            townSlug={townSlug}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">
                            No hay opciones disponibles en esta categoría por el momento.
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default AccommodationSection;
