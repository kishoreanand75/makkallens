import type { L } from "./data";

/** One visual identity per topic: photo and name. Used by cards, page heroes and detail pages. */
export type EmblemId =
  | "agriculture" | "health" | "women" | "seniors" | "business" | "housing" | "education" | "jobs" | "welfare"
  | "documents" | "identity" | "certificates" | "driving" | "government" | "emergency" | "bills" | "schemes" | "ask";

export interface Topic {
  id: EmblemId;
  href: string;
  name: L;
  blurb: L;
  color: string; // accent (hex)
  image: string; // /cats/<file>.webp
  imageAlt: L;
}

const t = (id: EmblemId, href: string, name: L, blurb: L, color: string, image: string, imageAlt: L): Topic => ({ id, href, name, blurb, color, image: image.startsWith("/") ? image : `/cats/${image}.webp`, imageAlt });

export const topics: Record<EmblemId, Topic> = {
  schemes: t("schemes", "/schemes", { ta: "அரசுத் திட்டங்கள்", en: "Government schemes" }, { ta: "தகுதி பொருத்தி, தேடல், உரிமை அட்டை", en: "Eligibility matcher, search, Urimai Card" }, "#c9822b", "/topics/schemes.webp",
    { ta: "நியாய விலைக் கடையில் அரிசிப் பையைப் பெறும் பெண்", en: "A woman receiving a bag of rice at a fair price shop" }),
  documents: t("documents", "/documents", { ta: "சான்றிதழ்கள் & ஆவணங்கள்", en: "Certificates & documents" }, { ta: "ஆவண மருத்துவர், வழிகாட்டிகள், நினைவூட்டல்", en: "Document Doctor, guides, reminders" }, "#3d5a80", "/topics/documents.webp",
    { ta: "சான்றிதழ்க் கோப்பை ஏந்திய கைகள்", en: "Hands holding a folder of certificates" }),
  jobs: t("jobs", "/jobs", { ta: "வேலை & தேர்வுகள்", en: "Jobs & exams" }, { ta: "தேர்வு பொருத்தி, பாடத்திட்டம், résumé", en: "Exam matcher, syllabus, résumé" }, "#0f8b8d", "/topics/jobs.webp",
    { ta: "திறன் பயிற்சிக் கூடத்தில் இளைஞர்கள்", en: "Young people in a skill-training lab" }),
  education: t("education", "/education", { ta: "கல்வி & உதவித்தொகைகள்", en: "Education & scholarships" }, { ta: "உதவித்தொகை, சேர்க்கைப் பட்டியல், நுழைவுத் தேர்வு", en: "Scholarships, admission checklist, entrance exams" }, "#2b6cb0", "/topics/education.webp",
    { ta: "பள்ளிச் சீருடையில் புன்னகைக்கும் மாணவி", en: "A smiling schoolgirl in uniform" }),
  agriculture: t("agriculture", "/agriculture", { ta: "வேளாண்மை", en: "Agriculture" }, { ta: "மானியம், காப்பீடு, கடன், வானிலை", en: "Subsidies, insurance, credit, weather" }, "#2e7d4f", "/topics/agriculture.webp",
    { ta: "நெல் வயலில் பெண் விவசாயி", en: "A woman farmer in a paddy field" }),
  health: t("health", "/health", { ta: "சுகாதாரம்", en: "Health" }, { ta: "காப்பீடு, மருத்துவமனை, மகப்பேறு", en: "Insurance, hospitals, maternity" }, "#c8415a", "/topics/health.webp",
    { ta: "முதியவருடன் பேசும் பெண் மருத்துவர்", en: "A woman doctor speaking with an elderly patient" }),
  women: t("women", "/women", { ta: "பெண்கள் & குடும்ப நலன்", en: "Women & family" }, { ta: "திட்டங்கள், உதவி எண்கள், சுய உதவிக் குழு", en: "Schemes, helplines, self-help groups" }, "#a84a8c", "/topics/women.webp",
    { ta: "சுய உதவிக் குழுவில் வேலை செய்யும் பெண்கள்", en: "Women working in a self-help group" }),
  seniors: t("seniors", "/seniors", { ta: "முதியோர் & ஓய்வூதியம்", en: "Seniors & pensions" }, { ta: "ஓய்வூதியத் தகுதி, புதுப்பித்தல், குரல் உதவி", en: "Pension eligibility, renewals, voice help" }, "#4b6cb7", "/topics/seniors.webp",
    { ta: "வராண்டாவில் தேநீர் அருந்தும் முதிய தம்பதியர்", en: "An elderly couple having tea on a veranda" }),
  business: t("business", "/business", { ta: "தொழில் & சுயதொழில்", en: "Business" }, { ta: "GST, MSME, FSSAI, கடை உரிமம், கடன்", en: "GST, MSME, FSSAI, licences, loans" }, "#c46a1d", "/topics/business.webp",
    { ta: "சொந்தக் கடையில் தையல் தொழிலாளி", en: "A tailor in her own shop" }),
  bills: t("bills", "/bills", { ta: "கட்டணங்கள் & உள்ளூர் சேவைகள்", en: "Bills & local services" }, { ta: "மின், சொத்து வரி, நில ஆவணம்", en: "Electricity, property tax, land records" }, "#5b7a8c", "/topics/bolt.webp",
    { ta: "சேவை மையத்தில் முதியவருக்கு உதவும் இளைஞர்", en: "A young man helping an elderly woman at a service centre" }),
  emergency: t("emergency", "/emergency", { ta: "அவசரம் & உதவி மையங்கள்", en: "Emergency & help centres" }, { ta: "112, 108, 100; அருகிலுள்ள மருத்துவமனை", en: "112, 108, 100; nearby hospitals" }, "#c4352b", "/topics/emergency.webp",
    { ta: "ஆம்புலன்ஸில் முதியவருக்கு உதவும் மருத்துவ உதவியாளர்", en: "A paramedic helping an elderly woman into an ambulance" }),
  government: t("government", "/leaders", { ta: "தமிழ்நாடு அரசு & தலைவர்கள்", en: "Tamil Nadu government" }, { ta: "முதலமைச்சர், அமைச்சரவை, பிரதிநிதிகள்", en: "Chief Minister, cabinet, representatives" }, "#1b4f9c", "government",
    { ta: "கொடிக்கம்பத்துடன் கூடிய அரசுக் கட்டடம்", en: "A government building with a flagstaff" }),
  housing: t("housing", "/schemes?c=housing", { ta: "வீடு", en: "Housing" }, { ta: "வீடு கட்ட உதவி, மானியம்", en: "Help to build or buy a home" }, "#8a5a34", "/topics/home.webp",
    { ta: "புதிய வீட்டு வாசலில் ஒரு குடும்பம்", en: "A family at the door of a new home" }),
  welfare: t("welfare", "/schemes?c=welfare", { ta: "நலத்திட்டங்கள்", en: "Welfare" }, { ta: "ரேஷன், தொழிலாளர் நலம்", en: "Ration, labour welfare" }, "#9a7b2f", "/topics/basket.webp",
    { ta: "நியாய விலைக் கடையில் அரிசிப் பையைப் பெறும் பெண்", en: "A woman receiving a bag of rice at a fair price shop" }),
  identity: t("identity", "/services?c=identity", { ta: "அடையாள ஆவணங்கள்", en: "Identity documents" }, { ta: "ஆதார், பான், வாக்காளர் அட்டை", en: "Aadhaar, PAN, voter ID" }, "#3d5a80", "/topics/id.webp",
    { ta: "சான்றிதழ்க் கோப்பை ஏந்திய கைகள்", en: "Hands holding a folder of certificates" }),
  certificates: t("certificates", "/services?c=certificates", { ta: "சான்றிதழ்கள்", en: "Certificates" }, { ta: "பிறப்பு, சாதி, வருமானம்", en: "Birth, community, income" }, "#5b5b9a", "/topics/documents.webp",
    { ta: "சான்றிதழ்க் கோப்பை ஏந்திய கைகள்", en: "Hands holding a folder of certificates" }),
  driving: t("driving", "/services?c=driving", { ta: "வாகனம் & ஓட்டுநர் உரிமம்", en: "Driving & vehicles" }, { ta: "லைசென்ஸ், RC", en: "Licence, RC" }, "#b5651d", "/topics/car.webp",
    { ta: "சேவை மையத்தில் முதியவருக்கு உதவும் இளைஞர்", en: "A young man helping an elderly woman at a service centre" }),
  ask: t("ask", "/ask", { ta: "கேளுங்கள்", en: "Ask" }, { ta: "தட்டச்சு அல்லது குரலில்", en: "Type or speak" }, "#0a6b3d", "csc",
    { ta: "சேவை மையத்தில் முதியவருக்கு உதவும் இளைஞர்", en: "A young man helping an elderly woman at a service centre" }),
};

/** Home-page order: the 12 PDF sections. */
export const homeTopics: EmblemId[] = ["schemes", "documents", "jobs", "education", "agriculture", "health", "women", "seniors", "business", "bills", "emergency", "government"];

export const topicOf = (id: string): Topic => topics[(id as EmblemId) in topics ? (id as EmblemId) : "schemes"];
