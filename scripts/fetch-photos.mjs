// Fetches portrait photos ONLY when the image carries an open licence (CC / public domain / GODL-India)
// according to Wikimedia metadata. Non-free or unknown-licence images are skipped, never copied.
// Usage: node scripts/fetch-photos.mjs [limitToId]
import { readFile, writeFile, mkdir } from "node:fs/promises";

const UA = { "User-Agent": "ArasuVazhi/0.1 (civic guide; contact: avengroups.connect@gmail.com)" };
const API = "https://en.wikipedia.org/w/api.php";
const OK = /^(cc[ -]|public domain|pd|gov(ernment)? (open|of india)|godl|cc0)/i;

const data = JSON.parse(await readFile("data/people.json", "utf8"));
const people = [
  { id: data.tamilNadu.cm.id, search: "Joseph Vijay", title: "C. Joseph Vijay", expect: "Tamil Nadu" },
  { id: data.tamilNadu.governor.id, search: data.tamilNadu.governor.search, expect: "Governor" },
  ...data.tamilNadu.ministers.map((m) => ({ id: m.id, search: m.search, expect: "Tamil Nadu" })),
  ...data.pastTnChiefMinisters.map((p) => ({ id: "past-" + p.name.replace(/\W+/g, "-").toLowerCase(), search: p.search, expect: "Tamil Nadu" })),
  ...data.states.filter((s) => s.code !== "TN").map((s) => ({ id: "cm-" + s.code.toLowerCase(), search: s.cm + " " + s.name, expect: "Minister" })),
];
const only = process.argv[2];
const BAD = /election|constituency|ministry|council|chief minister of|chief minister \(|funeral|history|family|government of|list of|death|assembly|ministership/i;
// A page counts as "the person" only if its title contains the person's distinctive name word.
// Every name word of 3+ letters (first AND last name) must appear in the page title.
const nameWords = (search) =>
  search.split(/\s+/).map((w) => w.toLowerCase().replace(/\W/g, "")).filter((w) => w.length >= 3 && !["tamil","nadu","tamilaga","vettri","kazhagam","minister","pradesh","uttar","madhya","andhra","himachal","arunachal"].includes(w));

const q = async (params) => {
  const r = await fetch(API + "?" + new URLSearchParams({ format: "json", origin: "*", ...params }), { headers: UA });
  return r.json();
};

await mkdir("public/photos", { recursive: true });
let creditsPath = "data/photo-credits.json";
let credits = {};
try {
  credits = JSON.parse(await readFile(creditsPath, "utf8"));
} catch {}

for (const p of people) {
  if (only && p.id !== only) continue;
  if (credits[p.id]) continue;
  try {
    const s = p.title ? { query: { search: [] } } : await q({ action: "query", list: "search", srsearch: p.search, srlimit: "6" });
    const words = nameWords(p.search);
    const hit = p.title
      ? { title: p.title, pageid: Object.values((await q({ action: "query", titles: p.title })).query.pages)[0].pageid }
      : s.query.search.find((h) => !BAD.test(h.title) && words.slice(0, 2).every((w) => h.title.toLowerCase().replace(/\W/g, "").includes(w)) && new RegExp(p.expect, "i").test(h.snippet + h.title)) ?? null;
    if (!hit) { console.log("NO PAGE  ", p.id, "|", p.search); continue; }
    const pg = await q({ action: "query", prop: "pageimages", piprop: "original|name", pageids: String(hit.pageid) });
    const page = Object.values(pg.query.pages)[0];
    if (!page.original || !page.pageimage) { console.log("NO IMAGE ", p.id, "|", hit.title); continue; }
    const fileTitle = "File:" + page.pageimage;
    const info = await q({ action: "query", prop: "imageinfo", iiprop: "extmetadata|url", iiurlwidth: "640", titles: fileTitle });
    const ii = Object.values(info.query.pages)[0].imageinfo?.[0];
    const md = ii?.extmetadata ?? {};
    const lic = md.LicenseShortName?.value ?? "";
    if (!OK.test(lic)) { console.log("LICENSE  ", p.id, "|", hit.title, "|", lic || "unknown", "-> skipped"); continue; }
    const img = await fetch(ii.thumburl, { headers: UA });
    if (!img.ok) { console.log("DL FAIL  ", p.id, img.status); continue; }
    const file = `${p.id}.jpg`;
    await writeFile("public/photos/" + file, Buffer.from(await img.arrayBuffer()));
    credits[p.id] = {
      file,
      page: hit.title,
      license: lic,
      author: (md.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim(),
      source: ii.descriptionurl,
    };
    console.log("OK       ", p.id, "|", hit.title, "|", lic);
    await new Promise((r) => setTimeout(r, 250));
  } catch (e) {
    console.log("ERROR    ", p.id, String(e).slice(0, 80));
  }
}
await writeFile(creditsPath, JSON.stringify(credits, null, 2));
console.log("credits saved:", Object.keys(credits).length);
