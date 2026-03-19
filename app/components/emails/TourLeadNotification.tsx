import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Link,
} from '@react-email/components';

interface TourLeadNotificationProps {
    customerName: string;
    customerEmail: string;
    customerWhatsapp?: string | null;
    tourName: string;
    tourDate: string;
    notes?: string;
    reservationId: string;
    adminPanelUrl?: string;
    roleLabel?: string;
    showAdminPanel?: boolean;
    showAgencyInstructions?: boolean;
}

const styles = {
    body: {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        margin: '0',
        padding: '0',
    },
    container: {
        border: '1px solid #eaeaea',
        borderRadius: '12px',
        margin: '32px auto',
        padding: '24px',
        maxWidth: '600px',
    },
    header: {
        backgroundColor: '#0ea5e9',
        borderRadius: '10px',
        padding: '18px',
        textAlign: 'center' as const,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0',
    },
    headerSub: {
        color: '#e0f2fe',
        fontSize: '14px',
        margin: '6px 0 0',
    },
    card: {
        backgroundColor: '#f9fafb',
        border: '1px solid #f1f5f9',
        borderRadius: '12px',
        padding: '16px',
        margin: '16px 0',
    },
    label: {
        color: '#6b7280',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        margin: '0 0 6px',
        fontWeight: '700',
        display: 'block',
    },
    value: {
        color: '#111827',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0',
        display: 'block',
    },
    text: {
        color: '#111827',
        fontSize: '14px',
        lineHeight: '20px',
        margin: '6px 0',
        display: 'block',
    },
    button: {
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: '700',
        padding: '10px 18px',
        textDecoration: 'none',
        margin: '6px 0',
    },
    buttonAlt: {
        backgroundColor: '#64748b',
        borderRadius: '8px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: '700',
        padding: '10px 18px',
        textDecoration: 'none',
        margin: '6px 0',
    },
    footer: {
        color: '#6b7280',
        fontSize: '12px',
        lineHeight: '18px',
        textAlign: 'center' as const,
        margin: '8px 0',
    },
};

export const TourLeadNotification = ({
    customerName,
    customerEmail,
    customerWhatsapp,
    tourName,
    tourDate,
    notes,
    reservationId,
    adminPanelUrl,
    roleLabel,
    showAdminPanel,
    showAgencyInstructions,
}: TourLeadNotificationProps) => {
    const normalizedWhatsapp = customerWhatsapp?.replace(/[^0-9]/g, '') || '';

    return (
        <Html>
            <Head />
            <Preview>Nuevo Lead: {customerName} - {tourName}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section style={styles.header}>
                        <Heading style={styles.headerTitle}>Nuevo Lead de Reserva</Heading>
                        <Text style={styles.headerSub}>{tourName}</Text>
                        {roleLabel ? (
                            <Text style={{ ...styles.headerSub, fontWeight: '700', marginTop: '4px' }}>
                                {roleLabel}
                            </Text>
                        ) : null}
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.label}>Informacion del cliente</Text>
                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                            <tbody>
                                <tr>
                                    <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700, paddingBottom: '8px' }}>
                                        NOMBRE
                                    </td>
                                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                                        {customerName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700, paddingBottom: customerWhatsapp ? '8px' : undefined }}>
                                        EMAIL
                                    </td>
                                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right', paddingBottom: customerWhatsapp ? '8px' : undefined }}>
                                        {customerEmail}
                                    </td>
                                </tr>
                                {customerWhatsapp ? (
                                    <tr>
                                        <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>
                                            WHATSAPP
                                        </td>
                                        <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
                                            {customerWhatsapp}
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.label}>Detalles de la solicitud</Text>
                        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                            <tbody>
                                <tr>
                                    <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700, paddingBottom: '8px' }}>
                                        TOUR
                                    </td>
                                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                                        {tourName}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700, paddingBottom: '8px' }}>
                                        FECHA
                                    </td>
                                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                                        {tourDate}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>
                                        ID RESERVA
                                    </td>
                                    <td style={{ color: '#111827', fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
                                        {reservationId}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {notes ? (
                            <>
                                <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />
                                <Text style={styles.text}>Notas del cliente</Text>
                                <Text style={styles.value}>"{notes}"</Text>
                            </>
                        ) : null}
                    </Section>

                    <Section style={{ textAlign: 'center', margin: '16px 0' }}>
                        {customerWhatsapp ? (
                            <Link
                                style={styles.button}
                                href={`https://wa.me/${normalizedWhatsapp}`}
                            >
                                Contactar por WhatsApp
                            </Link>
                        ) : null}
                        <br />
                        <Link
                            style={styles.button}
                            href={`mailto:${customerEmail}`}
                        >
                            Enviar Email
                        </Link>
                        {showAdminPanel && adminPanelUrl ? (
                            <>
                                <br />
                                <Link
                                    style={styles.buttonAlt}
                                    href={adminPanelUrl}
                                >
                                    Ver en panel operativo
                                </Link>
                            </>
                        ) : null}
                    </Section>

                    {showAgencyInstructions ? (
                        <Section style={styles.card}>
                            <Text style={styles.label}>Acción requerida</Text>
                            <Text style={styles.text}>
                                Confirma disponibilidad y responde al cliente lo antes posible.
                            </Text>
                        </Section>
                    ) : null}

                    <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

                    <Text style={styles.footer}>
                        Este es un email automatico del sistema de reservas de Nomada Fantasma
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default TourLeadNotification;
