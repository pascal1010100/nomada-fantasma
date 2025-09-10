// components/contact/NewsletterSubscribe.tsx
"use client";

import { useState } from "react";

type Props = { variant?: "compact" | "full" };

export default function NewsletterSubscribe({ variant = "compact" }: Props) {
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!email || !email.includes("@")) {
      setSubmitted("error");
      return;
    }
    setSubmitted("ok");
    e.currentTarget.reset();
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> =
    variant === "full"
      ? ({ children }) => (
          <div className="rounded-3xl overflow-hidden fade-border bg-background/60 p-6 md:p-8">
            {children}
          </div>
        )
      : ({ children }) => (
          <div className="rounded-2xl border border-border bg-card/55 p-3 sm:p-4">
            {children}
          </div>
        );

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        {variant === "full" ? (
          <>
            <h2 className="text-lg font-semibold">Recibe rutas y novedades</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sin spam. Podrás darte de baja cuando quieras.
            </p>
          </>
        ) : (
          <label htmlFor="newsletter" className="text-sm font-medium">
            Recibe rutas y novedades
          </label>
        )}

        <div className="mt-2 flex gap-2">
            <input
              id="newsletter"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-border bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.35)]"
              aria-describedby="newsletter-help"
            />
            <button type="submit" className="btn-primary px-4">
              Suscribirme
            </button>
        </div>

        <p id="newsletter-help" className="mt-2 text-xs text-muted-foreground">
          Sin spam. Podrás darte de baja cuando quieras.
        </p>

        <p
          role="status"
          className={`mt-2 text-xs ${
            submitted === "ok"
              ? "text-emerald-600 dark:text-emerald-400"
              : submitted === "error"
              ? "text-rose-600 dark:text-rose-400"
              : "text-transparent"
          }`}
        >
          {submitted === "ok"
            ? "¡Listo! Te escribiremos pronto."
            : submitted === "error"
            ? "Escribe un correo válido."
            : "•"}
        </p>
      </form>
    </Wrapper>
  );
}
