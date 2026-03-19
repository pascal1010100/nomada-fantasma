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
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{t('preview', { origin, destination })}</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#0f172a', padding: '40px 40px 30px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '32px', fontWeight: 700, margin: 0, textAlign: 'center' }}>
              🚌 Nómada Fantasma
            </Heading>
            <Text style={{ color: '#94a3b8', fontSize: '16px', margin: '10px 0 0', textAlign: 'center' }}>
              {t('subtitle')}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '40px' }}>
            <Heading style={{ color: '#1e293b', fontSize: '24px', fontWeight: 600, marginBottom: '20px' }}>
              {t('greeting', { customerName })} 🎉
            </Heading>
            
            <Text style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
              {t('intro')}
            </Text>

            {/* Trip Details Card */}
            <Section style={{ backgroundColor: '#f1f5f9', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                📍 {t('detailsTitle')}
              </Heading>
              
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, paddingBottom: '8px' }}>
                      {t('routeLabel')}
                    </td>
                    <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                      {origin} → {destination}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, paddingBottom: '8px' }}>
                      {t('dateLabel')}
                    </td>
                    <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                      {formatDate(travelDate)}
                    </td>
                  </tr>
                  {travelTime ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, paddingBottom: '8px' }}>
                        {t('timeLabel')}
                      </td>
                      <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                        {travelTime}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, paddingBottom: '8px' }}>
                      {t('passengersLabel')}
                    </td>
                    <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                      {passengers} {passengers === 1 ? t('passengerSingle') : t('passengerPlural')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, paddingBottom: '8px' }}>
                      {t('typeLabel')}
                    </td>
                    <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', paddingBottom: '8px' }}>
                      {type === 'shared' ? t('typeShared') : t('typePrivate')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, verticalAlign: 'top' }}>
                      {t('pickupLabel')}
                    </td>
                    <td style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', maxWidth: '250px' }}>
                      {pickupLocation}
                    </td>
                  </tr>
                </tbody>
              </table>

              {price && (
                <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                        {t('priceLabel')}
                      </td>
                      <td style={{ color: '#059669', fontSize: '18px', fontWeight: 700, textAlign: 'right' }}>
                        Q{price}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {bookingId ? (
                <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                        {t('requestIdLabel')}
                      </td>
                      <td style={{ color: '#1e293b', fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', textAlign: 'right' }}>
                        {bookingId}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </Section>

            {/* Next Steps */}
            <Section style={{ backgroundColor: '#fef3c7', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
              <Heading style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
                ⏰ {t('nextStepsTitle')}
              </Heading>
              <Text style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {t('nextSteps1')}<br />
                {t('nextSteps2')}<br />
                {t('nextSteps3')}<br />
                {t('nextSteps4')}
              </Text>
            </Section>

            {/* Contact Info */}
            <Text style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>
              {t('questions')}<br />
              <a href="mailto:hola@nomadafantasma.com" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                hola@nomadafantasma.com
              </a>
            </Text>

            {/* CTA Button */}
            <Button
              href="https://nomadafantasma.com/shuttles"
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px',
                display: 'block',
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              {t('cta')}
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f8fafc', padding: '30px 40px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              © 2024 Nómada Fantasma — Hecho con 💙 desde Guatemala<br />
              Este es un correo automático, por favor no responder.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
