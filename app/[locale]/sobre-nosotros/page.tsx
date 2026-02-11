"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Users, Heart, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import { RippleButton } from '@/app/components/ui'
import { useTranslations } from 'next-intl'

const AboutPage = () => {
  const t = useTranslations('About')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: t('features.curated.title'),
      description: t('features.curated.desc')
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: t('features.booking.title'),
      description: t('features.booking.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('features.guides.title'),
      description: t('features.guides.desc')
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: t('features.transport.title'),
      description: t('features.transport.desc')
    }
  ]

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden bg-background">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        {/* Background element can be placed here */}
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-semibold tracking-wide uppercase text-xs">{t('badge')}</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl font-bold text-foreground mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block">{t('titleTop')}</span>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t('titleGradient')}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('description')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/rutas-magicas">
              <RippleButton className="px-8 py-4 text-lg font-bold">
                {t('btnExplore')}
              </RippleButton>
            </Link>
            <Link href="/contacto">
              <button className="px-8 py-4 text-lg font-semibold glass-enhanced rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                {t('btnContact')}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8">{t('philosophyTitle')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('philosophyDesc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">{t('featuresTitle')}</h2>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 glass-enhanced rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            className="p-12 md:p-20 glass-enhanced rounded-[3rem] border border-primary/20 relative overflow-hidden text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 blur-[100px] -ml-32 -mb-32" />

            <Heart className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-6xl font-bold mb-8">{t('ctaTitle')}</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              {t('ctaDesc')}
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/rutas-magicas">
                <RippleButton className="px-10 py-5 text-xl font-bold min-w-[200px]">
                  {t('ctaAction')}
                </RippleButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gradient animation CSS */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default AboutPage
