import { Resend } from 'resend';
import ReservationTemplate from '../components/emails/ReservationTemplate';
import ShuttleRequestTemplate from '../components/emails/ShuttleRequestTemplate';
import ShuttleConfirmationEmail from '../components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '../components/emails/ShuttleAdminNotification';
import logger from './logger';

// Initialize Resend only if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
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
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
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

interface SendShuttleConfirmationEmailsProps {
    customerName: string;
    customerEmail: string;
    agencyEmail?: string | null;
    origin: string;
    destination: string;
    travelDate: string;
    travelTime?: string;
    passengers: number;
    pickupLocation: string;
    type: string;
    price?: number;
}

export async function sendTourConfirmationEmails(data: SendConfirmationEmailProps) {
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
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        const queue = [
            {
                label: 'tour_customer',
                to: data.to,
                subject: data.t('preview', { tourName: data.tourName }),
            },
            {
                label: 'tour_admin',
                to: adminEmail,
                subject: `Nueva solicitud de tour: ${data.tourName}`,
            },
        ];

        if (agencyEmail) {
            queue.push({
                label: 'tour_agency',
                to: agencyEmail,
                subject: `Solicitud de tour asignada: ${data.tourName}`,
            });
        }

        for (let i = 0; i < queue.length; i += 1) {
            const item = queue[i];
            const result = await sendEmailWithRetry(item.label, () =>
                resend.emails.send({
                    from: RESEND_FROM,
                    to: [item.to],
                    subject: item.subject,
                    react: ReservationTemplate(data),
                })
            );
            if (!result.success) {
                return { success: false, error: result.error };
            }

            if (i < queue.length - 1) {
                await sleep(EMAIL_SEND_SPACING_MS);
            }
        }

        return { success: true };
    } catch (error) {
        logger.error('Error sending tour confirmation emails:', error);
        return { success: false, error };
    }
}

export async function sendShuttleConfirmationEmails(data: SendShuttleConfirmationEmailsProps) {
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
        return { success: true };
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
                subject: 'Confirmacion de Shuttle',
                kind: 'customer',
            },
            {
                label: 'shuttle_admin',
                to: adminEmail,
                subject: 'Nueva Solicitud de Shuttle',
                kind: 'operations',
            },
        ];

        if (agencyEmail) {
            queue.push({
                label: 'shuttle_agency',
                to: agencyEmail,
                subject: 'Nueva Solicitud de Shuttle Asignada',
                kind: 'operations',
            });
        }

        for (let i = 0; i < queue.length; i += 1) {
            const item = queue[i];
            const reactComponent =
                item.kind === 'customer'
                    ? ShuttleConfirmationEmail({
                          customerName: data.customerName,
                          origin: data.origin,
                          destination: data.destination,
                          travelDate: data.travelDate,
                          travelTime: data.travelTime,
                          passengers: data.passengers,
                          pickupLocation: data.pickupLocation,
                          type: data.type,
                          price: data.price,
                      })
                    : ShuttleAdminNotification({
                          customerName: data.customerName,
                          customerEmail: data.customerEmail,
                          origin: data.origin,
                          destination: data.destination,
                          travelDate: data.travelDate,
                          travelTime: data.travelTime,
                          passengers: data.passengers,
                          pickupLocation: data.pickupLocation,
                          type: data.type,
                          price: data.price,
                      });

            const result = await sendEmailWithRetry(item.label, () =>
                resend.emails.send({
                    from: RESEND_FROM,
                    to: [item.to],
                    subject: item.subject,
                    react: reactComponent,
                })
            );

            if (!result.success) {
                return { success: false, error: result.error };
            }

            if (i < queue.length - 1) {
                await sleep(EMAIL_SEND_SPACING_MS);
            }
        }

        return { success: true };
    } catch (error) {
        logger.error('Error sending shuttle confirmation emails:', error);
        return { success: false, error };
    }
}
