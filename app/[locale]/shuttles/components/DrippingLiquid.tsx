'use client';

import { motion } from 'framer-motion';

export default function DrippingLiquid() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <svg
        className="absolute -bottom-1 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,64 C240,128 480,32 720,64 C960,96 1200,0 1440,64 L1440,120 L0,120 Z"
          fill="hsl(199, 89%, 53%)"
          initial={{ pathLength: 0, pathOffset: 1 }}
          animate={{ pathLength: 1, pathOffset: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}
