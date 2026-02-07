'use client';

import React from 'react';
import { Calendar, Moon, Users, MessageCircle } from 'lucide-react';

interface BookingFormProps {
    pricePerNight?: number;
    contact?: string;
    bookingUrl?: string;
    accommodationName: string;
}

export default function BookingForm({ pricePerNight, contact, bookingUrl, accommodationName }: BookingFormProps) {
    const [checkIn, setCheckIn] = React.useState('');
    const [checkOut, setCheckOut] = React.useState('');
    const [guests, setGuests] = React.useState(1);

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
    const total = subtotal;

    const handleWhatsAppBooking = () => {
        if (!contact) return;
        const cleanNumber = contact.replace(/\D/g, '');

        let message = `Hola, vi *${accommodationName}* en Nómada Fantasma.`;

        if (isValidDates) {
            message += `\n\nMe gustaría consultar disponibilidad para:\n🗓 *Entrada:* ${checkIn}\n🗓 *Salida:* ${checkOut}\n🌙 *Duración:* ${nights} noches\n👥 *Huéspedes:* ${guests}`;

            if (pricePerNight) {
                message += `\n\n💰 *Estimado:* Q${total} (Q${pricePerNight}/noche x ${nights} noches)`;
            }
        } else {
            message += `\n\nMe gustaría más información sobre disponibilidad y precios.`;
        }

        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (bookingUrl) {
        return (
            <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-center transition-all"
            >
                Reservar Online
            </a>
        );
    }

    return (
        <div className="space-y-4">
            {pricePerNight && (
                <div className="text-center pb-4 border-b border-white/10">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        Q{pricePerNight}
                    </div>
                    <div className="text-xs text-gray-500">por noche</div>
                </div>
            )}

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

            {/* Nights & Guests */}
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
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Q{pricePerNight} x {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                        <span className="text-white font-medium">Q{subtotal}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            Q{total}
                        </span>
                    </div>
                </div>
            )}

            {/* CTA Button */}
            <button
                onClick={handleWhatsAppBooking}
                disabled={!isValidDates}
                className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${isValidDates
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
            >
                <MessageCircle className="w-5 h-5" />
                <span>
                    {isValidDates ? (pricePerNight ? `Reservar • Q${total}` : `Consultar (${nights} noches)`) : 'Selecciona Fechas'}
                </span>
            </button>
        </div>
    );
}
