'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Loader2, CheckCircle2, AlertCircle, ChevronDown, Info, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../../../lib/analytics';
import { useTranslations, useLocale } from 'next-intl';
import { formatTourTimeDisplay } from '@/app/lib/tours';
import {
  calculateBookingTotal,
  resolveBookingOptionConfig,
} from '@/app/lib/tour-booking-options';
import type { BookingOptionConfig as BookingOption } from '@/app/lib/tour-booking-options';

type ReservationFormProps = {
  tourId: string;
  tourName?: string;
  price: number;
  childPrice?: number;
  minCapacity?: number;
  maxCapacity: number;
  availableDays: string[];
  startTimes?: string[];
  pickupTime?: string;
  bookingOptions?: BookingOption[];
};

export default function ReservationForm({
  tourId,
  tourName,
  price,
  minCapacity = 1,
  maxCapacity,
  availableDays,
  startTimes = [],
  pickupTime,
  bookingOptions = [],
}: ReservationFormProps) {
  const router = useRouter();
  const t = useTranslations('Reservation');
  const locale = useLocale();
  const dateLocale = locale === 'es' ? 'es-GT' : 'en-US';
  const normalizedBookingOptions = useMemo(
    () => bookingOptions.filter((option) => option && option.id && option.name),
    [bookingOptions]
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(normalizedBookingOptions[0]?.id ?? null);
  const selectedOption = useMemo(
    () => normalizedBookingOptions.find((option) => option.id === selectedOptionId) ?? normalizedBookingOptions[0] ?? null,
    [normalizedBookingOptions, selectedOptionId]
  );
  const optionConfig = useMemo(
    () => resolveBookingOptionConfig({
      option: selectedOption,
      availableDays,
      startTimes,
      pickupTime,
      minCapacity,
      maxCapacity,
    }),
    [selectedOption, availableDays, startTimes, pickupTime, minCapacity, maxCapacity]
  );
  const selectedAvailabilityMode = optionConfig.availabilityMode;
  const activeAvailableDays = optionConfig.availableDates;
  const activeAvailableDaysKey = useMemo(
    () => activeAvailableDays.join('|'),
    [activeAvailableDays]
  );
  const activeStartTimes = optionConfig.startTimes;
  const activeStartTimesKey = useMemo(
    () => activeStartTimes.join('|'),
    [activeStartTimes]
  );
  const activePickupTime = optionConfig.pickupTime;
  const pickupTimeLabel = formatTourTimeDisplay(activePickupTime);
  const hasStartTimes = activeStartTimes.length > 0;
  const hasPickupWindow = Boolean(activePickupTime);
  const effectiveMinGuests = optionConfig.minGuests;
  const effectiveMaxGuests = optionConfig.maxGuests;
  const minGuests = effectiveMinGuests;
  const guestOptions = useMemo(() => {
    const maxGuests = Math.max(minGuests, effectiveMaxGuests);
    return Array.from({ length: maxGuests - minGuests + 1 }, (_, index) => minGuests + index);
  }, [effectiveMaxGuests, minGuests]);

  // Estados del formulario
  const [date, setDate] = useState(activeAvailableDays[0] || '');
  const [selectedTime, setSelectedTime] = useState(activePickupTime || activeStartTimes[0] || '');
  const [guests, setGuests] = useState(minGuests);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Efecto para reiniciar el estado cuando cambia el tour
  useEffect(() => {
    setError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialRequests: ''
    });
    setTouched({
      name: false,
      email: false,
      phone: false
    });

    // Track form view
    trackEvent('view_reservation_form', {
      tour_id: tourId,
      price: price
    });
  }, [tourId, price]);

  useEffect(() => {
    const nextDate = activeAvailableDays[0] || '';
    if (!date || !activeAvailableDays.includes(date)) {
      setDate(nextDate);
    }

    const nextTime = activePickupTime || activeStartTimes[0] || '';
    if (hasPickupWindow) {
      if (selectedTime !== nextTime) {
        setSelectedTime(nextTime);
      }
      return;
    }

    if (hasStartTimes) {
      if (!selectedTime || !activeStartTimes.includes(selectedTime)) {
        setSelectedTime(nextTime);
      }
      return;
    }

    if (selectedTime) {
      setSelectedTime('');
    }
  }, [
    activeAvailableDays,
    activeAvailableDaysKey,
    activeStartTimes,
    activeStartTimesKey,
    activePickupTime,
    hasPickupWindow,
    hasStartTimes,
    date,
    selectedTime,
  ]);

  useEffect(() => {
    setSelectedOptionId((current) => {
      if (!normalizedBookingOptions.length) {
        return null;
      }
      if (current && normalizedBookingOptions.some((option) => option.id === current)) {
        return current;
      }
      return normalizedBookingOptions[0].id;
    });
  }, [normalizedBookingOptions]);

  useEffect(() => {
    setGuests(minGuests);
  }, [selectedOptionId, minGuests]);

  // Track when user starts filling the form
  useEffect(() => {
    if (formData.name || formData.email || formData.phone) {
      trackEvent('start_reservation_form', {
        tour_id: tourId
      });
    }
  }, [formData.name, formData.email, formData.phone, tourId]);

  // Validaciones
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[0-9+()\s-]{8,20}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push(t('errors.requiredName'));
    if (!formData.email) {
      errors.push(t('errors.requiredEmail'));
    } else if (!validateEmail(formData.email)) {
      errors.push(t('errors.invalidEmail'));
    }
    if (!formData.phone) {
      errors.push(t('errors.requiredPhone'));
    } else if (!validatePhone(formData.phone)) {
      errors.push(t('errors.invalidPhone'));
    }
    if (hasStartTimes && !hasPickupWindow && !selectedTime) {
      errors.push(t('errors.requiredTime'));
    }
    if (effectiveMaxGuests < 1) {
      errors.push(t('errors.maxCapacity', { max: effectiveMaxGuests }));
    }
    if (guests < minGuests) {
      errors.push(t('errors.minCapacity', { min: minGuests }));
    }
    if (guests > effectiveMaxGuests) {
      errors.push(t('errors.maxCapacity', { max: effectiveMaxGuests }));
    }

    return errors;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Marcar como tocado para mostrar errores
    if (name in touched) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Calcular el total
  const calculateTotal = () => {
    return calculateBookingTotal(selectedOption?.price ?? price, guests, selectedOption?.pricingMode);
  };

  const reservationNotes = useMemo(() => {
    const notes = formData.specialRequests.trim();
    if (!selectedOption) {
      return notes;
    }

    const optionLine = `${t('selectedOptionNotePrefix')}: ${selectedOption.name}`;
    return notes ? `${optionLine}\n${notes}` : optionLine;
  }, [formData.specialRequests, selectedOption, t]);

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar formulario
    const errors = validateForm();

    if (errors.length > 0) {
      setError(errors[0]);
      if (!formData.name.trim()) {
        nameRef.current?.focus();
      } else if (!formData.email || !validateEmail(formData.email)) {
        emailRef.current?.focus();
      } else if (!formData.phone || !validatePhone(formData.phone)) {
        phoneRef.current?.focus();
      }

      // Track validation error
      trackEvent('reservation_validation_error', {
        tour_id: tourId,
        error: errors[0]
      });
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Track submission attempt
      trackEvent('submit_reservation', {
        tour_id: tourId,
        total: calculateTotal(),
        date: date,
        booking_option: selectedOption?.id ?? null
      });

      // Llamada real a la API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Locale': locale,
        },
        body: JSON.stringify({
          tourId,
          tourName,
          date,
          time: (activePickupTime || selectedTime) || undefined,
          guests,
          type: 'tour',
          totalPrice: calculateTotal(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: reservationNotes
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError = typeof data?.error === 'string' ? data.error : t('errorGeneric');
        const debugMessage = typeof data?.debug?.message === 'string' ? data.debug.message : '';
        const displayError = debugMessage ? `${apiError} (${debugMessage})` : apiError;
        setError(displayError);
        trackEvent('reservation_error', {
          tour_id: tourId,
          error: displayError
        });
        return;
      }

      const emailStatus =
        data?.email && typeof data.email.status === 'string'
          ? data.email.status
          : data?.email && typeof data.email.sent === 'boolean'
            ? data.email.sent
              ? 'sent'
              : 'failed'
            : 'unknown';

      // Redirigir a la página de confirmación con los parámetros necesarios
      const searchParams = new URLSearchParams({
        tourId,
        date,
        ...((activePickupTime || selectedTime) ? { time: (activePickupTime || selectedTime) } : {}),
        adults: guests.toString(),
        total: calculateTotal().toString(),
        emailSent: emailStatus,
        name: encodeURIComponent(formData.name),
        ...(selectedOption?.name ? { option: selectedOption.name } : {})
      });

      setSuccess(true);

      // Track successful reservation
      trackEvent('complete_reservation', {
        tour_id: tourId,
        total: calculateTotal(),
        booking_option: selectedOption?.id ?? null
      });

      // Redirigir después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push(`/${locale}/reservas/confirmacion?${searchParams.toString()}`);
      }, 1500);

    } catch (err) {
      setError(t('errorGeneric'));
      console.error('Error al reservar:', err);

      // Track error
      trackEvent('reservation_error', {
        tour_id: tourId,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si la reserva fue exitosa, mostrar mensaje de confirmación
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/30 dark:to-cyan-900/20 rounded-2xl border border-green-100 dark:border-green-900/50 shadow-sm"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">{t('successTitle')}</h3>
        <p className="text-green-700 dark:text-green-300 mb-6">{t('successDesc')}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <motion.div
            className="bg-green-500 h-2.5 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Encabezado */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('headerTitle')}</h3>
        <p className="text-gray-500 dark:text-gray-400">{t('headerDesc')}</p>
      </div>

      {normalizedBookingOptions.length > 0 && (
        <div className="space-y-4 border-b border-gray-200 pb-5 dark:border-gray-700">
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">{t('rideOptionTitle')}</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('rideOptionHelp')}</p>
          </div>

          <div className="grid gap-2">
            {normalizedBookingOptions.map((option) => {
              const optionMinGuests = Math.max(1, option.minGuests ?? 1);
              const isSelected = option.id === selectedOption?.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 shadow-sm dark:border-cyan-400 dark:bg-cyan-950/30'
                      : 'border-gray-200 bg-white hover:border-cyan-300 dark:border-gray-700 dark:bg-gray-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{option.name}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {optionMinGuests > 1 ? t('minimumGuestsOption', { min: optionMinGuests }) : t('soloFriendlyShort')}
                        {' · '}
                        {option.availabilityMode === 'request_based' ? t('requestBasedAvailabilityShort') : t('fixedAvailabilityShort')}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">Q{option.price.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {option.pricingMode === 'per_group' ? t('perGroup') : t('perPerson')}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedOption && (
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-900/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOption.name}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {selectedOption.description || selectedOption.durationLabel || t('optionFlexibleFallback')}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('durationLabel')}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedOption.durationLabel ?? t('optionFlexibleFallback')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('availabilityLabel')}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedOption.availabilityMode === 'request_based' ? t('requestBasedAvailabilityShort') : t('fixedAvailabilityShort')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('groupSizeLabel')}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {Math.max(1, selectedOption.minGuests ?? 1) > 1
                      ? t('minimumGuestsOption', { min: Math.max(1, selectedOption.minGuests ?? 1) })
                      : t('soloFriendlyShort')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-cyan-600" />
            {t('dateLabel')}
          </label>
          <div className="relative">
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {activeAvailableDays.map((day, index) => {
                const dateObj = new Date(`${day}T00:00:00`);

                return (
                  <option key={index} value={day}>
                    {dateObj.toLocaleDateString(dateLocale, {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                    {`, ${dateObj.toLocaleDateString(dateLocale, { year: 'numeric' })}`}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {selectedAvailabilityMode === 'request_based' ? t('dateHelpFlexible') : t('dateHelp')}
          </p>
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-cyan-600" />
            {t('timeLabel')}
          </label>
          <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm">
            {hasPickupWindow ? (
              <div className="w-full bg-transparent text-sm">
                {t('pickupWindowValue', { time: pickupTimeLabel })}
              </div>
            ) : hasStartTimes ? (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
                disabled={isLoading}
              >
                {activeStartTimes.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption}
                  </option>
                ))}
              </select>
            ) : (
              t('timeToConfirm')
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {hasPickupWindow ? t('pickupWindowHelp') : hasStartTimes ? t('timeHelpSelectable') : t('timeHelpFlexible')}
          </p>
        </div>
      </div>

      {/* Participantes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
            <User className="w-4 h-4 mr-2 text-cyan-600" />
            {t('adultsLabel')}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            disabled={isLoading}
          >
            {guestOptions.map((guestCount) => (
              <option key={guestCount} value={guestCount}>
                {guestCount} {guestCount === 1 ? t('adultsSingular') : t('adultsPlural')}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('guestRangeHelp', { min: minGuests, max: effectiveMaxGuests })}
          </p>
        </div>
      </div>

      {/* Información del Contacto */}
      <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Info className="w-5 h-5 mr-2 text-cyan-600" />
          {t('contactTitle')}
        </h3>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('nameLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                ref={nameRef}
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                className={`w-full rounded-xl border ${touched.name && !formData.name.trim()
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder={t('namePlaceholder')}
                disabled={isLoading}
                aria-invalid={touched.name && !formData.name.trim()}
                aria-describedby={touched.name && !formData.name.trim() ? 'name-error' : undefined}
              />
              {touched.name && !formData.name.trim() && (
                <p id="name-error" className="mt-1 text-sm text-red-600">{t('nameErrorRequired')}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('emailLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-xl border ${touched.email && (!formData.email || !validateEmail(formData.email))
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder={t('emailPlaceholder')}
                disabled={isLoading}
                aria-invalid={touched.email && (!formData.email || !validateEmail(formData.email))}
                aria-describedby={touched.email && (!formData.email || !validateEmail(formData.email)) ? 'email-error' : undefined}
              />
              {touched.email && (!formData.email || !validateEmail(formData.email)) && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {!formData.email ? t('emailErrorRequired') : t('emailErrorInvalid')}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('phoneLabel')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                ref={phoneRef}
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full rounded-xl border ${touched.phone && (!formData.phone || !validatePhone(formData.phone))
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder={t('phonePlaceholder')}
                disabled={isLoading}
                aria-invalid={touched.phone && (!formData.phone || !validatePhone(formData.phone))}
                aria-describedby={touched.phone && (!formData.phone || !validatePhone(formData.phone)) ? 'phone-error' : undefined}
              />
              {touched.phone && (!formData.phone || !validatePhone(formData.phone)) && (
                <p id="phone-error" className="mt-1 text-sm text-red-600">
                  {!formData.phone ? t('phoneErrorRequired') : t('phoneErrorInvalid')}
                </p>
              )}
            </div>
          </div>

          {/* Solicitudes especiales */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('specialLabel')}
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder={t('specialPlaceholder')}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Resumen del precio */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {selectedOption?.name ?? t('summaryTotal')}
          </p>
          <div className="mt-2 flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
            {selectedOption?.pricingMode === 'per_group'
              ? selectedOption.name
              : `${guests} ${guests === 1 ? t('adultsSingular') : t('adultsPlural')}`}
            </span>
            <span className="font-medium">Q{calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
          <div className="flex justify-between font-semibold">
            <span>{t('summaryTotal')}</span>
            <span>Q{calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Botón de reserva */}
      <button
        type="submit"
        disabled={
          isLoading ||
          !formData.name.trim() ||
          !formData.email ||
          !validateEmail(formData.email) ||
          !formData.phone ||
          !validatePhone(formData.phone) ||
          (hasStartTimes && !hasPickupWindow && !selectedTime) ||
          guests < minGuests ||
          maxCapacity < 1
        }
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {t('submitProcessing')}
          </>
        ) : (
          t('submitCta')
        )}
      </button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        {t('footerCancelation')}
      </p>
    </motion.form>
  );
}
