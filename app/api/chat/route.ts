export const runtime = "edge";

// Basic schema for incoming chat messages
// We'll keep it flexible for now and validate lightly.

type ChatRequest = {
  message: string;
  locale?: string; // optional hint: "es", "en", "fr", etc.
  threadId?: string; // for future conversation continuity
};

export async function POST(req: Request): Promise<Response> {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Expected application/json" }),
        { status: 415, headers: { "content-type": "application/json" } }
      );
    }

    const body = (await req.json()) as Partial<ChatRequest> | null;
    const text = (body?.message ?? "").toString().trim();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Missing 'message' in request body" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Language heuristic
    const locale = (body?.locale || detectLocale(text)) as string | undefined;

    // Compose a short system prompt derived from project style
    const system =
      locale === "es"
        ? "Eres Aletheia, la Guía Fantasma de Nómada Fantasma. Responde en el idioma del usuario. Estilo: 1 línea de valor → 3 bullets máx. → 1 acción. No inventes horarios/precios. Si dudas, dilo y ofrece verificación. Seguridad primero."
        : locale === "fr"
        ? "Tu es Aletheia, la Guide Fantôme de Nómada Fantasma. Réponds dans la langue de l'utilisateur. Style: 1 ligne de valeur → 3 points max → 1 action. N'invente pas d'horaires/prix. Si tu doutes, dis-le et propose une vérification. Priorité à la sécurité."
        : "You are Aletheia, the Ghost Guide of Nómada Fantasma. Reply in the user's language. Style: 1 value line → max 3 bullets → 1 action. Do not invent schedules/prices. If unsure, say so and offer verification. Safety first.";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GROQ_API_KEY" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // Create upstream streaming fetch to Groq (OpenAI-compatible chat.completions)
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        stream: true,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: text },
        ],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const msg = `Upstream error ${upstream.status}`;
      return new Response(JSON.stringify({ error: msg }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const send = (payload: unknown) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        };

        // Announce start to client
        send({ type: "start", locale: locale || null });

        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const pump = () => {
          reader.read().then(({ value, done }) => {
            try {
              if (done) {
                send({ type: "end" });
                controller.close();
                return;
              }
              if (value) buffer += decoder.decode(value, { stream: true });

              // The upstream uses SSE with lines like: "data: {json}\n" and end marker "data: [DONE]"
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
                  if (json === "[DONE]") {
                    send({ type: "end" });
                    controller.close();
                    return;
                  }
                  try {
                    const evt = JSON.parse(json) as {
                      choices?: Array<{ delta?: { content?: string } }>;
                    };
                    const delta = evt.choices?.[0]?.delta?.content;
                    if (delta) send({ type: "delta", text: delta });
                  } catch {
                    // ignore non-JSON lines
                  }
                }
              }

              pump();
            } catch (e) {
              controller.error(e);
            }
          }).catch((e) => controller.error(e));
        };
        pump();
      },
      cancel() {
        // Client disconnected; upstream stream will be GC'd
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

function detectLocale(text: string): "es" | "en" | "fr" | undefined {
  const t = text.toLowerCase();
  // Naive checks for now, good enough for skeleton.
  if (/[áéíóúñ¡¿]/.test(t) || /\b(hola|gracias|por favor|cómo)\b/.test(t)) return "es";
  if (/\b(bonjour|merci|s'il|comment)\b/.test(t)) return "fr";
  if (/\b(hello|thanks|please|how)\b/.test(t)) return "en";
  return undefined;
}

// no chunkString needed anymore
