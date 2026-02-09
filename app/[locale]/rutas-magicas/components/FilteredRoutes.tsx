"use client"

import { motion, Variants } from "framer-motion"
import RouteCard from "./RouteCard"
import { mockRoutes } from "../mocks/routes"
import { Region, Route } from "../lib/types"
import { Compass, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}
interface FilteredRoutesProps {
  region?: Region
  searchQuery?: string
}
export default function FilteredRoutes({ region, searchQuery = "" }: FilteredRoutesProps) {
  const t = useTranslations("Routes")
  const td = useTranslations('Data.routes');
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const filteredRoutes = mockRoutes.filter((route: Route) => {
    const matchesRegion = !region || route.region === region
    const isMainRoute = !route.isSubRoute

    // Get localized content for search
    const localizedTitle = td(`${route.slug}.title`).toLowerCase();
    const localizedSummary = td(`${route.slug}.summary`).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      localizedTitle.includes(query) ||
      localizedSummary.includes(query) ||
      (route.tags && route.tags.some((tag: string) => tag.toLowerCase().includes(query)))

    return matchesRegion && matchesSearch && isMainRoute
  })

  return (
    <div className="relative">
      {filteredRoutes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-electricBlue/10 to-cyberPurple/10 dark:from-electricBlue/5 dark:to-cyberPurple/5 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-8 h-8 text-cyberPurple" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? t("noResults") : t("noRoutes")}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery ? t("noResultsDesc") : t("noRoutesDesc")}
          </p>
          {searchQuery && (
            <button
              onClick={() => (window.location.href = window.location.pathname)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyberPurple hover:bg-cyberPurple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple transition-colors"
            >
              {t("clearSearch")}
              <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRoutes.map((route) => (
            <motion.div key={route.id} variants={itemVariants}>
              <RouteCard route={route} />
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Floating elements for visual interest */}
      {isMounted && (
        <>
          <div className="absolute -left-20 top-1/4 w-64 h-64 bg-cyberPurple/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 -z-10"></div>
          <div className="absolute -right-20 bottom-1/4 w-64 h-64 bg-electricBlue/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30 -z-10"></div>
        </>
      )}
    </div>
  )
}
