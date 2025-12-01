"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ghost, Ship, X, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatModalProps = {
  open: boolean;
  onClose: () => void;
  variant?: "ghost" | "ship";
  panelId?: string; // for aria-controls from the toggle button
};

export default function ChatModal({
  open,
  onClose,
  variant = "ghost",
  panelId,
}: ChatModalProps): JSX.Element {
  const reduce = useReducedMotion();
  const Icon = useMemo(() => (variant === "ship" ? Ship : Ghost), [variant]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleId = `${panelId ?? "chat"}-label`;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  type Msg = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<Msg[]>([]);

  const overlayAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.18 },
  } as const;

  const panelAnim = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.98 },
    transition: { duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  } as const;

  // Autofocus the input when opening
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Basic focus trap inside panel with Tab/Shift+Tab
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Abort any in-flight streaming when closing the modal
  useEffect(() => {
    if (!open && abortRef.current) {
      try { abortRef.current.abort(); } catch { }
      abortRef.current = null;
      setLoading(false);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
            onClick={onClose}
            {...overlayAnim}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-label="Chat Nómada IA"
            className="
              fixed z-[75]
              right-5 bottom-24 md:right-6 md:bottom-28
              w-[min(92vw,420px)]
            "
            onClick={(e) => e.stopPropagation()}
            {...panelAnim}
          >
            <div className="card-glass border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div id={titleId} className="text-sm font-medium">Nómada IA</div>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar chat"
                  onClick={onClose}
                  className="rounded-lg p-1.5 hover:bg-card/70 focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mensaje de bienvenida */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 px-4 py-3 border-b border-border/40" aria-live="polite">
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">👋</span>
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    <strong>¡Hola!</strong> Soy Aletheia, tu guía del Lago de Atitlán.
                    <br />
                    <span className="text-xs text-slate-600 dark:text-slate-300 opacity-90">
                      Pregúntame sobre pueblos, tours, precios o actividades.
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 space-y-3 max-h-[48vh] overflow-auto">
                {messages.length === 0 ? (
                  <>
                    <div className="text-sm text-slate-700 dark:text-slate-200">
                      <span className="opacity-70">💬</span>{" "}
                      ¿En qué ruta te ayudo hoy?
                    </div>

                    {/* Sugerencias rápidas */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => setInput("¿Qué hacer en San Marcos?")}
                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                      >
                        🧘 Yoga en San Marcos
                      </button>
                      <button
                        onClick={() => setInput("Tours económicos en el lago")}
                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                      >
                        💰 Tours baratos
                      </button>
                      <button
                        onClick={() => setInput("¿Dónde hay mejor WiFi?")}
                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                      >
                        📶 Nómada digital
                      </button>
                      <button
                        onClick={() => setInput("Diferencias entre San Pedro y San Marcos")}
                        className="text-xs px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
                      >
                        🏘️ Comparar pueblos
                      </button>
                    </div>
                  </>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={
                        m.role === "user"
                          ? "self-end max-w-[85%] rounded-xl px-3 py-2 text-sm bg-[hsl(var(--primary)/0.10)] border border-[hsl(var(--primary)/0.35)]"
                          : "self-start max-w-[85%] rounded-xl px-3 py-2 text-sm bg-card/70 border border-border/60"
                      }
                    >
                      {m.content}
                    </div>
                  ))
                )}
                {loading && (
                  <div className="self-start max-w-[85%] rounded-xl px-3 py-2 text-xs bg-card/60 border border-border/50 text-slate-500" aria-live="polite">
                    Aletheia está escribiendo…
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                className="flex items-center gap-2 px-3 pb-3 pt-2 bg-card/60 border-t border-border/60"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const text = input.trim();
                  if (!text || loading) return;
                  setLoading(true);

                  // snapshot indices to update assistant message during stream
                  const userMsg: Msg = { role: "user", content: text };
                  const assistantMsg: Msg = { role: "assistant", content: "" };
                  const startIndex = messages.length;
                  setMessages((prev) => [...prev, userMsg, assistantMsg]);
                  setInput("");

                  try {
                    // setup abort controller to allow stopping the stream
                    const controller = new AbortController();
                    abortRef.current = controller;

                    // Prepare conversation history (exclude the messages we just added)
                    const history = messages.slice(0, startIndex).map(m => ({
                      role: m.role,
                      content: m.content
                    }));

                    const res = await fetch("/api/chat", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        message: text,
                        history // Send conversation history
                      }),
                      signal: controller.signal,
                    });
                    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = "";
                    let done = false;
                    while (!done) {
                      const { value, done: d } = await reader.read();
                      done = d ?? false;
                      if (value) buffer += decoder.decode(value, { stream: true });
                      let idx;
                      while ((idx = buffer.indexOf("\n\n")) !== -1) {
                        const chunk = buffer.slice(0, idx).trim();
                        buffer = buffer.slice(idx + 2);
                        if (!chunk) continue;
                        // multiple lines possible; handle lines starting with data:
                        const lines = chunk.split("\n");
                        for (const line of lines) {
                          const prefix = "data: ";
                          if (!line.startsWith(prefix)) continue;
                          const json = line.slice(prefix.length);
                          try {
                            const evt = JSON.parse(json) as { type: string; text?: string };
                            if (evt.type === "delta" && evt.text) {
                              setMessages((prev) => {
                                const next = [...prev];
                                const a = next[startIndex + 1];
                                if (a && a.role === "assistant") {
                                  next[startIndex + 1] = { ...a, content: a.content + evt.text };
                                }
                                return next;
                              });
                            }
                            // type: start/end ignored for UI for now
                          } catch {
                            // ignore malformed lines
                          }
                        }
                      }
                    }
                  } catch (err) {
                    // On error, append a minimal assistant error message
                    setMessages((prev) => {
                      const next = [...prev];
                      const a = next[startIndex + 1];
                      const msg = "⚠️ Ocurrió un problema al conectar. Intenta de nuevo.";
                      next[startIndex + 1] = a && a.role === "assistant" ? { ...a, content: a.content || msg } : { role: "assistant", content: msg };
                      return next;
                    });
                  } finally {
                    setLoading(false);
                    abortRef.current = null;
                  }
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe un mensaje…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-disabled={loading}
                  className="
                    flex-1 rounded-xl border bg-background/70 px-3 py-2 text-sm outline-none
                    focus:ring-2 focus:ring-[hsl(var(--primary)/0.35)]
                  "
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm
                    text-[hsl(var(--primary-foreground))] border-0
                    bg-[linear-gradient(180deg,hsl(var(--primary)),hsl(187_92%_44%))]
                    shadow-md hover:opacity-95 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  <Send className="h-4 w-4" />
                </button>
                {loading && (
                  <button
                    type="button"
                    onClick={() => {
                      try { abortRef.current?.abort(); } catch { }
                      abortRef.current = null;
                      setLoading(false);
                    }}
                    className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs border bg-background/70 hover:bg-background"
                  >
                    Detener
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
//intregando chatbot con ia