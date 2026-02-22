import { Html, Head, Body, Container, Section, Text, Heading, Button, Font } from '@react-email/components';

interface ShuttleConfirmationEmailProps {
  customerName: string;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime?: string;
  passengers: number;
  pickupLocation: string;
  type: string;
  price?: number;
}

export default function ShuttleConfirmationEmail({
  customerName,
  origin,
  destination,
  travelDate,
  travelTime,
  passengers,
  pickupLocation,
  type,
  price
}: ShuttleConfirmationEmailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
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
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#0f172a', padding: '40px 40px 30px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '32px', fontWeight: 700, margin: 0, textAlign: 'center' }}>
              🚌 Nómada Fantasma
            </Heading>
            <Text style={{ color: '#94a3b8', fontSize: '16px', margin: '10px 0 0', textAlign: 'center' }}>
              Tu solicitud de shuttle ha sido recibida
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '40px' }}>
            <Heading style={{ color: '#1e293b', fontSize: '24px', fontWeight: 600, marginBottom: '20px' }}>
              ¡Hola {customerName}! 🎉
            </Heading>
            
            <Text style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
              Hemos recibido tu solicitud de transporte. Nuestro equipo está revisando la disponibilidad y te contactaremos en menos de 24 horas con la confirmación final.
            </Text>

            {/* Trip Details Card */}
            <Section style={{ backgroundColor: '#f1f5f9', padding: '30px', borderRadius: '8px', marginBottom: '30px' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                📍 Detalles de tu Viaje
              </Heading>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>RUTA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {origin} → {destination}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>FECHA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {formatDate(travelDate)}
                  </Text>
                </div>

                {travelTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>HORA</Text>
                    <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                      {travelTime}
                    </Text>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>PASAJEROS</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {passengers} {passengers === 1 ? 'persona' : 'personas'}
                  </Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>TIPO</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {type === 'shared' ? 'Shuttle Compartido' : 'Traslado Privado'}
                  </Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>RECOGIDA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', maxWidth: '250px' }}>
                    {pickupLocation}
                  </Text>
                </div>

                {price && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>PRECIO ESTIMADO</Text>
                    <Text style={{ color: '#059669', fontSize: '18px', fontWeight: 700 }}>
                      Q{price}
                    </Text>
                  </div>
                )}
              </div>
            </Section>

            {/* Next Steps */}
            <Section style={{ backgroundColor: '#fef3c7', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
              <Heading style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
                ⏰ Próximos Pasos
              </Heading>
              <Text style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                1. Revisaremos disponibilidad con nuestras agencias asociadas<br />
                2. Te enviaremos un email con la confirmación y detalles de pago<br />
                3. Recibirás instrucciones exactas de punto de encuentro<br />
                4. ¡Listo para tu aventura en el Lago Atitlán!
              </Text>
            </Section>

            {/* Contact Info */}
            <Text style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>
              ¿Tienes preguntas? Contáctanos en<br />
              <a href="mailto:hola@nomadafantasma.com" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                hola@nomadafantasma.com
              </a>
            </Text>

            {/* CTA Button */}
            <Button
              href="https://nomadafantasma.com"
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
              Explorar más destinos
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
