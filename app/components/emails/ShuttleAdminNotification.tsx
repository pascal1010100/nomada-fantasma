import { Html, Head, Body, Container, Section, Text, Heading, Font } from '@react-email/components';

interface ShuttleAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime?: string;
  passengers: number;
  pickupLocation: string;
  type: string;
  price?: number;
}

export default function ShuttleAdminNotification({
  customerName,
  customerEmail,
  origin,
  destination,
  travelDate,
  travelTime,
  passengers,
  pickupLocation,
  type,
  price
}: ShuttleAdminNotificationProps) {
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
          <Section style={{ backgroundColor: '#dc2626', padding: '40px 40px 30px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <Heading style={{ color: '#ffffff', fontSize: '32px', fontWeight: 700, margin: 0, textAlign: 'center' }}>
              🚌 Nueva Solicitud de Shuttle
            </Heading>
            <Text style={{ color: '#fca5a5', fontSize: '16px', margin: '10px 0 0', textAlign: 'center' }}>
              Notificación de Reserva - Nómada Fantasma
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: '40px' }}>
            <Heading style={{ color: '#1e293b', fontSize: '24px', fontWeight: 600, marginBottom: '20px' }}>
              📋 Detalles de la Solicitud
            </Heading>
            
            {/* Customer Info */}
            <Section style={{ backgroundColor: '#fef2f2', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
              <Heading style={{ color: '#991b1b', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
                👤 Información del Cliente
              </Heading>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#7f1d1d', fontSize: '14px', fontWeight: 500 }}>NOMBRE</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {customerName}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#7f1d1d', fontSize: '14px', fontWeight: 500 }}>EMAIL</Text>
                  <a href={`mailto:${customerEmail}`} style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textDecoration: 'underline' }}>
                    {customerEmail}
                  </a>
                </div>
              </div>
            </Section>

            {/* Trip Details */}
            <Section style={{ backgroundColor: '#f0f9ff', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
              <Heading style={{ color: '#075985', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
                📍 Detalles del Viaje
              </Heading>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>RUTA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {origin} → {destination}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>FECHA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {formatDate(travelDate)}
                  </Text>
                </div>

                {travelTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>HORA</Text>
                    <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                      {travelTime}
                    </Text>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>PASAJEROS</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {passengers} {passengers === 1 ? 'persona' : 'personas'}
                  </Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>TIPO</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600 }}>
                    {type === 'shared' ? 'Shuttle Compartido' : 'Traslado Privado'}
                  </Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>RECOGIDA</Text>
                  <Text style={{ color: '#1e293b', fontSize: '16px', fontWeight: 600, textAlign: 'right', maxWidth: '250px' }}>
                    {pickupLocation}
                  </Text>
                </div>

                {price && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #bae6fd' }}>
                    <Text style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: 500 }}>PRECIO</Text>
                    <Text style={{ color: '#059669', fontSize: '18px', fontWeight: 700 }}>
                      Q{price}
                    </Text>
                  </div>
                )}
              </div>
            </Section>

            {/* Action Required */}
            <Section style={{ backgroundColor: '#fef3c7', padding: '25px', borderRadius: '8px', marginBottom: '25px' }}>
              <Heading style={{ color: '#92400e', fontSize: '16px', fontWeight: 600, marginBottom: '15px' }}>
                ⚡ Acción Requerida
              </Heading>
              <Text style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                1. Contactar a agencias de transporte para verificar disponibilidad<br />
                2. Confirmar precio y horario exacto<br />
                3. Responder al cliente con confirmación o alternativas<br />
                4. Coordinar detalles de pago y recogida
              </Text>
            </Section>

            {/* Quick Actions */}
            <Section style={{ textAlign: 'center', marginBottom: '25px' }}>
              <a
                href={`mailto:${customerEmail}`}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'inline-block',
                  marginRight: '10px',
                  marginBottom: '10px'
                }}
              >
                📧 Responder al Cliente
              </a>
              
              <a
                href="https://nomadafantasma.com/admin"
                style={{
                  backgroundColor: '#64748b',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}
              >
                📊 Ver en Panel Admin
              </a>
            </Section>

            {/* Timestamp */}
            <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Solicitud recibida: {new Date().toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f8fafc', padding: '30px 40px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              © 2024 Nómada Fantasma — Sistema de Notificaciones Automáticas<br />
              Por favor responder al cliente dentro de las próximas 24 horas
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
