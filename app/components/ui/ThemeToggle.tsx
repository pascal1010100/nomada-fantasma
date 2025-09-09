// app/components/ui/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("nf-theme");
    if (saved === "light" || saved === "dark") {
      apply(saved as Theme);
      return;
    }
    // migración desde "system" u otros valores
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    apply(prefersDark ? "dark" : "light");
  }, []);

  function apply(next: Theme) {
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    setTheme(next);
    localStorage.setItem("nf-theme", next);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-border bg-card/50 backdrop-blur-xs px-1 py-1">
      <button
        aria-label="Tema claro"
        onClick={() => apply("light")}
        className={`px-2 py-1 rounded-xl transition ${
          theme === "light" ? "bg-muted text-foreground" : "opacity-75 hover:opacity-100"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        aria-label="Tema oscuro"
        onClick={() => apply("dark")}
        className={`px-2 py-1 rounded-xl transition ${
          theme === "dark" ? "bg-muted text-foreground" : "opacity-75 hover:opacity-100"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
