import { Html, Head, Body, Container, Section, Text, Heading, Font, Link, Preview } from '@react-email/components';

interface ShuttleAdminNotificationProps {
  bookingId?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string | null;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime?: string;
  passengers: number;
  pickupLocation: string;
  type: string;
  price?: number;
  createdAt?: string;
  adminPanelUrl?: string;
}

function formatDate(dateString: string) {
  const parts = dateString.split('-').map(Number);
  const date = parts.length === 3
    ? new Date(parts[0], parts[1] - 1, parts[2], 12)
    : new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTimestamp(value?: string) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function ShuttleAdminNotification({
  bookingId,
  customerName,
  customerEmail,
  customerWhatsapp,
  origin,
  destination,
  travelDate,
  travelTime,
  passengers,
  pickupLocation,
  type,
  price,
  createdAt,
  adminPanelUrl
}: ShuttleAdminNotificationProps) {
  const routeLabel = `${origin} → ${destination}`;
  const isShared = type === 'shared';
  const unitPrice = typeof price === 'number' ? price : null;
  const estimatedTotal = unitPrice !== null ? (isShared ? unitPrice * passengers : unitPrice) : null;

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
      <Preview>Operaciones: {routeLabel} · {travelDate}</Preview>
      <Body style={{ backgroundColor: '#f3f7fb', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <Section style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 55%, #dc2626 100%)', padding: '34px 36px 30px' }}>
            <Text style={{ color: '#fecaca', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 14px' }}>
              Operaciones Shuttle
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '30px', lineHeight: '1.15', fontWeight: 700, margin: 0 }}>
              Nueva reserva por validar
            </Heading>
            <Text style={{ color: '#fee2e2', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
              Hay una nueva reserva de shuttle que requiere validación operativa y seguimiento con el cliente.
            </Text>
            <Text style={{ display: 'inline-block', marginTop: '18px', backgroundColor: '#fff1f2', color: '#9f1239', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: 700 }}>
              Pendiente de revisión
            </Text>
          </Section>

          <Section style={{ padding: '32px 36px 36px' }}>
            <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                Resumen de la reserva
              </Heading>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>Ruta</td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{routeLabel}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>Fecha</td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{formatDate(travelDate)}</td>
                  </tr>
                  {travelTime ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>Hora</td>
                      <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{travelTime}</td>
                    </tr>
                  ) : null}
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>Pasajeros</td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{passengers} {passengers === 1 ? 'persona' : 'personas'}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>Tipo</td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{type === 'shared' ? 'Shuttle compartido' : 'Traslado privado'}</td>
                  </tr>
                  <tr>
                    <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', verticalAlign: 'top', paddingBottom: '10px' }}>Recogida</td>
                    <td style={{ color: '#0f172a', fontSize: '15px', fontWeight: 600, textAlign: 'right', paddingBottom: '10px' }}>{pickupLocation}</td>
                  </tr>
                  {unitPrice !== null ? (
                    <>
                      <tr>
                        <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: '1px solid #dbe7f0', paddingBottom: '10px' }}>
                          {isShared ? 'Referencia por persona' : 'Referencia total'}
                        </td>
                        <td style={{ color: '#0f766e', fontSize: '16px', fontWeight: 700, textAlign: 'right', paddingTop: '12px', borderTop: '1px solid #dbe7f0', paddingBottom: '10px' }}>
                          {isShared ? `Q${unitPrice.toFixed(2)} por persona` : `Q${unitPrice.toFixed(2)} total`}
                        </td>
                      </tr>
                      {estimatedTotal !== null ? (
                        <tr>
                          <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '10px' }}>
                            Total estimado
                          </td>
                          <td style={{ color: '#0f766e', fontSize: '18px', fontWeight: 700, textAlign: 'right', paddingBottom: '10px' }}>
                            {isShared ? `Q${estimatedTotal.toFixed(2)} (${passengers} ${passengers === 1 ? 'persona' : 'personas'})` : `Q${estimatedTotal.toFixed(2)}`}
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ) : null}
                  {bookingId ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: unitPrice !== null ? undefined : '1px solid #dbe7f0' }}>ID solicitud</td>
                      <td style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, fontFamily: 'Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '12px', borderTop: unitPrice !== null ? undefined : '1px solid #dbe7f0' }}>{bookingId}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#991b1b', fontSize: '17px', fontWeight: 700, margin: '0 0 12px' }}>
                Contacto del cliente
              </Heading>
              <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}>
                <strong>Nombre:</strong> {customerName}
              </Text>
              <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                <strong>Email:</strong> {customerEmail}
              </Text>
              {customerWhatsapp ? (
                <Text style={{ color: '#7f1d1d', fontSize: '14px', lineHeight: '1.7', margin: '8px 0 0' }}>
                  <strong>WhatsApp:</strong> {customerWhatsapp}
                </Text>
              ) : null}
            </Section>

            <Section style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#854d0e', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                Acción recomendada
              </Heading>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>1. Verifica disponibilidad operativa y ventana real de salida.</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>2. Confirma si el pickup es viable o si requiere ajuste.</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: 0 }}>3. Cierra seguimiento en el panel y comparte el siguiente paso con el cliente.</Text>
            </Section>

            <Section style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Link
                href={`mailto:${customerEmail}`}
                style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}
              >
                Escribir al cliente
              </Link>
              {adminPanelUrl ? (
                <Link
                  href={adminPanelUrl}
                  style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', marginBottom: '10px' }}
                >
                  Abrir panel operativo
                </Link>
              ) : null}
            </Section>

            <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Solicitud registrada: {formatTimestamp(createdAt)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
