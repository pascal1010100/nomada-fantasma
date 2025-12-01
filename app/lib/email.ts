import { Resend } from 'resend';
import ReservationTemplate from '../components/emails/ReservationTemplate';

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
