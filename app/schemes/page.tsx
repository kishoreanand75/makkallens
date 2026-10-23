import type { Metadata } from "next";
import { SchemeExplorer } from "@/components/scheme/SchemeExplorer";
import { PageHero } from "@/components/ui/PageHero";
import { schemeCategories, schemes, type SchemeCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "அரசுத் திட்டங்கள் – உங்களுக்குப் பொருந்துவது எது? | MakkalLens",
  description: "மத்திய, தமிழ்நாடு அரசுத் திட்டங்களுக்கான தகுதி, ஆவணங்கள், விண்ணப்ப வழி, அதிகாரப்பூர்வ இணைப்பு.",
  alternates: { canonical: "/schemes" },
};

export default async function SchemesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const initial = schemeCategories.find((x) => x.id === c)?.id as SchemeCategory | undefined;
  return (
    <div>
      <PageHero
        topic="schemes"
        kicker={{ ta: "தகுதி பொருத்தி", en: "Eligibility matcher" }}
        title={{ ta: "அரசுத் திட்டங்கள்", en: "Government schemes" }}
        intro={{ ta: `${schemes.length} திட்டங்கள். ஒவ்வொன்றிலும் துறை, அதிகாரப்பூர்வ இணைப்பு, சரிபார்ப்பு நிலை உண்டு.`, en: `${schemes.length} schemes. Each shows its department, official link and verification status.` }}
      />
      <div className="w-full px-4 pb-24 pt-2 sm:px-8 lg:pl-24">
        <SchemeExplorer category={initial} />
      </div>
    </div>
  );
}
