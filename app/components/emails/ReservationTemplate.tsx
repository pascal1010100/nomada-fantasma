import * as React from 'react';
import { CONTACT_INFO } from '../../lib/constants';
import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

type TFunction = (key: string, values?: Record<string, string | number>) => string;

interface ReservationTemplateProps {
    reservationId: string;
    customerName: string;
    customerPhone?: string | null;
    tourName: string;
    bookingOptionName?: string | null;
    date: string;
    requestedTime?: string | null;
    guests: number;
    totalPrice: number;
    locale?: string;
    t: TFunction;
}

function formatReservationDate(value: string, locale?: string) {
    const trimmed = value.trim();
    let parsedDate: Date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const [year, month, day] = trimmed.split('-').map(Number);
        parsedDate = new Date(year, month - 1, day, 12);
    } else {
        parsedDate = new Date(trimmed);
    }

    if (Number.isNaN(parsedDate.getTime())) {
        return value;
    }

    return parsedDate.toLocaleDateString(locale || 'es', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const styles = {
    body: {
        backgroundColor: '#f3f7fb',
        fontFamily: 'Inter, Arial, sans-serif',
        margin: '0',
        padding: '24px 0',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid #dbe7f0',
        boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
    },
    hero: {
        background: 'linear-gradient(135deg, #0f172a 0%, #164e63 55%, #0f766e 100%)',
        padding: '36px 36px 30px',
    },
    eyebrow: {
        color: '#a5f3fc',
        fontSize: '12px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        fontWeight: '700',
        margin: '0 0 14px',
    },
    heroTitle: {
        color: '#ffffff',
        fontSize: '31px',
        lineHeight: '1.15',
        fontWeight: '700',
        margin: '0',
    },
    heroSubtitle: {
        color: '#cffafe',
        fontSize: '15px',
        lineHeight: '1.7',
        margin: '14px 0 0',
    },
    statusPill: {
        display: 'inline-block',
        marginTop: '18px',
        backgroundColor: '#ecfeff',
        color: '#155e75',
        borderRadius: '999px',
        padding: '8px 14px',
        fontSize: '12px',
        fontWeight: '700',
    },
    content: {
        padding: '32px 36px 36px',
    },
    text: {
        color: '#475569',
        fontSize: '15px',
        lineHeight: '1.75',
        margin: '0 0 14px',
    },
    card: {
        backgroundColor: '#f8fbfd',
        border: '1px solid #e2edf5',
        borderRadius: '18px',
        padding: '22px',
        margin: '24px 0',
    },
    cardTitle: {
        color: '#0f172a',
        fontSize: '18px',
        fontWeight: '700',
        margin: '0 0 16px',
    },
    tableLabel: {
        color: '#64748b',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        paddingBottom: '10px',
    },
    tableValue: {
        color: '#0f172a',
        fontSize: '15px',
        fontWeight: '600',
        textAlign: 'right' as const,
        paddingBottom: '10px',
    },
    highlightCard: {
        backgroundColor: '#fefce8',
        border: '1px solid #fde68a',
        borderRadius: '18px',
        padding: '22px',
        margin: '24px 0',
    },
    highlightTitle: {
        color: '#854d0e',
        fontSize: '17px',
        fontWeight: '700',
        margin: '0 0 10px',
    },
    listLine: {
        color: '#713f12',
        fontSize: '14px',
        lineHeight: '1.75',
        margin: '0 0 8px',
    },
    infoCard: {
        backgroundColor: '#ecfeff',
        border: '1px solid #a5f3fc',
        borderRadius: '18px',
        padding: '22px',
        margin: '24px 0',
    },
    infoTitle: {
        color: '#155e75',
        fontSize: '17px',
        fontWeight: '700',
        margin: '0 0 10px',
    },
    infoText: {
        color: '#0f766e',
        fontSize: '14px',
        lineHeight: '1.7',
        margin: '0',
    },
    metaCard: {
        backgroundColor: '#f8fafc',
        border: '1px dashed #cbd5e1',
        borderRadius: '18px',
        padding: '20px 22px',
        margin: '24px 0',
    },
    metaLabel: {
        color: '#64748b',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        margin: '0 0 8px',
    },
    metaValue: {
        color: '#0f172a',
        fontSize: '14px',
        fontWeight: '700',
        fontFamily: 'Menlo, Monaco, Consolas, monospace',
        margin: '0',
    },
    contactRow: {
        marginTop: '18px',
    },
    primaryButton: {
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderRadius: '999px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        padding: '13px 22px',
        display: 'inline-block',
        marginRight: '12px',
        marginBottom: '12px',
    },
    secondaryButton: {
        backgroundColor: '#ecfeff',
        color: '#155e75',
        borderRadius: '999px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        padding: '13px 22px',
        display: 'inline-block',
        marginBottom: '12px',
        border: '1px solid #a5f3fc',
    },
    footer: {
        padding: '0 36px 30px',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: '12px',
        lineHeight: '1.7',
        textAlign: 'center' as const,
        margin: '0',
    },
};

export const ReservationTemplate = ({
    reservationId,
    customerName,
    customerPhone,
    tourName,
    bookingOptionName,
    date,
    requestedTime,
    guests,
    totalPrice,
    locale,
    t,
}: ReservationTemplateProps) => {
    const previewText = t('preview', { tourName });
    const formattedDate = formatReservationDate(date, locale);
    const contactWhatsApp = (customerPhone || '').trim();

    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section style={styles.hero}>
                        <Text style={styles.eyebrow}>{t('eyebrow')}</Text>
                        <Heading style={styles.heroTitle}>{t('title')}</Heading>
                        <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
                        <Text style={styles.statusPill}>{t('statusBadge')}</Text>
                    </Section>

                    <Section style={styles.content}>
                        <Text style={styles.text}>{t('greeting', { customerName })}</Text>
                        <Text style={styles.text}>{t('intro', { tourName })}</Text>

                        <Section style={styles.card}>
                            <Heading style={styles.cardTitle}>{t('summaryTitle')}</Heading>
                            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                                <tbody>
                                    <tr>
                                        <td style={styles.tableLabel}>{t('summaryTour')}</td>
                                        <td style={styles.tableValue}>{tourName}</td>
                                    </tr>
                                    {bookingOptionName ? (
                                        <tr>
                                            <td style={styles.tableLabel}>{t('summaryOption')}</td>
                                            <td style={styles.tableValue}>{bookingOptionName}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td style={styles.tableLabel}>{t('summaryDate')}</td>
                                        <td style={styles.tableValue}>{formattedDate}</td>
                                    </tr>
                                    {requestedTime ? (
                                        <tr>
                                            <td style={styles.tableLabel}>{t('summaryTime')}</td>
                                            <td style={styles.tableValue}>{requestedTime}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td style={styles.tableLabel}>{t('summaryTravelers')}</td>
                                        <td style={styles.tableValue}>
                                            {guests} {guests === 1 ? t('detailsTraveler') : t('detailsTravelersPlural')}
                                        </td>
                                    </tr>
                                    {contactWhatsApp ? (
                                        <tr>
                                            <td style={styles.tableLabel}>{t('summaryWhatsapp')}</td>
                                            <td style={styles.tableValue}>{contactWhatsApp}</td>
                                        </tr>
                                    ) : null}
                                    <tr>
                                        <td style={{ ...styles.tableLabel, paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>
                                            {t('summaryTotal')}
                                        </td>
                                        <td style={{ ...styles.tableValue, paddingTop: '12px', borderTop: '1px solid #dbe7f0', color: '#0f766e', fontSize: '18px' }}>
                                            Q{totalPrice.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Section>

                        <Section style={styles.highlightCard}>
                            <Heading style={styles.highlightTitle}>{t('nextStepsTitle')}</Heading>
                            <Text style={styles.listLine}>1. {t('nextStep1')}</Text>
                            <Text style={styles.listLine}>2. {t('nextStep2')}</Text>
                            <Text style={{ ...styles.listLine, marginBottom: 0 }}>3. {t('nextStep3')}</Text>
                        </Section>

                        <Section style={styles.infoCard}>
                            <Heading style={styles.infoTitle}>{t('paymentTitle')}</Heading>
                            <Text style={styles.infoText}>{t('paymentDesc')}</Text>
                        </Section>

                        <Section style={styles.metaCard}>
                            <Text style={styles.metaLabel}>{t('requestIdLabel')}</Text>
                            <Text style={styles.metaValue}>{reservationId}</Text>
                        </Section>

                        <Section style={styles.contactRow}>
                            <Heading style={styles.cardTitle}>{t('contactTitle')}</Heading>
                            <Text style={styles.text}>{t('contactLine')}</Text>
                            <Button href={`mailto:${CONTACT_INFO.email}`} style={styles.primaryButton}>
                                {CONTACT_INFO.email}
                            </Button>
                            <Button href={CONTACT_INFO.whatsappLink} style={styles.secondaryButton}>
                                {t('contactWhatsApp')}
                            </Button>
                        </Section>
                    </Section>

                    <Section style={styles.footer}>
                        <Text style={styles.footerText}>
                            {t('footerNote')}
                            <br />
                            {t('footerSignature')}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ReservationTemplate;
