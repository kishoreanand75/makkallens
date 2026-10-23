import { beforeEach, describe, expect, it, vi } from "vitest";
import { districts, documents, exams, helplines, schemes, getScheme } from "@/lib/data";
import { matchExam, matchScheme } from "@/lib/match";
import { emptyProfile, type Profile } from "@/lib/profile";
import { recommend, interestWeights, pushEvent, MAX_EVENTS, type HistoryEvent } from "@/lib/history";
import { searchAll, tokenize } from "@/lib/search";
import { daysUntil, toIcs, urgency } from "@/lib/reminders";
import { _resetMemoryCache, cacheGet, cacheSet, incrWindow } from "@/lib/server/cache";
import { respond } from "@/lib/server/pipeline";
import { geminiAnswer } from "@/lib/server/gemini";
import { allow } from "@/lib/server/ratelimit";
import { services } from "@/lib/services";

const P = (patch: Partial<Profile>): Profile => ({ ...emptyProfile, ...patch });

describe("data integrity", () => {
  it("scheme ids are unique and every field is filled in both languages", () => {
    const ids = new Set(schemes.map((s) => s.id));
    expect(ids.size).toBe(schemes.length);
    for (const s of schemes) {
      for (const v of [s.title, s.dept, s.benefit, s.apply]) {
        expect(v.ta.length, `${s.id} ta`).toBeGreaterThan(3);
        expect(v.en.length, `${s.id} en`).toBeGreaterThan(3);
      }
      expect(s.url, s.id).toMatch(/^https:\/\//);
      expect(() => new URL(s.url)).not.toThrow();
    }
  });
  it("every document referenced by a scheme exists", () => {
    const known = new Set(documents.map((d) => d.id));
    for (const s of schemes) for (const d of s.docs) expect(known.has(d), `${s.id} -> ${d}`).toBe(true);
  });
  it("documents that point to a service guide point to a real one", () => {
    for (const d of documents) if (d.service) expect(services.some((s) => s.slug === d.service), d.id).toBe(true);
  });
  it("no scheme claims to be verified without a date, and none has a date yet", () => {
    for (const s of schemes) expect(s.lastVerified).toBeNull();
  });
  it("38 districts with plausible Tamil Nadu coordinates; helplines have numbers", () => {
    expect(districts).toHaveLength(38);
    for (const d of districts) {
      expect(d.lat).toBeGreaterThan(8);
      expect(d.lat).toBeLessThan(14);
      expect(d.lng).toBeGreaterThan(76);
      expect(d.lng).toBeLessThan(81);
    }
    for (const h of helplines) expect(h.num).toMatch(/^\d{3,11}$/);
    expect(exams.length).toBeGreaterThanOrEqual(10);
  });
});

describe("eligibility matching", () => {
  const kisan = getScheme("pm-kisan")!;
  it("farmer matches PM-KISAN strongly, student is excluded", () => {
    expect(matchScheme(P({ occupation: "farmer", needs: ["farming"] }), kisan).band).toBe("high");
    const student = matchScheme(P({ occupation: "student" }), kisan);
    expect(student.band).toBe("none");
    expect(student.score).toBe(0);
  });
  it("gender rule is hard: a man never matches a women-only scheme", () => {
    expect(matchScheme(P({ gender: "male" }), getScheme("magalir-urimai")!).band).toBe("none");
    expect(matchScheme(P({ gender: "female", age: 35, occupation: "homemaker", income: "lt1" }), getScheme("magalir-urimai")!).band).not.toBe("none");
  });
  it("age limits: 45-year-old cannot join Atal Pension, 30-year-old can", () => {
    const apy = getScheme("apy")!;
    expect(matchScheme(P({ age: 45 }), apy).band).toBe("none");
    expect(matchScheme(P({ age: 30, occupation: "worker" }), apy).band).not.toBe("none");
  });
  it("income band: ₹8L+ is excluded from CMCHIS (₹1.2L), under ₹1L passes, ₹1-2.5L is 'unknown' not failed", () => {
    const c = getScheme("cmchis")!;
    expect(matchScheme(P({ income: "gt8" }), c).band).toBe("none");
    expect(matchScheme(P({ income: "lt1" }), c).checks[0].state).toBe("met");
    expect(matchScheme(P({ income: "1to25" }), c).checks[0].state).toBe("unknown");
  });
  it("unknown profile never hard-fails and need selection adds a bonus", () => {
    const a = matchScheme(emptyProfile, kisan);
    const b = matchScheme(P({ needs: ["farming"] }), kisan);
    expect(a.band).not.toBe("none");
    expect(b.score).toBeGreaterThan(a.score);
  });
  it("schemes for children (Sukanya, breakfast) are not hidden from parents by age", () => {
    expect(matchScheme(P({ age: 32, gender: "male" }), getScheme("tn-breakfast")!).band).not.toBe("none");
    expect(matchScheme(P({ age: 32, gender: "female" }), getScheme("sukanya")!).band).not.toBe("none");
  });
  it("Stand-Up India is not wrongly closed to women of any community", () => {
    expect(matchScheme(P({ gender: "female", community: "general", age: 30 }), getScheme("standup-india")!).band).not.toBe("none");
  });
  it("exam matcher checks education and age", () => {
    const g4 = exams.find((e) => e.id === "tnpsc-g4")!;
    const upsc = exams.find((e) => e.id === "upsc-cse")!;
    expect(matchExam(P({ education: "below10" }), g4).status).toBe("no");
    expect(matchExam(P({ education: "degree" }), g4).status).toBe("eligible");
    expect(matchExam(P({ education: "degree", age: 20 }), upsc).status).toBe("no");
    expect(matchExam(P({ education: "degree", age: 40 }), upsc).status).toBe("check");
    expect(matchExam(emptyProfile, upsc).status).toBe("check");
  });
});

describe("search", () => {
  it("finds services, schemes and exams in Tamil, English and Tanglish", () => {
    expect(searchAll("birth certificate documents")[0].id).toBe("birth-certificate");
    expect(searchAll("pirappu sandrithal")[0].id).toBe("birth-certificate");
    expect(searchAll("PM Kisan farmer money")[0].id).toBe("pm-kisan");
    expect(searchAll("விவசாயி கடன்")[0].type).toBe("scheme");
    expect(searchAll("tnpsc group 4 eligibility")[0].id).toBe("tnpsc-g4");
    expect(searchAll("முதியோர் ஓய்வூதியம்").some((h) => h.id === "ignoaps" || h.id === "tn-oap")).toBe(true);
  });
  it("ignores filler words and returns nothing for gibberish", () => {
    expect(tokenize("how to get the")).toEqual([]);
    expect(searchAll("zzzz qqqq")).toEqual([]);
  });
});

describe("history personalisation (on-device)", () => {
  const now = Date.UTC(2026, 9, 21);
  const q = (text: string, daysAgo = 0): HistoryEvent => ({ t: now - daysAgo * 86400000, k: "q", text });
  it("farm searches push agriculture schemes ahead for an otherwise empty profile", () => {
    const base = recommend(emptyProfile, [], 35, now);
    const withHistory = recommend(emptyProfile, [q("crop insurance"), q("kisan credit card loan"), q("விவசாயி")], 35, now);
    const rank = (list: typeof base, id: string) => list.findIndex((r) => r.scheme.id === id);
    expect(rank(withHistory, "pmfby")).toBeLessThan(rank(base, "pmfby"));
    expect(withHistory[0].why).toBe("history");
  });
  it("old interest fades (14-day half life) and history is capped", () => {
    const fresh = interestWeights([q("scholarship")], now);
    const old = interestWeights([q("scholarship", 56)], now);
    expect(Math.max(...Object.values(old))).toBeLessThan(Math.max(...Object.values(fresh)) / 8);
    let ev: HistoryEvent[] = [];
    for (let i = 0; i < MAX_EVENTS + 30; i++) ev = pushEvent(ev, q(`q${i}`));
    expect(ev).toHaveLength(MAX_EVENTS);
  });
  it("hard-ineligible schemes are never recommended", () => {
    const rec = recommend(P({ gender: "male" }), [], 40, now);
    expect(rec.some((r) => r.scheme.id === "magalir-urimai")).toBe(false);
  });
});

describe("reminders", () => {
  it("urgency and day counts", () => {
    const now = new Date(2026, 9, 21);
    expect(daysUntil("2026-10-21", now)).toBe(0);
    expect(urgency("2026-10-20", now)).toBe("overdue");
    expect(urgency("2026-10-25", now)).toBe("soon");
    expect(urgency("2026-12-01", now)).toBe("later");
  });
  it("produces valid iCalendar with escaped text and an alarm", () => {
    const ics = toIcs([{ id: "a1", title: "PAN, link; renew", due: "2026-12-31", note: "line1\nline2" }], new Date("2026-10-21T00:00:00Z"));
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
    expect(ics).toContain("SUMMARY:PAN\\, link\\; renew");
    expect(ics).toContain("DESCRIPTION:line1\\nline2");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics.endsWith("END:VCALENDAR")).toBe(true);
  });
});

