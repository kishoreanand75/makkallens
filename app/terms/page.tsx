import type { Metadata } from "next";
import { T } from "@/lib/lang";

export const metadata: Metadata = { title: "பயன்பாட்டு விதிமுறைகள் & மறுப்பு | MakkalLens", alternates: { canonical: "/terms" } };

const items: { h: { ta: string; en: string }; p: { ta: string; en: string } }[] = [
  {
    h: { ta: "இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல", en: "This is not an official government website" },
    p: { ta: "MakkalLens ஒரு தனியார் வழிகாட்டி. அரசு விண்ணப்பம், கட்டணம், சான்றிதழ்கள் எல்லாம் அந்தந்தத் துறையின் அதிகாரப்பூர்வ தளத்தில்தான் நடக்கும்.", en: "MakkalLens is a private guide. Applications, fees and certificates are handled only on each department's official site." },
  },
  {
    h: { ta: "தகவல் துல்லியம்", en: "Accuracy of information" },
    p: { ta: "திட்ட விதிகள், கட்டணம், தேதிகள் அடிக்கடி மாறும். ஒவ்வொரு பக்கத்திலும் அதிகாரப்பூர்வ இணைப்பும், 'சரிபார்க்கப்பட்ட தேதி' அல்லது 'சரிபார்ப்பு நிலுவை' நிலையும் காட்டப்படுகிறது. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யுங்கள். தவறைக் கண்டால் 'இந்தத் தகவல் பழையதா?' மூலம் தெரிவியுங்கள்.", en: "Rules, fees and dates change often. Every page shows the official link and either a 'verified on' date or 'verification pending'. Confirm on the official site before applying. Tell us about errors via 'Is this information outdated?'." },
  },
  {
    h: { ta: "AI & தானியங்கிப் பதில்கள்", en: "AI and automated answers" },
    p: { ta: "கேள்விகளுக்கான பதில்கள் எங்கள் சரிபார்க்கப்பட்ட தரவுத்தளத்திலிருந்தும், சில சமயம் AI உதவியுடனும் உருவாக்கப்படுகின்றன. அவை அரசின் அதிகாரப்பூர்வ முடிவு அல்ல; சட்ட, நிதி, மருத்துவ ஆலோசனையும் அல்ல.", en: "Answers come from our database and sometimes with AI help. They are not an official government decision and not legal, financial or medical advice." },
  },
  {
    h: { ta: "தகுதி மதிப்பீடு", en: "Eligibility estimates" },
    p: { ta: "'பொருத்தம் %' என்பது நீங்கள் கொடுத்த விவரங்களின் அடிப்படையிலான தோராய மதிப்பீடு மட்டுமே. இறுதி முடிவு சம்பந்தப்பட்ட அரசுத் துறையினுடையது.", en: "'Match %' is only an estimate from the details you gave. The final decision belongs to the concerned department." },
  },
  {
    h: { ta: "தலைவர்கள், அரசியல் தகவல்கள்", en: "Leaders and political information" },
    p: { ta: "பதவி, துறை, கட்சி போன்ற உண்மைத் தகவல்கள் மட்டுமே; ஆதாரங்கள் குறிப்பிடப்படும். எந்தக் கட்சிக்கும் ஆதரவு அல்லது எதிர்ப்பு இல்லை. புகைப்படங்கள் திறந்த உரிமம் கொண்டவை மட்டுமே, உரிமக் குறிப்புடன்.", en: "Only factual details such as office, department and party, with sources. No party is promoted or opposed. Photos are openly licensed only, with credits." },
  },
  {
    h: { ta: "மோசடி எச்சரிக்கை", en: "Fraud warning" },
    p: { ta: "அரசு வேலை, ஆவணம், திட்டப் பணத்துக்காக யாரிடமும் கூடுதல் பணம் கொடுக்காதீர்கள். OTP, ஆதார், பான் எண்களை யாரிடமும் பகிராதீர்கள். நாங்கள் ஒருபோதும் அவற்றைக் கேட்க மாட்டோம்.", en: "Do not pay anyone extra for a government job, document or scheme money. Never share OTPs, Aadhaar or PAN numbers. We will never ask for them." },
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-5xl">
        <T v={{ ta: "விதிமுறைகள் & மறுப்பு", en: "Terms & disclaimer" }} />
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        <T v={{ ta: "இது தொடக்க வரைவு; தொடங்கும் முன் சட்ட ஆலோசகரின் மதிப்பாய்வு தேவை.", en: "This is a working draft; have it reviewed by a lawyer before launch." }} />
      </p>
      <div className="mt-8 space-y-8">
        {items.map((s) => (
          <section key={s.h.en}>
            <h2 className="text-xl sm:text-2xl">
              <T v={s.h} />
            </h2>
            <p className="mt-2 text-ink-soft">
              <T v={s.p} />
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
