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

    // Light language heuristic to echo back (no LLM yet)
    const locale = (body?.locale || detectLocale(text)) as string | undefined;

    // For now, we just return a minimal stub response to confirm the wiring.
    // Next steps: add SSE streaming and plug a model + DeepWiki retrieval.
    return new Response(
      JSON.stringify({
        ok: true,
        echo: text,
        locale,
        message:
          locale === "es"
            ? "Recibido. El endpoint /api/chat está listo para streaming en el siguiente paso."
            : locale === "fr"
            ? "Reçu. Le point de terminaison /api/chat est prêt pour le streaming à l'étape suivante."
            : "Received. The /api/chat endpoint is ready for streaming in the next step.",
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
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
