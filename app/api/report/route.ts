import { NextResponse } from "next/server";
import { getScheme } from "@/lib/data";
import { allow } from "@/lib/server/ratelimit";
import { saveReport, type ReportKind } from "@/lib/server/reports";

export const runtime = "nodejs";

const KINDS: ReportKind[] = ["outdated", "contact", "waitlist"];
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "");

// "Report outdated information", contact form and plan waitlist all land here and wait for an admin to verify.
export async function POST(req: Request) {
  const rl = await allow(req, "report", 5, 600);
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const kind = KINDS.find((k) => k === body.kind);
  const message = clean(body.message, 1000);
  if (!kind || message.length < 3) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // honeypot: real people leave this empty
  if (clean(body.website, 50)) return NextResponse.json({ ok: true });

  const target = clean(body.target, 80);
  if (kind === "outdated" && target && !getScheme(target) && !/^(service|page):/.test(target)) {
    return NextResponse.json({ error: "unknown_target" }, { status: 400 });
  }
  const { stored } = await saveReport({ kind, message, target: target || undefined, contact: clean(body.contact, 120) || undefined });
  return NextResponse.json({ ok: true, stored });
}
