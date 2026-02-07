// app/mapa/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carta Fantasma · Mapa Nómada',
  description: 'Carta náutica ciberpunk: Wi-Fi, hospedaje, cowork, bancos y puertos.',
  openGraph: {
    title: 'Carta Fantasma · Mapa Nómada',
    description: 'Carta náutica ciberpunk: Wi-Fi, hospedaje, cowork, bancos y puertos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
