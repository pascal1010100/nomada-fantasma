'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MessageSquare,
  Send,
  User,
  Mail,
  Phone,
  Clock3,
  Users,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { trackEvent } from '../../../lib/analytics';

type GuideBookingService = {
  id: string;
  title: string;
  priceLabel?: string | null;
  description?: string | null;
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideId?: string;
  guideName: string;
  guidePhone: string;
  guideTown?: string;
  services: GuideBookingService[];
}

type FormErrors = {
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  timePreference: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string | undefined | null): boolean {
  if (!value) return false;
  return UUID_REGEX.test(value.trim());
}

function buildFallbackWhatsappUrl(
  guidePhone: string,
  guideName: string,
  serviceTitle: string,
  formData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    timePreference: string;
    guests: number;
    notes: string;
  }
) {
  const text = [
    `Hola ${guideName}, soy ${formData.name}.`,
    `Quiero reservar: ${serviceTitle}.`,
    `Fecha: ${formData.date}.`,
    `Horario preferido: ${formData.timePreference}.`,
    `Personas: ${formData.guests}.`,
    `Email: ${formData.email}.`,
    `WhatsApp: ${formData.phone}.`,
    formData.notes ? `Notas: ${formData.notes}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `https://wa.me/${guidePhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export default function BookingModal({
  isOpen,
  onClose,
  guideId,
  guideName,
  guidePhone,
  guideTown,
  services,
}: BookingModalProps) {
  const locale = useLocale();
  const isEnglish = locale.startsWith('en');

  const copy = useMemo(
    () => ({
      title: isEnglish ? `Reserve with ${guideName}` : `Reserva con ${guideName}`,
      subtitle: isEnglish
        ? 'Choose the experience, tell us your date and we will coordinate the next steps.'
        : 'Elige la experiencia, comparte tu fecha y coordinaremos contigo los siguientes pasos.',
      experience: isEnglish ? 'Experience' : 'Experiencia',
      bookingDetails: isEnglish ? 'Booking details' : 'Detalles de la reserva',
      contactDetails: isEnglish ? 'Contact details' : 'Datos de contacto',
      serviceRequired: isEnglish ? 'Choose one of the guide services.' : 'Elige uno de los servicios del guía.',
      name: isEnglish ? 'Full name' : 'Nombre completo',
      email: 'Email',
      phone: isEnglish ? 'WhatsApp number' : 'Número de WhatsApp',
      date: isEnglish ? 'Preferred date' : 'Fecha deseada',
      guests: isEnglish ? 'Travelers' : 'Personas',
      time: isEnglish ? 'Preferred time' : 'Horario preferido',
      notes: isEnglish ? 'Special notes' : 'Notas especiales',
      optional: isEnglish ? 'Optional' : 'Opcional',
      summary: isEnglish ? 'Reservation summary' : 'Resumen de la solicitud',
      nextStep: isEnglish ? 'What happens next' : 'Qué sigue ahora',
      nextStepBody: isEnglish
        ? 'We review availability with the guide, then confirm payment options and final logistics by email.'
        : 'Revisamos disponibilidad con el guía, luego confirmamos las opciones de pago y la logística final por correo.',
      submit: isEnglish ? 'Request booking' : 'Solicitar reserva',
      submitSending: isEnglish ? 'Sending request...' : 'Enviando solicitud...',
      submitWhatsapp: isEnglish ? 'Open WhatsApp request' : 'Abrir solicitud en WhatsApp',
      success: isEnglish
        ? 'Your request has been received. We will confirm availability and payment by email.'
        : 'Recibimos tu solicitud. Confirmaremos disponibilidad y pago por correo.',
      fallbackNote: isEnglish
        ? 'This guide is still finishing setup inside the platform, so we will open WhatsApp to avoid losing the request.'
        : 'Este guía aún está terminando su configuración en la plataforma, así que abriremos WhatsApp para no perder tu solicitud.',
      morning: isEnglish ? 'Morning' : 'Mañana',
      afternoon: isEnglish ? 'Afternoon' : 'Tarde',
      sunrise: isEnglish ? 'Sunrise / early' : 'Temprano / amanecer',
      flexible: isEnglish ? 'Flexible' : 'Flexible',
      invalidEmail: isEnglish ? 'Enter a valid email.' : 'Ingresa un correo válido.',
      requiredField: isEnglish ? 'This field is required.' : 'Este campo es obligatorio.',
      invalidPhone: isEnglish ? 'Enter a valid WhatsApp number.' : 'Ingresa un número de WhatsApp válido.',
      futureDate: isEnglish ? 'Choose a future date.' : 'Elige una fecha futura.',
      validGuests: isEnglish ? 'Choose between 1 and 20 travelers.' : 'Elige entre 1 y 20 personas.',
      noPrice: isEnglish ? 'Price confirmed after availability review' : 'Precio confirmado tras revisar disponibilidad',
      townLabel: isEnglish ? 'Base in' : 'Base en',
      serviceSummary: isEnglish ? 'Selected service' : 'Servicio elegido',
      serviceDescription: isEnglish ? 'Service overview' : 'Resumen del servicio',
      priceLabel: isEnglish ? 'Estimated price' : 'Precio estimado',
      serviceStatus: isEnglish ? 'We will confirm final logistics after checking availability.' : 'Confirmaremos la logística final tras revisar disponibilidad.',
    }),
    [guideName, isEnglish]
  );

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: services[0]?.id ?? '',
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: 2,
    timePreference: isEnglish ? 'Morning' : 'Mañana',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    serviceId: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    timePreference: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        serviceId: services[0]?.id ?? '',
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: 2,
        timePreference: isEnglish ? 'Morning' : 'Mañana',
        notes: '',
      });
      setErrors({
        serviceId: '',
        name: '',
        email: '',
        phone: '',
        date: '',
        guests: '',
        timePreference: '',
      });
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  }, [isEnglish, isOpen, services]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const selectedService =
    services.find((service) => service.id === formData.serviceId) ?? services[0] ?? null;
  const canUseInternalReservation =
    isUuid(guideId) && Boolean(selectedService && isUuid(selectedService.id));
  const guideInitial = guideName.trim().charAt(0).toUpperCase();

  const validateForm = () => {
    const nextErrors: FormErrors = {
      serviceId: '',
      name: '',
      email: '',
      phone: '',
      date: '',
      guests: '',
      timePreference: '',
    };

    let isValid = true;

    if (!formData.serviceId) {
      nextErrors.serviceId = copy.serviceRequired;
      isValid = false;
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      nextErrors.name = copy.requiredField;
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = copy.invalidEmail;
      isValid = false;
    }

    if (formData.phone.replace(/\D/g, '').length < 8) {
      nextErrors.phone = copy.invalidPhone;
      isValid = false;
    }

    if (!formData.date) {
      nextErrors.date = copy.requiredField;
      isValid = false;
    } else {
      const selectedDate = new Date(`${formData.date}T12:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() <= today.getTime()) {
        nextErrors.date = copy.futureDate;
        isValid = false;
      }
    }

    if (formData.guests < 1 || formData.guests > 20) {
      nextErrors.guests = copy.validGuests;
      isValid = false;
    }

    if (!formData.timePreference.trim()) {
      nextErrors.timePreference = copy.requiredField;
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm() || !selectedService) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    trackEvent('complete_booking', {
      guide: guideName,
      guide_service: selectedService.title,
      guests: formData.guests,
      date: formData.date,
    });

    if (!canUseInternalReservation) {
      trackEvent('contact_guide_whatsapp', {
        guide: guideName,
        guide_service: selectedService.title,
        source: 'missing_internal_ids',
      });
      const whatsappUrl = buildFallbackWhatsappUrl(guidePhone, guideName, selectedService.title, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        timePreference: formData.timePreference,
        guests: formData.guests,
        notes: formData.notes.trim(),
      });
      window.open(whatsappUrl, '_blank');
      setSuccessMessage(copy.fallbackNote);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'guide',
          guideId: guideId,
          guideServiceId: selectedService.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          date: formData.date,
          time: formData.timePreference,
          guests: formData.guests,
          totalPrice: null,
          notes: [
            `Guide service: ${selectedService.title}`,
            formData.notes.trim() ? `Notes: ${formData.notes.trim()}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message =
          payload?.error ||
          (isEnglish ? 'Unable to create guide reservation.' : 'No se pudo crear la reserva del guía.');

        if (response.status >= 500) {
          throw new Error(message);
        }

        setSuccessMessage(message);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(copy.success);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (error) {
      trackEvent('contact_guide_whatsapp', {
        guide: guideName,
        guide_service: selectedService.title,
        source: 'reservation_api_error',
      });
      const whatsappUrl = buildFallbackWhatsappUrl(guidePhone, guideName, selectedService.title, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        timePreference: formData.timePreference,
        guests: formData.guests,
        notes: formData.notes.trim(),
      });
      window.open(whatsappUrl, '_blank');
      setSuccessMessage(
        error instanceof Error && error.message
          ? `${error.message} ${copy.fallbackNote}`
          : copy.fallbackNote
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            className="relative z-10 my-6 flex w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-cyan-500/15 bg-slate-950/95 shadow-2xl shadow-black/50 sm:my-8 sm:max-h-[calc(100vh-4rem)]"
          >
            <div className="border-b border-white/6 bg-white/[0.02] px-6 py-5 sm:px-7">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition-colors hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="space-y-2">
                {guideTown ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    <MapPin className="h-3.5 w-3.5" />
                    {copy.townLabel} {guideTown}
                  </div>
                ) : null}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(103,232,249,0.28),transparent_32%),linear-gradient(135deg,rgba(56,189,248,0.14),rgba(168,85,247,0.16))] text-2xl font-bold text-cyan-100">
                    {guideInitial}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white sm:text-[2rem]">{copy.title}</h3>
                    <p className="max-w-2xl text-sm leading-6 text-slate-300">{copy.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-6">
                <section className="rounded-2xl border border-cyan-400/10 bg-cyan-500/[0.05] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        {isEnglish ? 'Estimated price' : 'Precio estimado'}
                      </p>
                      <div className="mt-1 text-2xl font-bold text-cyan-200">
                        {selectedService?.priceLabel || copy.noPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-400">{copy.guests}</p>
                      <div className="mt-1 text-lg font-semibold text-white">{formData.guests}</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {copy.nextStep}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{copy.nextStepBody}</p>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
                    {copy.experience}
                  </div>
                  <div className="grid gap-3">
                    {services.map((service) => {
                      const selected = service.id === formData.serviceId;
                      return (
                        <label
                          key={service.id}
                          className={`cursor-pointer rounded-2xl border px-4 py-4 transition-all ${
                            selected
                              ? 'border-cyan-400/35 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.16)]'
                              : 'border-white/8 bg-white/[0.03] hover:border-cyan-400/18'
                          }`}
                        >
                          <input
                            type="radio"
                            name="service"
                            value={service.id}
                            checked={selected}
                            onChange={() => setFormData((prev) => ({ ...prev, serviceId: service.id }))}
                            className="sr-only"
                          />
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-semibold text-white">{service.title}</p>
                              {service.description ? (
                                <p className="mt-1 text-sm leading-6 text-slate-400">{service.description}</p>
                              ) : null}
                            </div>
                            <div className="shrink-0 self-start rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                              {service.priceLabel || copy.noPrice}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.serviceId ? <p className="text-sm text-rose-300">{errors.serviceId}</p> : null}
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
                      {copy.bookingDetails}
                    </div>
                    <div className="rounded-2xl border border-cyan-400/12 bg-cyan-500/[0.05] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {copy.serviceSummary}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {selectedService?.title ?? '-'}
                          </p>
                          {selectedService?.description ? (
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {selectedService.description}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {copy.serviceStatus}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          {selectedService?.priceLabel || copy.noPrice}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>{copy.date}</span>
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          />
                        </div>
                        {errors.date ? <span className="text-xs text-rose-300">{errors.date}</span> : null}
                      </label>

                      <label className="space-y-2 text-sm text-slate-300">
                        <span>{copy.guests}</span>
                        <div className="relative">
                          <Users className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={formData.guests}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                guests: Number.parseInt(e.target.value || '1', 10),
                              }))
                            }
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          />
                        </div>
                        {errors.guests ? <span className="text-xs text-rose-300">{errors.guests}</span> : null}
                      </label>

                      <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                        <span>{copy.time}</span>
                        <div className="relative">
                          <Clock3 className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <select
                            value={formData.timePreference}
                            onChange={(e) => setFormData((prev) => ({ ...prev, timePreference: e.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          >
                            <option value={copy.morning}>{copy.morning}</option>
                            <option value={copy.afternoon}>{copy.afternoon}</option>
                            <option value={copy.sunrise}>{copy.sunrise}</option>
                            <option value={copy.flexible}>{copy.flexible}</option>
                          </select>
                        </div>
                        {errors.timePreference ? <span className="text-xs text-rose-300">{errors.timePreference}</span> : null}
                      </label>
                    </div>
                  </section>

                  <section className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <User className="h-3.5 w-3.5 text-cyan-300" />
                      {copy.contactDetails}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                        <span>{copy.name}</span>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          />
                        </div>
                        {errors.name ? <span className="text-xs text-rose-300">{errors.name}</span> : null}
                      </label>
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>{copy.email}</span>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          />
                        </div>
                        {errors.email ? <span className="text-xs text-rose-300">{errors.email}</span> : null}
                      </label>
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>{copy.phone}</span>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                          />
                        </div>
                        {errors.phone ? <span className="text-xs text-rose-300">{errors.phone}</span> : null}
                      </label>
                      <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                        <span>
                          {copy.notes} <span className="text-slate-500">({copy.optional})</span>
                        </span>
                        <div className="relative">
                          <MessageSquare className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-slate-500" />
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            className="min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-900/80 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                            placeholder={
                              isEnglish
                                ? 'Level, preferences, allergies, special context...'
                                : 'Nivel, preferencias, alergias, contexto especial...'
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </section>
                </div>

                <section className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {copy.summary}
                  </div>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">{copy.experience}</span>
                      <span className="text-right text-white">{selectedService?.title ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">{copy.date}</span>
                      <span className="text-right text-white">{formData.date || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">{copy.guests}</span>
                      <span className="text-right text-white">{formData.guests}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">{copy.time}</span>
                      <span className="text-right text-white">{formData.timePreference}</span>
                    </div>
                  </div>

                  {successMessage ? (
                    <p className="rounded-xl border border-cyan-400/15 bg-cyan-500/10 px-4 py-3 text-sm leading-6 text-cyan-100">
                      {successMessage}
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-slate-400">
                      {canUseInternalReservation ? copy.nextStepBody : copy.fallbackNote}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-cta shimmer inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting
                      ? copy.submitSending
                      : canUseInternalReservation
                        ? copy.submit
                        : copy.submitWhatsapp}
                  </button>
                </section>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
