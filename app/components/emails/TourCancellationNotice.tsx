import * as React from 'react';
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface TourCancellationNoticeProps {
    reservationId: string;
    tourName: string;
    tourDate: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    guests?: number;
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

export default function TourCancellationNotice({
    reservationId,
    tourName,
    tourDate,
    customerName,
    customerEmail,
    customerWhatsapp,
    guests,
    cancellationReason,
}: TourCancellationNoticeProps) {
    return (
        <Html>
            <Head />
            <Preview>Reserva cancelada: {tourName}</Preview>
            <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif', margin: 0, padding: '24px 0' }}>
                <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <Section style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #be123c 100%)', padding: '32px 36px' }}>
                        <Text style={{ color: '#fecdd3', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                            Aviso operativo
                        </Text>
                        <Heading style={{ color: '#ffffff', fontSize: '28px', lineHeight: '1.2', margin: 0 }}>
                            Reserva cancelada
                        </Heading>
                        <Text style={{ color: '#ffe4e6', fontSize: '15px', lineHeight: '1.7', margin: '12px 0 0' }}>
                            Esta solicitud ya no requiere gestión operativa por parte de la agencia.
                        </Text>
                    </Section>

                    <Section style={{ padding: '28px 36px 36px' }}>
                        <Text style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, margin: '0 0 14px' }}>
                            {tourName}
                        </Text>

                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>ID:</strong> {reservationId}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Fecha:</strong> {formatDate(tourDate)}
                        </Text>
                        {typeof guests === 'number' ? (
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                                <strong>Viajeros:</strong> {guests}
                            </Text>
                        ) : null}
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Cliente:</strong> {customerName}
                        </Text>
                        <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 10px' }}>
                            <strong>Email:</strong> {customerEmail}
                        </Text>
                        {customerWhatsapp ? (
                            <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 18px' }}>
                                <strong>WhatsApp:</strong> {customerWhatsapp}
                            </Text>
                        ) : null}

                        <Section style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', padding: '18px 20px', margin: '24px 0' }}>
                            <Text style={{ color: '#9f1239', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>
                                Motivo registrado
                            </Text>
                            <Text style={{ color: '#881337', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
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
