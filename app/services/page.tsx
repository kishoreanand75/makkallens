import type { Metadata } from "next";
import { ServiceBrowser } from "@/components/ServiceBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { categories, type CategoryId } from "@/lib/services";

export const metadata: Metadata = { title: "அனைத்து சேவைகள் – படிப்படியான வழிகாட்டிகள் | MakkalLens", alternates: { canonical: "/services" } };

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const initial = categories.find((x) => x.id === c)?.id as CategoryId | undefined;
  return (
    <div>
      <PageHero topic="documents" kicker={{ ta: "படிப்படியாக", en: "Step by step" }} title={{ ta: "அரசு சேவைகள்", en: "Government services" }} intro={{ ta: "ஒரு சேவையைத் தேர்ந்தெடுத்தால் முழு வழிகாட்டி கிடைக்கும்.", en: "Pick a service for the complete guide." }} />
      <div className="w-full px-4 pb-24 pt-2 sm:px-8 lg:pl-24">
        <ServiceBrowser initialCategory={initial} />
      </div>
    </div>
  );
}
