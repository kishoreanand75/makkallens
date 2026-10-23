import { NextResponse } from "next/server";
import { allow } from "@/lib/server/ratelimit";

export const runtime = "nodejs";

// Minimal client-error sink (stand-in for Sentry until a DSN is configured). No user data: message + route only.
export async function POST(req: Request) {
  const rl = await allow(req, "log", 10, 60);
  if (!rl.ok) return NextResponse.json({ ok: false }, { status: 429 });
  try {
    const b = (await req.json()) as { message?: unknown; path?: unknown };
    console.error(JSON.stringify({ evt: "client-error", message: String(b.message ?? "").slice(0, 300), path: String(b.path ?? "").slice(0, 120) }));
  } catch {
    /* ignore malformed */
  }
  return NextResponse.json({ ok: true });
}
