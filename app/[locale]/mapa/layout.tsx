// app/mapa/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa Nómada Fantasma',
  description: 'Mapa útil de Guatemala: Wi-Fi, hospedaje, cowork, bancos, muelles y experiencias locales.',
  openGraph: {
    title: 'Mapa Nómada Fantasma',
    description: 'Mapa útil de Guatemala: Wi-Fi, hospedaje, cowork, bancos, muelles y experiencias locales.',
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
