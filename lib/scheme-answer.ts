import type { ChatAnswer } from "./answer";
import { eduLevels, type Exam, type Scheme } from "./data";
import { docNames, eligibilityLines, examLines, verifyLine } from "./scheme-text";

type Lang = "ta" | "en";

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

const INTENT = {
  documents: ["document", "documents", "papers", "aavanam", "ஆவண", "என்ன வேண்டும்", "என்னென்ன"],
  eligibility: ["eligib", "who can", "qualif", "தகுதி", "யார் விண்ணப்ப", "யாருக்கு", "yarukku"],
  apply: ["apply", "how to", "register", "விண்ணப்ப", "எப்படி", "epdi", "eppadi"],
  benefit: ["benefit", "amount", "how much", "evlo", "எவ்வளவு", "பலன்", "தொகை"],
};

export function schemeAnswer(s: Scheme, rawQuery: string, lang: Lang): ChatAnswer {
  const q = rawQuery.toLowerCase();
  const name = s.title[lang];
  const docs = docNames(s.docs, lang);
  const elig = eligibilityLines(s, lang);
  const L = (ta: string, en: string) => (lang === "ta" ? ta : en);
  let body: string;

  if (has(q, INTENT.documents)) {
    body = docs.length
      ? `${name} – ${L("தேவையான ஆவணங்கள்", "documents needed")}:\n` + docs.map((d) => `• ${d}`).join("\n")
      : `${name} – ${L("தனி ஆவணம் தேவையில்லை; பள்ளி / அரசு மூலம் தானாகவே கிடைக்கும்.", "no separate documents needed; it is delivered through the school / government.")}`;
  } else if (has(q, INTENT.eligibility)) {
    body = `${name} – ${L("தகுதி", "eligibility")}:\n` + (elig.length ? elig.map((e) => `• ${e}`).join("\n") : L("• அனைவருக்கும் திறந்தது", "• Open to everyone"));
  } else if (has(q, INTENT.benefit)) {
    body = `${name} – ${L("பலன்", "benefit")}:\n${s.benefit[lang]}`;
  } else if (has(q, INTENT.apply)) {
    body = `${name} – ${L("எப்படி விண்ணப்பிப்பது", "how to apply")}:\n${s.apply[lang]}`;
  } else {
    body =
      `${name}\n${s.benefit[lang]}\n\n` +
      (elig.length ? `${L("யார் தகுதி", "Who is eligible")}: ${elig[0]}${elig.length > 1 ? " …" : ""}\n` : "") +
      `${L("எப்படி", "How")}: ${s.apply[lang]}`;
  }

  const note = s.note ? `\n\n⚠ ${s.note[lang]}` : "";
  const tail = `\n\n${L("துறை", "Department")}: ${s.dept[lang]}\n${verifyLine(s, lang)}`;
  return {
    text: body + note + tail,
    speech: body.replace(/[•⚠]/g, ""),
    slug: undefined,
    links: [
      { label: L("முழு விவரம்", "Full details"), href: `/schemes/${s.id}` },
      { label: new URL(s.url).host, href: s.url },
    ],
    suggestions:
      lang === "ta"
        ? [`${s.title.ta} – என்ன ஆவணங்கள் வேண்டும்?`, `${s.title.ta} – யார் விண்ணப்பிக்கலாம்?`, `${s.title.ta} – எப்படி விண்ணப்பிப்பது?`]
        : [`${s.title.en} – what documents are needed?`, `${s.title.en} – who can apply?`, `${s.title.en} – how to apply?`],
  };
}

export function examAnswer(ex: Exam, lang: Lang): ChatAnswer {
  const L = (ta: string, en: string) => (lang === "ta" ? ta : en);
  const edu = eduLevels.find((e) => e.id === ex.edu)!.name[lang];
  const body = `${ex.name[lang]}\n${L("குறைந்தபட்சத் தகுதி", "Minimum qualification")}: ${edu}\n` + examLines(ex, lang).map((x) => `• ${x}`).join("\n");
  return {
    text: `${body}\n\n${L("அறிவிப்பு / விண்ணப்பம் அதிகாரப்பூர்வ தளத்தில் மட்டும்; தகுதி விவரங்களை ஒவ்வொரு ஆண்டும் அறிவிப்பில் உறுதிசெய்யுங்கள்.", "Notifications and applications are only on the official site; confirm eligibility in each year's notification.")}`,
    speech: body.replace(/•/g, ""),
    links: [
      { label: L("வேலை & தேர்வுகள்", "Jobs & exams"), href: `/jobs#${ex.id}` },
      { label: new URL(ex.url).host, href: ex.url },
    ],
    suggestions: lang === "ta" ? ["TNPSC குரூப் 4 தகுதி என்ன?", "UPSC வயது வரம்பு?"] : ["What is TNPSC Group 4 eligibility?", "UPSC age limit?"],
  };
}
