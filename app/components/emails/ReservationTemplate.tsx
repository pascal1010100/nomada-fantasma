import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

interface ReservationTemplateProps {
    reservationId: string;
    customerName: string;
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
    type: 'tour' | 'guide';
}

export const ReservationTemplate = ({
    reservationId,
    customerName,
    tourName,
    date,
    guests,
    totalPrice,
    type,
}: ReservationTemplateProps) => {
    const previewText = `Confirmación de reserva: ${tourName}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                cyberPurple: '#7c3aed',
                                electricBlue: '#06b6d4',
                                darkBg: '#111827',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                ¡Tu aventura comienza aquí! 🌎
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hola <strong>{customerName}</strong>,
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hemos recibido tu solicitud de reserva para <strong>{tourName}</strong>.
                                Estamos emocionados de ser parte de tu experiencia en Guatemala.
                            </Text>
                        </Section>

                        <Section className="bg-gray-50 rounded-lg p-6 my-6 border border-gray-100">
                            <Text className="text-gray-500 text-xs uppercase tracking-wider mb-4 font-semibold">
                                Detalles de la Reserva
                            </Text>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Experiencia</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">{tourName}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Fecha</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">{date}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">Viajeros</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">
                                    {guests} {guests === 1 ? 'persona' : 'personas'}
                                </Text>
                            </div>

                            <Hr className="border-gray-200 my-4" />

                            <div className="flex justify-between items-center">
                                <Text className="text-gray-900 font-bold text-lg m-0">Total</Text>
                                <Text className="text-cyberPurple font-bold text-lg m-0">
                                    ${totalPrice.toLocaleString()}
                                </Text>
                            </div>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#06b6d4] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`https://nomada-fantasma.com/reservas/${reservationId}`}
                            >
                                Gestionar mi Reserva
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Si tienes alguna pregunta, responde a este correo o contáctanos por WhatsApp.
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Nómada Fantasma - Viajes Épicos en Guatemala 🇬🇹
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ReservationTemplate;
