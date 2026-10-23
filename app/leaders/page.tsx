import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabinetBrowser } from "@/components/CabinetBrowser";
import { Portrait } from "@/components/Portrait";
import { Reveal } from "@/components/Reveal";
import { LinkList, Section } from "@/components/TopicShell";
import { PageHero } from "@/components/ui/PageHero";
import { T } from "@/lib/lang";
import { dataMeta, localLinks, pastCms, photoFor, tnCm, tnGovernor, tnMinisters } from "@/lib/people";

export const metadata: Metadata = {
  title: "தமிழ்நாடு அரசு – முதலமைச்சர், அமைச்சர்கள், பிரதிநிதிகள் | MakkalLens",
  description: "தமிழ்நாட்டின் முதலமைச்சர், அமைச்சரவை, ஆளுநர், உங்கள் பகுதி பிரதிநிதிகள் மற்றும் முந்தைய முதலமைச்சர்களின் பணிகள்.",
  alternates: { canonical: "/leaders" },
};

export default function LeadersPage() {
  const portraits = Object.fromEntries(tnMinisters.map((m) => [m.id, <Portrait key={m.id} id={m.id} name={m.name} className="size-[4.5rem]" />]));
  const withPhoto = tnMinisters.filter((m) => photoFor(m.id)).map((m) => m.id);
  const shown = [tnCm.id, tnGovernor.id, ...tnMinisters.map((m) => m.id), ...pastCms.map((p) => p.id)].map((id) => ({ id, c: photoFor(id) })).filter((x) => x.c);

  return (
    <div>
      <PageHero
        topic="government"
        kicker={{ ta: "உங்கள் அரசு", en: "Your government" }}
        title={{ ta: "தமிழ்நாடு அரசு", en: "Government of Tamil Nadu" }}
        intro={{ ta: "யார் ஆள்கிறார்கள், எந்தத் துறை யாரிடம், உங்கள் பகுதியின் பிரதிநிதி யார் – ஒரே பக்கத்தில்.", en: "Who governs, who holds which department, and who represents your area – on one page." }}
        badges={
          <span className="rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-sm font-semibold text-ink">
            <T v={{ ta: `தகவல் ${dataMeta.asOf} நிலவரம் – tn.gov.in-உடன் சரிபார்ப்பு நிலுவை`, en: `Information as of ${dataMeta.asOf} – verification against tn.gov.in pending` }} />
          </span>
        }
      />

      <div className="mx-auto max-w-5xl space-y-24 px-4 pb-24 pt-4 sm:px-6">
        {/* Chief Minister */}
        <section aria-labelledby="cm" className="relative isolate grid items-center gap-8 overflow-hidden rounded-3xl border-2 border-line bg-info-tint p-5 sm:p-10 md:grid-cols-[minmax(0,19rem)_1fr]">
          <Image src="/photos/cm-tn.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_20%] opacity-[0.16]" />
          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border-4 border-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
            <Portrait id={tnCm.id} name={tnCm.name.en} className="aspect-[4/5] w-full" />
          </div>
          <Reveal delay={0.15} variant="right">
            <p className="font-display text-base font-semibold text-info">
              <T v={{ ta: "முதலமைச்சர்", en: "Chief Minister" }} />
            </p>
            <h2 id="cm" className="mt-1 text-3xl sm:text-5xl">
              <T v={tnCm.name} />
            </h2>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-lg">
              <dt className="text-ink-soft"><T v={{ ta: "கட்சி", en: "Party" }} /></dt>
              <dd><T v={tnCm.party} /></dd>
              <dt className="text-ink-soft"><T v={{ ta: "தொகுதி", en: "Constituency" }} /></dt>
              <dd><T v={tnCm.constituency} /></dd>
              <dt className="text-ink-soft"><T v={{ ta: "பதவியேற்பு", en: "Took office" }} /></dt>
              <dd>{tnCm.since}</dd>
              <dt className="text-ink-soft"><T v={{ ta: "ஆளுநர்", en: "Governor" }} /></dt>
              <dd>{tnGovernor.name}</dd>
            </dl>
            <p className="mt-5 max-w-xl text-ink-soft">
              <T v={tnCm.portfolioNote} />
            </p>
            <Link href={`/ask?q=${encodeURIComponent("முதலமைச்சர் யார்?")}`} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-info px-6 font-display text-base font-semibold text-white hover:bg-ink">
              <T v={{ ta: "உதவியாளரிடம் கேளுங்கள் →", en: "Ask the assistant →" }} />
            </Link>
          </Reveal>
        </section>

        <Section id="cabinet" title={{ ta: "அமைச்சரவை & துறைகள்", en: "Cabinet & departments" }} hint={{ ta: `${tnMinisters.length} அமைச்சர்கள் (முதலமைச்சர் தவிர)`, en: `${tnMinisters.length} ministers (besides the Chief Minister)` }}>
          <CabinetBrowser ministers={tnMinisters} portraits={portraits} withPhoto={withPhoto} />
        </Section>

        <Section id="local" title={{ ta: "உங்கள் பகுதி பிரதிநிதிகள்", en: "Your local representatives" }} hint={{ ta: "எம்.எல்.ஏ., எம்.பி., வார்டு கவுன்சிலர் பெயர்கள் அதிகாரப்பூர்வ பட்டியல்களிலிருந்து தொகுக்கப்படுகின்றன. அதுவரை உறுதியான வழிகள்:", en: "MLA, MP and ward councillor names are being compiled from official lists. Until then, reliable ways to find them:" }}>
          <LinkList
            items={[
              { title: { ta: "எம்.எல்.ஏ. & எம்.பி. தொகுதி", en: "Your MLA & MP constituency" }, note: { ta: "வாக்காளர் அடையாள அட்டை மூலம் உங்கள் தொகுதியைப் பாருங்கள்.", en: "Look up your constituency using your voter ID." }, url: localLinks.voters },
              { title: { ta: "நாடாளுமன்ற உறுப்பினர்கள்", en: "Members of Parliament" }, note: { ta: "மக்களவை உறுப்பினர் விவரம், வருகைப் பதிவு.", en: "Lok Sabha member details and attendance." }, url: localLinks.sansad },
              { title: { ta: "வார்டு கவுன்சிலர் – சென்னை", en: "Ward councillor – Chennai" }, note: { ta: "200 வார்டுகள்; வார்டு, மண்டல விவரம் மாநகராட்சி தளத்தில்.", en: "200 wards; ward and zone details on the corporation site." }, url: localLinks.chennai },
              { title: { ta: "தமிழ்நாடு அரசு அதிகாரப்பூர்வ தளம்", en: "Official Tamil Nadu government portal" }, note: { ta: "துறைகள், அறிவிப்புகள், அரசாணைகள்.", en: "Departments, announcements and government orders." }, url: localLinks.tn },
            ]}
          />
        </Section>

        <Section id="history" title={{ ta: "முந்தைய முதலமைச்சர்கள் – மக்களுக்குச் செய்தவை", en: "Past Chief Ministers – what they did for the people" }} hint={{ ta: "சில முக்கியப் பணிகள் மட்டும்; முழுப் பட்டியல் அல்ல. ஒவ்வொன்றுக்கும் ஆதார இணைப்பு விரைவில்.", en: "A few notable works only, not a full list. A source link for each is coming." }}>
          <ol className="space-y-5">
            {pastCms.map((p, i) => (
              <Reveal as="li" key={p.id} delay={0.05} variant={i % 2 ? "right" : "left"}>
                <article className="flex gap-5 rounded-xl border-2 border-line bg-paper-2 p-5 sm:p-6">
                  <Portrait id={p.id} name={p.name.en} className="hidden size-24 shrink-0 rounded-2xl sm:grid" />
                  <div>
                    <h3 className="text-xl sm:text-2xl">
                      <T v={p.name} />
                    </h3>
                    <p className="text-sm font-bold text-brand">{p.years}</p>
                    <ul className="mt-3 space-y-1.5 text-ink-soft">
                      {p.work.map((w, k) => (
                        <li key={k} className="flex gap-2">
                          <span aria-hidden="true" className="text-accent">✦</span>
                          <T v={w} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </Section>

        <Reveal variant="scale" className="overflow-hidden rounded-[2rem] bg-brand p-8 text-white sm:p-10">
          <h2 className="text-2xl sm:text-3xl">
            <T v={{ ta: "பிற மாநிலங்கள்", en: "Other states" }} />
          </h2>
          <p className="mt-2 text-white/75">
            <T v={{ ta: "இந்தியாவின் அனைத்து மாநில முதலமைச்சர்களும் ஒரே இடத்தில்.", en: "Every Indian state's Chief Minister in one place." }} />
          </p>
          <Link href="/leaders/states" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-sun px-6 font-display text-lg font-semibold text-ink hover:bg-white">
            <T v={{ ta: "மாநில முதலமைச்சர்கள் →", en: "State Chief Ministers →" }} />
          </Link>
        </Reveal>

        <details className="text-sm text-ink-soft">
          <summary className="min-h-11 cursor-pointer font-bold">
            <T v={{ ta: "புகைப்பட உரிமம் & ஆதாரம்", en: "Photo credits & sources" }} />
          </summary>
          <p className="mt-2">{dataMeta.note}</p>
          <ul className="mt-2 space-y-1">
            {shown.map(({ id, c }) => (
              <li key={id}>
                {c!.page} – {c!.author || "n/a"} – {c!.license} –{" "}
                <a href={c!.source} className="underline" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
