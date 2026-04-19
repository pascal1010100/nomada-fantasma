import { Resend } from 'resend';
import type { ReactElement } from 'react';
import ReservationTemplate from '../components/emails/ReservationTemplate';
import ShuttleRequestTemplate from '../components/emails/ShuttleRequestTemplate';
import ShuttleConfirmationEmail from '../components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '../components/emails/ShuttleAdminNotification';
import ShuttleAgencyNotification from '../components/emails/ShuttleAgencyNotification';
import ShuttleCancellationNotice from '../components/emails/ShuttleCancellationNotice';
import CustomerActionEmail from '../components/emails/CustomerActionEmail';
import TourLeadNotification from '../components/emails/TourLeadNotification';
import TourCancellationNotice from '../components/emails/TourCancellationNotice';
import logger from './logger';
import { CONTACT_INFO } from './constants';

// Initialize Resend only if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nomadafantasma.com';
const EMAIL_SEND_SPACING_MS = 650;
const EMAIL_RATE_LIMIT_RETRY_MS = 1200;
const EMAIL_RATE_LIMIT_MAX_RETRIES = 2;

type TFunction = (key: string, values?: Record<string, string | number>) => string;

function redactForLog(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(redactForLog);
    }
    if (value && typeof value === 'object') {
        const entries = Object.entries(value).map(([key, val]) => {
            if (key.toLowerCase().includes('email')) {
                return [key, typeof val === 'string' ? val.replace(/(.{2}).+(@.+)/, '$1***$2') : val];
            }
            if (key.toLowerCase().includes('name')) {
                return [key, typeof val === 'string' ? `${val.slice(0, 1)}***` : val];
            }
            if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('contact')) {
                return [key, typeof val === 'string' ? `${val.slice(0, 2)}***` : val];
            }
            if (key.toLowerCase().includes('location')) {
                return [key, typeof val === 'string' ? '[redacted]' : val];
            }
            return [key, redactForLog(val)];
        });
        return Object.fromEntries(entries);
    }
    return value;
}

interface SendConfirmationEmailProps {
    to: string;
    agencyEmail?: string | null;
    reservationId: string;
    customerName: string;
    customerPhone?: string | null;
    customerNotes?: string | null;
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
    locale?: string;
    t: TFunction;
}

interface SendShuttleRequestEmailProps {
    customerName: string;
    customerEmail: string;
    routeOrigin: string;
    routeDestination: string;
    date: string;
    time: string;
    passengers: number;
    pickupLocation: string;
    type?: 'shared' | 'private';
}

type SendEmailResult = {
    success: boolean;
    error?: unknown;
    id?: string;
};

type RecipientDeliveryResult = {
    label: string;
    to: string;
    subject: string;
    success: boolean;
    id?: string;
    error?: unknown;
};

type MultiRecipientSendResult = {
    success: boolean;
    recipients: RecipientDeliveryResult[];
    error?: unknown;
};

type ManualCustomerEmailTemplate = 'payment_instructions' | 'not_available' | 'booking_confirmed' | 'booking_cancelled';

type ManualCustomerEmailProps = {
    to: string;
    subject: string;
    react: ReactElement;
    label: string;
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const typed = error as { statusCode?: number; name?: string; message?: string };
    return (
        typed.statusCode === 429 ||
        typed.name === 'rate_limit_exceeded' ||
        (typeof typed.message === 'string' && typed.message.toLowerCase().includes('rate limit'))
    );
}

async function sendEmailWithRetry(
    label: string,
    send: () => Promise<{ data?: { id?: string } | null; error?: unknown | null }>
): Promise<SendEmailResult> {
    let attempt = 0;
    while (attempt <= EMAIL_RATE_LIMIT_MAX_RETRIES) {
        const response = await send();
        const error = response?.error ?? null;
        if (!error) {
            return { success: true, id: response?.data?.id };
        }

        if (!isRateLimitError(error) || attempt === EMAIL_RATE_LIMIT_MAX_RETRIES) {
            return { success: false, error };
        }

        attempt += 1;
        const waitMs = EMAIL_RATE_LIMIT_RETRY_MS * attempt;
        logger.warn(`[email:${label}] rate limit detected, retrying in ${waitMs}ms`);
        await sleep(waitMs);
    }

    return { success: false, error: new Error('Unknown email retry state') };
}

