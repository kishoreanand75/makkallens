import type { Metadata } from "next";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { ExamMatcher } from "@/components/widgets/ExamMatcher";
import { ResumeBuilder } from "@/components/widgets/ResumeBuilder";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";

export const metadata: Metadata = {
  title: "வேலை & தேர்வுகள் – TNPSC, TNUSRB, TET, UPSC | MakkalLens",
  description: "உங்கள் தகுதிக்குப் பொருந்தும் அரசுத் தேர்வுகள், பாடத்திட்டச் சுருக்கம், அதிகாரப்பூர்வ அறிவிப்பு இணைப்புகள், சுயவிவரக் குறிப்பு (résumé) உருவாக்கி.",
  alternates: { canonical: "/jobs" },
};

export default function JobsPage() {
  return (
    <TopicShell topic="jobs"
      title={{ ta: "வேலை & தேர்வுகள்", en: "Jobs & exams" }}
      intro={{ ta: "உங்கள் கல்வி, வயதுக்கு எந்தத் தேர்வுகள் பொருந்தும்? அறிவிப்பு எங்கே? ஒவ்வொன்றும் இங்கே.", en: "Which exams fit your education and age, and where is the notification? All here." }}
    >
      <Section id="exams" title={{ ta: "தேர்வு பொருத்தி", en: "Exam matcher" }}>
        <ExamMatcher />
      </Section>
      <Section title={{ ta: "அதிகாரப்பூர்வ வேலை வாய்ப்புத் தளங்கள்", en: "Official job portals" }} hint={{ ta: "பதிவு செய்து அறிவிப்புகளைப் பெறுங்கள். வேலைக்குப் பணம் கேட்பவர்களை நம்பாதீர்கள்.", en: "Register to get notifications. Never pay anyone for a job." }}>
        <LinkList
          items={[
            { title: { ta: "தமிழ்நாடு அரசு வேலைவாய்ப்பு அலுவலகப் பதிவு", en: "Tamil Nadu employment exchange registration" }, note: { ta: "அரசு வேலைக்கான பதிவு மூப்பு", en: "Registration seniority for government jobs" }, url: "https://tnvelaivaaippu.gov.in" },
            { title: { ta: "தமிழ்நாடு தனியார் வேலைவாய்ப்புத் தளம்", en: "Tamil Nadu private jobs portal" }, note: { ta: "அரசு நடத்தும் தனியார் வேலை இணையதளம்", en: "Government-run portal for private-sector jobs" }, url: "https://www.tnprivatejobs.tn.gov.in" },
            { title: { ta: "தேசிய வேலைவாய்ப்புச் சேவை (NCS)", en: "National Career Service (NCS)" }, url: "https://www.ncs.gov.in" },
          ]}
        />
      </Section>
      <Section title={{ ta: "திறன் பயிற்சித் திட்டங்கள்", en: "Skill programmes" }}>
        <SchemeExplorer category="jobs" lockCategory />
      </Section>
      <Section id="resume" title={{ ta: "சுயவிவரக் குறிப்பு (résumé) உதவி", en: "Résumé builder" }}>
        <ResumeBuilder />
      </Section>
    </TopicShell>
  );
}
