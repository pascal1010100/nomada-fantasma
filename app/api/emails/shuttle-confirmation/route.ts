import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ShuttleConfirmationEmail from '@/app/components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '@/app/components/emails/ShuttleAdminNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const {
      customerName,
      customerEmail,
      origin,
      destination,
      travelDate,
      travelTime,
      passengers,
      pickupLocation,
      type,
      price
    } = await request.json();

    // Validate required fields
    if (!customerName || !customerEmail || !origin || !destination || !travelDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Render email templates
    const customerEmailHtml = await render(ShuttleConfirmationEmail({
      customerName,
      origin,
      destination,
      travelDate,
      travelTime,
      passengers,
      pickupLocation,
      type,
      price
    }));

    const adminEmailHtml = await render(ShuttleAdminNotification({
      customerName,
      customerEmail,
      origin,
      destination,
      travelDate,
      travelTime,
      passengers,
      pickupLocation,
      type,
      price
    }));

    // Send confirmation email to customer
    const customerEmailPromise = resend.emails.send({
      from: 'Nómada Fantasma <noreply@nomadafantasma.com>',
      to: [customerEmail],
      subject: `✈️ Confirmación de Solicitud de Shuttle - ${origin} a ${destination}`,
      html: customerEmailHtml,
    });

    // Send notification email to admin
    const adminEmailPromise = resend.emails.send({
      from: 'Nómada Fantasma <noreply@nomadafantasma.com>',
      to: ['josemanu0885@gmail.com'],
      subject: `🚌 Nueva Solicitud de Shuttle - ${origin} a ${destination}`,
      html: adminEmailHtml,
    });

    // Send both emails concurrently
    const [customerResult, adminResult] = await Promise.allSettled([
      customerEmailPromise,
      adminEmailPromise
    ]);

    // Check if at least the customer email was sent successfully
    if (customerResult.status === 'fulfilled') {
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully',
        customerEmailId: customerResult.value.data?.id,
        adminEmailId: adminResult.status === 'fulfilled' ? adminResult.value.data?.id : null
      });
    } else {
      console.error('Failed to send customer email:', customerResult.reason);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending shuttle confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