export async function sendShuttleRequestEmail(data: SendShuttleRequestEmailProps) {
    const adminEmail = process.env.ADMIN_EMAIL || 'josemanu0885@gmail.com';

    if (!resend) {
        logger.info('📧 [SHUTTLE EMAIL SIMULATION] -----------------------------------------');
        logger.info(`To Admin: ${adminEmail}`);
        logger.info(`Subject: Nueva Solicitud de Shuttle [${data.type?.toUpperCase() || 'SHARED'}]: ${data.routeOrigin} -> ${data.routeDestination}`);
        logger.info('Template Data:', JSON.stringify(redactForLog(data), null, 2));
        logger.info('-----------------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: RESEND_FROM,
            to: [adminEmail],
            replyTo: data.customerEmail,
            subject: `🚐 Solicitud de Shuttle: ${data.routeOrigin} ➡️ ${data.routeDestination}`,
            react: ShuttleRequestTemplate(data),
        });

        if (error) {
            logger.error('Error sending shuttle email:', error);
            return { success: false, error };
        }

        return { success: true, id: emailData?.id };
    } catch (error) {
        logger.error('Exception sending shuttle email:', error);
        return { success: false, error };
    }
}

export async function sendConfirmationEmail(data: SendConfirmationEmailProps) {
    // SIMULATION MODE: If no API key, log to console and return success
    if (!resend) {
        logger.info('📧 [EMAIL SIMULATION] ---------------------------------------------------');
        logger.info(`To: ${data.to}`);
        logger.info(`Subject: ${data.t('preview', { tourName: data.tourName })}`);
        logger.info('Template Data:', JSON.stringify(redactForLog(data), null, 2));
        logger.info('-----------------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        return await sendEmailWithRetry('generic_confirmation', () =>
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.to],
                subject: data.t('preview', { tourName: data.tourName }),
                react: ReservationTemplate(data),
            })
        );
    } catch (error) {
        logger.error('Exception sending email:', error);
        return { success: false, error };
    }
}

export async function sendManualCustomerEmail(data: ManualCustomerEmailProps): Promise<SendEmailResult> {
    if (!resend) {
        logger.info('📧 [MANUAL CUSTOMER EMAIL SIMULATION] ------------------------------');
        logger.info(`To: ${data.to}`);
        logger.info(`Subject: ${data.subject}`);
        logger.info(`Label: ${data.label}`);
        logger.info('----------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        return await sendEmailWithRetry(data.label, () =>
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.to],
                subject: data.subject,
                react: data.react,
            })
        );
    } catch (error) {
        logger.error(`Exception sending manual customer email (${data.label}):`, error);
        return { success: false, error };
    }
}

type CustomerActionEmailContent = {
    subject: string;
    react: ReactElement;
};

type PaymentOption = {
    title: string;
    details: string[];
    ctaLabel?: string;
    ctaHref?: string;
    isPrimary?: boolean;
};

type BuildCustomerActionEmailInput = {
    template: ManualCustomerEmailTemplate;
    locale: string;
    customerName: string;
    kind: 'tour' | 'shuttle';
    serviceName: string;
    date: string;
    travelers?: number;
    price?: number;
    requestId: string;
    paymentOptions?: PaymentOption[];
    pickupTime?: string;
    pickupLocation?: string;
    meetingPoint?: string;
    travelTime?: string;
    cancellationReason?: string;
};

