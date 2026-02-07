'use client';

import dynamic from 'next/dynamic';

const ParticlesBackground = dynamic(
    () => import('../mapa/components/ParticlesBackground'),
    { ssr: false }
);

export default function ClientParticles() {
    return <ParticlesBackground />;
}
