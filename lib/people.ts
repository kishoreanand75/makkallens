import raw from "@/data/people.json";
import creditsRaw from "@/data/photo-credits.json";
import type { L } from "./services";

export interface PhotoCredit {
  file: string;
  page: string;
  license: string;
  author: string;
  source: string;
}
const credits = creditsRaw as Record<string, PhotoCredit>;
export const photoFor = (id: string): PhotoCredit | undefined => credits[id];

export interface Minister {
  id: string;
  name: string;
  constituency: string;
  dept: L;
}

const tn = raw.tamilNadu;

export const dataMeta = raw._meta;

export const tnCm = {
  id: tn.cm.id,
  name: { ta: tn.cm.nameTa, en: tn.cm.name } as L,
  party: { ta: tn.cm.partyTa, en: tn.cm.party } as L,
  constituency: { ta: tn.cm.constituencyTa, en: tn.cm.constituency } as L,
  since: tn.cm.since,
  portfolioNote: tn.cmPortfolioNote as L,
};

export const tnGovernor = { id: tn.governor.id, name: tn.governor.name };

export const tnMinisters: Minister[] = tn.ministers.map((m) => ({
  id: m.id,
  name: m.name,
  constituency: m.constituency,
  dept: { ta: m.deptTa, en: m.dept },
}));

export interface StateCm {
  code: string;
  id: string;
  state: L;
  cm: string;
  party: string;
  since?: string;
}

export const stateCms: StateCm[] = raw.states.map((s) => ({
  code: s.code,
  id: "cm-" + s.code.toLowerCase(),
  state: { ta: s.nameTa, en: s.name },
  cm: s.cm,
  party: s.party,
  since: (s as { since?: string }).since,
}));

export interface PastCm {
  id: string;
  name: L;
  years: string;
  work: L[];
}

export const pastCms: PastCm[] = raw.pastTnChiefMinisters.map((p) => ({
  id: "past-" + p.name.replace(/\W+/g, "-").toLowerCase(),
  name: { ta: p.nameTa, en: p.name },
  years: p.years,
  work: p.workEn.map((en, i) => ({ en, ta: p.workTa[i] ?? en })),
}));

export const localLinks = {
  voters: "https://voters.eci.gov.in",
  sansad: "https://sansad.in",
  chennai: "https://chennaicorporation.gov.in",
  tn: "https://www.tn.gov.in",
};

export type DeptGroup = "health" | "education" | "agri" | "welfare" | "economy" | "infra" | "governance";

export const deptGroups: { id: DeptGroup; name: L }[] = [
  { id: "health", name: { ta: "சுகாதாரம்", en: "Health" } },
  { id: "education", name: { ta: "கல்வி", en: "Education" } },
  { id: "agri", name: { ta: "வேளாண்மை & கிராமம்", en: "Agriculture & rural" } },
  { id: "welfare", name: { ta: "நலன் & சமூக நீதி", en: "Welfare & social justice" } },
  { id: "economy", name: { ta: "நிதி & தொழில்", en: "Finance & industry" } },
  { id: "infra", name: { ta: "கட்டமைப்பு & போக்குவரத்து", en: "Infrastructure & transport" } },
  { id: "governance", name: { ta: "ஆட்சி, சட்டம் & பிற", en: "Governance, law & others" } },
];

/** Groups a minister's departments for the filter drawer (first matching rule wins). */
export function groupOf(m: Minister): DeptGroup {
  const d = m.dept.en;
  if (/Health/.test(d)) return "health";
  if (/Education|Science/.test(d)) return "education";
  if (/Agricultur|Milk|Dairy|Animal|Fisheries|Forest|Co-operation|Rural Development|Sugar/.test(d)) return "agri";
  if (/Welfare|Social|Adi Dravidar|Backward|Minorit|Labour|Nutritious/.test(d)) return "welfare";
  if (/Finance|Industr|Commercial|Minerals|Handloom|Tourism|IT|Information|Artificial|Investment|Pension/.test(d)) return "economy";
  if (/Public Works|Highways|Transport|Housing|Electricity|Irrigation|Urban/.test(d)) return "infra";
  return "governance";
}
