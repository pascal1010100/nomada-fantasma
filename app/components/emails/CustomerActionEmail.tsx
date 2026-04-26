import { Body, Button, Container, Font, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface PaymentOption {
  title: string;
  details: string[];
  ctaLabel?: string;
  ctaHref?: string;
  isPrimary?: boolean;
}

interface CustomerActionEmailProps {
  preview: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  greeting: string;
  intro: string;
  summaryTitle: string;
  serviceLabel: string;
  serviceValue: string;
  optionLabel?: string;
  optionValue?: string;
  dateLabel: string;
  dateValue: string;
  travelersLabel: string;
  travelersValue?: string;
  priceLabel?: string;
  priceValue?: string;
  requestIdLabel: string;
  requestId: string;
  infoTitle: string;
  infoBody: string;
  paymentTitle?: string;
  paymentOptions?: PaymentOption[];
  contactTitle: string;
  contactLine: string;
  contactWhatsAppLabel: string;
  footerNote: string;
  footerSignature: string;
}


export default function CustomerActionEmail({
  preview,
  eyebrow,
  title,
  subtitle,
  greeting,
  intro,
  summaryTitle,
  serviceLabel,
  serviceValue,
  optionLabel,
  optionValue,
  dateLabel,
  dateValue,
  travelersLabel,
  travelersValue,
  priceLabel,
  priceValue,
  requestIdLabel,
  requestId,
  infoTitle,
  infoBody,
  paymentTitle,
  paymentOptions,
  contactTitle,
  contactLine,
  contactWhatsAppLabel,
  footerNote,
  footerSignature,
}: CustomerActionEmailProps) {
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
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#f3f7fb', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <Section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', padding: '40px 36px 36px' }}>
            <Text style={{ color: '#38bdf8', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '800', margin: '0 0 16px' }}>
              {eyebrow}
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '32px', lineHeight: '1.2', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {title}
            </Heading>
            <Text style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', margin: '16px 0 0' }}>
              {subtitle}
            </Text>
          </Section>

          <Section style={{ padding: '32px 36px 36px' }}>
            <Heading style={{ color: '#0f172a', fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>
              {greeting}
            </Heading>

            <Text style={{ color: '#475569', fontSize: '15px', lineHeight: '1.75', margin: '0 0 14px' }}>
              {intro}
            </Text>

            <Section style={{ backgroundColor: '#fcfdfe', border: '1px solid #e5eaf0', borderRadius: '24px', padding: '24px', margin: '24px 0' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                {summaryTitle}
              </Heading>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: '12px' }}>
                      {serviceLabel}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, textAlign: 'right', paddingBottom: '12px' }}>
                      {serviceValue}
                    </td>
                  </tr>
                  {optionLabel && optionValue ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: '12px' }}>
                        {optionLabel}
                      </td>
                      <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, textAlign: 'right', paddingBottom: '12px' }}>
                        {optionValue}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: '12px' }}>
                      {dateLabel}
                    </td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, textAlign: 'right', paddingBottom: '12px' }}>
                      {dateValue}
                    </td>
                  </tr>
                  {travelersValue ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: '12px' }}>
                        {travelersLabel}
                      </td>
                      <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, textAlign: 'right', paddingBottom: '12px' }}>
                        {travelersValue}
                      </td>
                    </tr>
                  ) : null}
                  {priceLabel && priceValue ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingBottom: '12px' }}>
                        {priceLabel}
                      </td>
                      <td style={{ fontSize: '16px', fontWeight: 800, textAlign: 'right', paddingBottom: '12px', color: '#0891b2' }}>
                        {priceValue}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      {requestIdLabel}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '13px', fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      {requestId}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '20px', padding: '24px', margin: '24px 0' }}>
              <Heading style={{ color: '#92400e', fontSize: '16px', fontWeight: 800, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {infoTitle}
              </Heading>
              <Text style={{ color: '#b45309', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                {infoBody}
              </Text>
            </Section>

            {paymentTitle && (
              <Heading style={{ color: '#0f172a', fontSize: '20px', fontWeight: 800, margin: '40px 0 20px', letterSpacing: '-0.01em' }}>
                {paymentTitle}
              </Heading>
            )}

            {paymentOptions && paymentOptions.length > 0 && (
              <Section>
                {paymentOptions.map((option, idx) => (
                  <Section 
                    key={idx} 
                    style={{ 
                      backgroundColor: option.isPrimary ? '#f0f9ff' : '#ffffff', 
                      border: `1px solid ${option.isPrimary ? '#bae6fd' : '#e2e8f0'}`, 
                      borderRadius: '24px', 
                      padding: '24px', 
                      marginBottom: '20px',
                      boxShadow: option.isPrimary ? '0 4px 12px rgba(14, 165, 233, 0.08)' : 'none'
                    }}
                  >
                    <Heading style={{ color: option.isPrimary ? '#0369a1' : '#1e293b', fontSize: '17px', fontWeight: 800, margin: '0 0 12px' }}>
                      {option.title}
                    </Heading>
                    {option.details.map((detail, dIdx) => (
                      <Text key={dIdx} style={{ color: option.isPrimary ? '#0284c7' : '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 6px' }}>
                        {detail}
                      </Text>
                    ))}
                    {option.ctaLabel && option.ctaHref && (
                      <Button
                        href={option.ctaHref}
                        style={{ 
                          backgroundColor: option.isPrimary ? '#0f172a' : '#ffffff', 
                          color: option.isPrimary ? '#ffffff' : '#0f172a', 
                          border: `1px solid #0f172a`,
                          borderRadius: '12px', 
                          textDecoration: 'none', 
                          fontSize: '14px', 
                          fontWeight: 700, 
                          padding: '12px 24px', 
                          marginTop: '16px',
                          display: 'inline-block' 
                        }}
                      >
                        {option.ctaLabel}
                      </Button>
                    )}
                  </Section>
                ))}
              </Section>
            )}


            <Section style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '22px', margin: '24px 0 0' }}>
              <Heading style={{ color: '#0f172a', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                {contactTitle}
              </Heading>
              <Text style={{ color: '#475569', fontSize: '14px', lineHeight: '1.75', margin: '0 0 14px' }}>
                {contactLine}
              </Text>
              <Button
                href="mailto:hola@nomadafantasma.com"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '999px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '13px 22px', display: 'inline-block', marginRight: '12px', marginBottom: '12px' }}
              >
                hola@nomadafantasma.com
              </Button>
              <Button
                href="https://wa.me/50242900009"
                style={{ backgroundColor: '#ecfeff', color: '#155e75', borderRadius: '999px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '13px 22px', display: 'inline-block', marginBottom: '12px', border: '1px solid #a5f3fc' }}
              >
                {contactWhatsAppLabel}
              </Button>
            </Section>
          </Section>

          <Section style={{ padding: '0 36px 30px' }}>
            <Text style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.7', textAlign: 'center', margin: 0 }}>
              {footerNote}
              <br />
              {footerSignature}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
