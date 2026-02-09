import { Resend } from 'resend';
import ReservationTemplate from '../components/emails/ReservationTemplate';
import ShuttleRequestTemplate from '../components/emails/ShuttleRequestTemplate';

// Initialize Resend only if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendConfirmationEmailProps {
    to: string;
    reservationId: string;
    customerName: string;
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
    type: 'tour' | 'guide';
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
    const adminEmail = process.env.ADMIN_EMAIL || 'info@nomadafantasma.com';

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
            from: 'Nómada Fantasma <reservas@nomadafantasma.com>',
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
        console.log(`Subject: Confirmación de reserva: ${data.tourName}`);
        console.log('Template Data:', JSON.stringify(data, null, 2));
        console.log('-----------------------------------------------------------------------');
        return { success: true, id: 'simulated_' + Date.now() };
    }

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'Nómada Fantasma <reservas@nomadafantasma.com>',
            to: [data.to],
            subject: `Confirmación de reserva: ${data.tourName}`,
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