function formatEmailDate(value: string, locale: string) {
    const trimmed = value.trim();
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
        ? new Date(`${trimmed}T12:00:00`)
        : new Date(trimmed);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString(locale.startsWith('en') ? 'en-US' : 'es-GT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function buildCustomerActionEmail(data: BuildCustomerActionEmailInput): CustomerActionEmailContent {
    const isEnglish = data.locale.startsWith('en');
    const serviceKindLabel = isEnglish
        ? data.kind === 'tour' ? 'Tour' : 'Shuttle'
        : data.kind === 'tour' ? 'Tour' : 'Shuttle';
    const formattedDate = formatEmailDate(data.date, data.locale);
    const travelerValue =
        typeof data.travelers === 'number'
            ? isEnglish
                ? `${data.travelers} ${data.travelers === 1 ? 'traveler' : 'travelers'}`
                : `${data.travelers} ${data.travelers === 1 ? 'viajero' : 'viajeros'}`
            : undefined;

    const eyebrow = 'Nómada Fantasma';
    const requestIdLabel = isEnglish ? 'Request ID' : 'ID de solicitud';
    const summaryTitle = isEnglish ? 'Booking summary' : 'Resumen de tu reserva';
    const serviceLabel = isEnglish ? serviceKindLabel : serviceKindLabel;
    const dateLabel = isEnglish ? 'Date' : 'Fecha';
    const travelersLabel = isEnglish ? 'Travelers' : 'Viajeros';
    const priceLabel = isEnglish
        ? data.kind === 'tour' ? 'Total' : 'Quoted price'
        : data.kind === 'tour' ? 'Total' : 'Precio cotizado';
    const priceValue = typeof data.price === 'number' ? `Q${data.price.toFixed(2)}` : undefined;
    const contactTitle = isEnglish ? 'Need help?' : '¿Necesitas ayuda?';
    const contactLine = isEnglish
        ? 'If you have questions, reply to this email or contact our team directly.'
        : 'Si tienes preguntas, responde a este correo o contacta directamente a nuestro equipo.';
    const contactWhatsAppLabel = isEnglish ? 'Open WhatsApp' : 'Abrir WhatsApp';
    const footerNote = isEnglish
        ? 'This is an operational email from the Nómada Fantasma team.'
        : 'Este es un correo operativo enviado por el equipo de Nómada Fantasma.';
    const footerSignature = isEnglish
        ? 'Nómada Fantasma - Epic Travels in Guatemala'
        : 'Nómada Fantasma - Viajes Épicos en Guatemala';

    if (data.template === 'payment_instructions') {
        const subject = isEnglish
            ? `Payment instructions: ${data.serviceName}`
            : `Instrucciones de pago: ${data.serviceName}`;

        return {
            subject,
            react: CustomerActionEmail({
                preview: subject,
                eyebrow,
                title: isEnglish ? 'Your spot is ready to be secured' : 'Tu espacio está listo para asegurarse',
                subtitle: isEnglish
                    ? 'Availability is confirmed. Complete the payment using one of the methods below to finish your booking.'
                    : 'La disponibilidad ya está confirmada. Completa el pago con uno de los métodos indicados abajo para cerrar tu reserva.',
                greeting: isEnglish ? `Hi ${data.customerName},` : `Hola ${data.customerName},`,
                intro: isEnglish
                    ? 'We have already validated your reservation with operations. To complete the booking, please send the payment and share the proof with our team.'
                    : 'Ya validamos tu reserva con operaciones. Para completar la reserva, por favor realiza el pago y comparte el comprobante con nuestro equipo.',
                summaryTitle,
                serviceLabel,
                serviceValue: data.serviceName,
                dateLabel,
                dateValue: formattedDate,
                travelersLabel,
                travelersValue: travelerValue,
                priceLabel,
                priceValue,
                requestIdLabel,
                requestId: data.requestId,
                infoTitle: isEnglish ? 'Next step' : 'Siguiente paso',
                infoBody: isEnglish
                    ? 'Once the payment is confirmed, we will send your final booking confirmation with the operational details.'
                    : 'Una vez confirmado el pago, te enviaremos la confirmación final de tu reserva con los detalles operativos.',
                paymentTitle: isEnglish ? 'Available payment methods' : 'Métodos de pago disponibles',
                paymentOptions: data.paymentOptions,
                contactTitle,
                contactLine,
                contactWhatsAppLabel,
                footerNote,
                footerSignature,
            }),
        };
    }

    if (data.template === 'not_available') {
        const subject = isEnglish
            ? `Availability update: ${data.serviceName}`
            : `Actualización de disponibilidad: ${data.serviceName}`;
        return {
            subject,
            react: CustomerActionEmail({
                preview: subject,
                eyebrow,
                title: isEnglish ? 'This booking is not available' : 'Esta reserva no está disponible',
                subtitle: isEnglish
                    ? 'We could not confirm the requested date or operational conditions for this booking.'
                    : 'No pudimos confirmar la fecha o las condiciones operativas solicitadas para esta reserva.',
                greeting: isEnglish ? `Hi ${data.customerName},` : `Hola ${data.customerName},`,
                intro: isEnglish
                    ? 'Our team reviewed the request with operations and we cannot confirm this booking exactly as requested.'
                    : 'Nuestro equipo revisó la solicitud con operaciones y no podemos confirmar esta reserva exactamente como fue solicitada.',
                summaryTitle,
                serviceLabel,
                serviceValue: data.serviceName,
                dateLabel,
                dateValue: formattedDate,
                travelersLabel,
                travelersValue: travelerValue,
                priceLabel,
                priceValue,
                requestIdLabel,
                requestId: data.requestId,
                infoTitle: isEnglish ? 'What happens next' : 'Qué sigue ahora',
                infoBody: isEnglish
                    ? 'Reply to this email or contact us on WhatsApp and we will help you find an alternative date, route or experience.'
                    : 'Responde a este correo o contáctanos por WhatsApp y con gusto te ayudaremos a encontrar una fecha, ruta o experiencia alternativa.',
                contactTitle,
                contactLine,
                contactWhatsAppLabel,
                footerNote,
                footerSignature,
            }),
        };
    }

    if (data.template === 'booking_cancelled') {
        const subject = isEnglish
            ? `Booking cancelled: ${data.serviceName}`
            : `Reserva cancelada: ${data.serviceName}`;
        return {
            subject,
            react: CustomerActionEmail({
                preview: subject,
                eyebrow,
                title: isEnglish ? 'Your booking has been cancelled' : 'Tu reserva ha sido cancelada',
                subtitle: isEnglish
                    ? 'We are sorry, but this booking can no longer move forward under the requested conditions.'
                    : 'Lo sentimos, pero esta reserva ya no puede continuar bajo las condiciones solicitadas.',
                greeting: isEnglish ? `Hi ${data.customerName},` : `Hola ${data.customerName},`,
                intro: isEnglish
                    ? 'Our operations team has closed this booking and the reservation is now cancelled.'
                    : 'Nuestro equipo de operaciones cerró esta gestión y la reserva quedó cancelada.',
                summaryTitle,
                serviceLabel,
                serviceValue: data.serviceName,
                dateLabel,
                dateValue: formattedDate,
                travelersLabel,
                travelersValue: travelerValue,
                priceLabel,
                priceValue,
                requestIdLabel,
                requestId: data.requestId,
                infoTitle: isEnglish ? 'Cancellation details' : 'Detalle de la cancelación',
                infoBody: data.cancellationReason
                    ? isEnglish
                        ? `Reason shared by operations: ${data.cancellationReason}\n\nIf you would like us to help you find an alternative, reply to this email or contact us on WhatsApp.`
                        : `Motivo registrado por operaciones: ${data.cancellationReason}\n\nSi quieres que te ayudemos a encontrar una alternativa, responde a este correo o escríbenos por WhatsApp.`
                    : isEnglish
                        ? 'If you would like us to help you find an alternative, reply to this email or contact us on WhatsApp.'
                        : 'Si quieres que te ayudemos a encontrar una alternativa, responde a este correo o escríbenos por WhatsApp.',
                contactTitle,
                contactLine,
                contactWhatsAppLabel,
                footerNote,
                footerSignature,
            }),
        };
    }

    const subject = isEnglish
        ? `Booking confirmed: ${data.serviceName}`
        : `Reserva confirmada: ${data.serviceName}`;

    const infoBody = isEnglish
        ? 'Please keep this email as your confirmation reference. If there are any final adjustments, our team will contact you directly.'
        : 'Guarda este correo como referencia de confirmación. Si existe algún ajuste final, nuestro equipo te contactará directamente.';

    // Elite logistics for voucher
    const infoTitle = isEnglish ? 'Travel Logistics' : 'Logística de viaje';
    let eliteInfoBody = infoBody;

    if (data.kind === 'shuttle' && (data.travelTime || data.pickupLocation)) {
        const timeLabel = isEnglish ? 'Time' : 'Hora';
        const locLabel = isEnglish ? 'Pickup' : 'Recogida';
        eliteInfoBody = `${infoBody}\n\n• ${timeLabel}: ${data.travelTime || '-'}\n• ${locLabel}: ${data.pickupLocation || '-'}`;
    } else if (data.kind === 'tour' && (data.pickupTime || data.meetingPoint)) {
        const timeLabel = isEnglish ? 'Pickup Time' : 'Hora de recogida';
        const meetLabel = isEnglish ? 'Meeting Point' : 'Punto de encuentro';
        eliteInfoBody = `${infoBody}\n\n• ${timeLabel}: ${data.pickupTime || '-'}\n• ${meetLabel}: ${data.meetingPoint || '-'}`;
    }

    return {
        subject,
        react: CustomerActionEmail({
            preview: subject,
            eyebrow,
            title: isEnglish ? 'Your booking is confirmed' : 'Tu reserva está confirmada',
            subtitle: isEnglish
                ? 'Your payment has been received and the reservation is now confirmed.'
                : 'Ya recibimos tu pago y la reserva quedó confirmada.',
            greeting: isEnglish ? `Hi ${data.customerName},` : `Hola ${data.customerName},`,
            intro: isEnglish
                ? 'Thank you for completing the process. Your booking is now confirmed and our team will support you with any final operational details if needed.'
                : 'Gracias por completar el proceso. Tu reserva ya está confirmada y nuestro equipo te apoyará con cualquier detalle operativo final si hace falta.',
            summaryTitle,
            serviceLabel,
            serviceValue: data.serviceName,
            dateLabel,
            dateValue: formattedDate,
            travelersLabel,
            travelersValue: travelerValue,
            priceLabel,
            priceValue,
            requestIdLabel,
            requestId: data.requestId,
            infoTitle: infoTitle,
            infoBody: eliteInfoBody,
            contactTitle,
            contactLine,
            contactWhatsAppLabel,
            footerNote,
            footerSignature,
        }),
    };
}

type TourCancellationAgencyEmailProps = {
    to: string;
    reservationId: string;
    tourName: string;
    tourDate: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    guests?: number;
    cancellationReason: string;
};

type ShuttleCancellationAgencyEmailProps = {
    to: string;
    bookingId: string;
    origin: string;
    destination: string;
    travelDate: string;
    travelTime?: string | null;
    passengers: number;
    pickupLocation: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    cancellationReason: string;
};

export async function sendTourCancellationAgencyEmail(data: TourCancellationAgencyEmailProps): Promise<SendEmailResult> {
    if (!resend) {
        logger.info('📧 [TOUR CANCELLATION AGENCY EMAIL SIMULATION] --------------------');
        logger.info(`To: ${data.to}`);
        logger.info(`Subject: Tour cancelado: ${data.tourName}`);
        logger.info('----------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        return await sendEmailWithRetry('tour_agency_cancellation', () =>
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.to],
                subject: `Tour cancelado: ${data.tourName}`,
                react: TourCancellationNotice(data),
            })
        );
    } catch (error) {
        logger.error('Error sending tour cancellation agency email:', error);
        return { success: false, error };
    }
}

