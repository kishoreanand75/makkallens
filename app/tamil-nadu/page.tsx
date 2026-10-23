import type { Metadata } from "next";
import Link from "next/link";
import { PlacesGallery } from "@/components/PlacesGallery";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "தமிழ்நாடு – நம் மண், நம் நம்பிக்கை | MakkalLens",
  description: "தமிழ்நாட்டின் கோயில்கள், கடற்கரை, மலை, வயல் – நம்பிக்கை தரும் விடியல்களின் தொகுப்பு.",
  alternates: { canonical: "/tamil-nadu" },
};

export default function TamilNaduPage() {
  return (
    <div>
      <PageHero
        topic="schemes"
        image="/places/hero.webp"
        kicker={{ ta: "நம் மண், நம் நம்பிக்கை", en: "Our land, our hope" }}
        title={{ ta: "ஒவ்வொரு விடியலும் ஒரு புதிய தொடக்கம்", en: "Every sunrise is a fresh start" }}
        intro={{ ta: "படிப்பு, வேலை, வீடு, தொழில் – எல்லாவற்றுக்கும் முதல் படி சரியான ஆவணம். அந்தப் பயணத்தில் தமிழ்நாடு உங்களுடன்.", en: "Study, work, a home, a business – the first step is the right document. Tamil Nadu walks that road with you." }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-2 sm:px-6">
        <PlacesGallery />
        <Reveal className="mt-16 rounded-[2rem] bg-brand p-8 text-white sm:p-10">
          <h2 className="text-2xl sm:text-3xl">
            <T v={{ ta: "உங்கள் அடுத்த படிக்கு…", en: "For your next step…" }} />
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/profile" className="inline-flex min-h-12 items-center rounded-full bg-sun px-6 font-display text-base font-semibold text-ink hover:bg-white">
              <T v={{ ta: "எனக்கான திட்டங்கள்", en: "Schemes for me" }} />
            </Link>
            <Link href="/explore" className="inline-flex min-h-12 items-center rounded-full border-2 border-white/70 px-6 font-display text-base font-semibold hover:bg-white hover:text-ink">
              <T v={{ ta: "அனைத்துப் பகுதிகள்", en: "All sections" }} />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
