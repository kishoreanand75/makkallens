import type { Community, EduLevel, L, Need, Occupation } from "./data";

export interface Profile {
  age: number | null;
  district: string | null; // English district name, as in data/districts.json
  gender: "female" | "male" | "other" | null;
  occupation: Occupation | null;
  income: IncomeBand | null;
  needs: Need[];
  community: Community | null;
  education: EduLevel | null;
}

export type IncomeBand = "lt1" | "1to25" | "25to5" | "5to8" | "gt8";

export const emptyProfile: Profile = {
  age: null,
  district: null,
  gender: null,
  occupation: null,
  income: null,
  needs: [],
  community: null,
  education: null,
};

export const incomeBands: { id: IncomeBand; name: L; min: number; max: number }[] = [
  { id: "lt1", name: { ta: "₹1 லட்சத்துக்குக் கீழ்", en: "Under ₹1 lakh" }, min: 0, max: 100000 },
  { id: "1to25", name: { ta: "₹1 – 2.5 லட்சம்", en: "₹1 – 2.5 lakh" }, min: 100000, max: 250000 },
  { id: "25to5", name: { ta: "₹2.5 – 5 லட்சம்", en: "₹2.5 – 5 lakh" }, min: 250000, max: 500000 },
  { id: "5to8", name: { ta: "₹5 – 8 லட்சம்", en: "₹5 – 8 lakh" }, min: 500000, max: 800000 },
  { id: "gt8", name: { ta: "₹8 லட்சத்துக்கு மேல்", en: "Above ₹8 lakh" }, min: 800000, max: Number.POSITIVE_INFINITY },
];

export const occupationOptions: { id: Occupation; name: L }[] = [
  { id: "student", name: { ta: "மாணவர்", en: "Student" } },
  { id: "farmer", name: { ta: "விவசாயி", en: "Farmer" } },
  { id: "worker", name: { ta: "தினக்கூலி / உடலுழைப்புத் தொழிலாளி", en: "Daily-wage / manual worker" } },
  { id: "employee", name: { ta: "தனியார் / அரசு ஊழியர்", en: "Salaried employee" } },
  { id: "selfemployed", name: { ta: "சொந்தத் தொழில் / வியாபாரம்", en: "Self-employed / business" } },
  { id: "unemployed", name: { ta: "வேலை தேடுபவர்", en: "Looking for work" } },
  { id: "homemaker", name: { ta: "குடும்பத் தலைவி / இல்லத்தரசி", en: "Homemaker" } },
  { id: "senior", name: { ta: "ஓய்வு பெற்றவர் / முதியவர்", en: "Retired / senior" } },
  { id: "other", name: { ta: "மற்றவை", en: "Other" } },
];

export const needOptions: { id: Need; name: L }[] = [
  { id: "money", name: { ta: "பண உதவி", en: "Financial help" } },
  { id: "education", name: { ta: "கல்வி / உதவித்தொகை", en: "Education / scholarship" } },
  { id: "health", name: { ta: "மருத்துவம்", en: "Health care" } },
  { id: "housing", name: { ta: "வீடு", en: "Housing" } },
  { id: "farming", name: { ta: "விவசாயம்", en: "Farming" } },
  { id: "business", name: { ta: "தொழில் தொடங்க", en: "Starting a business" } },
  { id: "loan", name: { ta: "கடன்", en: "Loan" } },
  { id: "jobs", name: { ta: "வேலை", en: "Job" } },
  { id: "skill", name: { ta: "திறன் பயிற்சி", en: "Skill training" } },
  { id: "pension", name: { ta: "ஓய்வூதியம்", en: "Pension" } },
  { id: "insurance", name: { ta: "காப்பீடு", en: "Insurance" } },
  { id: "women", name: { ta: "பெண்கள் நலன்", en: "Women's welfare" } },
  { id: "savings", name: { ta: "சேமிப்பு", en: "Savings" } },
  { id: "welfare", name: { ta: "ரேஷன் / நலத்திட்டங்கள்", en: "Ration / welfare" } },
];

export const communityOptions: { id: Community; name: L }[] = [
  { id: "general", name: { ta: "பொதுப் பிரிவு (OC)", en: "General (OC)" } },
  { id: "bc", name: { ta: "பிற்படுத்தப்பட்டோர் (BC)", en: "Backward Class (BC)" } },
  { id: "mbc", name: { ta: "மிகவும் பிற்படுத்தப்பட்டோர் (MBC/DNC)", en: "Most Backward Class (MBC/DNC)" } },
  { id: "sc", name: { ta: "ஆதிதிராவிடர் (SC)", en: "Scheduled Caste (SC)" } },
  { id: "st", name: { ta: "பழங்குடியினர் (ST)", en: "Scheduled Tribe (ST)" } },
  { id: "minority", name: { ta: "சிறுபான்மையினர்", en: "Minority" } },
];

export const genderOptions: { id: NonNullable<Profile["gender"]>; name: L }[] = [
  { id: "female", name: { ta: "பெண்", en: "Female" } },
  { id: "male", name: { ta: "ஆண்", en: "Male" } },
  { id: "other", name: { ta: "மற்றவர்", en: "Other" } },
];

/** How many of the six core questions are answered (age, district, gender, occupation, income, need). */
export function profileProgress(p: Profile): number {
  return [p.age !== null, p.district !== null, p.gender !== null, p.occupation !== null, p.income !== null, p.needs.length > 0].filter(Boolean).length;
}

export const PROFILE_KEY = "av-profile";
