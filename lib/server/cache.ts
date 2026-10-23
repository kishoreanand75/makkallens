// Cache-first layer. Uses Upstash Redis (REST) when UPSTASH_REDIS_REST_URL / _TOKEN are set,
// otherwise a per-instance in-memory LRU with TTL. Only non-personal Q&A is cached (key = hash of the normalised question).

interface Entry {
  value: string;
  exp: number;
}

const MAX = 500;
const mem = new Map<string, Entry>();

const url = () => process.env.UPSTASH_REDIS_REST_URL;
const token = () => process.env.UPSTASH_REDIS_REST_TOKEN;
export const cacheBackend = () => (url() && token() ? "upstash" : "memory");

async function upstash(cmd: (string | number)[]): Promise<unknown> {
  const res = await fetch(url()!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    signal: AbortSignal.timeout(1500),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export async function cacheGet(key: string): Promise<string | null> {
  if (cacheBackend() === "upstash") {
    try {
      const v = await upstash(["GET", key]);
      return typeof v === "string" ? v : null;
    } catch {
      /* fall through to memory so an outage never breaks answers */
    }
  }
  const e = mem.get(key);
  if (!e) return null;
  if (e.exp < Date.now()) {
    mem.delete(key);
    return null;
  }
  mem.delete(key); // refresh LRU position
  mem.set(key, e);
  return e.value;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (cacheBackend() === "upstash") {
    try {
      await upstash(["SET", key, value, "EX", ttlSeconds]);
      return;
    } catch {
      /* fall back to memory */
    }
  }
  if (mem.size >= MAX) mem.delete(mem.keys().next().value as string);
  mem.set(key, { value, exp: Date.now() + ttlSeconds * 1000 });
}

/** Fixed-window counter. Returns the count after incrementing. */
export async function incrWindow(key: string, windowSeconds: number): Promise<number> {
  if (cacheBackend() === "upstash") {
    try {
      const n = Number(await upstash(["INCR", key]));
      if (n === 1) await upstash(["EXPIRE", key, windowSeconds]);
      return n;
    } catch {
      /* memory fallback */
    }
  }
  const now = Date.now();
  const e = mem.get(key);
  if (!e || e.exp < now) {
    mem.set(key, { value: "1", exp: now + windowSeconds * 1000 });
    return 1;
  }
  const n = Number(e.value) + 1;
  e.value = String(n);
  return n;
}

export function _resetMemoryCache() {
  mem.clear();
}
