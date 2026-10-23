import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

export type ReportKind = "outdated" | "contact" | "waitlist";

export interface Report {
  id: string;
  kind: ReportKind;
  at: string;
  target?: string; // scheme id / page
  message: string;
  contact?: string;
  status: "new" | "verified" | "rejected";
}

const FILE = path.join(process.cwd(), ".data", "reports.jsonl");

/**
 * Stores a report. With SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY it goes to the `reports` table (see supabase/schema.sql);
 * otherwise it is appended to .data/reports.jsonl (local development / single server). The service-role key is server-only.
 */
export async function saveReport(r: Omit<Report, "id" | "at" | "status">): Promise<{ stored: "supabase" | "file" | "log" }> {
  const rec: Report = { id: crypto.randomUUID(), at: new Date().toISOString(), status: "new", ...r };
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (base && key) {
    try {
      const res = await fetch(`${base}/rest/v1/reports`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ id: rec.id, kind: rec.kind, target: rec.target ?? null, message: rec.message, contact: rec.contact ?? null, status: rec.status }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return { stored: "supabase" };
    } catch {
      /* fall through */
    }
  }
  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    await appendFile(FILE, JSON.stringify(rec) + "\n", "utf8");
    return { stored: "file" };
  } catch {
    console.info(JSON.stringify({ evt: "report", ...rec })); // read-only filesystems (serverless): at least keep it in logs
    return { stored: "log" };
  }
}

export async function listReports(): Promise<Report[]> {
  try {
    const text = await readFile(FILE, "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as Report)
      .reverse();
  } catch {
    return [];
  }
}
