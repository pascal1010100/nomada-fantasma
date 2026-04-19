"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Compass, Sparkles } from "lucide-react"
import Link from "next/link"
import SearchBar from "./SearchBar"
import { useLocale, useTranslations } from "next-intl"

export default function HeroSection({
  onSearch,
  defaultQuery = "",
}: {
  onSearch?: (query: string) => void
  defaultQuery?: string
}) {
  const t = useTranslations("Routes")
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query)
    }
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <motion.section ref={ref} style={{ opacity }} className="relative min-h-[80vh] flex items-center justify-center">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto text-center sm:px-8">
        <div className="space-y-8">
          <motion.div
            className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-semibold tracking-wide uppercase text-xs">{t("badge")}</span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="block text-foreground">{t("titleTop")}</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t("titleGradient")}
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t("description")}
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto my-8 w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SearchBar
              onSearch={handleSearch}
              defaultValue={defaultQuery}
              placeholder={t("search")}
              className="w-full"
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="#destinos"
              className="btn-cta shimmer group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Compass className="h-5 w-5 transition-transform group-hover:rotate-12" />
                {t("btnExplore")}
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="absolute right-4 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href={`/${locale}/shuttles`}
              className="btn-ghost group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 hover:border-primary/50 sm:w-auto"
            >
              <span>{t("btnHow")}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Gradient animation CSS */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </motion.section>
  )
}
