import { Resend } from 'resend';
import ReservationTemplate from '../components/emails/ReservationTemplate';
import ShuttleRequestTemplate from '../components/emails/ShuttleRequestTemplate';
import ShuttleConfirmationEmail from '../components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '../components/emails/ShuttleAdminNotification';

// Initialize Resend only if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

type TFunction = (key: string, values?: Record<string, string | number>) => string;

interface SendConfirmationEmailProps {
    to: string;
    reservationId: string;
    customerName: string;
    tourName:string;
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

export async function sendShuttleRequestEmail(data: SendShuttleRequestEmailProps) {
    const adminEmail = process.env.ADMIN_EMAIL || 'josemanu0885@gmail.com';

    if (!resend) {
        console.log('📧 [SHUTTLE EMAIL SIMULATION] -----------------------------------------');
        console.log(`To Admin: ${adminEmail}`);
        console.log(`Subject: Nueva Solicitud de Shuttle [${data.type?.toUpperCase() || 'SHARED'}]: ${data.routeOrigin} -> ${data.routeDestination}`);
        console.log('Template Data:', JSON.stringify(data, null, 2));
        console.log('-----------------------------------------------------------------------');
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
            console.error('Error sending shuttle email:', error);
            return { success: false, error };
        }

        return { success: true, id: emailData?.id };
    } catch (error) {
        console.error('Exception sending shuttle email:', error);
        return { success: false, error };
    }
}

export async function sendConfirmationEmail(data: SendConfirmationEmailProps) {
    // SIMULATION MODE: If no API key, log to console and return success
    if (!resend) {
        console.log('📧 [EMAIL SIMULATION] ---------------------------------------------------');
        console.log(`To: ${data.to}`);
        console.log(`Subject: ${data.t('preview', { tourName: data.tourName })}`);
        console.log('Template Data:', JSON.stringify(data, null, 2));
        console.log('-----------------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: RESEND_FROM,
            to: [data.to],
            subject: data.t('preview', { tourName: data.tourName }),
            react: ReservationTemplate(data),
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, id: emailData?.id };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { success: false, error };
    }
}

interface SendShuttleConfirmationEmailsProps {
    customerName: string;
    customerEmail: string;
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

    if (!resend) {
        console.log('📧 [TOUR CONFIRMATION SIMULATION] --------------------------------------');
        console.log(`To Customer: ${data.to}`);
        console.log(`Subject: ${data.t('preview', { tourName: data.tourName })}`);
        console.log('Customer Template Data:', JSON.stringify(data, null, 2));
        console.log(`To Admin: ${adminEmail}`);
        console.log(`Subject: Nueva solicitud de tour: ${data.tourName}`);
        console.log('Admin Template Data:', JSON.stringify(data, null, 2));
        console.log('-----------------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        const [customerRes, adminRes] = await Promise.all([
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.to],
                subject: data.t('preview', { tourName: data.tourName }),
                react: ReservationTemplate(data),
            }),
            resend.emails.send({
                from: RESEND_FROM,
                to: [adminEmail],
                subject: `Nueva solicitud de tour: ${data.tourName}`,
                react: ReservationTemplate(data),
            }),
        ]);

        const customerError = customerRes?.error;
        const adminError = adminRes?.error;
        if (customerError || adminError) {
            return { success: false, error: customerError || adminError };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending tour confirmation emails:', error);
        return { success: false, error };
    }
}

export async function sendShuttleConfirmationEmails(data: SendShuttleConfirmationEmailsProps) {
    const adminEmail = process.env.ADMIN_EMAIL || 'josemanu0885@gmail.com';

    if (!resend) {
        console.log('📧 [SHUTTLE CONFIRMATION SIMULATION] ----------------------------');
        console.log(`To Customer: ${data.customerEmail}`);
        console.log(`Subject: Confirmacion de Shuttle`);
        console.log('Customer Template Data:', JSON.stringify(data, null, 2));
        console.log(`To Admin: ${adminEmail}`);
        console.log(`Subject: Nueva Solicitud de Shuttle`);
        console.log('Admin Template Data:', JSON.stringify(data, null, 2));
        console.log('----------------------------------------------------------------');
        return { success: true };
    }

    try {
        const [customerRes, adminRes] = await Promise.all([
            resend.emails.send({
                from: RESEND_FROM,
                to: [data.customerEmail],
                subject: 'Confirmacion de Shuttle',
                react: ShuttleConfirmationEmail({
                    customerName: data.customerName,
                    origin: data.origin,
                    destination: data.destination,
                    travelDate: data.travelDate,
                    travelTime: data.travelTime,
                    passengers: data.passengers,
                    pickupLocation: data.pickupLocation,
                    type: data.type,
                    price: data.price,
                }),
            }),
            resend.emails.send({
                from: RESEND_FROM,
                to: [adminEmail],
                subject: 'Nueva Solicitud de Shuttle',
                react: ShuttleAdminNotification({
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
                }),
            }),
        ]);

        const customerError = customerRes?.error;
        const adminError = adminRes?.error;
        if (customerError || adminError) {
            return { success: false, error: customerError || adminError };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending shuttle confirmation emails:', error);
        return { success: false, error };
    }
}
