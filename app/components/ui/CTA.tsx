"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <motion.a
        href="/mapa"
        className="btn-primary glow-aqua"
        whileHover={{ y: -1.5, boxShadow: "0 0 0 1px hsl(187 92% 52% / .5), 0 16px 44px hsl(187 92% 52% / .35)" }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        🗺️ Explorar mapa
      </motion.a>

      <motion.a
        href="/chat"
        className="btn-ghost"
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        💬 Hablar con la IA
      </motion.a>
    </div>
  );
}
