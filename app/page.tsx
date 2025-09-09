// app/page.tsx
export default function Page() {
  return (
    <section className="container py-24 text-center hero-halo rounded-3xl fade-border">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Nómada Fantasma</h1>
      <p className="mt-4 text-lg text-muted-foreground">Cartógrafo de lo imposible</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/mapa" className="btn-cta">🗺️ Explorar mapa</a>
        <a href="/chat" className="btn-ghost">💬 Hablar con la IA</a>
      </div>

      <ul className="mt-12 space-y-3 text-muted-foreground">
        <li>🪐 Explora destinos únicos</li>
        <li>🕯️ Descubre rutas secretas</li>
        <li>⚓ Navegar sin límites</li>
      </ul>
    </section>
  );
}
