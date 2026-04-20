import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Font,
} from '@react-email/components';

interface TourProviderConfirmationEmailProps {
    reservationId: string;
    tourName: string;
    tourDate: string;
    requestedTime?: string | null;
    meetingPoint?: string | null;
    guests?: number;
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    customerNotes?: string | null;
}

function formatDate(dateString: string) {
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
        ? new Date(`${dateString}T12:00:00`)
        : new Date(dateString);

    if (Number.isNaN(parsed.getTime())) return dateString;

    return parsed.toLocaleDateString('es-GT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function TourProviderConfirmationEmail({
    reservationId,
    tourName,
    tourDate,
    requestedTime,
    meetingPoint,
    guests,
    customerName,
    customerEmail,
    customerWhatsapp,
    customerNotes,
}: TourProviderConfirmationEmailProps) {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                        format: 'woff2'
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Reserva confirmada para operar: {tourName}</Preview>
            <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
                <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0' }}>
                    <Section style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0f172a 100%)', padding: '32px 36px' }}>
                        <Text style={{ color: '#a7f3d0', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 12px' }}>
                            Confirmacion operativa
                        </Text>
                        <Heading style={{ color: '#ffffff', fontSize: '30px', lineHeight: '1.15', fontWeight: 700, margin: 0 }}>
                            Tour confirmado para operar
                        </Heading>
                        <Text style={{ color: '#ccfbf1', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
                            Esta reserva ya fue confirmada con pago recibido. Favor coordinar la experiencia con base en la informacion siguiente.
                        </Text>
                    </Section>

                    <Section style={{ padding: '32px 36px' }}>
                        <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                                Datos del tour
                            </Heading>
                            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>TOUR</td>
                                        <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{tourName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>FECHA</td>
                                        <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{formatDate(tourDate)}</td>
                                    </tr>
                                    {requestedTime ? (
                                        <tr>
                                            <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>HORA</td>
                                            <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{requestedTime}</td>
                                        </tr>
                                    ) : null}
                                    {typeof guests === 'number' ? (
                                        <tr>
                                            <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>VIAJEROS</td>
                                            <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{guests} {guests === 1 ? 'persona' : 'personas'}</td>
                                        </tr>
                                    ) : null}
                                    {meetingPoint ? (
                                        <tr>
                                            <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>ENCUENTRO</td>
                                            <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{meetingPoint}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>ID reserva</td>
                                        <td style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, fontFamily: 'Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>{reservationId}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        <Section style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#166534', fontSize: '17px', fontWeight: 700, margin: '0 0 12px' }}>
                                Contacto del cliente
                            </Heading>
                            <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Nombre:</strong> {customerName}</Text>
                            <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Email:</strong> {customerEmail}</Text>
                            {customerWhatsapp ? (
                                <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: 0 }}><strong>WhatsApp:</strong> {customerWhatsapp}</Text>
                            ) : null}
                        </Section>

                        {customerNotes ? (
                            <Section style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                                <Heading style={{ color: '#9a3412', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                                    Notas del cliente
                                </Heading>
                                <Text style={{ color: '#7c2d12', fontSize: '14px', lineHeight: '1.75', margin: 0 }}>
                                    "{customerNotes}"
                                </Text>
                            </Section>
                        ) : null}

                        <Text style={{ color: '#475569', fontSize: '13px', lineHeight: '1.75', margin: 0 }}>
                            Este correo es solo operativo y no incluye precios. Si necesitan confirmar un ajuste final de logistica, respondan directamente al equipo de Nómada Fantasma.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
