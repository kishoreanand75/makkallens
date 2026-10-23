"use client";

import type { ChatAnswer } from "./answer";
import { normalizeQuery } from "./search";
import { readStore, writeStore } from "./store";

// Client-side answer cache (the "user cache"): a question this device asked recently is answered instantly,
// even offline, without calling the server or the AI. Entries expire after 24 hours; at most 50 are kept.
const KEY = "av-answers";
const TTL_MS = 24 * 3600 * 1000;
const MAX = 50;

interface Entry {
  k: string;
  t: number;
  a: ChatAnswer;
}
const NONE: Entry[] = [];

const keyOf = (q: string, lang: string) => `${lang}:${normalizeQuery(q)}`;

export function getCachedAnswer(q: string, lang: string, now = Date.now()): ChatAnswer | null {
  const k = keyOf(q, lang);
  const hit = readStore<Entry[]>(KEY, NONE).find((e) => e.k === k && now - e.t < TTL_MS);
  return hit ? hit.a : null;
}

export function putCachedAnswer(q: string, lang: string, a: ChatAnswer, now = Date.now()) {
  const k = keyOf(q, lang);
  const rest = readStore<Entry[]>(KEY, NONE).filter((e) => e.k !== k && now - e.t < TTL_MS);
  writeStore(KEY, [...rest, { k, t: now, a }].slice(-MAX));
}
