import { politicalAnswer } from "./political";
import { services, type L, type Service } from "./services";

export interface ChatAnswer {
  text: string;
  /** Plain text for speech synthesis (no symbols read out loud). */
  speech: string;
  slug?: string;
  links?: { label: string; href: string }[];
  suggestions: string[];
}

type Intent = "documents" | "fees" | "time" | "official" | "offline" | "steps";

const intentWords: Record<Exclude<Intent, "steps">, string[]> = {
  documents: ["document", "documents", "papers", "needed", "required", "aavanam", "aavanangal", "ஆவண", "என்ன வேண்டும்", "என்னென்ன"],
  fees: ["fee", "fees", "cost", "price", "charge", "kattanam", "எவ்வளவு", "கட்டணம்", "பணம்", "செலவு"],
  time: ["time", "days", "how long", "evlo naal", "எத்தனை நாள்", "நாட்கள்", "எவ்வளவு நேரம்", "கால"],
  official: ["link", "website", "site", "url", "portal", "இணையதளம்", "லிங்க்", "தளம்"],
  offline: ["office", "centre", "center", "offline", "visit", "அலுவலகம்", "மையம்", "நேரில்"],
};

function detectIntent(q: string): Intent {
  for (const [intent, words] of Object.entries(intentWords) as [Exclude<Intent, "steps">, string[]][]) {
    if (words.some((w) => q.includes(w))) return intent;
  }
  return "steps";
}

function score(q: string, s: Service): number {
  let n = 0;
  for (const k of s.keywords) {
    const kw = k.toLowerCase();
    // short ASCII keywords (bc, sc, st, dl) must be whole words, otherwise "upsc" would match "sc"
    const hit = kw.length <= 3 && /^[a-z]+$/.test(kw) ? new RegExp(`\\b${kw}\\b`).test(q) : q.includes(kw);
    if (hit) n += kw.length > 3 ? 2 : 1;
  }
  if (q.includes(s.name.en.toLowerCase()) || q.includes(s.name.ta)) n += 4;
  return n;
}

const pick = (v: L, lang: "ta" | "en") => v[lang];

export const defaultSuggestions: Record<"ta" | "en", string[]> = {
  ta: ["பிறப்புச் சான்றிதழ் பதிவிறக்கம் எப்படி?", "ஆதார் பதிவிறக்க என்ன வேண்டும்?", "பான் கார்டு எப்படி எடுப்பது?", "முதலமைச்சர் யார்?"],
  en: ["How to download a birth certificate?", "What do I need to download Aadhaar?", "How do I get a PAN card?", "Who is the Chief Minister?"],
};

export function answer(rawQuery: string, lang: "ta" | "en"): ChatAnswer {
  const q = rawQuery.toLowerCase().trim();
  const political = politicalAnswer(rawQuery, q, lang);
  if (political) return political;
  const ranked = services
    .map((s) => ({ s, n: score(q, s) }))
    .filter((r) => r.n > 0)
    .sort((a, b) => b.n - a.n);

  if (ranked.length === 0) {
    const text =
      lang === "ta"
        ? "மன்னிக்கவும், இந்தக் கேள்விக்கான வழிகாட்டி இன்னும் எங்களிடம் இல்லை. இப்போது பிறப்புச் சான்றிதழ், ஆதார், பான், ஓட்டுநர் உரிமம், சாதிச் சான்றிதழ் பற்றி உதவ முடியும். மேலும் சேவைகள் விரைவில் சேர்க்கப்படும்."
        : "Sorry, I do not have a guide for that yet. Right now I can help with birth certificate, Aadhaar, PAN, driving licence and community certificate. More services are coming soon.";
    return { text, speech: text, suggestions: defaultSuggestions[lang] };
  }

  const s = ranked[0].s;
  const intent = detectIntent(q);
  const name = pick(s.name, lang);
  const verifyNote =
    lang === "ta"
      ? "இந்த வழிகாட்டி இன்னும் சரிபார்ப்பில் உள்ளது; விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யுங்கள்."
      : "This guide is still being verified; please confirm on the official site before you apply.";

  let body = "";
  let spoken = "";

  if (intent === "documents") {
    const list = s.documents.map((d) => pick(d.name, lang));
    body = (lang === "ta" ? `${name} – தேவையான ஆவணங்கள்:\n` : `${name} – documents you need:\n`) + list.map((d) => `• ${d}`).join("\n");
    spoken = (lang === "ta" ? `${name} க்குத் தேவையான ஆவணங்கள். ` : `Documents for ${name}. `) + list.join(". ");
  } else if (intent === "fees") {
    body = `${name} – ${lang === "ta" ? "கட்டணம்" : "fees"}:\n${pick(s.fees, lang)}`;
    spoken = pick(s.fees, lang);
  } else if (intent === "time") {
    body = `${name} – ${lang === "ta" ? "ஆகும் நேரம்" : "time needed"}:\n${pick(s.time, lang)}`;
    spoken = pick(s.time, lang);
  } else if (intent === "official") {
    body = `${name} – ${lang === "ta" ? "அதிகாரப்பூர்வ தளம்" : "official site"}: ${s.officialLabel}\n${pick(s.authority, lang)}`;
    spoken = `${lang === "ta" ? "அதிகாரப்பூர்வ தளம்" : "Official site"} ${s.officialLabel}`;
  } else if (intent === "offline") {
    body = `${name} – ${lang === "ta" ? "நேரில் செல்ல" : "in person"}:\n${pick(s.offline, lang)}`;
    spoken = pick(s.offline, lang);
  } else {
    const steps = s.steps.map((st, i) => `${i + 1}. ${pick(st.title, lang)}`);
    body = (lang === "ta" ? `${name} – படிப்படியாக:\n` : `${name} – step by step:\n`) + steps.join("\n");
    spoken = (lang === "ta" ? `${name}. படிகள். ` : `${name}. Steps. `) + s.steps.map((st, i) => `${i + 1}. ${pick(st.title, lang)}`).join(". ");
  }

  const text = s.lastVerified ? body : `${body}\n\n${verifyNote}`;
  const links = [
    { label: lang === "ta" ? "முழு வழிகாட்டி" : "Full guide", href: `/service/${s.slug}` },
    { label: s.officialLabel, href: s.officialUrl },
  ];
  const suggestions =
    lang === "ta"
      ? [`${name} – என்ன ஆவணங்கள் வேண்டும்?`, `${name} – கட்டணம் எவ்வளவு?`, `${name} – எத்தனை நாட்கள் ஆகும்?`]
      : [`${name} – what documents are needed?`, `${name} – what is the fee?`, `${name} – how many days does it take?`];

  return { text, speech: spoken, slug: s.slug, links, suggestions };
}
