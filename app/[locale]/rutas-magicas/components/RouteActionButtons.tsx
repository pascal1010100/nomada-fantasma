'use client';

import { Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface RouteActionButtonsProps {
    isAtitlanPage: boolean;
    onBookingClick?: () => void;
}

export default function RouteActionButtons({ isAtitlanPage, onBookingClick }: RouteActionButtonsProps) {
    const locale = useLocale();
    const t = useTranslations('RouteActions');
    return (
        <>
            {isAtitlanPage ? (
                // Para Lago de Atitlán: explorar pueblos
                <button
                    onClick={() => {
                        const section = document.getElementById('pueblos-section');
                        if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                    className="mt-8 w-full bg-gradient-to-r from-electricBlue to-cyberPurple hover:from-electricBlue/90 hover:to-cyberPurple/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-electricBlue/20"
                >
                    <Map className="w-5 h-5 mr-2" />
                    {t('exploreTownsAndTours')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            ) : (
                // Para otras rutas: abrir modal si existe handler, sino link
                onBookingClick ? (
                    <button
                        onClick={onBookingClick}
                        className="mt-8 w-full bg-gradient-to-r from-electricBlue to-cyberPurple hover:from-electricBlue/90 hover:to-cyberPurple/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-electricBlue/20"
                    >
                        {t('reserveNow')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                ) : (
                    <Link
                        href={`/${locale}/reservas`}
                        className="mt-8 w-full bg-gradient-to-r from-electricBlue to-cyberPurple hover:from-electricBlue/90 hover:to-cyberPurple/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-electricBlue/20"
                    >
                        {t('reserveNow')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                )
            )}

        </>
    );
}
