'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Loader2, CheckCircle2, AlertCircle, ChevronDown, Info, User, User2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../../lib/analytics';

type ReservationFormProps = {
  tourId: string;
  price: number;
  childPrice?: number;
  maxCapacity: number;
  availableDays: string[];
  startTimes: string[];
};

export default function ReservationForm({
  tourId,
  price,
  childPrice,
  maxCapacity,
  availableDays,
  startTimes
}: ReservationFormProps) {
  const router = useRouter();

  // Estados del formulario
  const [date, setDate] = useState(availableDays[0] || '');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState(startTimes[0] || '');
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

  // Efecto para reiniciar el estado cuando cambia el tour
  useEffect(() => {
    setDate(availableDays[0] || '');
    setSelectedTime(startTimes[0] || '');
    setAdults(1);
    setChildren(0);
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
  }, [tourId, availableDays, startTimes, price]);

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
    const re = /^[0-9\-\+\(\)\s]{8,20}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push('El nombre es obligatorio');
    if (!formData.email) {
      errors.push('El correo electrónico es obligatorio');
    } else if (!validateEmail(formData.email)) {
      errors.push('Ingresa un correo electrónico válido');
    }
    if (!formData.phone) {
      errors.push('El teléfono es obligatorio');
    } else if (!validatePhone(formData.phone)) {
      errors.push('Ingresa un número de teléfono válido');
    }
    if (adults + children > maxCapacity) {
      errors.push(`La capacidad máxima es de ${maxCapacity} personas`);
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    let total = adults * price;
    if (childPrice && children > 0) {
      total += children * childPrice;
    }
    return total;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar formulario
    const errors = validateForm();

    if (errors.length > 0) {
      setError(errors[0]);
      setIsSubmitting(false);

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
        adults: adults,
        children: children,
        total: calculateTotal(),
        date: date
      });

      // Llamada real a la API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId,
          date,
          time: selectedTime,
          adults,
          children: children || 0,
          totalPrice: calculateTotal(),
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la reserva');
      }

      // Redirigir a la página de confirmación con los parámetros necesarios
      const searchParams = new URLSearchParams({
        tourId,
        date,
        time: selectedTime,
        adults: adults.toString(),
        children: children.toString(),
        total: calculateTotal().toString(),
        name: encodeURIComponent(formData.name)
      });

      setSuccess(true);

      // Track successful reservation
      trackEvent('complete_reservation', {
        tour_id: tourId,
        adults: adults,
        children: children,
        total: calculateTotal()
      });

      // Redirigir después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push(`/reservas/confirmacion?${searchParams.toString()}`);
      }, 1500);

    } catch (err) {
      setError('Ocurrió un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
      console.error('Error al reservar:', err);

      // Track error
      trackEvent('reservation_error', {
        tour_id: tourId,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
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
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">¡Reserva en Proceso!</h3>
        <p className="text-green-700 dark:text-green-300 mb-6">Estamos procesando tu solicitud de reserva.</p>
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
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reserva Ahora</h3>
        <p className="text-gray-500 dark:text-gray-400">Completa el formulario para asegurar tu lugar</p>
      </div>

      {/* Precio */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 p-5 rounded-xl border border-cyan-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Precio por adulto</p>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">${price.toLocaleString()}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ persona</span>
            </div>
          </div>
          {childPrice && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Precio niño</p>
              <div className="text-cyan-600 dark:text-cyan-400 font-medium">
                ${childPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total estimado:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-cyan-600" />
            Fecha del tour
          </label>
          <div className="relative">
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {availableDays.map((day, index) => {
                const dateObj = new Date(day);
                const today = new Date();
                const isToday = dateObj.toDateString() === today.toDateString();

                return (
                  <option key={index} value={day}>
                    {isToday
                      ? 'Hoy'
                      : dateObj.toLocaleDateString('es-GT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    {!isToday && `, ${dateObj.toLocaleDateString('es-GT', { year: 'numeric' })}`}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hora */}
        {startTimes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-cyan-600" />
              Hora de inicio
            </label>
            <div className="relative">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                {startTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adultos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
            <User className="w-4 h-4 mr-2 text-cyan-600" />
            Adultos
            <span className="text-xs text-gray-400 ml-1">(13+ años)</span>
          </label>
          <div className="relative">
            <select
              value={adults}
              onChange={(e) => {
                setAdults(Number(e.target.value));
                // Ajustar niños si se excede la capacidad máxima
                if (Number(e.target.value) + children > maxCapacity) {
                  setChildren(Math.max(0, maxCapacity - Number(e.target.value)));
                }
              }}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(num => (
                <option key={`adult-${num}`} value={num}>
                  {num} {num === 1 ? 'adulto' : 'adultos'}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Niños */}
        {childPrice && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center">
              <User2 className="w-4 h-4 mr-2 text-cyan-600" />
              Niños
              <span className="text-xs text-gray-400 ml-1">(4-12 años)</span>
            </label>
            <div className="relative">
              <select
                value={children}
                onChange={(e) => {
                  const newChildren = Number(e.target.value);
                  setChildren(newChildren);
                  // Ajustar adultos si se excede la capacidad máxima
                  if (adults + newChildren > maxCapacity) {
                    setAdults(Math.max(1, maxCapacity - newChildren));
                  }
                }}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm appearance-none pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                {Array.from({ length: maxCapacity + 1 }, (_, i) => i).map(num => (
                  <option key={`child-${num}`} value={num}>
                    {num} {num === 1 ? 'niño' : 'niños'}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información del Contacto */}
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-cyan-600" />
          Información de contacto
        </h3>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                className={`w-full rounded-xl border ${touched.name && !formData.name.trim()
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder="Tu nombre completo"
                disabled={isLoading}
              />
              {touched.name && !formData.name.trim() && (
                <p className="mt-1 text-sm text-red-600">Por favor ingresa tu nombre</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-xl border ${touched.email && (!formData.email || !validateEmail(formData.email))
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder="tucorreo@ejemplo.com"
                disabled={isLoading}
              />
              {touched.email && (!formData.email || !validateEmail(formData.email)) && (
                <p className="mt-1 text-sm text-red-600">
                  {!formData.email ? 'Por favor ingresa tu correo electrónico' : 'Ingresa un correo electrónico válido'}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full rounded-xl border ${touched.phone && (!formData.phone || !validatePhone(formData.phone))
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm transition-all`}
                placeholder="Ej: 502 1234 5678"
                disabled={isLoading}
              />
              {touched.phone && (!formData.phone || !validatePhone(formData.phone)) && (
                <p className="mt-1 text-sm text-red-600">
                  {!formData.phone ? 'Por favor ingresa tu número de teléfono' : 'Ingresa un número de teléfono válido'}
                </p>
              )}
            </div>
          </div>

          {/* Solicitudes especiales */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Solicitudes especiales (opcional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Alergias, movilidad reducida, preferencias alimenticias, etc."
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Resumen del precio */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            {adults} {adults === 1 ? 'adulto' : 'adultos'}
          </span>
          <span className="font-medium">${(adults * price).toLocaleString()}</span>
        </div>

        {childPrice && children > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              {children} {children === 1 ? 'niño' : 'niños'}
            </span>
            <span className="font-medium">${(children * childPrice).toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${calculateTotal().toLocaleString()}</span>
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
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          'Reservar ahora'
        )}
      </button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Cancelación gratuita hasta 24 horas antes
      </p>
    </motion.form>
  );
}
