import { topics, type EmblemId } from "./categories";

const P = {
  id: "M3 5h18v14H3zM7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM6 16c0-1.5 1.5-2 3-2s3 .5 3 2M14 9h4M14 13h4",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  woman: "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 8v5M7.5 12h9M8 22l4-9 4 9",
  basket: "M4 9h16l-1.5 10h-13zM8 9l3-5M16 9l-3-5",
  leaf: "M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8",
  baby: "M6 3h9l4 4v14H6zM14 3v5h5M12 12v5M9.5 14.5h5",
  doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  heart: "M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z",
  cross: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  home: "M3 11l9-8 9 8v10H3zM9 21v-6h6v6",
  bus: "M5 4h14a1 1 0 0 1 1 1v11H4V5a1 1 0 0 1 1-1zM4 11h16M7 19v2M17 19v2M7.5 15.5h.01M16.5 15.5h.01",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  rupee: "M7 5h10M7 9h10M7 5c5 0 8 2 8 5s-3 5-8 5l7 5",
  map: "M9 4l6 2 5-2v14l-5 2-6-2-5 2V6zM9 4v14M15 6v14",
  vote: "M5 12h14v8H5zM8 12l1-6h6l1 6M9 16h6",
  car: "M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16M3 16h18v3H3zM7 19v1M17 19v1M7.5 13h.01M16.5 13h.01",
  passport: "M6 3h12v18H6zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9 18h6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  brief: "M3 8h18v12H3zM8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18",
  shop: "M4 9l1-5h14l1 5M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M5 12v8h14v-8",
  flame: "M12 3c3 4 5 6 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 1 2 2 2 0-3 0-5 1-8z",
  meal: "M4 11h16a8 8 0 0 1-16 0zM8 7c0-1.5 1-1.5 1-3M12 7c0-1.5 1-1.5 1-3M16 7c0-1.5 1-1.5 1-3",
  elder: "M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 8v6M8 22l4-8 4 8M5 11h14",
  ring: "M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM9 9l3-5 3 5",
  chip: "M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4",
};

const rules: [RegExp, keyof typeof P][] = [
  [/aadhaar|udid|identity/, "id"],
  [/\bpan\b|jan-?dhan|bank/, "card"],
  [/magalir|pudhumai|women|woman|maternity|pmmvy|sukanya|pudhalvan|girl/, "woman"],
  [/ration|pds|breakfast/, "basket"],
  [/kisan|farm|crop|pmfby|soil|kcc|agri/, "leaf"],
  [/birth|death/, "baby"],
  [/marriage/, "ring"],
  [/cmchis|pm-jay|health|ayushman|hospital/, "cross"],
  [/scholarship|nsp|vidyalaxmi|education|graduate|naan|skill/, "cap"],
  [/pmay|housing|house|awas/, "home"],
  [/bus\b|transport/, "bus"],
  [/\beb\b|electric|tneb|bill/, "bolt"],
  [/mudra|loan|svanidhi|standup|stand-up|credit/, "shop"],
  [/patta|chitta|encumbrance|land|nativity/, "map"],
  [/voter|epic|election/, "vote"],
  [/driving|licen|vehicle|\brc\b/, "car"],
  [/passport/, "passport"],
  [/jjby|sby|apy|insurance|pension|ignoaps|oap|senior|old age/, "shield"],
  [/eshram|labour|job|exam|vishwakarma/, "brief"],
  [/ujjwala|gas|lpg/, "flame"],
  [/community|income|certificate/, "doc"],
];

/** Picks a line icon for a scheme/service from its id + English title. */
export function iconPath(id: string, titleEn = ""): string {
  const k = `${id} ${titleEn}`.toLowerCase();
  const hit = rules.find(([re]) => re.test(k));
  return P[hit ? hit[1] : "doc"];
}

const groupTopic: Record<string, EmblemId> = { land: "housing", utilities: "bills", "svc-land": "housing", "svc-utilities": "bills" };

/** Accent colour for a category / service-category id (falls back to the brand green). */
export function colorFor(group: string): string {
  const g = group.replace(/^svc-/, "");
  const id = groupTopic[g] ?? (g as EmblemId);
  return topics[id]?.color ?? "#0a6b3d";
}

const imgAlias: Record<string, string> = {
  woman: "women", leaf: "agriculture", cross: "health", cap: "education", brief: "jobs", shop: "business", doc: "documents",
  rupee: "business", heart: "health", elder: "seniors", chip: "documents",
};

/** Photo (in /public/topics) that illustrates a scheme/service, chosen from the same keyword rules as the icons. */
export function imageFor(id: string, titleEn = ""): string {
  if (own[id]) return `/topics/${own[id]}.webp`;
  if (ownImageIds.includes(id)) return `/topics/${id}.webp`;
  const k = `${id} ${titleEn}`.toLowerCase();
  const hit = rules.find(([re]) => re.test(k));
  const key = hit ? hit[1] : "doc";
  return `/topics/${imgAlias[key] ?? key}.webp`;
}

/** Items that own a photo (existing keyword photos reassigned 1:1, the rest generated per item) – so no two Top-50 cards share a picture. */
const own: Record<string, string> = {
  "aadhaar-card": "id", "pan-card": "card", "ration-card": "basket", "birth-certificate": "baby", "marriage-registration": "ring",
  "pmay-g": "home", "tn-free-bus": "bus", "eb-bill": "bolt", "patta-chitta": "map", "voter-id": "vote", "driving-licence": "car",
  "passport": "passport", "pm-ujjwala": "flame", "pmjjby": "shield", "tn-breakfast": "meal", "pm-kisan": "agriculture",
  "community-certificate": "documents", "magalir-urimai": "women", "ignoaps": "seniors", "mudra": "business", "cmchis": "health",
  "naan-mudhalvan": "jobs", "pudhumai-penn": "education", "income-certificate": "schemes", "pmsby": "emergency",
};
export const ownImageIds = [
  "nativity-certificate", "pmfby", "nsp-scholarships", "first-graduate-certificate", "pm-jay", "tn-oap", "tamil-pudhalvan", "pmmvy",
  "tn-maternity", "death-certificate", "encumbrance-certificate", "sukanya", "apy", "eshram", "tn-labour-welfare", "kcc", "pmay-u",
  "jan-dhan", "udid", "pm-vidyalaxmi", "skill-india", "pm-svanidhi", "pm-vishwakarma", "standup-india", "soil-health-card",
];
