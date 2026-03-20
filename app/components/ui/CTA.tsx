"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { buttonClassNames } from "./Button";
import { cn } from "@/app/lib/utils";

export default function CTA() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <motion.div
        whileHover={{ y: -1.5, boxShadow: "0 0 0 1px hsl(187 92% 52% / .5), 0 16px 44px hsl(187 92% 52% / .35)" }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <Link
          href={`/${locale}/mapa`}
          className={cn(buttonClassNames("primary", "md"), "glow-aqua")}
        >
          {t("explore")}
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <Link
          href={`/${locale}/contacto`}
          className={buttonClassNames("secondary", "md")}
        >
          {t("chat")}
        </Link>
      </motion.div>
    </div>
  );
}
