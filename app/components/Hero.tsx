// app/components/Hero.tsx
"use client";

export default function Hero() {
  return (
    <section className="min-h-[70vh] grid place-items-center bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* fondo sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_center,rgba(56,189,248,.25),transparent_60%)]" />

      <div className="relative z-10 max-w-2xl text-center px-6">
        <div className="text-6xl mb-3">👻</div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Nómada Fantasma
        </h1>
        <p className="mt-4 text-slate-300">
          Barco pirata tecnológico para explorar mapas y datos.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#"
            className="rounded-xl px-4 py-2 bg-sky-500/90 hover:bg-sky-500 transition shadow"
          >
            Explorar mapa
          </a>
          <a
            href="#"
            className="rounded-xl px-4 py-2 border border-slate-700 hover:bg-slate-900 transition"
          >
            Hablar con la IA
          </a>
        </div>
      </div>
    </section>
  );
}
