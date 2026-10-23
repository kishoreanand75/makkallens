import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListenText } from "@/components/ListenText";
import { ReportForm } from "@/components/ReportForm";
import { Reveal } from "@/components/Reveal";
import { TrackView } from "@/components/TrackView";
import { VerifyBadge } from "@/components/VerifyBadge";
import { DocWallet } from "@/components/scheme/DocWallet";
import { EligibilitySection } from "@/components/scheme/EligibilitySection";
import { SaveButton } from "@/components/scheme/SaveButton";
import { Section } from "@/components/TopicShell";
import { PageHero } from "@/components/ui/PageHero";
import { SectionNav } from "@/components/ui/SectionNav";
import { StepTimeline } from "@/components/ui/StepTimeline";
import { topics } from "@/lib/categories";
import { getScheme, schemeCategories, schemes } from "@/lib/data";
import { T } from "@/lib/lang";

export function generateStaticParams() {
  return schemes.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = getScheme(id);
  if (!s) return {};
  return { title: `${s.title.ta} – ${s.title.en} | MakkalLens`, description: s.benefit.ta, alternates: { canonical: `/schemes/${s.id}` } };
}

export default async function SchemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getScheme(id);
  if (!s) notFound();
  const cat = schemeCategories.find((c) => c.id === s.category)!;
  const tp = topics[s.category];
  const host = new URL(s.url).host;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: s.title.en,
    alternateName: s.title.ta,
    description: s.benefit.en,
    serviceType: cat.name.en,
    provider: { "@type": "GovernmentOrganization", name: s.dept.en },
    url: s.url,
    inLanguage: ["ta", "en"],
  };

  const steps = [
    {
      title: { ta: "தகுதியையும் ஆவணங்களையும் சரிபாருங்கள்", en: "Check eligibility and gather documents" },
      detail: { ta: "மேலே உள்ள தகுதி அட்டைகளையும் ஆவண அட்டைகளையும் பாருங்கள். குறைவது எதுவோ அதை முதலில் பெறுங்கள்.", en: "Look at the eligibility and document cards above and get anything that is missing first." },
      action: (
        <Link href="/documents#doctor" className="inline-flex min-h-12 items-center rounded-xl border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "ஆவண மருத்துவர் →", en: "Document Doctor →" }} />
        </Link>
      ),
    },
    {
      title: { ta: "விண்ணப்பியுங்கள்", en: "Apply" },
      detail: s.apply,
      action: (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-5 font-display text-base font-semibold text-white hover:bg-brand-dark">
          <T v={{ ta: "அதிகாரப்பூர்வ தளம்", en: "Official site" }} /> · {host} ↗
        </a>
      ),
    },
    {
      title: { ta: "ஒப்புகை எண்ணைப் பாதுகாக்கவும்", en: "Keep your acknowledgement" },
      detail: { ta: "விண்ணப்பித்த பின் கிடைக்கும் எண்ணைக் குறித்துக் கொள்ளுங்கள்; அதே தளத்தில் நிலையைப் பார்க்கலாம். சிக்கல் என்றால் இ-சேவை / CSC மையத்தில் கேளுங்கள்.", en: "Note the number you get after applying and track the status on the same site. If you are stuck, ask at an e-Sevai / CSC centre." },
      action: (
        <Link href={`/documents?remind=${encodeURIComponent(s.title.ta)}#reminders`} className="inline-flex min-h-12 items-center rounded-xl border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "⏰ நினைவூட்டல் அமை", en: "⏰ Set a reminder" }} />
        </Link>
      ),
    },
  ];

  return (
    <article style={{ ["--accent" as string]: tp.color }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <TrackView type="scheme" id={s.id} tags={[...s.needs, s.category]} />

      <PageHero
        topic={s.category}
        crumb={{ href: "/schemes", label: { ta: "திட்டங்கள்", en: "Schemes" } }}
        kicker={cat.name}
        title={s.title}
        intro={s.benefit}
        badges={
          <>
            <span className="rounded-full bg-white px-3 py-0.5 font-display text-sm font-semibold text-ink">{s.level === "central" ? <T v={{ ta: "மத்திய அரசு", en: "Central" }} /> : <T v={{ ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }} />}</span>
            <VerifyBadge date={s.lastVerified} />
          </>
        }
        actions={
          <>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-display text-base font-semibold text-ink hover:bg-sun">
              <T v={{ ta: "அதிகாரப்பூர்வ தளம்", en: "Official site" }} /> · {host} ↗
            </a>
            <SaveButton id={s.id} />
            <ListenText parts={[s.title, s.benefit, s.apply]} />
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <SectionNav
          items={[
            { id: "who", label: { ta: "யார்?", en: "Who" } },
            { id: "docs", label: { ta: "ஆவணங்கள்", en: "Documents" } },
            { id: "apply", label: { ta: "எப்படி?", en: "How" } },
          ]}
        />

        <p className="mb-10 max-w-3xl text-ink-soft">
          <span className="font-bold text-ink">
            <T v={{ ta: "துறை: ", en: "Department: " }} />
          </span>
          <T v={s.dept} />
        </p>

        {s.note && (
          <p role="note" className="mb-12 rounded-xl border-2 border-dashed border-brand bg-sun-tint p-4 text-base">
            ⚠ <T v={s.note} />
          </p>
        )}

        <div className="space-y-24">
          <Section id="who" title={{ ta: "யார் விண்ணப்பிக்கலாம்?", en: "Who can apply?" }} hint={{ ta: "ஒவ்வொரு அட்டையும் உங்கள் சுயவிவரத்துடன் ஒப்பிடப்படுகிறது – உங்கள் போனிலேயே.", en: "Each card is compared with your profile – on your own device." }}>
            <EligibilitySection scheme={s} />
          </Section>

          <Section id="docs" title={{ ta: "தேவையான ஆவணங்கள்", en: "Documents you need" }} hint={{ ta: "இருப்பதைத் தட்டிக் குறியுங்கள்; குறைவதற்கு எப்படிப் பெறுவது என்று காட்டுவோம்.", en: "Tap what you already have; we will show how to get the rest." }}>
            <DocWallet ids={s.docs} />
          </Section>

          <Section id="apply" title={{ ta: "எப்படி விண்ணப்பிப்பது?", en: "How to apply" }} hint={{ ta: "ஏஜெண்ட்டுகளுக்குக் கூடுதல் பணம் தேவையில்லை – அதிகாரப்பூர்வ வழி இலவசம் அல்லது அரசு நிர்ணயித்த கட்டணம் மட்டுமே.", en: "No need to pay agents extra – the official route is free or at the government-fixed fee." }}>
            <StepTimeline steps={steps} accent={tp.color} />
          </Section>
        </div>

        <Reveal className="mt-24 border-t border-line pt-8">
          <details>
            <summary className="min-h-11 cursor-pointer font-display text-lg font-semibold">
              <T v={{ ta: "இந்தத் தகவல் பழையதா? தெரிவியுங்கள்", en: "Is this information outdated? Tell us" }} />
            </summary>
            <div className="mt-4 max-w-xl">
              <ReportForm target={s.id} />
            </div>
          </details>
          <p className="mt-4 text-sm text-ink-soft">
            <T v={{ ta: "இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல. இறுதி விதிகள், கட்டணம் அரசுத் தளத்தில் உறுதிசெய்யப்பட வேண்டும்.", en: "This is not an official government site. Final rules and fees must be confirmed on the official site." }} />
          </p>
        </Reveal>
      </div>
    </article>
  );
}
