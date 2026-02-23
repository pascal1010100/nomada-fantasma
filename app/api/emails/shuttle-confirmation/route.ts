import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ShuttleConfirmationEmail from '@/app/components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '@/app/components/emails/ShuttleAdminNotification';

const rateLimitStore = new Map<string, { count: number; start: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const isDev = process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  try {
    const ipHeader = request.headers.get('x-forwarded-for') || '';
    const ip = ipHeader.split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.set(ip, { count: 1, start: now });
    } else {
      if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: 'Demasiadas solicitudes. Intenta más tarde.' },
          { status: 429 }
        );
      }
      entry.count += 1;
      rateLimitStore.set(ip, entry);
    }

    // Check API key first
    const resendApiKey = process.env.RESEND_API_KEY;
    if (isDev) {
      console.log('=== EMAIL DEBUG: Checking API key ===');
      console.log('API Key exists:', !!resendApiKey);
      console.log('API Key length:', resendApiKey?.length || 0);
    }
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    if (isDev) {
      console.log('=== EMAIL DEBUG: Resend instance created ===');
    }
    const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mandalashostal@gmail.com';
    
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

    if (isDev) {
      console.log('=== EMAIL DEBUG: Received data ===');
      console.log('Customer Name:', customerName);
      console.log('Customer Email:', customerEmail);
      console.log('Origin:', origin);
      console.log('Destination:', destination);
      console.log('Travel Date:', travelDate);
      console.log('Travel Time:', travelTime);
      console.log('Passengers:', passengers);
      console.log('Pickup Location:', pickupLocation);
      console.log('Type:', type);
      console.log('Price:', price);
    }

    // Validate required fields
    if (!customerName || !customerEmail || !origin || !destination || !travelDate) {
      console.error('=== EMAIL DEBUG: Missing required fields ===');
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
    if (isDev) {
      console.log('=== EMAIL DEBUG: Sending customer email ===');
    }
    const customerEmailPromise = resend.emails.send({
      from: RESEND_FROM,
      to: [customerEmail],
      subject: 'Confirmacion de Shuttle',
      html: customerEmailHtml,
    }).catch(error => {
      console.error('Customer email error', error);
      return { error: error.message, status: 'failed' };
    });

    // Send notification email to admin
    if (isDev) {
      console.log('=== EMAIL DEBUG: Sending admin email ===');
    }
    const adminEmailPromise = resend.emails.send({
      from: RESEND_FROM,
      to: [ADMIN_EMAIL],
      subject: 'Nueva Solicitud de Shuttle',
      html: adminEmailHtml,
    }).catch(error => {
      console.error('Admin email error', error);
      return { error: error.message, status: 'failed' };
    });

    if (isDev) {
      console.log('=== EMAIL DEBUG: Waiting for email promises ===');
    }
    const [customerResult, adminResult] = await Promise.allSettled([
      customerEmailPromise,
      adminEmailPromise
    ]);
    if (isDev) {
      console.log('=== EMAIL DEBUG: Customer email result ===', customerResult);
      console.log('=== EMAIL DEBUG: Admin email result ===', adminResult);
    }
    if (customerResult.status === 'fulfilled') {
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully'
      });
    }
    const errorMessage =
      customerResult.status === 'rejected' && customerResult.reason
        ? String(customerResult.reason)
        : 'Unknown error';
    console.error('Failed to send customer email:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error sending shuttle confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
