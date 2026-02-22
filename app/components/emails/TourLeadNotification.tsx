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
    Tailwind,
} from '@react-email/components';

interface TourLeadNotificationProps {
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string;
    tourName: string;
    tourDate: string;
    notes?: string;
    reservationId: string;
}

export const TourLeadNotification = ({
    customerName,
    customerEmail,
    customerWhatsapp,
    tourName,
    tourDate,
    notes,
    reservationId,
}: TourLeadNotificationProps) => {
    return (
        <Html>
            <Head />
            <Preview>🎯 Nuevo Lead: {customerName} - {tourName}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px]">
                        {/* Header */}
                        <Section className="mt-[32px]">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-6 text-center">
                                <Heading className="text-white text-[28px] font-bold m-0">
                                    🎯 Nuevo Lead de Reserva
                                </Heading>
                                <Text className="text-white text-[14px] m-0 mt-2">
                                    {tourName}
                                </Text>
                            </div>
                        </Section>

                        {/* Customer Info */}
                        <Section className="bg-gray-50 rounded-lg p-6 my-6 border border-gray-100">
                            <Text className="text-gray-500 text-xs uppercase tracking-wider mb-4 font-semibold m-0">
                                📋 INFORMACIÓN DEL CLIENTE
                            </Text>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Nombre</Text>
                                <Text className="text-gray-900 text-[16px] font-semibold m-0">{customerName}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Email</Text>
                                <Text className="text-cyan-600 text-[14px] font-medium m-0">
                                    <a href={`mailto:${customerEmail}`} className="text-cyan-600 no-underline">
                                        {customerEmail}
                                    </a>
                                </Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">WhatsApp</Text>
                                <Text className="text-green-600 text-[16px] font-semibold m-0">
                                    <a href={`https://wa.me/${customerWhatsapp.replace(/[^0-9]/g, '')}`} className="text-green-600 no-underline">
                                        {customerWhatsapp}
                                    </a>
                                </Text>
                            </div>
                        </Section>

                        {/* Tour Details */}
                        <Section className="bg-blue-50 rounded-lg p-6 my-6 border border-blue-100">
                            <Text className="text-blue-600 text-xs uppercase tracking-wider mb-4 font-semibold m-0">
                                🗓️ DETALLES DE LA SOLICITUD
                            </Text>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Tour</Text>
                                <Text className="text-gray-900 text-[14px] font-medium m-0">{tourName}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Fecha solicitada</Text>
                                <Text className="text-gray-900 text-[14px] font-medium m-0">{tourDate}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">ID de Reserva</Text>
                                <Text className="text-gray-600 text-[12px] font-mono m-0">{reservationId}</Text>
                            </div>

                            {notes && (
                                <div className="mt-4 pt-4 border-t border-blue-200">
                                    <Text className="text-gray-500 text-xs m-0 mb-2">Notas del cliente</Text>
                                    <Text className="text-gray-700 text-[14px] m-0 italic bg-white p-3 rounded border border-gray-200">
                                        "{notes}"
                                    </Text>
                                </div>
                            )}
                        </Section>

                        {/* Action Items */}
                        <Section className="bg-yellow-50 rounded-lg p-6 my-6 border border-yellow-200">
                            <Text className="text-yellow-800 text-xs uppercase tracking-wider mb-3 font-semibold m-0">
                                ⚡ PRÓXIMOS PASOS
                            </Text>
                            <ol className="text-gray-700 text-[14px] leading-6 pl-4">
                                <li className="mb-2">Contactar al cliente vía WhatsApp para confirmar disponibilidad</li>
                                <li className="mb-2">Verificar disponibilidad con la agencia local</li>
                                <li className="mb-2">Enviar instrucciones de pago</li>
                                <li>Confirmar reserva una vez recibido el pago</li>
                            </ol>
                        </Section>

                        {/* Quick Actions */}
                        <Section className="text-center my-6">
                            <table className="w-full">
                                <tr>
                                    <td align="center" className="p-2">
                                        <a
                                            href={`https://wa.me/${customerWhatsapp.replace(/[^0-9]/g, '')}`}
                                            className="bg-green-500 hover:bg-green-600 rounded text-white text-[14px] font-semibold no-underline px-6 py-3 inline-block"
                                        >
                                            💬 Contactar por WhatsApp
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" className="p-2">
                                        <a
                                            href={`mailto:${customerEmail}`}
                                            className="bg-cyan-500 hover:bg-cyan-600 rounded text-white text-[14px] font-semibold no-underline px-6 py-3 inline-block"
                                        >
                                            ✉️ Enviar Email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                            Este es un email automático del sistema de reservas de Nómada Fantasma
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default TourLeadNotification;
