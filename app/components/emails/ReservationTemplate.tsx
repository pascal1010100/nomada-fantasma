import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

type TFunction = (key: string, values?: Record<string, string | number>) => string;

interface ReservationTemplateProps {
    reservationId: string;
    manageUrl?: string;
    customerName: string;
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
    t: TFunction;
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
        fontSize: '22px',
        fontWeight: '600',
        textAlign: 'center' as const,
        margin: '16px 0',
    },
    text: {
        color: '#111827',
        fontSize: '14px',
        lineHeight: '22px',
        margin: '8px 0',
        display: 'block',
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
        margin: '0 0 8px',
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
    totalRow: {
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
    },
    totalLabel: {
        color: '#111827',
        fontSize: '15px',
        fontWeight: '700',
        margin: '0',
    },
    totalValue: {
        color: '#7c3aed',
        fontSize: '18px',
        fontWeight: '700',
        margin: '0',
    },
    button: {
        backgroundColor: '#06b6d4',
        borderRadius: '8px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: '700',
        padding: '12px 20px',
        textDecoration: 'none',
    },
    metaLabel: {
        color: '#6b7280',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        margin: '0 0 4px',
        fontWeight: '700',
    },
    metaValue: {
        color: '#111827',
        fontSize: '13px',
        fontWeight: '600',
        margin: '0 0 10px',
        fontFamily: 'monospace',
    },
    footer: {
        color: '#6b7280',
        fontSize: '12px',
        lineHeight: '18px',
        margin: '8px 0',
    },
};

export const ReservationTemplate = ({
    reservationId,
    manageUrl,
    customerName,
    tourName,
    date,
    guests,
    totalPrice,
    t,
}: ReservationTemplateProps) => {
    const previewText = t('preview', { tourName });

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section>
                        <Heading style={styles.title}>{t('title')}</Heading>
                        <Text style={styles.text}>{t('greeting', { customerName })}</Text>
                        <Text style={styles.text}>{t('intro', { tourName })}</Text>
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.label}>{t('detailsTitle')}</Text>

                        <Text style={styles.text}>{t('detailsExperience')}</Text>
                        <Text style={styles.value}>{tourName}</Text>

                        <Text style={{ ...styles.text, marginTop: '10px' }}>{t('detailsDate')}</Text>
                        <Text style={styles.value}>{date}</Text>

                        <Text style={{ ...styles.text, marginTop: '10px' }}>{t('detailsTravelers')}</Text>
                        <Text style={styles.value}>
                            {guests} {guests === 1 ? t('detailsTraveler') : t('detailsTravelersPlural')}
                        </Text>

                        <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

                        <Section style={styles.totalRow}>
                            <Text style={styles.totalLabel}>{t('total')}</Text>
                            <Text style={styles.totalValue}>Q{totalPrice.toLocaleString()}</Text>
                        </Section>
                    </Section>

                    <Section>
                        <Heading style={{ ...styles.title, textAlign: 'left', fontSize: '18px' }}>
                            {t('paymentTitle')}
                        </Heading>
                        <Text style={styles.text}>{t('paymentIntro')}</Text>
                        <Section style={styles.card}>
                            <Text style={styles.value}>{t('paymentMethodBank')}</Text>
                            <Text style={styles.text}>{t('paymentBankAccount')}</Text>
                            <Text style={styles.text}>{t('paymentBankHolder')}</Text>
                            <Text style={styles.text}>{t('paymentBankName')}</Text>
                        </Section>
                        <Text style={styles.text}>{t('paymentConfirmation')}</Text>
                    </Section>

                    <Section style={styles.card}>
                        <Text style={styles.metaLabel}>{t('requestIdLabel')}</Text>
                        <Text style={styles.metaValue}>{reservationId}</Text>
                        <Text style={styles.text}>
                            {t('contactLine')}{' '}
                            <Link href="mailto:hola@nomadafantasma.com">hola@nomadafantasma.com</Link>.
                        </Text>
                    </Section>

                    <Hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

                    <Text style={styles.footer}>{t('footerQuestion')}</Text>
                    <Text style={styles.footer}>{t('footerSignature')}</Text>
                </Container>
            </Body>
        </Html>
    );
};

export default ReservationTemplate;
