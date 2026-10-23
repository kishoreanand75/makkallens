import type { Metadata } from "next";
import { ChatPanel } from "@/components/ChatPanel";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "கேளுங்கள் – MakkalLens உதவியாளர்", alternates: { canonical: "/ask" } };

export default async function AskPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div>
      <PageHero
        topic="ask"
        kicker={{ ta: "உதவியாளர்", en: "Assistant" }}
        title={{ ta: "கேளுங்கள், சொல்கிறோம்", en: "Ask, and we will tell you" }}
        intro={{ ta: "சேவைகள், ஆவணங்கள், கட்டணம், தமிழ்நாடு அரசு, தலைவர்கள் – எதைப் பற்றியும். பதிலைக் குரலிலும் கேட்கலாம்.", en: "Services, documents, fees, the Tamil Nadu government, leaders – anything. Hear the answer aloud too." }}
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-2 sm:px-6">
        <ChatPanel initialQuestion={q?.slice(0, 300)} />
      </div>
    </div>
  );
}
