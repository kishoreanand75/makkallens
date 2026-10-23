import type { Metadata } from "next";
import { T } from "@/lib/lang";
import { ClearDataButton } from "@/components/ClearDataButton";

export const metadata: Metadata = { title: "தனியுரிமைக் கொள்கை | MakkalLens", alternates: { canonical: "/privacy" } };

const sections: { h: { ta: string; en: string }; p: { ta: string; en: string } }[] = [
  {
    h: { ta: "நாங்கள் யார்", en: "Who we are" },
    p: { ta: "MakkalLens ஒரு தனியார் வழிகாட்டி இணையதளம். இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல; எந்த அரசுத் துறையுடனும் தொடர்புடையதும் அல்ல.", en: "MakkalLens is a private guide website. It is not an official government site and is not affiliated with any government department." },
  },
  {
    h: { ta: "உங்கள் சாதனத்தில் மட்டும் சேமிப்பவை", en: "What stays only on your device" },
    p: { ta: "நீங்கள் நிரப்பும் 30 வினாடிச் சுயவிவரம் (வயது, மாவட்டம், பாலினம், தொழில், வருமானப் பிரிவு, தேவைகள்), சேமித்த திட்டங்கள், ஆவணக் குறிகள், நினைவூட்டல்கள், நீங்கள் இங்கே தேடிய / பார்த்த விவரங்கள் ஆகியவை உங்கள் உலாவியின் localStorage-இல் மட்டுமே சேமிக்கப்படும். 'உங்களுக்காக' பரிந்துரைகள் அங்கேயே கணக்கிடப்படுகின்றன. நாங்கள் உங்கள் Google தேடல் வரலாற்றைப் பார்க்கவோ பெறவோ மாட்டோம்.", en: "The 30-second profile (age, district, gender, occupation, income band, needs), saved schemes, document ticks, reminders and what you searched or viewed here are kept only in your browser's localStorage. The 'For you' picks are computed there. We never see or fetch your Google search history." },
  },
  {
    h: { ta: "நாங்கள் ஒருபோதும் சேமிக்காதவை", en: "What we never store" },
    p: { ta: "ஆதார் எண், பான் எண், வங்கி விவரங்கள், OTP, கடவுச்சொல், ஆவணப் படங்கள். இவற்றை இந்தத் தளத்தில் உள்ளிட வேண்டாம்.", en: "Aadhaar or PAN numbers, bank details, OTPs, passwords or document images. Please do not enter them on this site." },
  },
  {
    h: { ta: "கேள்விகள் சர்வருக்குச் செல்லும்போது", en: "When a question reaches our server" },
    p: { ta: "'கேளுங்கள்' பகுதியில் நீங்கள் தட்டச்சு / பேசிய கேள்வி பதில் தருவதற்காக எங்கள் சர்வருக்கு அனுப்பப்படும். அதன் உரை பதிவில் (log) வைக்கப்படாது; நீளம், நேரம், பதில் வழி மட்டுமே பதிவாகும். பொதுவான கேள்வி–பதில்கள் வேகத்துக்காகச் சிறிது நேரம் தற்காலிகச் சேமிப்பில் (cache) இருக்கலாம்; அவை எந்தப் பயனருடனும் இணைக்கப்படாது. AI (Gemini) இயக்கப்பட்டால் தெளிவற்ற கேள்விகள் மட்டும், பொருத்தமான சிறு சூழலுடன் அனுப்பப்படும்.", en: "A question you type or speak on the Ask page is sent to our server to be answered. Its text is not logged; only its length, time and answer route are. Common question–answer pairs may be cached briefly for speed and are not linked to any user. If AI (Gemini) is enabled, only unclear questions are sent, with a small relevant context." },
  },
  {
    h: { ta: "குரல்", en: "Voice" },
    p: { ta: "குரல் உள்ளீடு, குரல் வெளியீடு உங்கள் உலாவி / சாதனத்தின் சேவையால் இயங்கும்; சில உலாவிகள் குரலை அவற்றின் சொந்தச் சேவைக்கு அனுப்பலாம் (எ.கா. Chrome). நாங்கள் ஒலிப்பதிவுகளைச் சேமிப்பதில்லை.", en: "Voice input and output use your browser / device services; some browsers (e.g. Chrome) may send speech to their own service. We do not store recordings." },
  },
  {
    h: { ta: "வெளிச் சேவைகள்", en: "Third-party services" },
    p: { ta: "வரைபடம் (OpenStreetMap, Leaflet), அருகிலுள்ள இடங்கள் (Overpass API), வானிலை (Open-Meteo) ஆகியவற்றை அழைக்கும்போது உங்கள் IP முகவரி அந்தச் சேவைகளுக்குத் தெரியும். உங்கள் இருப்பிடம் 'என் இருப்பிடம்' அழுத்தும்போது மட்டுமே பெறப்படும்; அது தேடலுக்காக மட்டும் பயன்படும், சேமிக்கப்படாது.", en: "Maps (OpenStreetMap, Leaflet), nearby places (Overpass API) and weather (Open-Meteo) see your IP address when called. Your location is read only when you press 'Use my location', is used only for the search and is not stored." },
  },
  {
    h: { ta: "உள்நுழைவு (விருப்பம்)", en: "Sign-in (optional)" },
    p: { ta: "உள்நுழைந்தால் மட்டும், குறைந்தபட்சத் தகவல் (மின்னஞ்சல், மாவட்டம், வயது, பாலினம், தொழில், வருமானப் பிரிவு, சேமித்த திட்ட எண்கள், நினைவூட்டல்கள்) Supabase-இல் உங்கள் கணக்குடன் மட்டும் இணைந்து சேமிக்கப்படும்; வரிநிலைப் பாதுகாப்பு (Row Level Security) மூலம் வேறு யாரும் பார்க்க முடியாது.", en: "Only if you sign in, minimal data (email, district, age, gender, occupation, income band, saved scheme ids, reminders) is stored in Supabase under your account, protected by Row Level Security so nobody else can read it." },
  },
  {
    h: { ta: "உங்கள் உரிமைகள்", en: "Your choices" },
    p: { ta: "கீழுள்ள பொத்தானை அழுத்தினால் இந்தச் சாதனத்தில் உள்ள எல்லாத் தகவலும் உடனே அழியும். உள்நுழைந்திருந்தால் கணக்கு நீக்கக் கோரிக்கையைத் 'தொடர்பு' பக்கத்தில் அனுப்புங்கள்.", en: "The button below instantly erases everything stored on this device. If you signed in, send an account-deletion request from the Contact page." },
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-5xl">
        <T v={{ ta: "தனியுரிமைக் கொள்கை", en: "Privacy policy" }} />
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        <T v={{ ta: "இது தொடக்க வரைவு; தொடங்கும் முன் சட்ட ஆலோசகரின் மதிப்பாய்வு தேவை.", en: "This is a working draft; have it reviewed by a lawyer before launch." }} />
      </p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
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
      <div className="mt-10">
        <ClearDataButton />
      </div>
    </div>
  );
}
