import { answer as serviceAnswer, defaultSuggestions, type ChatAnswer } from "../answer";
import { exams, getScheme } from "../data";
import { politicalAnswer } from "../political";
import { examAnswer, schemeAnswer } from "../scheme-answer";
import { normalizeQuery, searchAll } from "../search";
import { cacheGet, cacheSet } from "./cache";
import { GEMINI_MODEL, geminiAnswer, geminiEnabled } from "./gemini";
import { logPipeline, type PipelineLog } from "./log";

type Lang = "ta" | "en";

export interface PipelineResult {
  answer: ChatAnswer;
  meta: { route: PipelineLog["route"]; cache: "hit" | "miss"; ms: number };
}

// Confident = the top hit is clearly better than the runner-up and has real keyword evidence.
const CONFIDENT_MIN = 6;
const CONFIDENT_MARGIN = 3;
const CONFIDENT_RATIO = 1.4;

const TTL_SECONDS = { political: 3600, rules: 86400, gemini: 43200, fallback: 600 } as const;

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/**
 * Database-first, cache-first (PDF §8):
 * normalise → cache → political/government data → scheme/service/exam search + rules → Gemini only if ambiguous → cache with TTL → log.
 */
export async function respond(rawQuery: string, lang: Lang, opts: { fetchImpl?: typeof fetch } = {}): Promise<PipelineResult> {
  const t0 = Date.now();
  const norm = normalizeQuery(rawQuery);
  const key = `chat:v2:${lang}:${await sha256(norm)}`;
  const finish = (answer: ChatAnswer, route: PipelineLog["route"], cache: "hit" | "miss", extra: Partial<PipelineLog> = {}): PipelineResult => {
    const ms = Date.now() - t0;
    logPipeline({ t: Date.now(), route, cache, ms, lang, qLen: rawQuery.length, ...extra });
    return { answer, meta: { route, cache, ms } };
  };

  const cached = await cacheGet(key);
  if (cached) {
    try {
      return finish(JSON.parse(cached) as ChatAnswer, "cache", "hit");
    } catch {
      /* corrupted entry – recompute */
    }
  }

  const store = async (a: ChatAnswer, ttl: number) => {
    await cacheSet(key, JSON.stringify(a), ttl);
  };

  const political = politicalAnswer(rawQuery, norm, lang);
  if (political) {
    await store(political, TTL_SECONDS.political);
    return finish(political, "political", "miss");
  }

  const hits = searchAll(rawQuery, 5);
  const top = hits[0];
  const second = hits[1];
  const confident = top && top.score >= CONFIDENT_MIN && (!second || top.score - second.score >= CONFIDENT_MARGIN || top.score >= second.score * CONFIDENT_RATIO || (top.score >= 12 && top.score > second.score));

  if (confident) {
    let a: ChatAnswer | null = null;
    let route: PipelineLog["route"] = "service";
    if (top.type === "scheme") {
      const s = getScheme(top.id);
      if (s) {
        a = schemeAnswer(s, rawQuery, lang);
        route = "scheme";
      }
    } else if (top.type === "exam") {
      const ex = exams.find((e) => e.id === top.id);
      if (ex) {
        a = examAnswer(ex, lang);
        route = "exam";
      }
    } else {
      a = serviceAnswer(rawQuery, lang);
      route = "service";
    }
    if (a) {
      await store(a, TTL_SECONDS.rules);
      return finish(a, route, "miss");
    }
  }

  // Ambiguous or unknown: ask Gemini with a small, relevant context (never the whole database).
  if (geminiEnabled() && hits.length > 0) {
    const g = await geminiAnswer(rawQuery, lang, hits.slice(0, 3), opts.fetchImpl);
    if (g) {
      const a: ChatAnswer = {
        text: g.text,
        speech: g.text,
        links: hits.slice(0, 2).map((h) => ({ label: h.title[lang], href: h.href })),
        suggestions: defaultSuggestions[lang],
      };
      await store(a, TTL_SECONDS.gemini);
      return finish(a, "gemini", "miss", { model: GEMINI_MODEL, tokensIn: g.tokensIn, tokensOut: g.tokensOut });
    }
  }

  // Rules fallback: best partial match as suggestions.
  const fb = serviceAnswer(rawQuery, lang);
  if (hits.length > 0) {
    fb.text =
      (lang === "ta" ? "நேரடிப் பதில் கிடைக்கவில்லை. இவை உதவலாம்:\n" : "I could not find a direct answer. These may help:\n") +
      hits.slice(0, 3).map((h) => `• ${h.title[lang]}`).join("\n");
    fb.speech = fb.text.replace(/•/g, "");
    fb.links = hits.slice(0, 3).map((h) => ({ label: h.title[lang], href: h.href }));
  }
  await store(fb, TTL_SECONDS.fallback);
  return finish(fb, "fallback", "miss");
}
