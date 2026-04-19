import { Html, Head, Body, Container, Section, Text, Heading, Font, Link, Preview } from '@react-email/components';

interface ShuttleAgencyNotificationProps {
  bookingId?: string;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime?: string;
  passengers: number;
  pickupLocation: string;
  type: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string | null;
  createdAt?: string;
  operationsEmail: string;
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

export default function ShuttleAgencyNotification({
  bookingId,
  origin,
  destination,
  travelDate,
  travelTime,
  passengers,
  pickupLocation,
  type,
  customerName,
  customerEmail,
  customerWhatsapp,
  createdAt,
  operationsEmail
}: ShuttleAgencyNotificationProps) {
  const routeLabel = `${origin} → ${destination}`;
  const normalizedOperationsEmail = operationsEmail.trim();
  const replySubject = bookingId
    ? `Disponibilidad shuttle ${bookingId} · ${routeLabel}`
    : `Disponibilidad shuttle · ${routeLabel}`;
  const operationsMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(replySubject)}`;
  const confirmSubject = bookingId
    ? `Disponible shuttle ${bookingId} · ${routeLabel}`
    : `Disponible shuttle · ${routeLabel}`;
  const denySubject = bookingId
    ? `No disponible shuttle ${bookingId} · ${routeLabel}`
    : `No disponible shuttle · ${routeLabel}`;
  const confirmBody = [
    'Hola equipo de operaciones,',
    '',
    'Confirmamos disponibilidad para esta reserva de shuttle.',
    '',
    `Ruta: ${routeLabel}`,
    `Fecha: ${formatDate(travelDate)}`,
    travelTime ? `Hora: ${travelTime}` : null,
    `Pasajeros: ${passengers}`,
    `Pickup viable: ${pickupLocation}`,
    '',
    'Notas operativas:',
    '- ',
    '',
    'Saludos,'
  ].filter(Boolean).join('\n');
  const denyBody = [
    'Hola equipo de operaciones,',
    '',
    'No tenemos disponibilidad para esta reserva en la condición solicitada.',
    '',
    `Ruta: ${routeLabel}`,
    `Fecha: ${formatDate(travelDate)}`,
    travelTime ? `Hora: ${travelTime}` : null,
    `Pasajeros: ${passengers}`,
    '',
    'Motivo:',
    '- ',
    '',
    'Alternativa sugerida:',
    '- ',
    '',
    'Saludos,'
  ].filter(Boolean).join('\n');
  const confirmMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(confirmSubject)}&body=${encodeURIComponent(confirmBody)}`;
  const denyMailto = `mailto:${normalizedOperationsEmail}?subject=${encodeURIComponent(denySubject)}&body=${encodeURIComponent(denyBody)}`;

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
      <Preview>Agencia asignada: {routeLabel} · {travelDate}</Preview>
      <Body style={{ backgroundColor: '#f3f7fb', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #dbe7f0', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)' }}>
          <Section style={{ background: 'linear-gradient(135deg, #164e63 0%, #0f766e 55%, #14b8a6 100%)', padding: '34px 36px 30px' }}>
            <Text style={{ color: '#ccfbf1', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 14px' }}>
              Agencia asignada
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '30px', lineHeight: '1.15', fontWeight: 700, margin: 0 }}>
              Nueva reserva por confirmar
            </Heading>
            <Text style={{ color: '#cffafe', fontSize: '15px', lineHeight: '1.7', margin: '14px 0 0' }}>
              Necesitamos validar disponibilidad operativa de esta ruta para continuar el cierre con el viajero.
            </Text>
            <Text style={{ display: 'inline-block', marginTop: '18px', backgroundColor: '#ecfeff', color: '#155e75', borderRadius: '999px', padding: '8px 14px', fontSize: '12px', fontWeight: 700 }}>
              Respuesta requerida
            </Text>
          </Section>

          <Section style={{ padding: '32px 36px 36px' }}>
            <Section style={{ margin: '0 0 24px' }}>
              <Text style={{ color: '#475569', fontSize: '13px', textAlign: 'center', margin: '0 0 14px' }}>
                Responde en segundos con una de estas opciones y el sistema abrirá un correo ya preparado para operaciones.
              </Text>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
                      <Section style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #86efac', borderRadius: '18px', padding: '18px', minHeight: '172px', boxShadow: '0 10px 24px rgba(16, 185, 129, 0.10)' }}>
                        <Text style={{ color: '#047857', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>
                          Respuesta positiva
                        </Text>
                        <Heading style={{ color: '#065f46', fontSize: '20px', lineHeight: '1.2', fontWeight: 700, margin: '0 0 10px' }}>
                          Sí, podemos operarlo
                        </Heading>
                        <Text style={{ color: '#065f46', fontSize: '14px', lineHeight: '1.65', margin: '0 0 16px' }}>
                          Usa este botón si la ruta y la franja horaria están disponibles tal como se solicitaron.
                        </Text>
                        <Link
                          href={confirmMailto}
                          style={{ backgroundColor: '#047857', color: '#ffffff', padding: '12px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', boxShadow: '0 8px 18px rgba(4, 120, 87, 0.22)' }}
                        >
                          Confirmar disponibilidad
                        </Link>
                      </Section>
                    </td>
                    <td style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
                      <Section style={{ background: 'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)', border: '1px solid #fda4af', borderRadius: '18px', padding: '18px', minHeight: '172px', boxShadow: '0 10px 24px rgba(244, 63, 94, 0.10)' }}>
                        <Text style={{ color: '#be123c', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 8px' }}>
                          Respuesta negativa
                        </Text>
                        <Heading style={{ color: '#9f1239', fontSize: '20px', lineHeight: '1.2', fontWeight: 700, margin: '0 0 10px' }}>
                          No está disponible
                        </Heading>
                        <Text style={{ color: '#9f1239', fontSize: '14px', lineHeight: '1.65', margin: '0 0 16px' }}>
                          Usa este botón si no puedes operar esta reserva y quieres responder con motivo o alternativa.
                        </Text>
                        <Link
                          href={denyMailto}
                          style={{ backgroundColor: '#be123c', color: '#ffffff', padding: '12px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', boxShadow: '0 8px 18px rgba(190, 24, 93, 0.20)' }}
                        >
                          No disponible
                        </Link>
                      </Section>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#f8fafc', border: '1px solid #dbe7f0', borderRadius: '18px', padding: '18px 20px', margin: '0 0 24px' }}>
              <Text style={{ color: '#475569', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 14px' }}>
                Lectura rápida
              </Text>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr>
                    <td style={{ width: '33.33%', paddingRight: '8px', verticalAlign: 'top' }}>
                      <Section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                        <Text style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                          Ruta
                        </Text>
                        <Text style={{ color: '#0f172a', fontSize: '14px', lineHeight: '1.5', fontWeight: 700, margin: 0 }}>
                          {routeLabel}
                        </Text>
                      </Section>
                    </td>
                    <td style={{ width: '33.33%', paddingLeft: '4px', paddingRight: '4px', verticalAlign: 'top' }}>
                      <Section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                        <Text style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                          Fecha
                        </Text>
                        <Text style={{ color: '#0f172a', fontSize: '14px', lineHeight: '1.5', fontWeight: 700, margin: 0 }}>
                          {formatDate(travelDate)}
                        </Text>
                      </Section>
                    </td>
                    <td style={{ width: '33.33%', paddingLeft: '8px', verticalAlign: 'top' }}>
                      <Section style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                        <Text style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                          Grupo
                        </Text>
                        <Text style={{ color: '#0f172a', fontSize: '14px', lineHeight: '1.5', fontWeight: 700, margin: 0 }}>
                          {passengers} {passengers === 1 ? 'persona' : 'personas'}
                        </Text>
                      </Section>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#f8fbfd', border: '1px solid #e2edf5', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, margin: '0 0 16px' }}>
                Detalles de la ruta
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
                  {bookingId ? (
                    <tr>
                      <td style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>ID solicitud</td>
                      <td style={{ color: '#0f172a', fontSize: '14px', fontWeight: 700, fontFamily: 'Menlo, Monaco, Consolas, monospace', textAlign: 'right', paddingTop: '12px', borderTop: '1px solid #dbe7f0' }}>{bookingId}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </Section>

            <Section style={{ backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#155e75', fontSize: '17px', fontWeight: 700, margin: '0 0 12px' }}>
                Referencia del viajero
              </Heading>
              <Text style={{ color: '#0f766e', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px' }}>
                <strong>Nombre:</strong> {customerName}
              </Text>
              <Text style={{ color: '#0f766e', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                <strong>Email:</strong> {customerEmail}
              </Text>
              {customerWhatsapp ? (
                <Text style={{ color: '#0f766e', fontSize: '14px', lineHeight: '1.7', margin: '8px 0 0' }}>
                  <strong>WhatsApp:</strong> {customerWhatsapp}
                </Text>
              ) : null}
            </Section>

            <Section style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', borderRadius: '18px', padding: '22px', margin: '0 0 24px' }}>
              <Heading style={{ color: '#854d0e', fontSize: '17px', fontWeight: 700, margin: '0 0 10px' }}>
                Lo que necesitamos de tu lado
              </Heading>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>1. Confirma disponibilidad para esta fecha y franja horaria.</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: '0 0 8px' }}>2. Indica cualquier restricción relevante de pickup o logística.</Text>
              <Text style={{ color: '#713f12', fontSize: '14px', lineHeight: '1.75', margin: 0 }}>3. Responde a operaciones para que Nómada Fantasma cierre el siguiente paso con el viajero.</Text>
            </Section>

            <Section style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Link
                href={operationsMailto}
                style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', display: 'inline-block', marginBottom: '10px' }}
              >
                Escribir manualmente a operaciones
              </Link>
            </Section>

            <Text style={{ color: '#0f766e', fontSize: '13px', textAlign: 'center', margin: '0 0 24px' }}>
              Si el botón no abre tu correo, responde manualmente a <strong>{normalizedOperationsEmail}</strong>.
            </Text>

            <Text style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Solicitud asignada: {formatTimestamp(createdAt)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
