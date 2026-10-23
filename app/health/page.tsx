import type { Metadata } from "next";
import { Section, TopicShell } from "@/components/TopicShell";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { CentreMap } from "@/components/widgets/CentreMap";
import { HelplineGrid } from "@/components/widgets/HelplineGrid";

export const metadata: Metadata = {
  title: "சுகாதாரம் – காப்பீடு, மருத்துவமனை, மகப்பேறு | MakkalLens",
  description: "மருத்துவக் காப்பீடு, மகப்பேறு உதவி, மாற்றுத்திறனாளி அட்டை, அருகிலுள்ள மருத்துவமனைகள், சுகாதார உதவி எண்கள்.",
  alternates: { canonical: "/health" },
};

export default function HealthPage() {
  return (
    <TopicShell topic="health"
      title={{ ta: "சுகாதாரம்", en: "Health" }}
      intro={{ ta: "மருத்துவக் காப்பீடு, மகப்பேறு உதவி, மாற்றுத்திறனாளி நலன், அருகிலுள்ள மருத்துவமனை.", en: "Health insurance, maternity help, disability support and nearby hospitals." }}
    >
      <Section id="helplines" title={{ ta: "சுகாதார உதவி எண்கள்", en: "Health helplines" }}>
        <HelplineGrid kinds={["health"]} />
      </Section>
      <Section id="insurance" title={{ ta: "காப்பீடு & மருத்துவ உதவிகள்", en: "Insurance & medical help" }}>
        <SchemeExplorer category="health" lockCategory />
      </Section>
      <Section id="maternity" title={{ ta: "மகப்பேறு உதவி", en: "Maternity support" }} hint={{ ta: "கர்ப்பிணிகளுக்கான திட்டங்கள் 'பெண்கள் & குடும்பம்' பக்கத்திலும் உள்ளன.", en: "Schemes for expectant mothers are also on the Women & family page." }}>
        <SchemeExplorer category="women" lockCategory />
      </Section>
      <Section id="hospitals" title={{ ta: "அருகிலுள்ள மருத்துவமனைகள்", en: "Nearby hospitals" }}>
        <CentreMap showKinds={["hospital"]} />
      </Section>
    </TopicShell>
  );
}
