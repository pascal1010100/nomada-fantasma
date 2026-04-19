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
    Link,
    Font,
} from '@react-email/components';

interface TourLeadNotificationProps {
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    tourName: string;
    tourDate: string;
    guests?: number;
    notes?: string;
    reservationId: string;
    adminPanelUrl?: string;
    operationsEmail: string;
    roleLabel?: string;
    showAdminPanel?: boolean;
    showAgencyInstructions?: boolean;
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
        day: 'numeric'
    });
}

export const TourLeadNotification = ({
    customerName,
    customerEmail,
    customerWhatsapp,
    tourName,
    tourDate,
    guests,
    notes,
    reservationId,
    adminPanelUrl,
    operationsEmail,
    roleLabel,
    showAdminPanel,
    showAgencyInstructions,
}: TourLeadNotificationProps) => {
    const normalizedOperationsEmail = (operationsEmail || 'hola@nomadafantasma.com').trim();
    const normalizedWhatsapp = customerWhatsapp?.replace(/[^0-9]/g, '') || '';

    const replySubject = `Disponibilidad tour ${reservationId} · ${tourName}`;
    const confirmSubject = `Disponible tour ${reservationId} · ${tourName}`;
    const denySubject = `No disponible tour ${reservationId} · ${tourName}`;

    const confirmBody = [
        'Hola equipo de operaciones,',
        '',
        'Confirmamos disponibilidad para esta reserva de tour.',
        '',
        `Tour: ${tourName}`,
        `Fecha: ${formatDate(tourDate)}`,
        guests ? `Viajeros: ${guests}` : null,
        '',
        'Notas operativas:',
        '- ',
        '',
        'Saludos,'
    ].filter(Boolean).join('\n');

    const denyBody = [
        'Hola equipo de operaciones,',
        '',
        'No tenemos disponibilidad para este tour en la fecha solicitada.',
        '',
        `Tour: ${tourName}`,
        `Fecha: ${formatDate(tourDate)}`,
        '',
        'Motivo:',
        '- ',
        '',
        'Alternativa sugerida:',
        '- ',
        '',
        'Saludos,'
    ].filter(Boolean).join('\n');

    const confirmMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(confirmSubject)}&body=${encodeURIComponent(confirmBody)}`;
    const denyMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(denySubject)}&body=${encodeURIComponent(denyBody)}`;
    const manualMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(replySubject)}`;

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
            <Preview>Nuevo Lead: {customerName} - {tourName}</Preview>
            <Body style={{ backgroundColor: '#f3f7fb', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
                <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>

                    {/* Header Operativo (Elite Red Style) */}
                    <Section style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 55%, #dc2626 100%)', padding: '34px 36px 30px' }}>
                        <Text style={{ color: '#fecaca', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 14px' }}>
                            {roleLabel || 'Lead de Operaciones'}
                        </Text>
                        <Heading style={{ color: '#ffffff', fontSize: '30px', lineHeight: '1.15', fontWeight: 700, margin: 0 }}>
                            Nueva solicitud de tour
                        </Heading>
                        <Text style={{ color: '#fee2e2', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
                            {tourName}
                        </Text>
                        <Text style={{ display: 'inline-block', marginTop: '18px', backgroundColor: '#fff1f2', color: '#9f1239', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: 700 }}>
                            Acción requerida
                        </Text>
                    </Section>

                    <Section style={{ padding: '32px 36px 36px' }}>

                        {/* Quick Response section for Agencies */}
                        {showAgencyInstructions && (
                            <Section style={{ margin: '0 0 24px' }}>
                                <Text style={{ color: '#475569', fontSize: '13px', textAlign: 'center', margin: '0 0 14px' }}>
                                    Responde en segundos con una de estas opciones y el sistema abrirá un correo preparado para operaciones.
                                </Text>
                                <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
                                                <Section style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #86efac', borderRadius: '18px', padding: '18px', minHeight: '160px', boxShadow: '0 10px 24px rgba(16, 185, 129, 0.10)' }}>
                                                    <Text style={{ color: '#047857', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>Positiva</Text>
                                                    <Heading style={{ color: '#065f46', fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>Sí, operamos</Heading>
                                                    <Link
                                                        href={confirmMailto}
                                                        style={{ backgroundColor: '#047857', color: '#ffffff', padding: '10px 16px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'inline-block' }}
                                                    >
                                                        Confirmar
                                                    </Link>
                                                </Section>
                                            </td>
                                            <td style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
                                                <Section style={{ background: 'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)', border: '1px solid #fda4af', borderRadius: '18px', padding: '18px', minHeight: '160px', boxShadow: '0 10px 24px rgba(244, 63, 94, 0.10)' }}>
                                                    <Text style={{ color: '#be123c', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>Negativa</Text>
                                                    <Heading style={{ color: '#9f1239', fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>No disponible</Heading>
                                                    <Link
                                                        href={denyMailto}
                                                        style={{ backgroundColor: '#be123c', color: '#ffffff', padding: '10px 16px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'inline-block' }}
                                                    >
                                                        Rechazar
                                                    </Link>
                                                </Section>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Section>
                        )}

                        <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                                Detalles de la solicitud
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
                                    {guests ? (
                                        <tr>
                                            <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>VIAJEROS</td>
                                            <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{guests} {guests === 1 ? 'persona' : 'personas'}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>ID solicitud</td>
                                        <td style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, fontFamily: 'Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>{reservationId}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {notes && (
                                <Section style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #dbe7f0' }}>
                                    <Text style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>Notas del cliente</Text>
                                    <Text style={{ color: '#1e293b', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>"{notes}"</Text>
                                </Section>
                            )}
                        </Section>

                        <Section style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
                            <Heading style={{ color: '#991b1b', fontSize: '17px', fontWeight: 700, margin: '0 0 12px' }}>
                                Contacto del cliente
                            </Heading>
                            <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}>
                                <strong>Nombre:</strong> {customerName}
                            </Text>
                            <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}>
                                <strong>Email:</strong> {customerEmail}
                            </Text>
                            {customerWhatsapp && (
                                <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                                    <strong>WhatsApp:</strong> {customerWhatsapp}
                                </Text>
                            )}
                        </Section>

                        <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
                            {customerWhatsapp && (
                                <Link
                                    href={`https://wa.me/${normalizedWhatsapp}`}
                                    style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}
                                >
                                    WhatsApp Cliente
                                </Link>
                            )}
                            <Link
                                href={`mailto:${customerEmail}`}
                                style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', marginBottom: '10px' }}
                            >
                                Email Cliente
                            </Link>
                            {showAdminPanel && adminPanelUrl && (
                                <Link
                                    href={adminPanelUrl}
                                    style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', width: '100%', marginTop: '10px', border: '1px solid #e2e8f0' }}
                                >
                                    Abrir panel operativo
                                </Link>
                            )}
                        </Section>

                        {showAgencyInstructions && (
                            <Text style={{ color: '#0f766e', fontSize: '13px', textAlign: 'center', margin: '0 0 24px' }}>
                                Si los botones no abren tu correo, responde manualmente a <strong style={{ color: '#0d9488' }}>{normalizedOperationsEmail}</strong>.
                            </Text>
                        )}

                        <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                            Este es un email automático del sistema de reservas de Nomada Fantasma.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default TourLeadNotification;
