import type { Metadata } from "next";
import Link from "next/link";
import { AskBox } from "@/components/AskBox";
import { ForceLargeText } from "@/components/LargeText";
import { Section, TopicShell } from "@/components/TopicShell";
import { HelplineGrid } from "@/components/widgets/HelplineGrid";
import { PensionChecker } from "@/components/widgets/PensionChecker";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "முதியோர் & ஓய்வூதியம் – பெரிய எழுத்து, குரல் உதவி | MakkalLens",
  description: "ஓய்வூதியத் தகுதி சரிபார்ப்பு, புதுப்பித்தல், முதியோர் உதவி எண், குரலில் கேட்கும் வசதி.",
  alternates: { canonical: "/seniors" },
};

export default function SeniorsPage() {
  return (
    <div>
      <ForceLargeText />
      <TopicShell topic="seniors"
        title={{ ta: "முதியோர் & ஓய்வூதியம்", en: "Senior citizens & pensions" }}
        intro={{ ta: "பெரிய எழுத்தில், குரலில் – ஓய்வூதியம் உங்களுக்குக் கிடைக்குமா என்று பாருங்கள்.", en: "Large text, voice-first – check whether you can get a pension." }}
      >
        <Section id="voice" title={{ ta: "பேசிக் கேளுங்கள்", en: "Just ask by voice" }} hint={{ ta: "மைக்கை அழுத்தி உங்கள் கேள்வியைச் சொல்லுங்கள்.", en: "Press the mic and say your question." }}>
          <AskBox examples={[{ ta: "முதியோர் ஓய்வூதியம் யாருக்கு?", en: "Who gets old-age pension?" }, { ta: "ஆதார் பதிவிறக்கம்", en: "Download Aadhaar" }]} />
        </Section>
        <Section id="pension" title={{ ta: "ஓய்வூதியத் தகுதி சரிபார்ப்பு", en: "Pension checker" }}>
          <PensionChecker />
        </Section>
        <Section id="renewal" title={{ ta: "புதுப்பித்தல் & உதவி", en: "Renewals & help" }}>
          <ul className="space-y-3 text-ink-soft">
            <li className="border-l-4 border-sun pl-4">
              <T v={{ ta: "அரசு ஓய்வூதியதாரர்கள் ஆண்டுதோறும் வாழ்நாள் சான்று (Life Certificate) அளிக்க வேண்டும்; பொதுவாக நவம்பரில்.", en: "Government pensioners must submit a Life Certificate every year, usually in November." }} />
            </li>
            <li className="border-l-4 border-sun pl-4">
              <T v={{ ta: "ஓய்வூதியம் வராவிட்டால் முதலில் வங்கிக் கணக்கு – ஆதார் இணைப்பையும் மொபைல் எண்ணையும் சரிபாருங்கள்.", en: "If your pension does not arrive, first check bank-Aadhaar linking and your mobile number." }} />
            </li>
          </ul>
          <Link href="/documents?remind=Life%20certificate#reminders" className="mt-4 inline-flex min-h-14 items-center rounded-xl border-2 border-ink px-5 font-display text-lg font-semibold hover:bg-sun/40">
            <T v={{ ta: "⏰ நினைவூட்டல் அமை", en: "⏰ Set a reminder" }} />
          </Link>
          <div className="mt-6">
            <HelplineGrid kinds={["seniors", "emergency"]} />
          </div>
        </Section>
      </TopicShell>
    </div>
  );
}
