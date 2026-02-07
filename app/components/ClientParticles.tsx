'use client';

import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(
    () => import('@/app/[locale]/mapa/components/ParticlesBackground'),
    { ssr: false }
);

export default function ClientParticles() {
    return <ParticlesBackground />;
}
