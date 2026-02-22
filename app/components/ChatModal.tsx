"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Ghost
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  variant?: "ghost" | "docked";
  panelId?: string;
}

const panelAnim = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 },
  transition: { type: "spring", damping: 25, stiffness: 300 } as const
};

export default function ChatModal({
  open,
  onClose,
  variant = "ghost",
  panelId = "ghost-chat-modal",
}: ChatModalProps) {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const titleId = `${panelId}-title`;
  const Icon = variant === "ghost" ? Ghost : MessageCircle;

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSuggestion = (query: string) => {
    // Only set input and focus, don't auto-send to allow user to edit
    setInput(query);
    inputRef.current?.focus();
  };

  const suggestions = [
    { text: t('suggestions.yoga.text'), query: t('suggestions.yoga.query') },
    { text: t('suggestions.tours.text'), query: t('suggestions.tours.query') },
    { text: t('suggestions.nomad.text'), query: t('suggestions.nomad.query') },
    { text: t('suggestions.compare.text'), query: t('suggestions.compare.query') }
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/20 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-label={t('title')}
            className="
              fixed z-[75]
              right-5 bottom-24 md:right-6 md:bottom-28
              w-[min(92vw,420px)]
            "
            onClick={(e) => e.stopPropagation()}
            {...panelAnim}
          >
            <div className="card-glass border rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div id={titleId} className="text-sm font-medium">{t('title')}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={t('clearTooltip')}
                    onClick={() => setMessages([])}
                    className="rounded-lg p-1.5 hover:bg-card/70 focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-all"
                  >
                    <Ghost className="h-4 w-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    aria-label={t('closeMenu')}
                    onClick={onClose}
                    className="rounded-lg p-1.5 hover:bg-card/70 focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)] transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 px-4 py-2 border-b border-border/40 flex items-center gap-2" aria-live="polite">
                <div className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? 'bg-amber-500' : 'bg-primary'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? 'bg-amber-500' : 'bg-primary'}`}></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                  {loading ? t('statusWait') : t('statusOnline')}
                </span>
              </div>

              <div
                ref={scrollRef}
                className="px-4 py-3 space-y-3 max-h-[48vh] overflow-y-auto scrollbar-hide"
              >
                {messages.length === 0 ? (
                  <div className="space-y-4 py-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="glass-enhanced rounded-2xl p-4 text-sm leading-relaxed border border-white/5 shadow-xl">
                        {t('welcomeMessage')}
                      </div>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion.query)}
                          className="text-[10px] uppercase font-black tracking-widest px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                          ${m.role === "user"
                            ? "bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20"
                            : "glass-enhanced border border-white/10 shadow-xl"
                          }
                        `}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="glass-enhanced rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs font-medium opacity-50 italic">{t('statusActive')}</span>
                    </div>
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

                  const userMsg: Msg = { role: "user", content: text };
                  const assistantMsg: Msg = { role: "assistant", content: "" };
                  const startIndex = messages.length;
                  setMessages((prev) => [...prev, userMsg, assistantMsg]);
                  setInput("");

                  try {
                    const controller = new AbortController();
                    abortRef.current = controller;

                    const history = messages.slice(0, startIndex).map(m => ({
                      role: m.role,
                      content: m.content
                    }));

                    const res = await fetch("/api/chat", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        message: text,
                        locale: locale,
                        history
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
                          } catch {
                            continue;
                          }
                        }
                      }
                    }
                  } catch {
                    setMessages((prev) => {
                      const next = [...prev];
                      const a = next[startIndex + 1];
                      const msg = t('errorMessage');
                      next[startIndex + 1] = a && a.role === "assistant" ? { ...a, content: a.content || msg } : { role: "assistant", content: msg };
                      return next;
                    });
                  } finally {
                    setLoading(false);
                    abortRef.current = null;
                  }
                }}
              >
                <div className="relative flex-1 group">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={t('inputPlaceholder')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-disabled={loading}
                    className="
                      w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm outline-none
                      focus:ring-2 focus:ring-primary/30 focus:bg-white/10 focus:border-primary/50
                      transition-all duration-300
                    "
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {loading ? (
                      <button
                        type="button"
                        onClick={() => {
                          try { abortRef.current?.abort(); } catch { return; }
                          abortRef.current = null;
                          setLoading(false);
                        }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className="
                          p-2 rounded-xl bg-primary text-primary-foreground
                          shadow-lg shadow-primary/20 hover:scale-105 active:scale-95
                          disabled:opacity-30 disabled:scale-100 disabled:grayscale
                          transition-all duration-300
                        "
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
