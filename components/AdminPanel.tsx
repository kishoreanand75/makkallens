"use client";

import { useState } from "react";

interface Report {
  id: string;
  kind: string;
  at: string;
  target?: string;
  message: string;
  contact?: string;
  status: string;
}
interface Stats {
  requests: number;
  cacheHits: number;
  gemini: number;
  tokensIn: number;
  tokensOut: number;
  cacheHitRate: number;
}

/** The token is typed here, kept in memory only and sent as a Bearer header. It is never stored in the browser. */
export function AdminPanel() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<{ reports: Report[]; stats: Stats } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/admin/reports", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
      setErr(res.status === 401 ? "Unauthorised (or ADMIN_TOKEN not set on the server)." : `Error ${res.status}`);
      setData(null);
      return;
    }
    setData(await res.json());
  }

  return (
    <div>
      <form onSubmit={load} className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="font-display text-base font-semibold">Admin token</span>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 block min-h-12 w-72 rounded-lg border-2 border-ink bg-paper-2 px-3" autoComplete="off" />
        </label>
        <button type="submit" className="min-h-12 rounded-lg bg-brand px-5 font-display text-base font-semibold text-white hover:bg-brand-dark">
          Load
        </button>
      </form>
      {err && (
        <p role="alert" className="mt-4 text-ink">
          {err}
        </p>
      )}
      {data && (
        <div className="mt-8 space-y-8">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ["Requests", data.stats.requests],
              ["Cache hit rate", `${Math.round(data.stats.cacheHitRate * 100)}%`],
              ["Gemini calls", data.stats.gemini],
              ["Tokens in", data.stats.tokensIn],
              ["Tokens out", data.stats.tokensOut],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-lg border border-line bg-paper-2 p-3">
                <dt className="text-sm text-ink-soft">{k}</dt>
                <dd className="font-display text-2xl font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="border-t border-line">
            {data.reports.map((r) => (
              <li key={r.id} className="border-b border-line py-3">
                <p className="text-sm text-ink-soft">
                  {new Date(r.at).toLocaleString()} · {r.kind} · {r.target ?? "-"} · {r.status}
                </p>
                <p className="whitespace-pre-wrap">{r.message}</p>
                {r.contact && <p className="text-sm text-ink-soft">Contact: {r.contact}</p>}
              </li>
            ))}
            {data.reports.length === 0 && <li className="py-3 text-ink-soft">No reports yet.</li>}
          </ul>
          <p className="text-sm text-ink-soft">To publish a correction, edit data/schemes.json (set lastVerified to the check date) and record it in the change log; with Supabase use the scheme_updates table.</p>
        </div>
      )}
    </div>
  );
}
