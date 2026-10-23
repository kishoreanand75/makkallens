import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceBrowser } from "@/components/ServiceBrowser";
import { DocumentDoctor } from "@/components/widgets/DocumentDoctor";
import { Reminders } from "@/components/widgets/Reminders";
import { Section, TopicShell } from "@/components/TopicShell";
import { documents } from "@/lib/data";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "சான்றிதழ்கள் & ஆவணங்கள் – ஆவண மருத்துவர் | MakkalLens",
  description: "பிறப்பு, ஆதார், பான், சாதிச் சான்று, ஓட்டுநர் உரிமம் வழிகாட்டிகள்; குறையும் ஆவணங்களைக் கண்டறியும் ஆவண மருத்துவர்; கடைசித் தேதி நினைவூட்டல்கள்.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  return (
    <TopicShell
      topic="documents"
      title={{ ta: "சான்றிதழ்கள் & ஆவணங்கள்", en: "Certificates & documents" }}
      intro={{ ta: "எந்த ஆவணம் எப்படிப் பெறுவது, உங்களிடம் எது குறைகிறது, எப்போது புதுப்பிக்க வேண்டும் – எல்லாம் ஒரே பக்கத்தில்.", en: "How to get each document, what you are missing and when to renew – on one page." }}
    >
      <Section id="guides" title={{ ta: "படிப்படியான வழிகாட்டிகள்", en: "Step-by-step guides" }} hint={{ ta: "வடிகட்டி மூலம் வகை, அரசு அடிப்படையில் தேடலாம்.", en: "Use the filter to narrow by type or government." }}>
        <div className="relative ml-[calc(50%-48vw)] w-[96vw] px-1 sm:px-4 lg:ml-[calc(50%-min(calc(100vw-13rem),112rem)/2)] lg:w-[min(calc(100vw-13rem),112rem)]">
          <ServiceBrowser />
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          <T v={{ ta: `${documents.length} வகை ஆவணங்கள் கீழே உள்ள ஆவண மருத்துவரில்; மேலும் வழிகாட்டிகள் சேர்க்கப்படுகின்றன.`, en: `${documents.length} document types are in the Document Doctor below; more guides are being added.` }} />
        </p>
      </Section>

      <Section id="doctor" title={{ ta: "ஆவண மருத்துவர்", en: "Document Doctor" }} hint={{ ta: "உங்களிடம் உள்ளவற்றைக் குறியுங்கள்; எந்தத் திட்டத்துக்கு எது குறைகிறது என்று சொல்கிறோம்.", en: "Tick what you have; we show what is missing for the scheme you choose." }}>
        <DocumentDoctor />
      </Section>

      <Section id="reminders" title={{ ta: "கடைசித் தேதி ரேடார் – நினைவூட்டல்கள்", en: "Deadline Radar – reminders" }} hint={{ ta: "ஒரு தேதியைச் சேருங்கள்; கேலண்டரிலும் சேர்க்கலாம்.", en: "Add a date; export it to your calendar too." }}>
        <Suspense>
          <Reminders />
        </Suspense>
      </Section>
    </TopicShell>
  );
}
