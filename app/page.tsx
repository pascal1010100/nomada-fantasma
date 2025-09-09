// app/page.tsx
export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="max-w-2xl text-center">
        <div className="text-6xl mb-4">👻</div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Nómada Fantasma
        </h1>
        <p className="mt-4 text-slate-300">
          Barco pirata tecnológico navegando mapas y datos. Esta es la base limpia
          para empezar a construir el Hero y el resto de la app!!.
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
      </section>
    </main>
  );
}
