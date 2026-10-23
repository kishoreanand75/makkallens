import type { Metadata } from "next";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { CentreMap } from "@/components/widgets/CentreMap";
import { HelplineGrid } from "@/components/widgets/HelplineGrid";

export const metadata: Metadata = {
  title: "அவசரம் & உதவி மையங்கள் – 112, 108, 100, அருகிலுள்ள மருத்துவமனை | MakkalLens",
  description: "அவசர உதவி எண்கள் (தொடுதலில் அழைக்க), அருகிலுள்ள மருத்துவமனை, காவல் நிலையம், இ-சேவை / CSC மையம் தேடல்.",
  alternates: { canonical: "/emergency" },
};

export default function EmergencyPage() {
  return (
    <TopicShell topic="emergency"
      title={{ ta: "அவசரம் & உதவி மையங்கள்", en: "Emergency & help centres" }}
      intro={{ ta: "ஆபத்தில் உடனே 112-ஐ அழையுங்கள். மற்ற உதவி எண்களும் அருகிலுள்ள மையங்களும் கீழே.", en: "In danger call 112 right away. Other helplines and nearby centres are below." }}
    >
      <Section id="call" title={{ ta: "அவசர எண்கள் – தொட்டால் அழைக்கும்", en: "Emergency numbers – tap to call" }}>
        <HelplineGrid kinds={["emergency"]} />
      </Section>
      <Section id="nearby" title={{ ta: "அருகிலுள்ள மருத்துவமனை & காவல் நிலையம்", en: "Nearby hospitals & police stations" }}>
        <CentreMap />
      </Section>
      <Section id="csc" title={{ ta: "இ-சேவை / CSC மையம் தேடல்", en: "Find an e-Sevai / CSC centre" }} hint={{ ta: "சான்றிதழ், விண்ணப்ப உதவிக்கு அருகிலுள்ள அரசு அங்கீகார மையம்.", en: "A government-authorised centre near you for certificates and application help." }}>
        <LinkList
          items={[
            { title: { ta: "CSC மையம் தேடல்", en: "CSC centre locator" }, url: "https://findmycsc.nic.in" },
            { title: { ta: "தமிழ்நாடு இ-சேவை மையம் (உதவி எண் 1800-425-6000)", en: "Tamil Nadu e-Sevai (helpline 1800-425-6000)" }, url: "https://www.tnesevai.tn.gov.in" },
          ]}
        />
      </Section>
      <Section id="other" title={{ ta: "மற்ற உதவி எண்கள்", en: "Other helplines" }}>
        <HelplineGrid kinds={["health", "women", "seniors", "other"]} />
      </Section>
    </TopicShell>
  );
}