export async function sendShuttleCancellationAgencyEmail(data: ShuttleCancellationAgencyEmailProps): Promise<SendEmailResult> {
    if (!resend) {
        logger.info('📧 [SHUTTLE CANCELLATION AGENCY EMAIL SIMULATION] -----------------');
        logger.info(`To: ${data.to}`);
        logger.info(`Subject: Shuttle cancelado: ${data.origin} -> ${data.destination}`);
        logger.info('----------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        return await sendEmailWithRetry('shuttle_agency_cancellation', () =>
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.to],
                subject: `Shuttle cancelado: ${data.origin} -> ${data.destination}`,
                react: ShuttleCancellationNotice(data),
            })
        );
    } catch (error) {
        logger.error('Error sending shuttle cancellation agency email:', error);
        return { success: false, error };
    }
}

interface SendShuttleConfirmationEmailsProps {
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    agencyEmail?: string | null;
    origin: string;
    destination: string;
    travelDate: string;
    travelTime?: string;
    passengers: number;
    pickupLocation: string;
    type: string;
    price?: number;
    createdAt?: string;
    t: TFunction;
    locale?: string;
}

function buildShuttleOpsSubject(prefix: string, origin: string, destination: string, travelDate: string) {
    return `${prefix}: ${origin} -> ${destination} • ${travelDate}`;
}

