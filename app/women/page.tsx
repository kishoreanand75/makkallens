import type { Metadata } from "next";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { HelplineGrid } from "@/components/widgets/HelplineGrid";

export const metadata: Metadata = {
  title: "பெண்கள் & குடும்ப நலன் – திட்டங்கள், உதவி எண்கள் | MakkalLens",
  description: "மகளிர் உரிமைத் தொகை, மகப்பேறு, சுகன்யா சம்ரித்தி, சுய உதவிக் குழு வழிகாட்டல், பெண்கள் உதவி எண்கள்.",
  alternates: { canonical: "/women" },
};

export default function WomenPage() {
  return (
    <TopicShell topic="women"
      title={{ ta: "பெண்கள் & குடும்ப நலன்", en: "Women & family welfare" }}
      intro={{ ta: "நலத்திட்டங்கள், மகப்பேறு நலன், உதவி எண்கள், சுய உதவிக் குழு வழிகாட்டல்.", en: "Welfare schemes, maternity benefits, helplines and SHG guidance." }}
    >
      <Section id="helplines" title={{ ta: "பாதுகாப்பு உதவி எண்கள்", en: "Safety helplines" }}>
        <HelplineGrid kinds={["women", "emergency"]} />
      </Section>
      <Section id="schemes" title={{ ta: "பெண்கள் திட்டங்கள்", en: "Schemes for women" }}>
        <SchemeExplorer category="women" lockCategory />
      </Section>
      <Section id="shg" title={{ ta: "சுய உதவிக் குழு (SHG) வழிகாட்டல்", en: "Self-help group (SHG) guidance" }} hint={{ ta: "குழுவாகச் சேமித்து, கடன் பெற்றுத் தொழில் தொடங்க தேசிய ஊரக வாழ்வாதார இயக்கம் உதவுகிறது; உங்கள் வட்டார அலுவலகத்தில் கேளுங்கள்.", en: "The National Rural Livelihoods Mission helps groups save, borrow and start enterprises; ask at your block office." }}>
        <LinkList items={[{ title: { ta: "தேசிய ஊரக வாழ்வாதார இயக்கம் (DAY-NRLM)", en: "DAY-NRLM (SHG programme)" }, url: "https://aajeevika.gov.in" }]} />
      </Section>
    </TopicShell>
  );
}
