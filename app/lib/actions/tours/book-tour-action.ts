'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/app/lib/supabase/server';
import { CreateReservationSchema, sanitizeReservationInput } from '@/app/lib/validations';
import { sendTourConfirmationEmails } from '@/app/lib/email';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Database } from '@/types/database.types';

type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
type ReservationRow = Database['public']['Tables']['reservations']['Row'];

// Define el tipo para el estado de la acción
export type FormState = {
  message: string;
  success: boolean;
  errors?: z.ZodIssue[];
};

export async function bookTourAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const locale = await getLocale();
  const t = await getTranslations('ReservationForm');

  // 1. Extraer y convertir datos del FormData
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    country: formData.get('country'),
    date: formData.get('date'),
    guests: formData.get('guests'),
    notes: formData.get('notes'),
    tourId: formData.get('tourId'),
    tourName: formData.get('tourName'),
    totalPrice: formData.get('totalPrice'),
    type: 'tour', // Forzar el tipo a 'tour'
  };

  const processedData = {
    ...rawData,
    guests: rawData.guests ? parseInt(rawData.guests as string, 10) : undefined,
    totalPrice: rawData.totalPrice ? parseFloat(rawData.totalPrice as string) : undefined,
  };

  // 2. Validar los datos con Zod
  const validation = CreateReservationSchema.safeParse(processedData);

  if (!validation.success) {
    return {
      message: t('error.validation'),
      success: false,
      errors: validation.error.issues,
    };
  }

  const sanitizedData = sanitizeReservationInput(validation.data);
  const dataToInsert: ReservationInsert = {
    customer_name: sanitizedData.customer_name,
    customer_email: sanitizedData.customer_email,
    customer_phone: sanitizedData.customer_phone,
    customer_country: sanitizedData.customer_country,
    reservation_date: sanitizedData.reservation_date,
    guests: sanitizedData.guests,
    reservation_type: sanitizedData.reservation_type,
    tour_id: sanitizedData.tour_id,
    accommodation_id: sanitizedData.accommodation_id,
    guide_id: sanitizedData.guide_id,
    tour_name: sanitizedData.tour_name,
    total_price: sanitizedData.total_price,
    customer_notes: sanitizedData.customer_notes,
  };

  // 3. Insertar en la base de datos
  const { data: reservation, error: dbError } = await supabaseAdmin
    .from('reservations')
    .insert(dataToInsert)
    .select()
    .single<ReservationRow>();

  if (dbError || !reservation) {
    console.error('Database Error:', dbError);
    return {
      message: t('error.database'),
      success: false,
    };
  }

  // 4. Enviar correo de confirmación
  try {
    const tEmail = await getTranslations('ReservationEmail');
    const dateLocale = locale === 'en' ? 'en-US' : 'es-GT';
    const result = await sendTourConfirmationEmails({
      to: validation.data.email,
      reservationId: reservation.id,
      customerName: validation.data.name,
      tourName: validation.data.tourName || 'Tour',
      date: new Date(validation.data.date).toLocaleDateString(dateLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      guests: validation.data.guests,
      totalPrice: validation.data.totalPrice || 0,
      t: tEmail,
    });
    if (!result.success) {
      console.warn('Email failed but booking was saved to DB');
    }
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    // No devolver un error al cliente si solo falla el email
  }

  // 5. Devolver éxito
  return {
    message: t('success.message'),
    success: true,
  };
}
