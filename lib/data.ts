import schemesRaw from "@/data/schemes.json";
import examsRaw from "@/data/exams.json";
import documentsRaw from "@/data/documents.json";
import helplinesRaw from "@/data/helplines.json";
import districtsRaw from "@/data/districts.json";
import businessRaw from "@/data/business.json";
import billsRaw from "@/data/bills.json";
import { popularityOf } from "./top50";
import type { L } from "./services";

export type { L };

export type Occupation = "student" | "farmer" | "worker" | "employee" | "selfemployed" | "unemployed" | "homemaker" | "senior" | "other";
export type Community = "general" | "bc" | "mbc" | "sc" | "st" | "minority";
export type Need =
  | "education" | "health" | "money" | "housing" | "farming" | "business" | "jobs" | "pension"
  | "women" | "insurance" | "skill" | "loan" | "savings" | "welfare";
export type SchemeCategory = "agriculture" | "health" | "women" | "seniors" | "business" | "housing" | "education" | "jobs" | "welfare";

export interface Eligibility {
  minAge: number | null;
  maxAge: number | null;
  gender: "any" | "female" | "male";
  occupations: Occupation[] | null;
  maxIncome: number | null;
  communities: Community[] | null;
}

export interface Scheme {
  id: string;
  level: "central" | "state";
  category: SchemeCategory;
  title: L;
  dept: L;
  benefit: L;
  elig: Eligibility;
  eligText: L | null;
  docs: string[];
  apply: L;
  url: string;
  needs: Need[];
  keywords: string[];
  popularity: number;
  status: "active" | "closed" | "changed";
  lastVerified: string | null;
  note?: L;
}

export type EduLevel = "below10" | "sslc" | "hsc" | "diploma" | "degree" | "pg";

export interface Exam {
  id: string;
  name: L;
  body: L;
  edu: EduLevel;
  minAge: number | null;
  maxAge: number | null;
  posts: L;
  ageNote: L;
  syllabus: L;
  url: string;
  keywords?: string[];
}

export interface DocItem {
  id: string;
  name: L;
  service: string | null;
  url: string | null;
  tip: L;
}

export interface Helpline {
  num: string;
  name: L;
  kind: "emergency" | "health" | "women" | "seniors" | "other";
}

export interface District {
  en: string;
  ta: string;
  lat: number;
  lng: number;
}

export interface BusinessItem {
  id: string;
  name: L;
  what: L;
  url: string;
  need: string[];
}

export interface BillItem {
  id: string;
  name: L;
  url: string;
  tip: L;
}

// popularity is derived from the curated Top-50 rank (10 = rank 1 … 1 = rank 50)
export const schemes: Scheme[] = (schemesRaw as unknown as Scheme[]).map((s) => ({ ...s, popularity: popularityOf("scheme", s.id) }));
export const exams = examsRaw as unknown as Exam[];
export const documents = documentsRaw as unknown as DocItem[];
export const helplines = helplinesRaw as unknown as Helpline[];
export const districts = districtsRaw as unknown as District[];
export const businessItems = businessRaw as unknown as BusinessItem[];
export const billItems = billsRaw as unknown as BillItem[];

export const getScheme = (id: string) => schemes.find((s) => s.id === id);
export const getDoc = (id: string) => documents.find((d) => d.id === id);
export const getDistrict = (en: string) => districts.find((d) => d.en === en);

export const eduLevels: { id: EduLevel; name: L; rank: number }[] = [
  { id: "below10", name: { ta: "10-ஆம் வகுப்புக்குக் கீழ்", en: "Below 10th" }, rank: 0 },
  { id: "sslc", name: { ta: "10-ஆம் வகுப்பு (SSLC)", en: "10th (SSLC)" }, rank: 1 },
  { id: "hsc", name: { ta: "12-ஆம் வகுப்பு (HSC)", en: "12th (HSC)" }, rank: 2 },
  { id: "diploma", name: { ta: "டிப்ளமோ / ஆசிரியர் பயிற்சி / ITI", en: "Diploma / teacher training / ITI" }, rank: 2.5 },
  { id: "degree", name: { ta: "இளங்கலைப் பட்டம்", en: "Bachelor's degree" }, rank: 3 },
  { id: "pg", name: { ta: "முதுகலை", en: "Postgraduate" }, rank: 4 },
];

/** Categories shown as filters on /schemes and used by the topic pages. */
export const schemeCategories: { id: SchemeCategory; name: L }[] = [
  { id: "agriculture", name: { ta: "வேளாண்மை", en: "Agriculture" } },
  { id: "health", name: { ta: "சுகாதாரம்", en: "Health" } },
  { id: "women", name: { ta: "பெண்கள் & குடும்பம்", en: "Women & family" } },
  { id: "seniors", name: { ta: "முதியோர் & ஓய்வூதியம்", en: "Seniors & pensions" } },
  { id: "business", name: { ta: "தொழில் & கடன்", en: "Business & loans" } },
  { id: "housing", name: { ta: "வீடு", en: "Housing" } },
  { id: "education", name: { ta: "கல்வி", en: "Education" } },
  { id: "jobs", name: { ta: "வேலை & திறன்", en: "Jobs & skills" } },
  { id: "welfare", name: { ta: "நலத்திட்டங்கள்", en: "Welfare" } },
];
