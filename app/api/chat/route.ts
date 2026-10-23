import { NextResponse } from "next/server";
import { respond } from "@/lib/server/pipeline";
import { allow } from "@/lib/server/ratelimit";

export const runtime = "nodejs";

const MAX_BODY = 2_000;

// POST { q, lang } -> { ...ChatAnswer, meta }. Rate-limited per IP; the Gemini key (if any) stays on the server.
export async function POST(req: Request) {
  const rl = await allow(req, "chat", 20, 60);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many questions. Please wait a minute. / சிறிது நேரம் கழித்து முயலுங்கள்." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return NextResponse.json({ error: "too_large" }, { status: 413 });
  let body: { q?: unknown; lang?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const q = typeof body.q === "string" ? body.q.replace(/[\u0000-\u001f]/g, " ").slice(0, 300).trim() : "";
  const lang = body.lang === "en" ? "en" : "ta";
  if (!q) return NextResponse.json({ error: "empty_question" }, { status: 400 });

  const { answer, meta } = await respond(q, lang);
  return NextResponse.json({ ...answer, meta });
}
