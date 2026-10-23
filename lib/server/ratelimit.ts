import { incrWindow } from "./cache";

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

/** Fixed-window limiter: `limit` requests per `windowSeconds` per IP and scope. */
export async function allow(req: Request, scope: string, limit: number, windowSeconds = 60) {
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const n = await incrWindow(`rl:${scope}:${clientIp(req)}:${bucket}`, windowSeconds);
  return { ok: n <= limit, remaining: Math.max(0, limit - n), retryAfter: windowSeconds };
}
