import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { pipelineStats } from "@/lib/server/log";
import { listReports } from "@/lib/server/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorised(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 16) return false; // admin disabled unless a strong token is configured
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!authorised(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  return NextResponse.json({ reports: await listReports(), stats: pipelineStats() });
}
