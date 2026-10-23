// Reachability check for every official URL in data/*.json (does NOT prove the content is correct).
import { readFile } from "node:fs/promises";
const files = ["schemes", "exams", "documents", "business", "bills"];
const urls = new Map();
for (const f of files) {
  for (const it of JSON.parse(await readFile(`data/${f}.json`, "utf8"))) if (it.url) urls.set(it.url, `${f}:${it.id}`);
}
const bad = [];
await Promise.all([...urls].map(async ([u, who]) => {
  for (const method of ["HEAD", "GET"]) {
    try {
      const r = await fetch(u, { method, redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "User-Agent": "Mozilla/5.0 ArasuVazhi-linkcheck" } });
      if (r.status < 400) return;
      if (method === "GET") bad.push(`${r.status} ${u} (${who})`);
    } catch (e) {
      if (method === "GET") bad.push(`ERR ${u} (${who}) ${String(e.cause?.code || e.name)}`);
    }
  }
}));
console.log(`${urls.size} unique urls, ${bad.length} not reachable`);
console.log(bad.sort().join("\n"));
