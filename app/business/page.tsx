import type { Metadata } from "next";
import { Section, TopicShell } from "@/components/TopicShell";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { BusinessChecklist } from "@/components/widgets/BusinessChecklist";

export const metadata: Metadata = {
  title: "தொழில் & சுயதொழில் – GST, MSME, FSSAI, கடை உரிமம் | MakkalLens",
  description: "சிறு தொழில் தொடங்கத் தேவையான பதிவுகள், உரிமங்களின் சரிபார்ப்புப் பட்டியல், முத்ரா உள்ளிட்ட கடன் திட்டங்கள்.",
  alternates: { canonical: "/business" },
};

export default function BusinessPage() {
  return (
    <TopicShell topic="business"
      title={{ ta: "தொழில் & சுயதொழில்", en: "Business & self-employment" }}
      intro={{ ta: "கடை, உணவகம், சிறு தொழில் – என்ன பதிவு, எந்த உரிமம், எந்தக் கடன் என்று படிப்படியாக.", en: "Shop, eatery or small business – which registration, which licence and which loan, step by step." }}
    >
      <Section id="checklist" title={{ ta: "தொழில் தொடக்கச் சரிபார்ப்புப் பட்டியல்", en: "Business start-up checklist" }} hint={{ ta: "எதைச் செய்து முடித்தீர்களோ அதைக் குறியுங்கள்.", en: "Tick what you have already done." }}>
        <BusinessChecklist />
      </Section>
      <Section id="loans" title={{ ta: "கடன் & ஆதரவுத் திட்டங்கள்", en: "Loans & support schemes" }}>
        <SchemeExplorer category="business" lockCategory />
      </Section>
    </TopicShell>
  );
}
