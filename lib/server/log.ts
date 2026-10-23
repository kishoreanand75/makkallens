// Usage log for the AI pipeline (PDF §8: "log token usage, latency, cache hit, and model version").
// The question text is never logged – only its length – so no personal data ends up in logs.

export interface PipelineLog {
  t: number;
  route: "cache" | "political" | "scheme" | "service" | "exam" | "gemini" | "fallback";
  cache: "hit" | "miss";
  ms: number;
  lang: "ta" | "en";
  qLen: number;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
}

const recent: PipelineLog[] = [];
const totals = { requests: 0, cacheHits: 0, gemini: 0, tokensIn: 0, tokensOut: 0 };

export function logPipeline(entry: PipelineLog) {
  totals.requests++;
  if (entry.cache === "hit") totals.cacheHits++;
  if (entry.route === "gemini") totals.gemini++;
  totals.tokensIn += entry.tokensIn ?? 0;
  totals.tokensOut += entry.tokensOut ?? 0;
  recent.push(entry);
  if (recent.length > 200) recent.shift();
  if (process.env.NODE_ENV !== "test") console.info(JSON.stringify({ evt: "chat", ...entry }));
}

export function pipelineStats() {
  return { ...totals, cacheHitRate: totals.requests ? totals.cacheHits / totals.requests : 0, recent: recent.slice(-20) };
}
