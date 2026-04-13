"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Bus, Compass, Map, ArrowRight } from "lucide-react";

export default function HomeConversionSections() {
  const t = useTranslations("HomeConversion");
  const locale = useLocale();

  const quickCards = [
    {
      key: "tours",
      icon: Compass,
      href: `/${locale}/rutas-magicas`,
      title: t("quick.cards.tours.title"),
      desc: t("quick.cards.tours.desc"),
      cta: t("quick.cards.tours.cta"),
    },
    {
      key: "shuttles",
      icon: Bus,
      href: `/${locale}/shuttles`,
      title: t("quick.cards.shuttles.title"),
      desc: t("quick.cards.shuttles.desc"),
      cta: t("quick.cards.shuttles.cta"),
    },
    {
      key: "map",
      icon: Map,
      href: `/${locale}/mapa?town=san-pedro`,
      title: t("quick.cards.map.title"),
      desc: t("quick.cards.map.desc"),
      cta: t("quick.cards.map.cta"),
    },
  ];

  return (
    <section className="mx-auto mb-20 mt-10 max-w-6xl px-4 sm:px-6">
      <div className="rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("quick.title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {t("quick.desc")}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group rounded-2xl border border-border/60 bg-card/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs uppercase tracking-wider">{t("quick.cardBadge")}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>


    </section>
  );
}
