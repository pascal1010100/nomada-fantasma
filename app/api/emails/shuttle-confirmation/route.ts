import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ShuttleConfirmationEmail from '@/app/components/emails/ShuttleConfirmationEmail';
import ShuttleAdminNotification from '@/app/components/emails/ShuttleAdminNotification';

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    const resendApiKey = process.env.RESEND_API_KEY;
    console.log('=== EMAIL DEBUG: Checking API key ===');
    console.log('API Key exists:', !!resendApiKey);
    console.log('API Key length:', resendApiKey?.length || 0);
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    console.log('=== EMAIL DEBUG: Resend instance created ===');
    
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
    console.log('=== EMAIL DEBUG: Sending customer email ===');
    const customerEmailPromise = resend.emails.send({
      from: 'josemanu0885@gmail.com',
      to: [customerEmail],
      subject: 'Confirmacion de Shuttle',
      html: customerEmailHtml,
    }).catch(error => {
      console.error('=== EMAIL DEBUG: Customer email error ===', error);
      return { error: error.message, status: 'failed' };
    });

    // Send notification email to admin
    console.log('=== EMAIL DEBUG: Sending admin email ===');
    const adminEmailPromise = resend.emails.send({
      from: 'josemanu0885@gmail.com',
      to: ['josemanu0885@gmail.com'],
      subject: 'Nueva Solicitud de Shuttle',
      html: adminEmailHtml,
    }).catch(error => {
      console.error('=== EMAIL DEBUG: Admin email error ===', error);
      return { error: error.message, status: 'failed' };
    });

    console.log('=== EMAIL DEBUG: Waiting for email promises ===');
    const results = await Promise.allSettled([
      customerEmailPromise,
      adminEmailPromise
    ]);
    
    const customerResult = results[0];
    const adminResult = results[1];
    
    console.log('=== EMAIL DEBUG: Customer email result ===', customerResult);
    console.log('=== EMAIL DEBUG: Admin email result ===', adminResult);

    // Check if at least one email was sent successfully
    if (customerResult.status === 'fulfilled') {
      return NextResponse.json({
        success: true,
        message: 'Confirmation email sent successfully',
        customerEmailId: (customerResult as any).value?.data?.id,
        adminEmailId: adminResult.status === 'fulfilled' ? (adminResult as any).value?.data?.id : null
      });
    } else {
      const error = customerResult.status === 'rejected' ? (customerResult as any).reason : 'Unknown error';
      console.error('Failed to send customer email:', error);
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
