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
} from '@react-email/components';

interface ShuttleRequestTemplateProps {
    customerName: string;
    customerEmail: string;
    routeOrigin: string;
    routeDestination: string;
    date: string;
    time: string;
    passengers: number;
    pickupLocation: string;
    type?: string;
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
        maxWidth: '520px',
    },
    title: {
        color: '#111827',
        fontSize: '20px',
        fontWeight: '700',
        textAlign: 'center' as const,
        margin: '8px 0',
    },
    subtitle: {
        color: '#6b7280',
        fontSize: '13px',
        textAlign: 'center' as const,
        margin: '0 0 12px',
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
    },
    text: {
        color: '#111827',
        fontSize: '14px',
        lineHeight: '20px',
        margin: '6px 0',
    },
    value: {
        color: '#111827',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0',
    },
    footer: {
        color: '#6b7280',
        fontSize: '12px',
        lineHeight: '18px',
        textAlign: 'center' as const,
        margin: '8px 0',
    },
};

export const ShuttleRequestTemplate = ({
    customerName,
    customerEmail,
    routeOrigin,
    routeDestination,
    date,
    time,
    passengers,
    pickupLocation,
    type,
}: ShuttleRequestTemplateProps) => {
    const previewText = `Nueva Solicitud de Shuttle: ${routeOrigin} -> ${routeDestination}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.title}>Nomada Fantasma</Heading>
                        <Text style={styles.subtitle}>Nueva solicitud de transporte</Text>
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.label}>Detalles del cliente</Text>
                        <Text style={styles.text}>Nombre</Text>
                        <Text style={styles.value}>{customerName}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Email</Text>
                        <Text style={styles.value}>{customerEmail}</Text>
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.label}>Informacion del trayecto</Text>
                        <Text style={styles.text}>Origen</Text>
                        <Text style={styles.value}>{routeOrigin}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Destino</Text>
                        <Text style={styles.value}>{routeDestination}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Fecha</Text>
                        <Text style={styles.value}>{date}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Hora</Text>
                        <Text style={styles.value}>{time}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Pasajeros</Text>
                        <Text style={styles.value}>{passengers} {passengers === 1 ? 'persona' : 'personas'}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Tipo</Text>
                        <Text style={styles.value}>{type === 'private' ? 'Traslado Privado' : 'Shuttle Compartido'}</Text>
                        <Text style={{ ...styles.text, marginTop: '10px' }}>Recogida</Text>
                        <Text style={styles.value}>{pickupLocation}</Text>
                    </Section>

                    <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

                    <Text style={styles.footer}>
                        Procesa esta solicitud con la agencia correspondiente lo antes posible.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ShuttleRequestTemplate;
