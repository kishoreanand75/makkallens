import type { Metadata } from "next";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { WeatherCard } from "@/components/widgets/WeatherCard";

export const metadata: Metadata = {
  title: "வேளாண்மை – மானியம், காப்பீடு, வானிலை | MakkalLens",
  description: "விவசாயிகளுக்கான திட்டங்கள், பயிர்க் காப்பீடு, 5 நாள் வானிலை, நிபுணர் ஆலோசனைக்கான அதிகாரப்பூர்வ வழிகள்.",
  alternates: { canonical: "/agriculture" },
};

export default function AgriculturePage() {
  return (
    <TopicShell topic="agriculture"
      title={{ ta: "வேளாண்மை", en: "Agriculture" }}
      intro={{ ta: "மானியம், காப்பீடு, கடன், வானிலை – விவசாயிக்குத் தேவையானவை.", en: "Subsidies, insurance, credit and weather – what a farmer needs." }}
    >
      <Section id="weather" title={{ ta: "வானிலை (5 நாட்கள்)", en: "Weather (5 days)" }}>
        <WeatherCard />
      </Section>
      <Section id="schemes" title={{ ta: "பயிர்த் திட்டங்கள், மானியம், காப்பீடு", en: "Crop schemes, subsidies, insurance" }}>
        <SchemeExplorer category="agriculture" lockCategory />
      </Section>
      <Section id="advice" title={{ ta: "பூச்சி, பயிர் ஆலோசனை (நிபுணர் வழி)", en: "Pest & crop advice (via experts)" }} hint={{ ta: "மருந்து அளவு போன்றவற்றை நாங்கள் சொல்வதில்லை; நிபுணரிடம் உறுதிசெய்யுங்கள்.", en: "We do not give chemical doses; confirm with an expert." }}>
        <LinkList
          items={[
            { title: { ta: "தமிழ்நாடு வேளாண் பல்கலைக்கழகம் (TNAU) – வேளாண் தொழில்நுட்பம்", en: "Tamil Nadu Agricultural University (TNAU) – agritech" }, url: "https://agritech.tnau.ac.in" },
            { title: { ta: "மண் வள அட்டை", en: "Soil Health Card" }, url: "https://soilhealth.dac.gov.in" },
            { title: { ta: "பயிர்க் காப்பீடு (PMFBY)", en: "Crop insurance (PMFBY)" }, url: "https://pmfby.gov.in" },
          ]}
        />
        <a href="tel:18001801551" className="mt-4 flex min-h-16 items-center gap-4 rounded-xl border-2 border-ink bg-paper-2 px-4 hover:bg-sun/30">
          <span className="font-display text-2xl font-semibold tabular-nums">1800-180-1551</span>
          <span className="text-lg">கிசான் கால் சென்டர் / Kisan Call Centre</span>
        </a>
      </Section>
    </TopicShell>
  );
}
