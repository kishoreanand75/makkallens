import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ReportForm } from "@/components/ReportForm";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "கட்டணத் திட்டங்கள் | MakkalLens",
  description: "அடிப்படை அரசு வழிகாட்டல் எப்போதும் இலவசம். வசதி, B2B கருவிகளுக்கான திட்டங்கள் விரைவில்.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    id: "free",
    name: { ta: "இலவசம்", en: "Free" },
    price: { ta: "₹0", en: "₹0" },
    who: { ta: "அனைத்துக் குடிமக்கள்", en: "All citizens" },
    items: [
      { ta: "அடிப்படைக் கேள்வி–பதில்", en: "Basic Q&A" },
      { ta: "திட்டத் தகுதிச் சரிபார்ப்பு", en: "Scheme eligibility checks" },
      { ta: "பொது ஆவணப் பட்டியல்கள்", en: "Public checklists" },
      { ta: "அதிகாரப்பூர்வ இணைப்புகள்", en: "Official links" },
    ],
  },
  {
    id: "plus",
    name: { ta: "பிளஸ்", en: "Plus" },
    price: { ta: "₹49 / மாதம் அல்லது ₹499 / ஆண்டு", en: "₹49 / month or ₹499 / year" },
    who: { ta: "வழக்கமான பயனர்கள்", en: "Regular users" },
    items: [
      { ta: "வரம்பற்ற திட்டச் சரிபார்ப்பு", en: "Unlimited scheme checks" },
      { ta: "சேமித்த சுயவிவரம்", en: "Saved profile" },
      { ta: "ஆவணப் பெட்டகம்", en: "Document wallet" },
      { ta: "நினைவூட்டல்கள்", en: "Reminders" },
    ],
  },
  {
    id: "pro",
    name: { ta: "ப்ரோ", en: "Pro" },
    price: { ta: "₹99 / மாதம் அல்லது ₹999 / ஆண்டு", en: "₹99 / month or ₹999 / year" },
    who: { ta: "மாணவர்கள் & தீவிரப் பயனர்கள்", en: "Students & power users" },
    items: [
      { ta: "முன்னுரிமை AI", en: "Priority AI" },
      { ta: "தேர்வு / வேலை எச்சரிக்கைகள்", en: "Exam / job alerts" },
      { ta: "résumé கருவிகள்", en: "Résumé tools" },
      { ta: "மேம்பட்ட திட்டமிடல்", en: "Advanced planner" },
    ],
  },
  {
    id: "csc",
    name: { ta: "CSC / முகவர்", en: "CSC / Agent" },
    price: { ta: "₹999 / மாதம்", en: "₹999 / month" },
    who: { ta: "இ-சேவை, CSC மையங்கள்", en: "e-Sevai agents, CSC centres" },
    items: [
      { ta: "பல பயனர் உதவி", en: "Multi-user assistance" },
      { ta: "ஆவண வார்ப்புருக்கள்", en: "Document templates" },
      { ta: "விசாரணைப் பெட்டி", en: "Lead inbox" },
      { ta: "சொந்த முத்திரை", en: "Branding" },
    ],
  },
  {
    id: "business",
    name: { ta: "வணிகம்", en: "Business" },
    price: { ta: "₹1,999 – ₹4,999 / மாதம்", en: "₹1,999 – ₹4,999 / month" },
    who: { ta: "உள்ளூர்க் கடைகள், கிளினிக், கல்லூரிகள்", en: "Local shops, clinics, colleges" },
    items: [
      { ta: "AI உதவியாளர்", en: "AI assistant" },
      { ta: "WhatsApp தானியக்கம்", en: "WhatsApp automation" },
      { ta: "வாடிக்கையாளர் சேகரிப்பு", en: "Lead capture" },
      { ta: "விளம்பரத் தெரிவுநிலை", en: "Sponsored visibility" },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="fade-up text-3xl sm:text-5xl">
        <T v={{ ta: "கட்டணத் திட்டங்கள்", en: "Plans & pricing" }} />
      </h1>
      <p className="fade-up mt-3 max-w-2xl text-xl text-ink-soft" style={{ ["--d" as string]: "0.1s" }}>
        <T v={{ ta: "அடிப்படை அரசு வழிகாட்டல் எப்போதும் இலவசம். வசதிக்கும் வணிகக் கருவிகளுக்கும் மட்டுமே கட்டணம்.", en: "Basic government guidance is always free. We charge only for convenience and business tools." }} />
      </p>
      <p role="note" className="fade-up mt-4 rounded-lg border-2 border-dashed border-brand bg-sun-tint p-3" style={{ ["--d" as string]: "0.15s" }}>
        <T v={{ ta: "இப்போது பணம் வசூலிக்கவில்லை – பீட்டா காலத்தில் எல்லா வசதிகளும் இலவசம். கீழுள்ள திட்டங்கள் தொடங்கும்போது தெரிவிக்க விருப்பத்தைப் பதிவு செய்யலாம்.", en: "We are not charging yet – everything is free during the beta. Join the waitlist below to hear when plans start." }} />
      </p>

      <ul className="mt-10 border-t border-line">
        {plans.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.05} className="grid gap-3 border-b border-line py-6 md:grid-cols-[14rem_1fr]">
            <div>
              <h2 className="text-2xl">
                <T v={p.name} />
              </h2>
              <p className="font-display text-lg font-semibold text-brand">
                <T v={p.price} />
              </p>
              <p className="text-sm text-ink-soft">
                <T v={p.who} />
              </p>
            </div>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {p.items.map((it) => (
                <li key={it.en} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand">✓</span>
                  <T v={it} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12 max-w-xl">
        <h2 className="text-2xl">
          <T v={{ ta: "தொடங்கும்போது எனக்குத் தெரிவியுங்கள்", en: "Tell me when plans start" }} />
        </h2>
        <p className="mb-4 mt-1 text-ink-soft">
          <T v={{ ta: "விருப்பமான திட்டத்தையும் தொடர்பு விவரத்தையும் எழுதுங்கள்.", en: "Write the plan you want and a way to reach you." }} />
        </p>
        <ReportForm target="page:pricing" kind="waitlist" />
      </Reveal>
    </div>
  );
}
