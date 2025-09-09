"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide">
        🌌 Nómada Fantasma
      </div>

      {/* Links */}
      <ul className="flex gap-6 text-sm font-medium">
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/mapa">Mapa</Link>
        </li>
        <li>
          <Link href="/contacto">Contacto</Link>
        </li>
      </ul>
    </nav>
  );
}
