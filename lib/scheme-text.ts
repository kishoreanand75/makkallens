import { getDoc, type Exam, type Scheme } from "./data";
import { occupationOptions, communityOptions } from "./profile";

type Lang = "ta" | "en";

export function eligibilityLines(s: Scheme, lang: Lang): string[] {
  const e = s.elig;
  const out: string[] = [];
  if (e.minAge !== null || e.maxAge !== null) {
    const range = e.minAge !== null && e.maxAge !== null ? `${e.minAge}–${e.maxAge}` : e.minAge !== null ? `${e.minAge}+` : `≤ ${e.maxAge}`;
    out.push(lang === "ta" ? `வயது: ${range}` : `Age: ${range}`);
  }
  if (e.gender !== "any") {
    out.push(lang === "ta" ? (e.gender === "female" ? "பெண்களுக்கு மட்டும்" : "ஆண்களுக்கு மட்டும்") : e.gender === "female" ? "Women only" : "Men only");
  }
  if (e.occupations && e.occupations.length > 0 && e.occupations.length < occupationOptions.length - 1) {
    const names = e.occupations.map((o) => occupationOptions.find((x) => x.id === o)?.name[lang]).filter(Boolean);
    out.push((lang === "ta" ? "யார்: " : "Who: ") + names.join(lang === "ta" ? ", " : ", "));
  }
  if (e.maxIncome !== null) {
    const lakh = e.maxIncome / 100000;
    out.push(lang === "ta" ? `குடும்ப ஆண்டு வருமானம் ₹${lakh} லட்சத்துக்குள் (தோராயம்)` : `Family income up to about ₹${lakh} lakh a year`);
  }
  if (e.communities && e.communities.length > 0) {
    out.push((lang === "ta" ? "சமூகம்: " : "Community: ") + e.communities.map((c) => communityOptions.find((x) => x.id === c)?.name[lang]).join(", "));
  }
  if (s.eligText) out.push(s.eligText[lang]);
  return out;
}

export function docNames(ids: string[], lang: Lang): string[] {
  return ids.map((id) => getDoc(id)?.name[lang]).filter((x): x is string => Boolean(x));
}

export function verifyLine(s: Scheme, lang: Lang): string {
  return s.lastVerified
    ? lang === "ta" ? `கடைசியாகச் சரிபார்த்தது: ${s.lastVerified}` : `Last verified: ${s.lastVerified}`
    : lang === "ta" ? "சரிபார்ப்பு நிலுவை – விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யவும்." : "Verification pending – confirm on the official site before applying.";
}

export function examLines(ex: Exam, lang: Lang): string[] {
  return [ex.posts[lang], ex.ageNote[lang], ex.syllabus[lang]];
}