export async function sendTourConfirmationEmails(data: SendConfirmationEmailProps): Promise<MultiRecipientSendResult> {
    const adminEmail = process.env.ADMIN_EMAIL || 'josemanu0885@gmail.com';
    const agencyEmail = data.agencyEmail?.trim() || null;

    if (!resend) {
        logger.info('📧 [TOUR CONFIRMATION SIMULATION] --------------------------------------');
        logger.info(`To Customer: ${data.to}`);
        logger.info(`Subject: ${data.t('preview', { tourName: data.tourName })}`);
        logger.info('Customer Template Data:', JSON.stringify(redactForLog(data), null, 2));
        logger.info(`To Admin: ${adminEmail}`);
        logger.info(`Subject: Nueva solicitud de tour: ${data.tourName}`);
        logger.info('Admin Template Data:', JSON.stringify(redactForLog(data), null, 2));
        if (agencyEmail) {
            logger.info(`To Agency: ${agencyEmail}`);
            logger.info(`Subject: Solicitud de tour asignada: ${data.tourName}`);
            logger.info('Agency Template Data:', JSON.stringify(redactForLog(data), null, 2));
        }
        logger.info('-----------------------------------------------------------------------');
        const simulatedRecipients: RecipientDeliveryResult[] = [
            {
                label: 'tour_customer',
                to: data.to,
                subject: data.t('preview', { tourName: data.tourName }),
                success: true,
                id: 'simulated_' + Date.now(),
            },
            {
                label: 'tour_admin',
                to: adminEmail,
                subject: `Nueva solicitud de tour: ${data.tourName}`,
                success: true,
                id: 'simulated_' + Date.now(),
            },
        ];
        if (agencyEmail) {
            simulatedRecipients.push({
                label: 'tour_agency',
                to: agencyEmail,
                subject: `Solicitud de tour asignada: ${data.tourName}`,
                success: true,
                id: 'simulated_' + Date.now(),
            });
        }
        return { success: true, recipients: simulatedRecipients };
    }

    try {
        const queue: Array<{
            label: string;
            to: string;
            subject: string;
            kind: 'customer' | 'operations';
        }> = [
                {
                    label: 'tour_customer',
                    to: data.to,
                    subject: data.t('preview', { tourName: data.tourName }),
                    kind: 'customer',
                },
                {
                    label: 'tour_admin',
                    to: adminEmail,
                    subject: `Nueva solicitud de tour: ${data.tourName}`,
                    kind: 'operations',
                },
            ];

        if (agencyEmail) {
            queue.push({
                label: 'tour_agency',
                to: agencyEmail,
                subject: `Solicitud de tour asignada: ${data.tourName}`,
                kind: 'operations',
            });
        }

        const recipients: RecipientDeliveryResult[] = [];

        for (let i = 0; i < queue.length; i += 1) {
            const item = queue[i];
            const roleLabel =
                item.label === 'tour_admin'
                    ? 'ADMIN'
                    : item.label === 'tour_agency'
                        ? 'AGENCIA'
                        : undefined;
            const reactComponent =
                item.kind === 'customer'
                    ? ReservationTemplate({
                        ...data,
                    })
                    : TourLeadNotification({
                        customerName: data.customerName,
                        customerEmail: data.to,
                        customerWhatsapp: data.customerPhone || '',
                        tourName: data.tourName,
                        tourDate: data.date,
                        guests: data.guests,
                        notes: data.customerNotes || undefined,
                        reservationId: data.reservationId,
                        operationsEmail: adminEmail,
                        adminPanelUrl: item.label === 'tour_admin'
                            ? `${SITE_URL}/es/internal/recepcion`
                            : undefined,
                        roleLabel,
                        showAdminPanel: item.label === 'tour_admin',
                        showAgencyInstructions: item.label === 'tour_agency',
                    });

            const result = await sendEmailWithRetry(item.label, () =>
                resend.emails.send({
                    from: RESEND_FROM,
                    to: [item.to],
                    subject: item.subject,
                    react: reactComponent,
                })
            );
            recipients.push({
                label: item.label,
                to: item.to,
                subject: item.subject,
                success: result.success,
                id: result.id,
                error: result.error,
            });

            if (i < queue.length - 1) {
                await sleep(EMAIL_SEND_SPACING_MS);
            }
        }

        const allOk = recipients.every((entry) => entry.success);
        return {
            success: allOk,
            recipients,
            error: allOk ? undefined : recipients.find((entry) => !entry.success)?.error,
        };
    } catch (error) {
        logger.error('Error sending tour confirmation emails:', error);
        return { success: false, recipients: [], error };
    }
}

