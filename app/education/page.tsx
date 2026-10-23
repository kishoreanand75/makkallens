import type { Metadata } from "next";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { DocChecklist } from "@/components/widgets/DocChecklist";
import { exams } from "@/lib/data";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "கல்வி & உதவித்தொகைகள் | MakkalLens",
  description: "உதவித்தொகை பொருத்தி, சேர்க்கைக்குத் தேவையான ஆவணப் பட்டியல், நுழைவுத் தேர்வுகள், கல்விக் கடன்.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  const entrance = exams.filter((e) => ["neet-ug", "jee-main"].includes(e.id));
  return (
    <TopicShell topic="education"
      title={{ ta: "கல்வி & உதவித்தொகைகள்", en: "Education & scholarships" }}
      intro={{ ta: "படிக்க உதவி, சேர்க்கைக்குத் தேவையானவை, நுழைவுத் தேர்வுகள் – ஒரே இடத்தில்.", en: "Help to study, what admission needs and entrance exams – in one place." }}
    >
      <Section id="scholarships" title={{ ta: "உதவித்தொகை பொருத்தி", en: "Scholarship matcher" }} hint={{ ta: "சுயவிவரம் நிரப்பினால் உங்களுக்குப் பொருந்துவது முதலில் வரும்.", en: "Fill your profile and the best matches come first." }}>
        <SchemeExplorer category="education" lockCategory />
      </Section>
      <Section id="admission" title={{ ta: "சேர்க்கை ஆவணப் பட்டியல்", en: "Admission checklist" }} hint={{ ta: "கல்லூரிச் சேர்க்கைக்குப் பொதுவாகத் தேவையானவை; கல்லூரி கேட்கும் பட்டியலையும் பாருங்கள்.", en: "Commonly needed for college admission; also check your college's own list." }}>
        <DocChecklist ids={["marks", "age", "community", "income", "aadhaar", "photo", "bank"]} />
      </Section>
      <Section title={{ ta: "நுழைவுத் தேர்வுகள்", en: "Entrance exams" }}>
        <LinkList items={entrance.map((e) => ({ title: e.name, note: e.posts, url: e.url }))} />
        <p className="mt-3 text-base text-ink-soft">
          <T v={{ ta: "தகுதி, தேதிகளை 'வேலை & தேர்வுகள்' பக்கத்தில் பாருங்கள்.", en: "See eligibility and dates on the Jobs & exams page." }} />
        </p>
      </Section>
    </TopicShell>
  );
}
