'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    X, MapPin, Star, Check, Share2, Heart, Calendar, Users, MessageCircle,
    Wallet, Moon, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import { Accommodation } from '../mocks/atitlanData';

interface AccommodationDetailsModalProps {
    accommodation: Accommodation | null;
    isOpen: boolean;
    onClose: () => void;
}

const AccommodationDetailsModal: React.FC<AccommodationDetailsModalProps> = ({ accommodation, isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showFloatingBar, setShowFloatingBar] = useState(false);

    // Booking State
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset states when accommodation changes
    useEffect(() => {
        setCurrentImageIndex(0);
        setIsSaved(false);
        setGuests(1);
        setCheckIn('');
        setCheckOut('');
        setShowFloatingBar(false);
    }, [accommodation]);

    // Handle scroll to show/hide floating bar
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setShowFloatingBar(scrollTop > 400);
    };

    if (!isOpen || !accommodation) return null;

    const { name, type, rating, description, amenities, image, gallery, vibeMetrics, contact, bookingUrl, reviews, pricePerNight } = accommodation;

    // Use gallery if available, otherwise fallback to single image
    const images = gallery && gallery.length > 0 ? gallery : [image];
    const currentImage = images[currentImageIndex];

    // Booking logic
    const today = new Date().toISOString().split('T')[0];

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights();
    const isValidDates = checkIn && checkOut && new Date(checkOut) > new Date(checkIn);

    const subtotal = pricePerNight && nights > 0 ? pricePerNight * nights : 0;
    const serviceFee = 0;
    const total = subtotal + serviceFee;

    const handleWhatsAppBooking = () => {
        if (!contact) return;
        const cleanNumber = contact.replace(/\D/g, '');

        let message = `Hola, vi su propiedad *${name}* en Nómada Fantasma.`;

        if (isValidDates) {
            const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

                return new Intl.DateTimeFormat('es-GT', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                }).format(adjustedDate);
            };

            message += `\n\nMe gustaría consultar disponibilidad para:\n🗓 *Entrada:* ${formatDate(checkIn)}\n🗓 *Salida:* ${formatDate(checkOut)}\n🌙 *Duración:* ${nights} noches\n👥 *Huéspedes:* ${guests}`;

            if (pricePerNight) {
                message += `\n\n💰 *Estimado:* Q${total} (Q${pricePerNight}/noche x ${nights} noches)`;
            }
        } else {
            message += `\n\nMe gustaría más información sobre disponibilidad y precios.`;
        }

        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const changeImage = (direction: 'next' | 'prev') => {
        if (isAnimating) return;
        setIsAnimating(true);

        if (direction === 'next') {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        } else {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }

        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/95 dark:bg-black/95 backdrop-blur-xl transition-opacity duration-300"
                onClick={onClose}
            >
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.svg')] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Modal Container - Vertical Layout */}
            <div className="relative w-full max-w-2xl h-[98vh] bg-white dark:bg-[#0a0a0f] rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">

                {/* Close Button - Floating */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2.5 bg-gray-200/80 dark:bg-black/60 hover:bg-red-500/90 text-gray-900 dark:text-white rounded-full backdrop-blur-md transition-all duration-300 border border-gray-300 dark:border-white/10 hover:rotate-90 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>

                    {/* Hero Gallery - Full Width */}
                    <div className="relative h-[60vh] w-full bg-black">
                        <Image
                            src={currentImage}
                            alt={`${name} - View ${currentImageIndex + 1}`}
                            fill
                            className={`object-cover transition-all duration-500 ${isAnimating ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}
                            priority
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0f] via-transparent to-transparent opacity-90" />

                        {/* Gallery Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => changeImage('prev')}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-purple-600/90 text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:scale-110"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => changeImage('next')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-purple-600/90 text-white rounded-full backdrop-blur-md transition-all border border-white/10 hover:scale-110"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Thumbnail Strip */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                                                ? 'bg-gradient-to-r from-purple-400 to-cyan-400 w-8 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                                                : 'bg-white/30 w-1.5 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-purple-600/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-400/30">
                                {type}
                            </span>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="p-6 space-y-6">

                        {/* Quick Info Bar */}
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                    {name}
                                </h1>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-cyan-500" />
                                        <span>San Pedro La Laguna</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-900 dark:text-white">{rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`p-2.5 rounded-xl border transition-all ${isSaved
                                        ? 'bg-pink-500/10 border-pink-500/50 text-pink-500'
                                        : 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-pink-500' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 hover:bg-gray-200 dark:hover:bg-white/10"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Vibe Metrics - Horizontal Scroll */}
                        {vibeMetrics && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Vibe Analysis</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                                    {Object.entries(vibeMetrics).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex-shrink-0 w-32 p-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/10 dark:to-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:scale-105 transition-transform snap-start"
                                        >
                                            <div className="text-xs uppercase font-bold text-gray-600 dark:text-gray-400 mb-2">{key}</div>
                                            <div className="flex items-end gap-2">
                                                <div className="text-2xl font-black text-gray-900 dark:text-white">
                                                    {value}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">/10</div>
                                            </div>
                                            <div className="mt-2 h-1 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${key === 'party' ? 'bg-pink-500' :
                                                        key === 'chill' ? 'bg-cyan-500' :
                                                            key === 'work' ? 'bg-emerald-500' :
                                                                'bg-purple-500'
                                                        }`}
                                                    style={{ width: `${value * 10}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Sobre este lugar</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                {description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Amenidades</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/30 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-sm text-gray-700 dark:text-gray-400"
                                    >
                                        <Check className="w-4 h-4 text-purple-500" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Preview */}
                        {reviews && reviews.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reseñas Recientes</h3>
                                <div className="space-y-3">
                                    {reviews.slice(0, 2).map((review) => (
                                        <div key={review.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-white text-sm">{review.user}</p>
                                                    <p className="text-xs text-gray-500">{review.date}</p>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Booking Section */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Reservar Ahora</h3>

                            {bookingUrl ? (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-center transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Reservar Online</span>
                                        <ExternalLink className="w-5 h-5" />
                                    </div>
                                </a>
                            ) : (
                                <div className="space-y-4">
                                    {/* Date Selection */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Entrada</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                                                <input
                                                    type="date"
                                                    min={today}
                                                    value={checkIn}
                                                    onChange={(e) => {
                                                        setCheckIn(e.target.value);
                                                        if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
                                                            setCheckOut('');
                                                        }
                                                    }}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer hover:bg-white/10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Salida</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                                                <input
                                                    type="date"
                                                    min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                                                    value={checkOut}
                                                    onChange={(e) => setCheckOut(e.target.value)}
                                                    disabled={!checkIn}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nights & Guests - Unified Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Duración</label>
                                            <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 border border-white/5">
                                                <Moon className="w-4 h-4 text-cyan-400" />
                                                <span className="text-sm font-medium text-white">
                                                    {isValidDates ? `${nights} ${nights === 1 ? 'noche' : 'noches'}` : '0 noches'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Huéspedes</label>
                                            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3">
                                                <Users className="w-4 h-4 text-gray-500 mr-2" />
                                                <select
                                                    value={guests}
                                                    onChange={(e) => setGuests(Number(e.target.value))}
                                                    className="bg-transparent text-white text-sm w-full focus:outline-none py-2.5 appearance-none cursor-pointer"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                        <option key={n} value={n} className="bg-gray-900">{n} Pers.</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    {isValidDates && pricePerNight && (
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 space-y-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                                <Wallet className="w-4 h-4" />
                                                Resumen
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between text-gray-400">
                                                    <span>Q{pricePerNight} x {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                                                    <span className="text-white font-medium">Q{subtotal}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-400">
                                                    <span>Tarifa de servicio</span>
                                                    <span className="text-green-400 font-medium">Q0</span>
                                                </div>
                                                <div className="h-px bg-white/10 my-2" />
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span className="text-white">Total</span>
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                                        Q{total}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    <button
                                        onClick={handleWhatsAppBooking}
                                        disabled={!isValidDates}
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${isValidDates
                                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]'
                                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isValidDates && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                                        <MessageCircle className={`w-5 h-5 relative ${isValidDates ? 'group-hover:scale-110' : ''} transition-transform`} />
                                        <span className="relative">
                                            {isValidDates ? (pricePerNight ? `Reservar • Q${total}` : `Consultar (${nights} noches)`) : 'Selecciona Fechas'}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Bottom Padding */}
                        <div className="h-20" />
                    </div>
                </div>

                {/* Floating Action Bar */}
                {showFloatingBar && isValidDates && pricePerNight && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-xs text-gray-500">Total Estimado</div>
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                    Q{total}
                                </div>
                            </div>
                            <button
                                onClick={handleWhatsAppBooking}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Reservar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccommodationDetailsModal;
