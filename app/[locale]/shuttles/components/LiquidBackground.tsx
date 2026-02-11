'use client';

import { motion } from 'framer-motion';

export default function LiquidBackground() {
  return (
    <>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.03"
              numOctaves="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur in="displacementMap" stdDeviation="10" />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="absolute inset-0"
        style={{
          background: '#05D9E8',
          filter: 'url(#liquid-filter)',
        }}
      />
    </>
  );
}
