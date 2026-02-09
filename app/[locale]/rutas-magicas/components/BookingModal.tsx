'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MessageSquare, Send, User } from 'lucide-react';
import { trackEvent } from '../../../lib/analytics';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    guideName: string;
    guidePhone: string; // Should be full number with country code, e.g., "50212345678"
}

export default function BookingModal({ isOpen, onClose, guideName, guidePhone }: BookingModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        guests: 2,
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        date: '',
        guests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', date: '', guests: 2, message: '' });
            setErrors({ name: '', date: '', guests: '' });
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors = { name: '', date: '', guests: '' };
        let isValid = true;

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'El nombre debe tener al menos 2 caracteres';
            isValid = false;
        }

        // Validate date
        if (!formData.date) {
            newErrors.date = 'La fecha es requerida';
            isValid = false;
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

            if (selectedDate < today) {
                newErrors.date = 'La fecha no puede ser en el pasado';
                isValid = false;
            } else if (selectedDate > sixMonthsFromNow) {
                newErrors.date = 'La fecha no puede ser más de 6 meses en el futuro';
                isValid = false;
            }
        }

        // Validate guests
        if (formData.guests < 1) {
            newErrors.guests = 'Debe haber al menos 1 persona';
            isValid = false;
        } else if (formData.guests > 20) {
            newErrors.guests = 'Máximo 20 personas por reserva';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Construct WhatsApp message
        const text = `Hola ${guideName}, soy ${formData.name}. Me gustaría reservar un tour para el ${formData.date} con ${formData.guests} personas. ${formData.message ? `Nota: ${formData.message}` : ''}`;
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/${guidePhone.replace(/\D/g, '')}?text=${encodedText}`;

        // Track event
        trackEvent('complete_booking', {
            guide: guideName,
            guests: formData.guests,
            date: formData.date
        });

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Small delay before closing to show success state
        setTimeout(() => {
            onClose();
        }, 500);
    };

    // Lock body scroll when modal is open
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

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto bg-gray-900 border border-cyan-500/30 rounded-2xl shadow-2xl z-10"
                    >
                        {/* Header */}
                        <div className="relative p-6 border-b border-gray-800 bg-gray-900/50">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-xl font-bold text-white">Reservar con {guideName}</h3>
                            <p className="text-sm text-cyan-400 mt-1">Coordina tu aventura directamente</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <User className="w-4 h-4 text-cyan-400" /> Tu Nombre
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    className={`w-full bg-gray-800/50 border rounded-lg px-4 py-2.5 text-white focus:ring-2 outline-none transition-all ${errors.name
                                        ? 'border-red-400 focus:ring-red-400'
                                        : 'border-gray-700 focus:ring-cyan-500/50 focus:border-cyan-500'
                                        }`}
                                    placeholder="Ej. Juan Pérez"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-300">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-cyan-400" /> Fecha
                                    </label>
                                    <input
                                        required
                                        type="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) => {
                                            setFormData({ ...formData, date: e.target.value });
                                            if (errors.date) setErrors({ ...errors, date: '' });
                                        }}
                                        className={`w-full bg-gray-800/50 border rounded-lg px-4 py-2.5 text-white focus:ring-2 outline-none transition-all ${errors.date
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-700 focus:ring-cyan-500/50 focus:border-cyan-500'
                                            }`}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-300">{errors.date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-cyan-400" /> Personas
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        id="guests"
                                        min="1"
                                        max="20"
                                        value={formData.guests}
                                        onChange={(e) => {
                                            setFormData({ ...formData, guests: parseInt(e.target.value) || 1 });
                                            if (errors.guests) setErrors({ ...errors, guests: '' });
                                        }}
                                        className={`w-full bg-gray-800/50 border rounded-lg px-4 py-2.5 text-white focus:ring-2 outline-none transition-all ${errors.guests
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-700 focus:ring-cyan-500/50 focus:border-cyan-500'
                                            }`}
                                    />
                                    {errors.guests && (
                                        <p className="mt-1 text-sm text-red-300">{errors.guests}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-cyan-400" /> Mensaje (Opcional)
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all min-h-[80px]"
                                    placeholder="¿Alguna preferencia especial?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Enviar Solicitud por WhatsApp
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Se abrirá WhatsApp con los detalles de tu reserva.
                            </p>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
