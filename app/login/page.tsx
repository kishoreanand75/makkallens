import type { Metadata } from "next";
import { LoginPanel } from "@/components/LoginPanel";
import { T } from "@/lib/lang";

export const metadata: Metadata = { title: "உள்நுழை (விருப்பம்) | MakkalLens", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-4xl">
        <T v={{ ta: "உள்நுழை (விருப்பம்)", en: "Sign in (optional)" }} />
      </h1>
      <p className="mb-8 mt-3 text-xl text-ink-soft">
        <T v={{ ta: "அடிப்படைத் தேடல், கேள்விகளுக்கு உள்நுழைவு தேவையில்லை. சேமிப்பு, நினைவூட்டல்களைப் பல சாதனங்களில் பெற மட்டும்.", en: "Search and questions never need an account. Sign in only to keep saved items and reminders across devices." }} />
      </p>
      <LoginPanel />
      <p className="mt-8 text-sm text-ink-soft">
        <T v={{ ta: "நாங்கள் பெயர், மாவட்டம், வயது, தொழில் போன்ற குறைந்தபட்சத் தகவல்களை மட்டுமே சேமிப்போம். ஆதார், பான், வங்கி விவரங்களை ஒருபோதும் சேமிக்கவோ கேட்கவோ மாட்டோம்.", en: "We store only minimal details such as district, age band and occupation. We never store or ask for Aadhaar, PAN or bank details." }} />
      </p>
    </div>
  );
}
