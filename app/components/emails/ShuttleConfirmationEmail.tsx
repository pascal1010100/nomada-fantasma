import { Html, Head, Body, Container, Section, Text, Heading, Button, Font, Preview } from '@react-email/components';

interface ShuttleConfirmationEmailProps {
  bookingId?: string;
  customerName: string;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime?: string;
  passengers: number;
  pickupLocation: string;
  type: string;
  price?: number;
  t: (key: string, values?: Record<string, string | number>) => string;
  locale?: string;
}

export default function ShuttleConfirmationEmail({
  bookingId,
  customerName,
  origin,
  destination,
  travelDate,
  travelTime,
  passengers,
  pickupLocation,
  type,
  price,
  t,
  locale
}: ShuttleConfirmationEmailProps) {
  const isShared = type === 'shared';
  const unitPrice = typeof price === 'number' ? price : null;
  const estimatedTotal = unitPrice !== null ? (isShared ? unitPrice * passengers : unitPrice) : null;

  const formatDate = (dateString: string) => {
    const parts = dateString.split('-').map(Number);
    const date = parts.length === 3
      ? new Date(parts[0], parts[1] - 1, parts[2], 12)
      : new Date(dateString);
    return date.toLocaleDateString(locale || 'es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      <Preview>{t('preview', { origin, destination })}</Preview>
      <Body style={{ backgroundColor: '#f3f7fb', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <Section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #164e63 55%, #0f766e 100%)', padding: '36px 36px 30px' }}>
            <Text style={{ color: '#a5f3fc', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 14px' }}>
              {t('eyebrow')}
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '31px', lineHeight: '1.15', fontWeight: 700, margin: 0 }}>
              {t('title')}
            </Heading>
            <Text style={{ color: '#cffafe', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
              {t('subtitle')}
            </Text>
            <Text style={{ display: 'inline-block', marginTop: '18px', backgroundColor: '#ecfeff', color: '#155e75', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: 700 }}>
              {t('statusBadge')}
            </Text>
          </Section>

          <Section style={{ padding: '32px 36px 36px' }}>
            <Heading style={{ color: '#0f172a', fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>
              {t('greeting', { customerName })}
            </Heading>

            <Text style={{ color: '#475569', fontSize: '15px', lineHeight: '1.75', margin: '0 0 14px' }}>
              {t('intro')}
            </Text>

            <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '24px 0' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                {t('detailsTitle')}
              </Heading>

              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                      {t('routeLabel')}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>
                      {origin} → {destination}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                      {t('dateLabel')}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>
                      {formatDate(travelDate)}
                    </td>
                  </tr>
                  {travelTime ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                        {t('timeLabel')}
                      </td>
                      <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>
                        {travelTime}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                      {t('passengersLabel')}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>
                      {passengers} {passengers === 1 ? t('passengerSingle') : t('passengerPlural')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                      {t('typeLabel')}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>
                      {type === 'shared' ? t('typeShared') : t('typePrivate')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', verticalAlign: 'top', paddingBottom: price || bookingId ? '10px' : '0' }}>
                      {t('pickupLabel')}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: price || bookingId ? '10px' : '0' }}>
                      {pickupLocation}
                    </td>
                  </tr>
                  {unitPrice !== null ? (
                    <>
                      <tr>
                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: '1px solid #dbe7f0', paddingBottom: '10px' }}>
                          {isShared ? t('pricePerPersonLabel') : t('priceTotalLabel')}
                        </td>
                        <td style={{ color: '#0f766e', fontSize: '16px', fontWeight: 700, textAlign: 'right', paddingTop: '12px', borderTop: '1px solid #dbe7f0', paddingBottom: '10px' }}>
                          {isShared ? t('pricePerPersonValue', { price: unitPrice.toFixed(2) }) : t('priceTotalValue', { price: unitPrice.toFixed(2) })}
                        </td>
                      </tr>
                      {isShared && estimatedTotal !== null && passengers > 1 ? (
                        <tr>
                          <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                            {t('estimatedTotalLabel')}
                          </td>
                          <td style={{ color: '#0f766e', fontSize: '18px', fontWeight: 700, textAlign: 'right', paddingBottom: '10px' }}>
                            {t('estimatedTotalValue', { total: estimatedTotal.toFixed(2), passengers })}
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ) : null}
                  {bookingId ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: unitPrice !== null ? undefined : '1px solid #dbe7f0' }}>
                        {t('requestIdLabel')}
                      </td>
                      <td style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, fontFamily: 'Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '12px', borderTop: unitPrice !== null ? undefined : '1px solid #dbe7f0' }}>
                        {bookingId}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '18px', padding: '22px', margin: '24px 0' }}>
              <Heading style={{ color: '#854d0e', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                {t('nextStepsTitle')}
              </Heading>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>1. {t('nextSteps1')}</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>2. {t('nextSteps2')}</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: 0 }}>3. {t('nextSteps3')}</Text>
            </Section>

            <Section style={{ backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '18px', padding: '22px', margin: '24px 0' }}>
              <Heading style={{ color: '#155e75', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                {t('contactTitle')}
              </Heading>
              <Text style={{ color: '#0f766e', fontSize: '14px', lineHeight: '1.7', margin: '0 0 14px' }}>
                {t('contactLine')}
              </Text>
              <Button
                href="mailto:hola@nomadafantasma.com"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '13px 22px',
                  display: 'inline-block',
                  marginRight: '12px',
                  marginBottom: '12px'
                }}
              >
                hola@nomadafantasma.com
              </Button>
              <Button
                href="https://wa.me/50242900009"
                style={{
                  backgroundColor: '#ecfeff',
                  color: '#155e75',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '13px 22px',
                  display: 'inline-block',
                  marginBottom: '12px',
                  border: '1px solid #a5f3fc'
                }}
              >
                {t('contactWhatsApp')}
              </Button>
            </Section>
          </Section>

          <Section style={{ padding: '0 36px 30px' }}>
            <Text style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.7', textAlign: 'center', margin: 0 }}>
              {t('footerNote')}
              <br />
              {t('footerSignature')}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
