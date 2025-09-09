"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // Lee preferencia guardada al hidratar
  useEffect(() => {
    const saved = (localStorage.getItem("nf-theme") as Theme) || "system";
    applyTheme(saved);
  }, []);

  function applyTheme(next: Theme) {
    const root = document.documentElement; // <html>
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Limpia
    root.classList.remove("dark");

    // Aplica
    if (next === "dark" || (next === "system" && prefersDark)) {
      root.classList.add("dark");
    }

    setTheme(next);
    localStorage.setItem("nf-theme", next);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card/50 backdrop-blur-xs px-1 py-1">
      <button
        aria-label="Tema claro"
        onClick={() => applyTheme("light")}
        className={`px-2 py-1 rounded-xl transition ${
          theme === "light" ? "bg-muted text-foreground" : "opacity-75 hover:opacity-100"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        aria-label="Tema oscuro"
        onClick={() => applyTheme("dark")}
        className={`px-2 py-1 rounded-xl transition ${
          theme === "dark" ? "bg-muted text-foreground" : "opacity-75 hover:opacity-100"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        aria-label="Tema del sistema"
        onClick={() => applyTheme("system")}
        className={`px-2 py-1 rounded-xl transition ${
          theme === "system" ? "bg-muted text-foreground" : "opacity-75 hover:opacity-100"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
