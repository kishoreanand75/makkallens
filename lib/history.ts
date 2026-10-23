import { schemes, type Scheme } from "./data";
import { matchScheme, type MatchResult } from "./match";
import type { Profile } from "./profile";
import { searchAll } from "./search";

// Privacy: this history lives only in the user's own browser (localStorage). It is never sent to a server,
// and it only contains what the user did on this site – we cannot and do not read anyone's Google history.

export type HistoryEvent =
  | { t: number; k: "q"; text: string }
  | { t: number; k: "view"; type: "scheme" | "service" | "exam"; id: string; tags: string[] };

export const HISTORY_KEY = "av-history";
export const MAX_EVENTS = 200;
const HALF_LIFE_DAYS = 14;

export function pushEvent(events: HistoryEvent[], ev: HistoryEvent): HistoryEvent[] {
  const next = [...events, ev];
  return next.length > MAX_EVENTS ? next.slice(next.length - MAX_EVENTS) : next;
}

const decay = (ageMs: number) => Math.pow(0.5, ageMs / (HALF_LIFE_DAYS * 86400000));

/** Weighted interest per tag (need / category / "docs" / "jobs"), newest events count most. */
export function interestWeights(events: HistoryEvent[], now = Date.now()): Record<string, number> {
  const w: Record<string, number> = {};
  const add = (tag: string, v: number) => {
    w[tag] = (w[tag] ?? 0) + v;
  };
  for (const ev of events) {
    const d = decay(Math.max(0, now - ev.t));
    if (ev.k === "view") {
      for (const tag of ev.tags) add(tag, 2 * d);
    } else {
      const hits = searchAll(ev.text, 3);
      const top = hits[0]?.score ?? 0;
      for (const h of hits) {
        const rel = top > 0 ? h.score / top : 0;
        for (const tag of h.tags) add(tag, rel * d);
      }
    }
  }
  return w;
}

export interface Recommendation {
  scheme: Scheme;
  match: MatchResult;
  score: number;
  why: "history" | "profile" | "popular";
}

export function recommend(profile: Profile, events: HistoryEvent[], limit = 6, now = Date.now()): Recommendation[] {
  const w = interestWeights(events, now);
  const maxW = Math.max(0, ...Object.values(w));
  const out: Recommendation[] = [];
  for (const scheme of schemes) {
    const match = matchScheme(profile, scheme);
    if (match.band === "none") continue;
    const tags = [...scheme.needs, scheme.category];
    const interest = maxW > 0 ? Math.min(1, tags.reduce((s, t) => s + (w[t] ?? 0), 0) / maxW) : 0;
    const profileKnown = profile.age !== null || profile.occupation !== null || profile.gender !== null || profile.income !== null;
    const score = (profileKnown ? match.score : 40) * 0.5 + interest * 100 * 0.4 + scheme.popularity * 1;
    out.push({ scheme, match, score, why: interest > 0.25 ? "history" : profileKnown ? "profile" : "popular" });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function recentQueries(events: HistoryEvent[], n = 5): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (let i = events.length - 1; i >= 0 && out.length < n; i--) {
    const ev = events[i];
    if (ev.k === "q" && !seen.has(ev.text)) {
      seen.add(ev.text);
      out.push(ev.text);
    }
  }
  return out;
}