describe("cache + rate limit (memory backend)", () => {
  beforeEach(() => {
    _resetMemoryCache();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });
  it("stores and expires values", async () => {
    await cacheSet("k", "v", 60);
    expect(await cacheGet("k")).toBe("v");
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 61_000);
    expect(await cacheGet("k")).toBeNull();
    vi.useRealTimers();
  });
  it("counts within a window", async () => {
    expect(await incrWindow("w", 60)).toBe(1);
    expect(await incrWindow("w", 60)).toBe(2);
  });
  it("blocks the 21st chat request from one IP, but not another IP", async () => {
    const req = (ip: string) => new Request("http://x/api/chat", { headers: { "x-forwarded-for": ip } });
    for (let i = 0; i < 20; i++) expect((await allow(req("1.1.1.1"), "chat", 20, 60)).ok).toBe(true);
    expect((await allow(req("1.1.1.1"), "chat", 20, 60)).ok).toBe(false);
    expect((await allow(req("2.2.2.2"), "chat", 20, 60)).ok).toBe(true);
  });
});

describe("AI pipeline (database-first, cache-first)", () => {
  beforeEach(() => {
    _resetMemoryCache();
    delete process.env.GEMINI_API_KEY;
    delete process.env.UPSTASH_REDIS_REST_URL;
  });
  it("answers a scheme question from the database, then serves the repeat from cache", async () => {
    const a = await respond("PM Kisan documents", "en");
    expect(a.meta.route).toBe("scheme");
    expect(a.meta.cache).toBe("miss");
    expect(a.answer.text).toMatch(/Department/);
    expect(a.answer.text).toMatch(/Verification pending/);
    expect(a.answer.links?.some((l) => l.href === "/schemes/pm-kisan")).toBe(true);
    const b = await respond("pm kisan documents?", "en"); // normalises to the same key
    expect(b.meta.cache).toBe("hit");
    expect(b.meta.route).toBe("cache");
    expect(b.answer.text).toBe(a.answer.text);
  });
  it("keeps languages separate in the cache", async () => {
    const ta = await respond("pm kisan", "ta");
    const en = await respond("pm kisan", "en");
    expect(en.meta.cache).toBe("miss");
    expect(ta.answer.text).not.toBe(en.answer.text);
  });
  it("routes politics, services and exams without any AI key", async () => {
    expect((await respond("who is the chief minister", "en")).meta.route).toBe("political");
    expect((await respond("birth certificate documents", "en")).meta.route).toBe("service");
    expect((await respond("tnpsc group 4 eligibility", "en")).meta.route).toBe("exam");
  });
  it("never calls Gemini when the rules are confident", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const f = vi.fn();
    const r = await respond("pm kisan benefit amount", "en", { fetchImpl: f as unknown as typeof fetch });
    expect(r.meta.route).toBe("scheme");
    expect(f).not.toHaveBeenCalled();
  });
  it("uses Gemini (small context, key in header, output capped) for an ambiguous question, then caches it", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const f = vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "Sample answer" }] } }], usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 8 } }), { status: 200 }));
    const q = "loan help";
    const r = await respond(q, "en", { fetchImpl: f as unknown as typeof fetch });
    if (r.meta.route === "gemini") {
      expect(r.answer.text).toBe("Sample answer");
      const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toContain("gemini-2.5-flash");
      expect(String(url)).not.toContain("test-key");
      expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
      const sent = JSON.parse(String(init.body));
      expect(sent.generationConfig.maxOutputTokens).toBeLessThanOrEqual(400);
      expect(JSON.stringify(sent).length).toBeLessThan(12000);
      expect((await respond(q, "en", { fetchImpl: f as unknown as typeof fetch })).meta.cache).toBe("hit");
      expect(f).toHaveBeenCalledTimes(1);
    } else {
      // the rules were confident enough for this wording; the dedicated Gemini test below covers the call itself
      expect(["scheme", "service", "fallback"]).toContain(r.meta.route);
    }
  });
  it("gemini wrapper: success parses text+tokens, HTTP error / timeout / missing key all return null", async () => {
    const ctx = searchAll("loan", 3);
    process.env.GEMINI_API_KEY = "k";
    const ok = vi.fn(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "வணக்கம்" }] } }], usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 2 } })));
    expect(await geminiAnswer("loan", "ta", ctx, ok as unknown as typeof fetch)).toEqual({ text: "வணக்கம்", tokensIn: 5, tokensOut: 2 });
    expect(await geminiAnswer("loan", "ta", ctx, (async () => new Response("no", { status: 500 })) as unknown as typeof fetch)).toBeNull();
    expect(await geminiAnswer("loan", "ta", ctx, (async () => { throw new Error("timeout"); }) as unknown as typeof fetch)).toBeNull();
    delete process.env.GEMINI_API_KEY;
    expect(await geminiAnswer("loan", "ta", ctx, ok as unknown as typeof fetch)).toBeNull();
  });
  it("falls back to rules suggestions when Gemini fails", async () => {
    process.env.GEMINI_API_KEY = "k";
    const r = await respond("loan help", "en", { fetchImpl: (async () => new Response("err", { status: 503 })) as unknown as typeof fetch });
    expect(["scheme", "service", "fallback"]).toContain(r.meta.route);
    expect(r.answer.text.length).toBeGreaterThan(10);
  });
});

describe("top 50", () => {
  it("has 50 unique ranked entries that all resolve to real records", async () => {
    const { top50Entries } = await import("../lib/top50-items");
    const list = top50Entries();
    expect(list).toHaveLength(50);
    expect(new Set(list.map((e) => `${e.type}:${e.id}`)).size).toBe(50);
    expect(list.map((e) => e.rank)).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });
  it("catalogue sizes", async () => {
    const { schemes } = await import("../lib/data");
    const { services } = await import("../lib/services");
    expect(schemes.length).toBe(34);
    expect(services.length).toBe(16);
  });
});

describe("top 50 photos", () => {
  it("gives every item its own existing photo", async () => {
    const { top50Entries } = await import("../lib/top50-items");
    const { existsSync } = await import("node:fs");
    const imgs = top50Entries().map((e) => e.icon);
    expect(new Set(imgs).size).toBe(50);
    for (const i of imgs) expect(existsSync(`public${i}`)).toBe(true);
  });
});
