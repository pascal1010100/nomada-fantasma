"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Shield, Globe, Users, Clock, MessageSquare, ArrowRight, Zap, Target, Heart } from 'lucide-react'
import Link from 'next/link'
import { RippleButton } from '@/app/components/ui'
// import { Waves } from '@/app/components/ui/waves-background'
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
      icon: <Globe className="w-6 h-6" />,
      title: t('features.cartography.title'),
      description: t('features.cartography.desc')
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: t('features.voyages.title'),
      description: t('features.voyages.desc')
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('features.cortex.title'),
      description: t('features.cortex.desc')
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('features.syndicate.title'),
      description: t('features.syndicate.desc')
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('features.sync.title'),
      description: t('features.sync.desc')
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('features.oracle.title'),
      description: t('features.oracle.desc')
    }
  ]

  const steps = [
    {
      number: "01",
      title: t('steps.scan.title'),
      description: t('steps.scan.desc')
    },
    {
      number: "02",
      title: t('steps.mission.title'),
      description: t('steps.mission.desc')
    },
    {
      number: "03",
      title: t('steps.protocol.title'),
      description: t('steps.protocol.desc')
    },
    {
      number: "04",
      title: t('steps.sync.title'),
      description: t('steps.sync.desc')
    },
    {
      number: "05",
      title: t('steps.immersion.title'),
      description: t('steps.immersion.desc')
    }
  ]

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        {/* <Waves
          lineColor="hsl(var(--primary))"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        /> */}
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
            <RippleButton className="px-8 py-4 text-lg font-bold">
              {t('btnExploration')}
            </RippleButton>
            <button className="px-8 py-4 text-lg font-semibold glass-enhanced rounded-xl border border-white/10 hover:bg-white/5 transition-all">
              {t('btnProtocol')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 relative z-10">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8">{t('decodingTitle')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('decodingDesc')}
              </p>

              <div className="space-y-6">
                <div className="p-6 glass-enhanced rounded-2xl border border-primary/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-primary" />
                    {t('cortexTitle')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('cortexDesc')}
                  </p>
                  <ul className="space-y-3">
                    {t.raw('cortexItems').map((item: string, i: number) => (
                      <li key={i} className="flex items-center text-sm">
                        <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative p-8 glass-enhanced rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

              <h3 className="text-2xl font-bold mb-8">{t('radarTitle')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t('resources.wifi'), val: "100Mbps", icon: <Globe /> },
                  { label: t('resources.shelters'), val: "Premium", icon: <Shield /> },
                  { label: t('resources.recharge'), val: "Universal", icon: <Zap /> },
                  { label: t('resources.atms'), val: "Crypto/Fiat", icon: <Shield /> },
                  { label: t('resources.nodes'), val: "Verified", icon: <Target /> },
                  { label: t('resources.hubs'), val: "Collab", icon: <Users /> }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-primary mb-2 opacity-50">{item.icon}</div>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-primary/5">
        <div className="container px-4 mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 glass-enhanced rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
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

      {/* Protocol Steps */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('protocolTitle')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('protocolDesc')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/10 hidden lg:block -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative z-10 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:border-primary transition-colors">
                    <span className="text-xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
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
            <h2 className="text-3xl md:text-6xl font-bold mb-8">{t('readyTitle')}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/rutas-magicas">
                <RippleButton className="px-10 py-5 text-xl font-bold min-w-[200px]">
                  {t('readyMission')}
                </RippleButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Footer-like */}
      <section className="pb-32">
        <div className="container px-4 mx-auto text-center border-t border-white/5 pt-20">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">{t('ctaTitle')}</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            {t('ctaDesc')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/registro">
              <RippleButton className="px-8 py-4 text-lg font-bold">
                {t('ctaRegister')}
              </RippleButton>
            </Link>
            <Link href="/contacto">
              <button className="px-8 py-4 text-lg font-semibold glass-enhanced rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                {t('ctaContact')}
              </button>
            </Link>
          </div>
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
