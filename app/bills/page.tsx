import type { Metadata } from "next";
import Link from "next/link";
import { Section, TopicShell, LinkList } from "@/components/TopicShell";
import { billItems } from "@/lib/data";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "கட்டணங்கள் & உள்ளூர் சேவைகள் – மின், சொத்து வரி, நில ஆவணம் | MakkalLens",
  description: "மின் கட்டணம், சொத்து வரி, குடிநீர் வரி, நில ஆவணங்களுக்கான அதிகாரப்பூர்வ பணம் செலுத்தும் இணைப்புகள் மற்றும் வழிகாட்டல்.",
  alternates: { canonical: "/bills" },
};

export default function BillsPage() {
  return (
    <TopicShell topic="bills"
      title={{ ta: "கட்டணங்கள் & உள்ளூர் சேவைகள்", en: "Bills & local services" }}
      intro={{ ta: "மின் கட்டணம், சொத்து வரி, நில ஆவணம் – அதிகாரப்பூர்வ இணைப்புகளுக்கு நேரடியாகச் செல்லுங்கள்.", en: "Electricity, property tax, land records – go straight to the official links." }}
    >
      <Section id="links" title={{ ta: "அதிகாரப்பூர்வப் பணம் செலுத்தும் / சேவை இணைப்புகள்" , en: "Official payment & service links" }} hint={{ ta: "பணம் செலுத்தும் முன் முகவரி (URL) .gov.in அல்லது அரசு வங்கி தளம்தானா என்று பாருங்கள்.", en: "Before paying, check that the address is a .gov.in site or your bank's." }}>
        <LinkList items={billItems.map((b) => ({ title: b.name, note: b.tip, url: b.url }))} />
      </Section>
      <Section id="safety" title={{ ta: "ஏமாறாமல் இருக்க", en: "Stay safe from fraud" }}>
        <ul className="space-y-3 text-ink-soft">
          <li className="border-l-4 border-sun pl-4">
            <T v={{ ta: "'மின் இணைப்பு துண்டிக்கப்படும், உடனே இந்த எண்ணை அழையுங்கள்' போன்ற SMS மோசடி. சந்தேகமெனில் மின் வாரிய உதவி எண் 1912-ஐ அழையுங்கள்.", en: "Beware SMS scams such as 'your power will be cut, call this number'. If unsure, call the electricity helpline 1912." }} />
          </li>
          <li className="border-l-4 border-sun pl-4">
            <T v={{ ta: "OTP, UPI PIN, ஆதார் எண்ணை யாரிடமும் சொல்லாதீர்கள். மோசடி நடந்தால் உடனே 1930-ஐ அழையுங்கள்.", en: "Never share an OTP, UPI PIN or Aadhaar number. If cheated, call 1930 immediately." }} />
          </li>
        </ul>
        <Link href="/emergency" className="mt-4 inline-flex min-h-12 items-center rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "அனைத்து உதவி எண்கள் →", en: "All helplines →" }} />
        </Link>
      </Section>
    </TopicShell>
  );
}
