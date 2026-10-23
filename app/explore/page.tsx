import type { Metadata } from "next";
import { TopicCard } from "@/components/ui/TopicCard";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { homeTopics, topics } from "@/lib/categories";
import { T } from "@/lib/lang";
import Link from "next/link";

export const metadata: Metadata = {
  title: "அனைத்துப் பகுதிகள் | MakkalLens",
  description: "MakkalLens-இன் 12 பகுதிகள்: திட்டங்கள், சான்றிதழ்கள், வேலை, கல்வி, வேளாண்மை, சுகாதாரம், பெண்கள், முதியோர், தொழில், கட்டணங்கள், அவசர உதவி.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <div>
      <PageHero topic="schemes" kicker={{ ta: "12 பகுதிகள்", en: "12 sections" }} title={{ ta: "அனைத்துப் பகுதிகள்", en: "All sections" }} intro={{ ta: "உங்களுக்குத் தேவையான பகுதியைத் தேர்ந்தெடுங்கள்.", en: "Pick the section you need." }} />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-2 sm:px-6">
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {homeTopics.map((id, i) => (
            <Reveal as="li" key={id} delay={(i % 4) * 0.07} variant="scale" className="[&_.topic-card]:h-full">
              <TopicCard topic={topics[id]} index={i} className="h-full min-h-[17rem] sm:min-h-[22rem]" />
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10">
          <Link href="/tamil-nadu" className="row-link flex items-center gap-4 rounded-xl border-2 border-line bg-paper-2 p-6 hover:border-accent">
            <span className="flex-1">
              <span className="block font-display text-xl font-semibold">
                <T v={{ ta: "தமிழ்நாடு – நம் மண், நம் நம்பிக்கை", en: "Tamil Nadu – our land, our hope" }} />
              </span>
              <span className="block text-ink-soft">
                <T v={{ ta: "நம்பிக்கை தரும் விடியல்களின் தொகுப்பு", en: "A gallery of hopeful sunrises" }} />
              </span>
            </span>
            <span aria-hidden="true" className="arrow text-2xl">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
