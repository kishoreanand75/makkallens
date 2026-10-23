import { exams, schemes, type L } from "./data";
import { services } from "./services";

export interface SearchHit {
  type: "scheme" | "service" | "exam";
  id: string;
  title: L;
  blurb: L;
  href: string;
  score: number;
  /** Interest tags this hit counts towards (used by the personalisation layer). */
  tags: string[];
}

// Tanglish / spelling variants -> words that exist in titles and keywords.
const ALIASES: Record<string, string> = {
  pirappu: "birth", pirandha: "birth", aadhar: "aadhaar", adhar: "aadhaar", adhaar: "aadhaar", kalvi: "education", padippu: "education",
  velai: "job", vela: "job", vivasayi: "farmer", vivasayam: "farmer", uzhavar: "farmer", panam: "money", veedu: "house", veetu: "house",
  maruthuvam: "health", maruthuva: "health", kadan: "loan", thozhil: "business", magalir: "women", makalir: "women", mudhiyor: "senior",
  muthiyor: "senior", kaappeedu: "insurance", kaapeedu: "insurance", sandrithal: "certificate", sandrithazh: "certificate", saathi: "community",
  jathi: "community", sathi: "community", urimai: "urimai", lisence: "licence", license: "licence", licensse: "licence", scholarsip: "scholarship",
  ration: "ration", pension: "pension", oyoothiyam: "pension", oruvoothiyam: "pension", kudumba: "family", pattaa: "patta", chitta: "chitta",
};

const STOP = new Set([
  "how", "to", "get", "what", "is", "the", "a", "an", "for", "apply", "of", "in", "my", "me", "i", "want", "need", "can", "do", "does",
  "about", "tell", "please", "online", "download", "new", "and", "or", "who", "which", "where", "when", "scheme", "schemes", "yojana",
  "age", "limit", "eligibility", "eligible", "qualification", "syllabus", "documents", "document", "fee", "fees", "cost", "time", "days", "steps", "process", "details", "info", "exam", "exams", "test", "job", "jobs", "help",
  "தேர்வு", "தேர்வுகள்", "வயது", "வரம்பு", "தகுதி", "ஆவணங்கள்", "கட்டணம்", "உதவி",
  "epdi", "eppadi", "enna", "venum", "vendum", "seiya", "panna", "pannanum", "yaar", "irukku",
  "எப்படி", "என்ன", "வேண்டும்", "செய்வது", "எடுப்பது", "பற்றி", "திட்டம்", "திட்டங்கள்", "யார்", "எவ்வளவு", "எங்கே", "உண்டா", "வேணும்", "சொல்லுங்கள்",
]);

export function normalizeQuery(q: string): string {
  return q
    .normalize("NFC")
    .toLowerCase()
    .replace(/[?!.,;:()"'`“”‘’/\\]+/g, " ")
    .replace(/(?:group|குரூப்)[\s-]*(\d)/g, "group$1") // "group 2", "group-2", "குரூப் 2" -> "group2"
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(q: string): string[] {
  const out: string[] = [];
  for (const raw of normalizeQuery(q).split(" ")) {
    if (raw.length < 2 || STOP.has(raw)) continue;
    const t = ALIASES[raw] ?? raw;
    if (!STOP.has(t)) out.push(t);
  }
  return out;
}

interface Doc {
  type: SearchHit["type"];
  id: string;
  title: L;
  blurb: L;
  href: string;
  keywords: string[];
  text: string;
  tags: string[];
}

let docs: Doc[] | null = null;
function buildDocs(): Doc[] {
  if (docs) return docs;
  docs = [
    ...schemes.map<Doc>((s) => ({
      type: "scheme", id: s.id, title: s.title, blurb: s.benefit, href: `/schemes/${s.id}`,
      keywords: s.keywords.map((k) => k.toLowerCase()),
      text: `${s.benefit.ta} ${s.benefit.en} ${s.dept.en} ${s.category}`.toLowerCase(),
      tags: [...s.needs, s.category],
    })),
    ...services.map<Doc>((s) => ({
      type: "service", id: s.slug, title: s.name, blurb: s.short, href: `/service/${s.slug}`,
      keywords: s.keywords.map((k) => k.toLowerCase()),
      text: `${s.short.ta} ${s.short.en} ${s.authority.en}`.toLowerCase(),
      tags: ["docs", s.category],
    })),
    ...exams.map<Doc>((e) => ({
      type: "exam", id: e.id, title: e.name, blurb: e.posts, href: `/jobs#${e.id}`,
      keywords: [e.id.replace(/-/g, " "), normalizeQuery(e.name.en), e.name.ta, ...(e.keywords ?? [])],
      text: `${e.posts.en} ${e.posts.ta} ${e.body.en}`.toLowerCase(),
      tags: ["jobs"],
    })),
  ];
  return docs;
}

function overlaps(a: string, b: string): boolean {
  if (a.length < 3 || b.length < 3) return a === b;
  return a.includes(b) || b.includes(a);
}

export function searchAll(query: string, limit = 8): SearchHit[] {
  const q = normalizeQuery(query);
  const toks = tokenize(query);
  if (toks.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const d of buildDocs()) {
    let score = 0;
    const titleEn = normalizeQuery(d.title.en);
    const titleTa = normalizeQuery(d.title.ta);
    if (q.length >= 3 && (q.includes(titleEn) || (titleTa && q.includes(titleTa)))) score += 12;
    for (const tok of toks) {
      if (d.keywords.includes(tok)) score += 9; // exact keyword
      else if (d.keywords.some((k) => overlaps(k, tok))) score += 6;
      else if (titleEn.includes(tok) || titleTa.includes(tok)) score += 4;
      else if (d.tags.includes(tok)) score += 3;
      else if (tok.length >= 4 && d.text.includes(tok)) score += 1.5;
    }
    if (score > 0) hits.push({ type: d.type, id: d.id, title: d.title, blurb: d.blurb, href: d.href, score, tags: d.tags });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
