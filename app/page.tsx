import Link from "next/link";
import { GovBand, HowSection, Top50Heading, TopicsSection, TrustSection, VoiceBand } from "@/components/home/HomeSections";
import { HomeHero } from "@/components/home/HomeHero";
import { Top50List } from "@/components/home/Top50List";
import { ForYou } from "@/components/widgets/ForYou";
import { RadarStrip } from "@/components/widgets/RadarStrip";
import { BgIcon, Watermark } from "@/components/ui/Watermark";
import { T } from "@/lib/lang";

export default function Home() {
  return (
    <>
      <HomeHero />
      <RadarStrip />
      <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="top-h">
        <Watermark text="50" className="-right-4 -top-6 text-[14rem] text-brand/[0.07] sm:text-[22rem]" />
        <BgIcon name="rupee" className="right-[30%] top-8 hidden size-24 text-brand/15 md:block" />
        <div className="relative mx-auto max-w-6xl">
          <div id="top-h">
            <Top50Heading />
          </div>
          <div className="mt-6">
            <Top50List limit={10} showTools={false} />
          </div>
          <Link href="/popular" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark">
            <T v={{ ta: "முழு 50-ஐயும் பாருங்கள்", en: "See all 50" }} /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <TopicsSection />
      <HowSection />
      <ForYou />
      <VoiceBand />
      <GovBand />
      <TrustSection />
    </>
  );
}
