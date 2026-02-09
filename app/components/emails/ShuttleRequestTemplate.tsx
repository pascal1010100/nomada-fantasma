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

interface ShuttleRequestTemplateProps {
    customerName: string;
    customerEmail: string;
    routeOrigin: string;
    routeDestination: string;
    date: string;
    time: string;
    passengers: number;
    pickupLocation: string;
    type?: string;
}

export const ShuttleRequestTemplate = ({
    customerName,
    customerEmail,
    routeOrigin,
    routeDestination,
    date,
    time,
    passengers,
    pickupLocation,
    type,
}: ShuttleRequestTemplateProps) => {
    const previewText = `Nueva Solicitud de Shuttle: ${routeOrigin} ➡️ ${routeDestination}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                ghostPrimary: '#7c3aed',
                                ghostAccent: '#06b6d4',
                                darkBg: '#111827',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[500px]">
                        <Section className="mt-[32px] text-center">
                            <Text className="text-[28px] font-black text-ghostPrimary m-0">Nómada Fantasma 👻</Text>
                            <Heading className="text-black text-[20px] font-bold text-center p-0 my-[10px] mx-0">
                                Nueva Solicitud de Transporte
                            </Heading>
                        </Section>

                        <Section className="bg-gray-50 rounded-2xl p-6 my-6 border border-gray-100 shadow-sm">
                            <Text className="text-ghostAccent text-xs uppercase tracking-[0.2em] mb-4 font-black">
                                Detalles del Cliente
                            </Text>
                            <div className="mb-4">
                                <Text className="text-gray-500 text-xs m-0">Nombre</Text>
                                <Text className="text-gray-900 text-base font-bold m-0">{customerName}</Text>
                            </div>
                            <div className="mb-4">
                                <Text className="text-gray-500 text-xs m-0">Email de Contacto</Text>
                                <Text className="text-gray-900 text-base font-bold m-0">{customerEmail}</Text>
                            </div>

                            <Hr className="border-gray-200 my-6" />

                            <Text className="text-ghostAccent text-xs uppercase tracking-[0.2em] mb-4 font-black">
                                Información del Trayecto
                            </Text>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <Text className="text-gray-500 text-xs m-0">Origen</Text>
                                    <Text className="text-gray-900 text-sm font-bold m-0">{routeOrigin}</Text>
                                </div>
                                <div className="mb-4">
                                    <Text className="text-gray-500 text-xs m-0">Destino</Text>
                                    <Text className="text-gray-900 text-sm font-bold m-0">{routeDestination}</Text>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <Text className="text-gray-500 text-xs m-0">Fecha</Text>
                                    <Text className="text-gray-900 text-sm font-bold m-0">{date}</Text>
                                </div>
                                <div className="mb-4">
                                    <Text className="text-gray-500 text-xs m-0">Hora</Text>
                                    <Text className="text-gray-900 text-sm font-bold m-0">{time}</Text>
                                </div>
                            </div>

                            <div className="mb-4">
                                <Text className="text-gray-500 text-xs m-0">Tipo de Servicio</Text>
                                <Text className="text-gray-900 text-sm font-bold m-0 uppercase tracking-tight">
                                    {type === 'private' ? '🚐 TRASLADO PRIVADO' : '🚌 SHUTTLE COMPARTIDO'}
                                </Text>
                            </div>

                            <div className="p-3 bg-white border border-dashed border-gray-200 rounded-xl">
                                <Text className="text-gray-500 text-xs mb-1 m-0 italic text-center">Lugar de Recogida</Text>
                                <Text className="text-gray-900 text-sm font-black m-0 text-center">{pickupLocation}</Text>
                            </div>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[20px] text-center">
                            Procesa esta solicitud con la agencia de viajes correspondiente lo antes posible.
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />
                        <Text className="text-[#9ca3af] text-[10px] text-center uppercase tracking-widest font-bold">
                            Nómada Fantasma - Operaciones Lago Atitlán
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ShuttleRequestTemplate;
