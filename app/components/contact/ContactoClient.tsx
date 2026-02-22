"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Send,
  Clock,
  Globe,
  User,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Github
} from 'lucide-react';
import { RippleButton, FloatingInput } from '@/app/components/ui';
import { useTranslations } from 'next-intl';

const ContactoClient = () => {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const contactCards = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t('cardChat.title'),
      description: t('cardChat.desc'),
      action: t('cardChat.action'),
      color: "bg-blue-500"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('cardMail.title'),
      description: t('cardMail.desc'),
      action: t('cardMail.action'),
      color: "bg-purple-500"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('cardVisit.title'),
      description: t('cardVisit.desc'),
      action: t('cardVisit.action'),
      color: "bg-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-semibold tracking-wide uppercase text-xs">{t('badge')}</span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="block text-foreground">{t('titleTop')}</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t('titleGradient')}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('description')}
          </motion.p>
        </div>

        {/* Contact Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {contactCards.map((card, index) => (
            <motion.div
              key={index}
              className="glass-enhanced p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/10`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                {card.description}
              </p>
              <button className="flex items-center text-sm font-bold text-primary group-hover:gap-2 transition-all">
                {card.action} <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            className="glass-enhanced p-8 md:p-10 rounded-3xl border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{t('formBadge')}</span>
              <h2 className="text-3xl font-bold">{t('formTitle')}</h2>
              <p className="text-muted-foreground mt-2">{t('formDesc')}</p>
            </div>

            {submitted ? (
              <motion.div
                className="bg-primary/10 border border-primary/20 p-8 rounded-2xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('formSuccess')}</h3>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold hover:underline"
                >
                  {t('btnProtocol')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FloatingInput
                  label={t('formName')}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  icon={<User className="h-5 w-5" />}
                />
                <FloatingInput
                  label={t('formEmail')}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  icon={<Mail className="h-5 w-5" />}
                />
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium ml-1">{t('formMessage')}</label>
                  <div className="relative group">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
                <RippleButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg font-bold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('formSubmit')} <Send className="h-5 w-5" />
                    </span>
                  )}
                </RippleButton>
              </form>
            )}
          </motion.div>

          {/* Social & Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="glass-enhanced p-8 rounded-3xl border border-white/10 space-y-8">
              <h3 className="text-2xl font-bold mb-6">{t('infoTitle')}</h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">{t('infoLocation')}</h4>
                  <p className="text-muted-foreground text-sm">{t('infoLocationCity')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">{t('infoEmail')}</h4>
                  <p className="text-muted-foreground text-sm">hola@nomadafantasma.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold">{t('infoSchedule')}</h4>
                  <p className="text-muted-foreground text-sm">{t('infoScheduleWeek')}</p>
                  <p className="text-muted-foreground text-sm">{t('infoScheduleSat')}</p>
                </div>
              </div>
            </div>

            <div className="glass-enhanced p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">{t('infoSocial')}</h3>
              <div className="flex gap-4">
                {[
                  { icon: <Instagram className="h-5 w-5" />, color: "hover:bg-pink-500" },
                  { icon: <Facebook className="h-5 w-5" />, color: "hover:bg-blue-600" },
                  { icon: <Twitter className="h-5 w-5" />, color: "hover:bg-cyan-400" },
                  { icon: <Github className="h-5 w-5" />, color: "hover:bg-slate-800" }
                ].map((social, i) => (
                  <button
                    key={i}
                    className={`w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center transition-all ${social.color} hover:text-white hover:scale-110 active:scale-95`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Minimal */}
            <div className="bg-primary/20 p-8 rounded-3xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-24 h-24 rotate-12" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ghost Nomad Syndicate</h3>
              <p className="text-sm text-primary-foreground/70 mb-4">Recibe actualizaciones tácticas y nuevas rutas antes que nadie.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo de élite..."
                  className="bg-white/10 border border-white/10 rounded-xl px-4 text-sm w-full outline-none focus:bg-white/20 transition-all"
                />
                <button className="bg-white text-primary p-2 rounded-xl hover:scale-105 active:scale-95 transition-all">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic styling */}
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
  );
};

export default ContactoClient;
