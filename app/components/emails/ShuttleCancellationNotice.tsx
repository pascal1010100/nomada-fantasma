import * as React from 'react';
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface ShuttleCancellationNoticeProps {
    bookingId: string;
    origin: string;
    destination: string;
    travelDate: string;
    travelTime?: string | null;
    passengers: number;
    pickupLocation: string;
    customerName: string;
    customerEmail: string;
    cancellationReason: string;
}

function formatDate(dateString: string) {
    const parts = dateString.split('-').map(Number);
    const date = parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2], 12)
        : new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function ShuttleCancellationNotice({
    bookingId,
    origin,
    destination,
    travelDate,
    travelTime,
    passengers,
    pickupLocation,
    customerName,
    customerEmail,
    cancellationReason,
}: ShuttleCancellationNoticeProps) {
    return (
        <Html>
            <Head />
            <Preview>Shuttle cancelado: {origin} → {destination}</Preview>
            <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', margin: 0, padding: '24px 0' }}>
                <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <Section style={{ background: 'linear-gradient(135deg, #164e63 0%, #0f766e 100%)', padding: '32px 36px' }}>
                        <Text style={{ color: '#ccfbf1', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                            Aviso operativo
                        </Text>
                        <Heading style={{ color: '#ffffff', fontSize: '28px', lineHeight: '1.2', margin: 0 }}>
                            Shuttle cancelado
                        </Heading>
                        <Text style={{ color: '#cffafe', fontSize: '15px', lineHeight: '1.7', margin: '12px 0 0' }}>
                            Esta solicitud ya no requiere confirmación ni asignación operativa.
                        </Text>
                    </Section>

                    <Section style={{ padding: '28px 36px 36px' }}>
                        <Text style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>
                            {origin} → {destination}
                        </Text>

                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>ID:</strong> {bookingId}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Fecha:</strong> {formatDate(travelDate)}
                        </Text>
                        {travelTime ? (
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                                <strong>Hora:</strong> {travelTime}
                            </Text>
                        ) : null}
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Pasajeros:</strong> {passengers}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Pickup:</strong> {pickupLocation}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Cliente:</strong> {customerName}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 18px' }}>
                            <strong>Email:</strong> {customerEmail}
                        </Text>

                        <Section style={{ backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '16px', padding: '18px 20px', margin: '24px 0' }}>
                            <Text style={{ color: '#155e75', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                                Motivo registrado
                            </Text>
                            <Text style={{ color: '#164e63', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                                {cancellationReason}
                            </Text>
                        </Section>

                        <Text style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                            Si necesitas aclarar algo con operaciones, responde directamente a este correo.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
