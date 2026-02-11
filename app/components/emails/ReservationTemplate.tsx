import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
type TFunction = (key: string, values?: Record<string, any>) => string;

interface ReservationTemplateProps {
    reservationId: string;
    customerName: string;
    tourName: string;
    date: string;
    guests: number;
    totalPrice: number;
    t: TFunction;
}

export const ReservationTemplate = ({
    reservationId,
    customerName,
    tourName,
    date,
    guests,
    totalPrice,
    t,
}: ReservationTemplateProps) => {
    const previewText = t('preview', { tourName });

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                {t('title')}
                            </Heading>
                            <Text
                                className="text-black text-[14px] leading-[24px]"
                                dangerouslySetInnerHTML={{ __html: t('greeting', { customerName: `<strong>${customerName}</strong>` }) }}
                            />
                            <Text
                                className="text-black text-[14px] leading-[24px]"
                                dangerouslySetInnerHTML={{ __html: t('intro', { tourName: `<strong>${tourName}</strong>` }) }}
                            />
                        </Section>

                        <Section className="bg-gray-50 rounded-lg p-6 my-6 border border-gray-100">
                            <Text className="text-gray-500 text-xs uppercase tracking-wider mb-4 font-semibold">
                                {t('detailsTitle')}
                            </Text>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">{t('detailsExperience')}</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">{tourName}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">{t('detailsDate')}</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">{date}</Text>
                            </div>

                            <div className="mb-3">
                                <Text className="text-gray-500 text-xs m-0">{t('detailsTravelers')}</Text>
                                <Text className="text-gray-900 text-sm font-medium m-0">
                                    {guests} {guests === 1 ? t('detailsTraveler') : t('detailsTravelersPlural')}
                                </Text>
                            </div>

                            <Hr className="border-gray-200 my-4" />

                            <div className="flex justify-between items-center">
                                <Text className="text-gray-900 font-bold text-lg m-0">{t('total')}</Text>
                                <Text className="text-purple-600 font-bold text-lg m-0">
                                    ${totalPrice.toLocaleString()}
                                </Text>
                            </div>
                        </Section>

                        <Section className="my-6">
                            <Heading className="text-black text-xl font-semibold text-left">
                                {t('paymentTitle')}
                            </Heading>
                            <Text className="text-gray-700 text-sm leading-6">
                                {t('paymentIntro')}
                            </Text>
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mt-4">
                                <Text className="font-semibold text-gray-800">{t('paymentMethodBank')}</Text>
                                <Text className="text-gray-600 text-sm m-0">{t('paymentBankAccount')}</Text>
                                <Text className="text-gray-600 text-sm m-0">{t('paymentBankHolder')}</Text>
                                <Text className="text-gray-600 text-sm m-0">{t('paymentBankName')}</Text>
                            </div>
                            <Text className="text-gray-700 text-sm leading-6 mt-4">
                                {t('paymentConfirmation')}
                            </Text>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-cyan-500 rounded text-white text-sm font-semibold no-underline text-center px-5 py-3"
                                href={`https://nomada-fantasma.com/reservas/${reservationId}`}
                            >
                                {t('manageButton')}
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            {t('footerQuestion')}
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            {t('footerSignature')}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ReservationTemplate;
