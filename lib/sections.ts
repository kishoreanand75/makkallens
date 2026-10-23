import type { L } from "./data";

/** The 12 pages from the launch plan (section 4), in the same order. */
export const sections: { href: string; name: L; blurb: L }[] = [
  { href: "/", name: { ta: "முகப்பு", en: "Home" }, blurb: { ta: "கேளுங்கள், உங்களுக்கான பரிந்துரைகள்", en: "Ask, and picks for you" } },
  { href: "/popular", name: { ta: "அதிகம் தேவைப்படும் முதல் 50", en: "The 50 most needed" }, blurb: { ta: "சான்றிதழ்கள், அடையாள ஆவணங்கள், திட்டங்கள் – முன்னுரிமை வரிசையில்", en: "Certificates, IDs and schemes – in priority order" } },
  { href: "/schemes", name: { ta: "அரசுத் திட்டங்கள்", en: "Government schemes" }, blurb: { ta: "தகுதி பொருத்தி, தேடல், வடிகட்டிகள், உரிமை அட்டை", en: "Eligibility matcher, search, filters, Urimai Card" } },
  { href: "/documents", name: { ta: "சான்றிதழ்கள் & ஆவணங்கள்", en: "Certificates & documents" }, blurb: { ta: "ஆவண மருத்துவர், வழிகாட்டிகள், புதுப்பித்தல் நினைவூட்டல்", en: "Document Doctor, guides, renewal reminders" } },
  { href: "/jobs", name: { ta: "வேலை & தேர்வுகள்", en: "Jobs & exams" }, blurb: { ta: "தேர்வு பொருத்தி, பாடத்திட்டம், résumé உருவாக்கி", en: "Exam matcher, syllabus, résumé builder" } },
  { href: "/education", name: { ta: "கல்வி & உதவித்தொகைகள்", en: "Education & scholarships" }, blurb: { ta: "உதவித்தொகை பொருத்தி, சேர்க்கைப் பட்டியல்", en: "Scholarship matcher, admission checklist" } },
  { href: "/agriculture", name: { ta: "வேளாண்மை", en: "Agriculture" }, blurb: { ta: "பயிர்த் திட்டங்கள், மானியம், காப்பீடு, வானிலை", en: "Crop schemes, subsidies, insurance, weather" } },
  { href: "/health", name: { ta: "சுகாதாரம்", en: "Health" }, blurb: { ta: "காப்பீடு, மருத்துவமனைத் தேடல், மகப்பேறு, மாற்றுத்திறன்", en: "Insurance, hospital locator, maternity, disability" } },
  { href: "/women", name: { ta: "பெண்கள் & குடும்ப நலன்", en: "Women & family welfare" }, blurb: { ta: "பெண்கள் திட்டங்கள், உதவி எண்கள், SHG", en: "Women's schemes, helplines, SHG" } },
  { href: "/seniors", name: { ta: "முதியோர் & ஓய்வூதியம்", en: "Senior citizens & pensions" }, blurb: { ta: "ஓய்வூதியத் தகுதி, புதுப்பித்தல், குரல் முதன்மை", en: "Pension eligibility, renewals, voice-first" } },
  { href: "/business", name: { ta: "தொழில் & சுயதொழில்", en: "Business & self-employment" }, blurb: { ta: "கடை / FSSAI / GST / MSME வழிகாட்டல்", en: "Shop / FSSAI / GST / MSME guidance" } },
  { href: "/bills", name: { ta: "கட்டணங்கள் & உள்ளூர் சேவைகள்", en: "Bills & local services" }, blurb: { ta: "மின், சொத்து, குடிநீர், நில ஆவணம் – அதிகாரப்பூர்வ இணைப்புகள்", en: "Electricity, property, water, land – official links" } },
  { href: "/emergency", name: { ta: "அவசரம் & உதவி மையங்கள்", en: "Emergency & help centres" }, blurb: { ta: "112, 108, 100; அருகிலுள்ள மருத்துவமனை, காவல், CSC", en: "112, 108, 100; nearby hospital, police, CSC" } },
  { href: "/leaders", name: { ta: "தமிழ்நாடு அரசு & தலைவர்கள்", en: "Tamil Nadu government & leaders" }, blurb: { ta: "முதலமைச்சர், அமைச்சரவை, பிரதிநிதிகள்", en: "Chief Minister, cabinet, representatives" } },
  { href: "/tamil-nadu", name: { ta: "தமிழ்நாடு – நம் மண்", en: "Tamil Nadu – our land" }, blurb: { ta: "இடங்களும் நிலக்காட்சிகளும்", en: "Places and landscapes" } },
];
