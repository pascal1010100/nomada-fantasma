"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Region } from "../lib/types"
import { Globe, Compass, MapPin } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

interface RegionFilterProps {
  selectedRegion?: Region | null
}

export default function RegionFilter({ selectedRegion = null }: RegionFilterProps) {
  const t = useTranslations("Routes")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!
  const [isOpen, setIsOpen] = useState(false)

  const regions: { value: Region; label: string; icon: React.ReactNode }[] = [
    {
      value: "europe",
      label: t("regions.europe"),
      icon: <Compass className="w-4 h-4 mr-2" />,
    },
    {
      value: "asia",
      label: t("regions.asia"),
      icon: <MapPin className="w-4 h-4 mr-2" />,
    },
    {
      value: "america",
      label: t("regions.america"),
      icon: <Globe className="w-4 h-4 mr-2" />,
    },
  ]

  const handleRegionChange = (region: Region | null) => {
    const params = new URLSearchParams(searchParams)

    if (region) {
      params.set("region", region)
    } else {
      params.delete("region")
    }

    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const selectedRegionData = regions.find((r) => r.value === selectedRegion)

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <motion.button
          onClick={() => handleRegionChange(null)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${!selectedRegion
              ? "bg-gradient-to-r from-electricBlue to-cyberPurple text-white shadow-md hover:shadow-lg hover:shadow-electricBlue/20 dark:shadow-cyberPurple/10"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-electricBlue/60 dark:hover:border-cyberPurple/40 hover:shadow-sm transition-all duration-300"
            }`}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe className="w-4 h-4 mr-2" />
          <span>{t("allRegions")}</span>
        </motion.button>

        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${selectedRegion
                ? "bg-gradient-to-r from-electricBlue to-cyberPurple text-white shadow-md hover:shadow-lg hover:shadow-electricBlue/20 dark:shadow-cyberPurple/10"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-electricBlue/60 dark:hover:border-cyberPurple/40 hover:shadow-sm transition-all duration-300"
              }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedRegion ? (
              <>
                {selectedRegionData?.icon}
                <span>{selectedRegionData?.label}</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 mr-2" />
                <span>{t("filterByRegion")}</span>
              </>
            )}
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
              >
                <div className="p-2">
                  {regions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => handleRegionChange(region.value)}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-md flex items-center transition-colors ${selectedRegion === region.value
                          ? "bg-gradient-to-r from-electricBlue/10 to-cyberPurple/10 text-electricBlue dark:text-cyberPurple font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                    >
                      {region.icon}
                      {region.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electricBlue/50 to-transparent dark:via-electricBlue/40 opacity-70"></div>
      </div>
    </div>
  )
}
