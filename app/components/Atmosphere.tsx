"use client";

import React from "react";

interface AtmosphereProps {
    active: boolean;
}

export const Atmosphere = ({ active }: AtmosphereProps) => {
    if (!active) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden">
            {/* Fog Layer 1 */}
            <div
                className="absolute inset-0 opacity-40 animate-fog"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                    mixBlendMode: "overlay",
                }}
            />

            {/* Fog Layer 2 (Slower, different direction/scale) */}
            <div
                className="absolute inset-0 opacity-30 animate-fog"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: "350px 350px",
                    animationDuration: "90s",
                    animationDirection: "reverse",
                    mixBlendMode: "screen",
                }}
            />

            {/* Vignette / Tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-purple-900/10 mix-blend-multiply" />
        </div>
    );
};
