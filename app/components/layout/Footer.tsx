// app/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-xl">👻</span>
            <span className="font-semibold tracking-tight">Nómada Fantasma</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/mapa" className="hover:text-slate-100">
              Mapa
            </Link>
            <Link href="/contacto" className="hover:text-slate-100">
              Contacto
            </Link>
            <Link href="/privacidad" className="hover:text-slate-100">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-slate-100">
              Términos
            </Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter/X"
              className="p-2 rounded-lg border border-slate-700 hover:bg-slate-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18.244 3H21l-6.65 7.59L22 21h-6.17l-4.83-5.72L5.4 21H3l7.21-8.24L2 3h6.3l4.37 5.19L18.244 3Zm-1.08 16h1.37L7.01 5H5.58l11.585 14Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/pascal1010100/nomada-fantasma"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg border border-slate-700 hover:bg-slate-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M12 .5A11.5 11.5 0 0 0 .5 12.4c0 5.25 3.41 9.7 8.15 11.27.6.12.82-.26.82-.58v-2.2c-3.31.74-4.01-1.6-4.01-1.6-.55-1.44-1.35-1.82-1.35-1.82-1.11-.78.08-.76.08-.76 1.22.09 1.86 1.27 1.86 1.27 1.09 1.9 2.86 1.35 3.56 1.03.11-.82.43-1.35.78-1.66-2.65-.31-5.43-1.38-5.43-6.12 0-1.35.47-2.45 1.24-3.32-.13-.3-.54-1.56.12-3.24 0 0 1.01-.33 3.3 1.27a11.1 11.1 0 0 1 6 0c2.29-1.6 3.3-1.27 3.3-1.27.66 1.68.25 2.94.12 3.24.77.87 1.24 1.97 1.24 3.32 0 4.76-2.79 5.8-5.45 6.11.44.38.84 1.12.84 2.26v3.34c0 .33.22.71.83.58A11.5 11.5 0 0 0 23.5 12.4 11.5 11.5 0 0 0 12 .5Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-6 text-xs text-slate-400">
          © {year} Nómada Fantasma. Hecho con pasión y mapa estelar.
        </div>
      </div>
    </footer>
  );
}
