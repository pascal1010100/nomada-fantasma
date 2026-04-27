import * as React from 'react';
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface ShuttleProviderConfirmationEmailProps {
    bookingId: string;
    origin: string;
    destination: string;
    travelDate: string;
    travelTime?: string | null;
    passengers: number;
    pickupLocation: string;
    type?: string | null;
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
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

export default function ShuttleProviderConfirmationEmail({
    bookingId,
    origin,
    destination,
    travelDate,
    travelTime,
    passengers,
    pickupLocation,
    type,
    customerName,
    customerEmail,
    customerWhatsapp,
}: ShuttleProviderConfirmationEmailProps) {
    const routeLabel = `${origin} -> ${destination}`;
    const shuttleType = type === 'private' ? 'Privado' : type === 'shared' ? 'Compartido' : 'Shuttle';

    return (
        <Html>
            <Head />
            <Preview>Shuttle confirmado para operar: {routeLabel}</Preview>
            <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', margin: 0, padding: '24px 0' }}>
                <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '22px', overflow: 'hidden', border: '1px solid #dbe7f0' }}>
                    <Section style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0f172a 100%)', padding: '32px 36px' }}>
                        <Text style={{ color: '#a7f3d0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                            Confirmacion operativa
                        </Text>
                        <Heading style={{ color: '#ffffff', fontSize: '30px', lineHeight: '1.15', margin: 0 }}>
                            Shuttle confirmado para operar
                        </Heading>
                        <Text style={{ color: '#ccfbf1', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
                            Esta reserva ya fue confirmada por Nómada Fantasma. Favor coordinar el traslado con base en la informacion siguiente.
                        </Text>
                    </Section>

                    <Section style={{ padding: '30px 36px 36px' }}>
                        <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#0f172a', fontSize: '18px', margin: '0 0 16px' }}>
                                Datos del traslado
                            </Heading>
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Ruta:</strong> {routeLabel}</Text>
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Tipo:</strong> {shuttleType}</Text>
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Fecha:</strong> {formatDate(travelDate)}</Text>
                            {travelTime ? (
                                <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Hora:</strong> {travelTime}</Text>
                            ) : null}
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Pasajeros:</strong> {passengers}</Text>
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Pickup:</strong> {pickupLocation}</Text>
                            <Text style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', margin: '16px 0 0', fontFamily: 'Menlo, Monaco, Consolas, monospace' }}>
                                ID: {bookingId}
                            </Text>
                        </Section>

                        <Section style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#166534', fontSize: '17px', margin: '0 0 12px' }}>
                                Contacto del cliente
                            </Heading>
                            <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Nombre:</strong> {customerName}</Text>
                            <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}><strong>Email:</strong> {customerEmail}</Text>
                            {customerWhatsapp ? (
                                <Text style={{ color: '#166534', fontSize: '14px', lineHeight: '1.7', margin: 0 }}><strong>WhatsApp:</strong> {customerWhatsapp}</Text>
                            ) : null}
                        </Section>

                        <Text style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                            Este correo es operativo. Si necesitan coordinar algun ajuste de logistica, respondan directamente al equipo de Nómada Fantasma.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
