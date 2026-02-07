'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Wifi, Utensils, Tent, Home, Hotel, Phone, Globe, ExternalLink, MessageCircle, Info } from 'lucide-react';
import { Accommodation } from '../mocks/atitlanData';

interface AccommodationCardProps {
    accommodation: Accommodation;
    townSlug: string;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, townSlug }) => {
    const { name, type, priceRange, rating, description, amenities, image, contact, bookingUrl } = accommodation;

    // Generate slug
    const accSlug = name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9-]/g, '');

    const getTypeIcon = () => {
        switch (type) {
            case 'hotel': return <Hotel className="w-4 h-4" />;
            case 'hostel': return <Home className="w-4 h-4" />;
            case 'camping': return <Tent className="w-4 h-4" />;
            default: return <Hotel className="w-4 h-4" />;
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'hotel': return 'Hotel';
            case 'hostel': return 'Hostal';
            case 'camping': return 'Camping';
            default: return 'Hospedaje';
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'hotel': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'hostel': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
            case 'camping': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        if (!contact) return;
        const cleanNumber = contact.replace(/\D/g, '');
        const message = `Hola, vi su propiedad ${name} en Nómada Fantasma y me gustaría más información.`;
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div
            className="group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 flex flex-col h-full relative"
        >
            {/* Main Link (Stretched to cover card) */}
            <Link
                href={`/rutas-magicas/lago-atitlan/${townSlug}/hospedaje/${accSlug}`}
                className="absolute inset-0 z-0"
            >
                <span className="sr-only">Ver detalles de {name}</span>
            </Link>

            {/* Image Container */}
            <div className="relative h-48 overflow-hidden pointer-events-none">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Type Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${getTypeColor()} backdrop-blur-sm`}>
                    {getTypeIcon()}
                    {getTypeLabel()}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
                    {priceRange}
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-bold">{rating}</span>
                </div>

                {/* View Details Hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <span className="px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Ver Detalles
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow pointer-events-none">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors relative z-10">
                    {name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow relative z-10">
                    {description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600/50 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-500/50">
                            {amenity}
                        </span>
                    ))}
                    {amenities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400 rounded-md border border-gray-200 dark:border-gray-500/50">
                            +{amenities.length - 3}
                        </span>
                    )}
                </div>

                {/* Actions - Interactive elements need pointer-events-auto and z-index > 0 */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-600 relative z-20 pointer-events-auto">
                    {contact && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-1.5" />
                            <span className="text-xs">{contact}</span>
                        </div>
                    )}

                    {bookingUrl ? (
                        <a
                            href={bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleBooking}
                            className="ml-auto flex items-center gap-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                            Ver disponibilidad
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    ) : contact ? (
                        <button
                            onClick={handleWhatsApp}
                            className="ml-auto flex items-center gap-1.5 text-sm font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                            Contactar
                            <MessageCircle className="w-4 h-4" />
                        </button>
                    ) : (
                        <span className="ml-auto text-xs text-gray-400 italic">
                            Solo presencial
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccommodationCard;
