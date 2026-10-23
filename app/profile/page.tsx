import type { Metadata } from "next";
import { ProfileFlow } from "@/components/profile/ProfileFlow";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "30 வினாடி சுயவிவரம் – எனக்கான திட்டங்கள் | MakkalLens",
  description: "ஆறு எளிய கேள்விகள் – உங்களுக்குப் பொருந்தும் அரசுத் திட்டங்கள், தேவையான ஆவணங்கள், அடுத்த படிகள்.",
  alternates: { canonical: "/profile" },
};

export default function ProfilePage() {
  return (
    <div>
      <PageHero
        topic="schemes"
        kicker={{ ta: "30 வினாடி", en: "30 seconds" }}
        title={{ ta: "எனக்கான திட்டங்கள்", en: "Schemes for me" }}
        intro={{ ta: "ஒரு நேரத்தில் ஒரு கேள்வி. பதிவு தேவையில்லை; உங்கள் பதில்கள் உங்கள் போனிலேயே இருக்கும்.", en: "One question at a time. No sign-up; your answers stay on your device." }}
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-2 sm:px-6">
        <ProfileFlow />
      </div>
    </div>
  );
}