export async function sendShuttleConfirmationEmails(data: SendShuttleConfirmationEmailsProps & { bookingId?: string }): Promise<MultiRecipientSendResult> {
    const adminEmail = process.env.ADMIN_EMAIL || 'josemanu0885@gmail.com';
    const agencyEmail = data.agencyEmail?.trim() || null;

    if (!resend) {
        logger.info('📧 [SHUTTLE CONFIRMATION SIMULATION] ----------------------------');
        logger.info(`To Customer: ${data.customerEmail}`);
        logger.info(`Subject: Confirmacion de Shuttle`);
        logger.info('Customer Template Data:', JSON.stringify(redactForLog(data), null, 2));
        logger.info(`To Admin: ${adminEmail}`);
        logger.info(`Subject: Nueva Solicitud de Shuttle`);
        logger.info('Admin Template Data:', JSON.stringify(redactForLog(data), null, 2));
        if (agencyEmail) {
            logger.info(`To Agency: ${agencyEmail}`);
            logger.info('Subject: Nueva Solicitud de Shuttle Asignada');
            logger.info('Agency Template Data:', JSON.stringify(redactForLog(data), null, 2));
        }
        logger.info('----------------------------------------------------------------');
        const simulatedRecipients: RecipientDeliveryResult[] = [
            {
                label: 'shuttle_customer',
                to: data.customerEmail,
                subject: data.t('subject', { origin: data.origin, destination: data.destination }),
                success: true,
                id: 'simulated_' + Date.now(),
            },
            {
                label: 'shuttle_admin',
                to: adminEmail,
                subject: buildShuttleOpsSubject('Shuttle pendiente', data.origin, data.destination, data.travelDate),
                success: true,
                id: 'simulated_' + Date.now(),
            },
        ];
        if (agencyEmail) {
            simulatedRecipients.push({
                label: 'shuttle_agency',
                to: agencyEmail,
                subject: buildShuttleOpsSubject('Shuttle asignado', data.origin, data.destination, data.travelDate),
                success: true,
                id: 'simulated_' + Date.now(),
            });
        }
        return { success: true, recipients: simulatedRecipients };
    }

    try {
        const queue: Array<{
            label: string;
            to: string;
            subject: string;
            kind: 'customer' | 'operations';
        }> = [
                {
                    label: 'shuttle_customer',
                    to: data.customerEmail,
                    subject: data.t('subject', { origin: data.origin, destination: data.destination }),
                    kind: 'customer',
                },
                {
                    label: 'shuttle_admin',
                    to: adminEmail,
                    subject: buildShuttleOpsSubject('Shuttle pendiente', data.origin, data.destination, data.travelDate),
                    kind: 'operations',
                },
            ];

        if (agencyEmail) {
            queue.push({
                label: 'shuttle_agency',
                to: agencyEmail,
                subject: buildShuttleOpsSubject('Shuttle asignado', data.origin, data.destination, data.travelDate),
                kind: 'operations',
            });
        }

        const recipients: RecipientDeliveryResult[] = [];

        for (let i = 0; i < queue.length; i += 1) {
            const item = queue[i];
            const reactComponent =
                item.kind === 'customer'
                    ? ShuttleConfirmationEmail({
                        bookingId: data.bookingId,
                        customerName: data.customerName,
                        origin: data.origin,
                        destination: data.destination,
                        travelDate: data.travelDate,
                        travelTime: data.travelTime,
                        passengers: data.passengers,
                        pickupLocation: data.pickupLocation,
                        type: data.type,
                        price: data.price,
                        t: data.t,
                        locale: data.locale,
                    })
                    : item.label === 'shuttle_admin'
                        ? ShuttleAdminNotification({
                            bookingId: data.bookingId,
                            customerName: data.customerName,
                            customerEmail: data.customerEmail,
                            customerWhatsapp: data.customerWhatsapp,
                            origin: data.origin,
                            destination: data.destination,
                            travelDate: data.travelDate,
                            travelTime: data.travelTime,
                            passengers: data.passengers,
                            pickupLocation: data.pickupLocation,
                            type: data.type,
                            price: data.price,
                            createdAt: data.createdAt,
                            adminPanelUrl: `${SITE_URL}/es/internal/recepcion`,
                        })
                        : ShuttleAgencyNotification({
                            bookingId: data.bookingId,
                            customerName: data.customerName,
                            customerEmail: data.customerEmail,
                            customerWhatsapp: data.customerWhatsapp,
                            origin: data.origin,
                            destination: data.destination,
                            travelDate: data.travelDate,
                            travelTime: data.travelTime,
                            passengers: data.passengers,
                            pickupLocation: data.pickupLocation,
                            type: data.type,
                            createdAt: data.createdAt,
                            operationsEmail: adminEmail,
                        });

            const result = await sendEmailWithRetry(item.label, () =>
                resend.emails.send({
                    from: RESEND_FROM,
                    to: [item.to],
                    subject: item.subject,
                    react: reactComponent,
                })
            );
            recipients.push({
                label: item.label,
                to: item.to,
                subject: item.subject,
                success: result.success,
                id: result.id,
                error: result.error,
            });

            if (i < queue.length - 1) {
                await sleep(EMAIL_SEND_SPACING_MS);
            }
        }

        const allOk = recipients.every((entry) => entry.success);
        return {
            success: allOk,
            recipients,
            error: allOk ? undefined : recipients.find((entry) => !entry.success)?.error,
        };
    } catch (error) {
        logger.error('Error sending shuttle confirmation emails:', error);
        return { success: false, recipients: [], error };
    }
}
