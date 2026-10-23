import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListenGuide } from "@/components/ListenGuide";
import { ReportForm } from "@/components/ReportForm";
import { Reveal } from "@/components/Reveal";
import { TrackView } from "@/components/TrackView";
import { VerifyBadge } from "@/components/VerifyBadge";
import { ServiceDocs } from "@/components/service/ServiceDocs";
import { Section } from "@/components/TopicShell";
import { PageHero } from "@/components/ui/PageHero";
import { SectionNav } from "@/components/ui/SectionNav";
import { StepTimeline } from "@/components/ui/StepTimeline";
import { topics, type EmblemId } from "@/lib/categories";
import { T } from "@/lib/lang";
import { getCategory, getService, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: `${s.name.ta} – ${s.name.en} | MakkalLens`, description: s.short.ta, alternates: { canonical: `/service/${s.slug}` } };
}

const factIcons = {
  fees: "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6",
  time: "M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  offline: "M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const cat = getCategory(s.category);
  const emblem: EmblemId = s.category === "driving" ? "driving" : s.category === "identity" ? "identity" : "certificates";
  const tp = topics[emblem];
  const host = new URL(s.officialUrl).host;

  const facts = [
    { k: "fees" as const, label: { ta: "கட்டணம்", en: "Fees" }, v: s.fees },
    { k: "time" as const, label: { ta: "ஆகும் நேரம்", en: "Time needed" }, v: s.time },
    { k: "offline" as const, label: { ta: "நேரில் செல்ல", en: "In person" }, v: s.offline },
  ];

  return (
    <article style={{ ["--accent" as string]: tp.color }}>
      <TrackView type="service" id={s.slug} tags={["docs", s.category]} />
      <PageHero
        topic={emblem}
        crumb={{ href: "/documents", label: { ta: "சான்றிதழ்கள் & ஆவணங்கள்", en: "Certificates & documents" } }}
        kicker={cat.name}
        title={s.name}
        intro={s.short}
        badges={
          <>
            <span className="rounded-full bg-white px-3 py-0.5 font-display text-sm font-semibold text-ink">
              <T v={s.scope} />
            </span>
            <VerifyBadge date={s.lastVerified} />
          </>
        }
        actions={
          <>
            <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-display text-base font-semibold text-ink hover:bg-sun">
              <T v={{ ta: "அதிகாரப்பூர்வ தளம்", en: "Official site" }} /> · {host} ↗
            </a>
            <ListenGuide service={s} />
          </>
        }
      />

      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <SectionNav
          items={[
            { id: "who", label: { ta: "யார்?", en: "Who" } },
            { id: "docs", label: { ta: "ஆவணங்கள்", en: "Documents" } },
            { id: "steps", label: { ta: "படிகள்", en: "Steps" } },
            { id: "facts", label: { ta: "கட்டணம் & நேரம்", en: "Fees & time" } },
          ]}
        />
        <p className="mb-10 max-w-3xl text-ink-soft">
          <span className="font-bold text-ink">
            <T v={{ ta: "பொறுப்பு: ", en: "Authority: " }} />
          </span>
          <T v={s.authority} />
        </p>

        <div className="space-y-24">
          <Section id="who" title={{ ta: "யார் விண்ணப்பிக்கலாம்?", en: "Who can apply?" }}>
            <p className="rounded-xl border-l-4 border-accent bg-accent/10 p-6 text-xl leading-relaxed">
              <T v={s.who} />
            </p>
          </Section>

          <Section id="docs" title={{ ta: "கொண்டு செல்ல வேண்டிய ஆவணங்கள்", en: "Documents to carry" }} hint={{ ta: "உங்களிடம் உள்ளதைத் தட்டிக் குறியுங்கள்.", en: "Tap the ones you already have." }}>
            <ServiceDocs slug={s.slug} docs={s.documents} />
          </Section>

          <Section id="steps" title={{ ta: "படிப்படியாக", en: "Step by step" }}>
            <StepTimeline steps={s.steps} accent={tp.color} />
          </Section>

          <Section id="facts" title={{ ta: "கட்டணம், நேரம், நேரில் செல்ல", en: "Fees, time and visiting in person" }}>
            <ul className="grid gap-4 md:grid-cols-3">
              {facts.map((f, i) => (
                <Reveal as="li" key={f.k} delay={i * 0.1} variant="scale">
                  <div className="h-full rounded-xl border-2 border-line bg-paper-2 p-6">
                    <svg viewBox="0 0 24 24" className="size-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={factIcons[f.k]} />
                    </svg>
                    <h3 className="mt-3 text-xl">
                      <T v={f.label} />
                    </h3>
                    <p className="mt-1 text-ink-soft">
                      <T v={f.v} />
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Section>

          <Section title={{ ta: "கவனத்தில் கொள்ள", en: "Good to know" }}>
            <ul className="grid gap-4 md:grid-cols-2">
              {s.tips.map((t, i) => (
                <Reveal as="li" key={i} delay={i * 0.08}>
                  <p className="h-full rounded-xl bg-brand p-6 text-white/90">
                    <span aria-hidden="true" className="mb-2 block text-2xl text-brand">
                      ✦
                    </span>
                    <T v={t} />
                  </p>
                </Reveal>
              ))}
            </ul>
          </Section>

          {s.faqs.length > 0 && (
            <Section title={{ ta: "அடிக்கடி கேட்கப்படுவது", en: "Common questions" }}>
              <div className="divide-y divide-line rounded-xl border-2 border-line bg-paper-2">
                {s.faqs.map((f, i) => (
                  <details key={i} className="group p-5">
                    <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-display text-lg font-semibold">
                      <T v={f.q} />
                      <span aria-hidden="true" className="text-2xl transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-ink-soft">
                      <T v={f.a} />
                    </p>
                  </details>
                ))}
              </div>
            </Section>
          )}
        </div>

        <Reveal className="mt-24 overflow-hidden rounded-[2rem] bg-brand p-8 text-white sm:p-10" variant="scale">
          <h2 className="text-2xl sm:text-3xl">
            <T v={{ ta: "இன்னும் சந்தேகமா?", en: "Still unsure?" }} />
          </h2>
          <p className="mt-2 text-white/75">
            <T v={{ ta: "உங்கள் நிலைமையைச் சொல்லுங்கள் – குரலிலும் கேட்கலாம்.", en: "Tell us your situation – you can ask by voice too." }} />
          </p>
          <Link href={`/ask?q=${encodeURIComponent(s.name.ta)}`} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-sun px-6 font-display text-lg font-semibold text-ink hover:bg-white">
            <T v={{ ta: "உதவியாளரிடம் கேளுங்கள் →", en: "Ask the assistant →" }} />
          </Link>
        </Reveal>

        <Reveal className="mt-14 border-t border-line pt-8">
          <details>
            <summary className="min-h-11 cursor-pointer font-display text-lg font-semibold">
              <T v={{ ta: "இந்தத் தகவல் பழையதா? தெரிவியுங்கள்", en: "Is this information outdated? Tell us" }} />
            </summary>
            <div className="mt-4 max-w-xl">
              <ReportForm target={`service:${s.slug}`} />
            </div>
          </details>
        </Reveal>
      </div>
    </article>
  );
}
