import { eduLevels, type Exam, type L, type Scheme } from "./data";
import { incomeBands, type Profile } from "./profile";

export type CheckState = "met" | "unknown" | "failed";

export interface Check {
  key: "age" | "gender" | "occupation" | "income" | "community";
  state: CheckState;
  label: L;
}

export interface MatchResult {
  /** 0–100. Zero means a hard rule fails. */
  score: number;
  band: "high" | "medium" | "low" | "none";
  checks: Check[];
  needHit: boolean;
}

const t = (ta: string, en: string): L => ({ ta, en });

/**
 * Rules-based eligibility. Each rule the scheme defines is checked against the profile:
 *  - a rule that definitely fails => score 0 ("none")
 *  - a rule we cannot judge (profile field empty / income band straddles the limit) counts half
 *  - schemes with no rules are open to everyone (base 60)
 * Up to 20 bonus points when the scheme serves a need the user selected.
 */
export function matchScheme(p: Profile, s: Scheme): MatchResult {
  const e = s.elig;
  const checks: Check[] = [];

  if (e.minAge !== null || e.maxAge !== null) {
    const range = e.minAge !== null && e.maxAge !== null ? `${e.minAge}–${e.maxAge}` : e.minAge !== null ? `${e.minAge}+` : `≤ ${e.maxAge}`;
    if (p.age === null) checks.push({ key: "age", state: "unknown", label: t(`வயது ${range} வேண்டும்`, `Age ${range} required`) });
    else if ((e.minAge !== null && p.age < e.minAge) || (e.maxAge !== null && p.age > e.maxAge))
      checks.push({ key: "age", state: "failed", label: t(`வயது ${range} வேண்டும் (உங்கள் வயது ${p.age})`, `Age ${range} required (you are ${p.age})`) });
    else checks.push({ key: "age", state: "met", label: t(`வயது தகுதி (${range})`, `Age fits (${range})`) });
  }

  if (e.gender !== "any") {
    const need = e.gender === "female" ? t("பெண்களுக்கு மட்டும்", "For women only") : t("ஆண்களுக்கு மட்டும்", "For men only");
    if (p.gender === null) checks.push({ key: "gender", state: "unknown", label: need });
    else if (p.gender === e.gender) checks.push({ key: "gender", state: "met", label: need });
    else checks.push({ key: "gender", state: "failed", label: need });
  }

  if (e.occupations && e.occupations.length > 0) {
    const lab = t("குறிப்பிட்ட தொழில் / நிலை உள்ளவர்களுக்கு", "For specific occupations / situations");
    if (p.occupation === null) checks.push({ key: "occupation", state: "unknown", label: lab });
    else if (e.occupations.includes(p.occupation)) checks.push({ key: "occupation", state: "met", label: lab });
    else checks.push({ key: "occupation", state: "failed", label: lab });
  }

  if (e.maxIncome !== null) {
    const lakh = e.maxIncome / 100000;
    const lab = t(`ஆண்டு வருமானம் ₹${lakh} லட்சத்துக்குள்`, `Annual income within ₹${lakh} lakh`);
    const band = incomeBands.find((b) => b.id === p.income);
    if (!band) checks.push({ key: "income", state: "unknown", label: lab });
    else if (band.min >= e.maxIncome) checks.push({ key: "income", state: "failed", label: lab });
    else if (band.max <= e.maxIncome) checks.push({ key: "income", state: "met", label: lab });
    else checks.push({ key: "income", state: "unknown", label: lab });
  }

  if (e.communities && e.communities.length > 0) {
    const lab = t("குறிப்பிட்ட சமூகப் பிரிவினருக்கு", "For specific communities");
    if (p.community === null) checks.push({ key: "community", state: "unknown", label: lab });
    else if (e.communities.includes(p.community)) checks.push({ key: "community", state: "met", label: lab });
    else checks.push({ key: "community", state: "failed", label: lab });
  }

  const needHit = s.needs.some((n) => p.needs.includes(n));
  if (checks.some((c) => c.state === "failed")) return { score: 0, band: "none", checks, needHit };

  const base =
    checks.length === 0
      ? 60
      : (checks.reduce((sum, c) => sum + (c.state === "met" ? 1 : 0.5), 0) / checks.length) * 80;
  const score = Math.round(Math.min(100, base + (needHit ? 20 : 0)));
  const band = score >= 80 ? "high" : score >= 55 ? "medium" : "low";
  return { score, band, checks, needHit };
}

export function rankSchemes(p: Profile, list: Scheme[]) {
  return list
    .map((s) => ({ scheme: s, match: matchScheme(p, s) }))
    .sort((a, b) => b.match.score - a.match.score || b.scheme.popularity - a.scheme.popularity);
}

export interface ExamMatch {
  status: "eligible" | "check" | "no";
  reason: L;
}

/** Education is checked strictly; age only where the exam has a hard, well-known limit. */
export function matchExam(p: Profile, ex: Exam): ExamMatch {
  const mine = eduLevels.find((e) => e.id === p.education);
  const need = eduLevels.find((e) => e.id === ex.edu)!;
  if (!mine) return { status: "check", reason: t("உங்கள் கல்வித் தகுதியைத் தேர்ந்தெடுங்கள்.", "Pick your education level.") };
  if (mine.rank < need.rank) {
    return { status: "no", reason: t(`குறைந்தபட்சத் தகுதி: ${need.name.ta}`, `Minimum qualification: ${need.name.en}`) };
  }
  if (p.age !== null) {
    if (ex.minAge !== null && p.age < ex.minAge) return { status: "no", reason: t(`குறைந்தபட்ச வயது ${ex.minAge}`, `Minimum age is ${ex.minAge}`) };
    if (ex.maxAge !== null && p.age > ex.maxAge) {
      return { status: "check", reason: t(`பொதுப் பிரிவு உச்ச வயது ${ex.maxAge}; உங்கள் பிரிவுக்குத் தளர்வு இருக்கலாம்.`, `General upper age is ${ex.maxAge}; relaxation may apply to your category.`) };
    }
  }
  return { status: "eligible", reason: t("கல்வித் தகுதி பொருந்துகிறது. வயது, பிற விதிகளை அறிவிப்பில் பாருங்கள்.", "Education fits. Check age and other rules in the notification.") };
}
