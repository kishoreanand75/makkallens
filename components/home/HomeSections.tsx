import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { BgIcon, Watermark } from "@/components/ui/Watermark";
import { TopicCarousel } from "@/components/home/TopicCarousel";
import { topics } from "@/lib/categories";
import { exams, helplines, schemes, districts } from "@/lib/data";
import { T } from "@/lib/lang";
import { dataMeta, tnCm, tnMinisters } from "@/lib/people";
import { services } from "@/lib/services";

const Heading = ({ kicker, title, sub }: { kicker?: { ta: string; en: string }; title: { ta: string; en: string }; sub?: { ta: string; en: string } }) => (
  <Reveal>
    {kicker && (
      <p className="mb-1 flex items-center gap-2 font-display text-base font-semibold text-brand">
        <span aria-hidden="true" className="h-4 w-1.5 bg-gold" />
        <T v={kicker} />
      </p>
    )}
    <h2 className="max-w-3xl text-2xl sm:text-4xl">
      <T v={title} />
    </h2>
    {sub && (
      <p className="mt-2 max-w-2xl text-lg text-ink-soft">
        <T v={sub} />
      </p>
    )}
  </Reveal>
);

/* ---------- Top 50 teaser ---------- */
export function Top50Heading() {
  return (
    <Heading
      kicker={{ ta: "தமிழ்நாடு", en: "Tamil Nadu" }}
      title={{ ta: "அதிகம் தேவைப்படும் சேவைகள் & திட்டங்கள்", en: "Most needed services & schemes" }}
      sub={{ ta: "மக்கள் அதிகம் தேடுவவை முதலில் – முழுப் பட்டியல் 50.", en: "What people need most comes first – full list of 50." }}
    />
  );
}

/* ---------- how it works ---------- */
const steps = [
  { n: "1", t: { ta: "30 வினாடிச் சுயவிவரம்", en: "A 30-second profile" }, d: { ta: "வயது, மாவட்டம், தொழில், வருமானம் – ஒரு நேரத்தில் ஒரு கேள்வி. பதிவு தேவையில்லை.", en: "Age, district, work, income – one question at a time. No sign-up." } },
  { n: "2", t: { ta: "உங்களுக்குப் பொருந்துவது", en: "What fits you" }, d: { ta: "பொருத்தம் %, குறையும் ஆவணங்கள், அடுத்த படி – விதிகளின் அடிப்படையில்.", en: "Match %, missing documents and the next step – based on rules." } },
  { n: "3", t: { ta: "ஆவணங்களைச் சேமியுங்கள்", en: "Save the documents you hold" }, d: { ta: "இடப்பக்கம் உள்ள ‘என் ஆவணங்கள்’ பொத்தானில் உங்களிடம் உள்ளவற்றைக் குறியுங்கள்; ஒவ்வொரு திட்டத்திலும் எவை தயார் என்று காட்டுவோம்.", en: "Tick what you hold in the ‘My documents’ button on the left; every scheme then shows what is ready." } },
];

export function HowSection() {
  return (
    <section id="how" className="relative overflow-hidden bg-tint px-4 py-10 sm:px-6 sm:py-12">
      <Watermark text="3" className="-right-2 -top-8 text-[16rem] text-brand/[0.07]" />
      <BgIcon name="doc" className="bottom-4 left-[40%] hidden size-24 text-brand/15 md:block" />
      <div className="relative mx-auto max-w-6xl">
        <Heading kicker={{ ta: "எப்படி வேலை செய்கிறது", en: "How it works" }} title={{ ta: "மூன்று படிகளில்", en: "In three steps" }} />
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.1}>
              <div className="flex h-full gap-4 rounded-xl border-2 border-ink bg-white p-4">
                <span className={`grid size-11 shrink-0 place-items-center font-display text-xl font-semibold text-white ${["bg-brand", "bg-info", "bg-warn"][i]}`}>{s.n}</span>
                <div>
                  <h3 className="text-lg sm:text-xl">
                    <T v={s.t} />
                  </h3>
                  <p className="mt-1 text-base text-ink-soft">
                    <T v={s.d} />
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- sections carousel (10 of the 12; the rest are under "view all") ---------- */
const carouselTopics = ["schemes", "documents", "jobs", "education", "agriculture", "health", "women", "seniors", "business", "emergency"] as const;

export function TopicsSection() {
  const count = (cat: string) => schemes.filter((s) => s.category === cat).length;
  const counts: Record<string, { ta: string; en: string } | undefined> = {
    schemes: { ta: `${schemes.length} திட்டங்கள்`, en: `${schemes.length} schemes` },
    documents: { ta: `${services.length} வழிகாட்டிகள்`, en: `${services.length} guides` },
    jobs: { ta: `${exams.length} தேர்வுகள்`, en: `${exams.length} exams` },
    education: { ta: `${count("education")} திட்டங்கள்`, en: `${count("education")} schemes` },
    agriculture: { ta: `${count("agriculture")} திட்டங்கள்`, en: `${count("agriculture")} schemes` },
    health: { ta: `${count("health")} திட்டங்கள்`, en: `${count("health")} schemes` },
    women: { ta: `${count("women")} திட்டங்கள்`, en: `${count("women")} schemes` },
    seniors: { ta: `${count("seniors")} திட்டங்கள்`, en: `${count("seniors")} schemes` },
    business: { ta: `${count("business")} திட்டங்கள்`, en: `${count("business")} schemes` },
    bills: { ta: "6 இணைப்புகள்", en: "6 links" },
    emergency: { ta: `${helplines.length} உதவி எண்கள்`, en: `${helplines.length} helplines` },
    government: { ta: `${tnMinisters.length + 1} அமைச்சர்கள்`, en: `${tnMinisters.length + 1} ministers` },
  };
  return (
    <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12">
      <Watermark text="12" className="-right-4 top-0 text-[14rem] text-brand/[0.06] sm:text-[20rem]" />
      <BgIcon name="leaf" className="left-[45%] top-6 hidden size-24 text-brand/15 md:block" />
      <div className="relative mx-auto max-w-6xl">
        <Heading kicker={{ ta: "முக்கியப் பகுதிகள்", en: "Main sections" }} title={{ ta: "என்ன உதவி வேண்டும்?", en: "What do you need help with?" }} sub={{ ta: "ஒரு பகுதியைத் தொடுங்கள் – தகுதி, ஆவணங்கள், விண்ணப்பம்.", en: "Open a section – eligibility, documents and applying." }} />
        <div className="mt-2">
          <TopicCarousel items={carouselTopics.map((id) => ({ topic: topics[id], count: counts[id] }))} />
        </div>
      </div>
    </section>
  );
}

/* ---------- voice ---------- */
export function VoiceBand() {
  return (
    <section className="relative overflow-hidden border-y-2 border-ink bg-info-tint px-4 py-10 sm:px-6 sm:py-12">
      <Watermark text="குரல்" className="-left-4 -top-4 text-[9rem] text-info/[0.07] sm:text-[14rem]" />
      <BgIcon name="mic" className="bottom-6 left-[52%] hidden size-28 text-info/20 md:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-[1.4fr_1fr]">
        <Reveal variant="left">
          <p className="mb-1 flex items-center gap-2 font-display text-base font-semibold">
            <span aria-hidden="true" className="h-4 w-1.5 bg-info" />
            <T v={{ ta: "குரல் உதவியாளர்", en: "Voice assistant" }} />
          </p>
          <h2 className="text-2xl sm:text-4xl">
            <T v={{ ta: "தட்டச்சு வேண்டாம் – பேசுங்கள்", en: "No typing – just speak" }} />
          </h2>
          <p className="mt-3 max-w-xl text-lg">
            <T v={{ ta: "‘பிறப்புச் சான்றிதழ் எப்படி எடுப்பது?’ என்று தமிழில் கேளுங்கள். பதிலை எழுத்திலும் குரலிலும் பெறுங்கள்.", en: "Ask ‘how do I get a birth certificate?’ in Tamil. Get the answer as text and in a voice." }} />
          </p>
          <ul className="mt-4 space-y-1.5">
            {[
              { ta: "ஆவணங்கள், கட்டணம், நாட்கள் – உடனடிப் பதில்", en: "Documents, fees, days – instant answers" },
              { ta: "ஒவ்வொரு பதிலிலும் அதிகாரப்பூர்வ இணைப்பு", en: "An official link in every answer" },
              { ta: "முதலமைச்சர், அமைச்சர் பற்றியும் கேட்கலாம்", en: "Ask about the Chief Minister and ministers too" },
            ].map((x) => (
              <li key={x.en} className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 font-bold text-info">✓</span>
                <T v={x} />
              </li>
            ))}
          </ul>
          <Link href="/ask" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-info px-6 font-display text-lg font-semibold text-white hover:bg-ink">
            <T v={{ ta: "கேட்கத் தொடங்குங்கள்", en: "Start asking" }} /> <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Reveal variant="right" className="relative mx-auto aspect-[4/3] w-full max-w-sm">
          <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full rounded-xl bg-info" />
          <div className="relative size-full overflow-hidden rounded-xl border-2 border-ink">
            <Image src="/cats/csc.webp" alt="சேவை மையத்தில் முதியவருக்கு உதவும் இளைஞர்" fill sizes="24rem" className="object-cover object-[50%_25%]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- government ---------- */
export function GovBand() {
  const stats = [
    { n: tnMinisters.length + 1, l: { ta: "அமைச்சர்கள்", en: "Ministers" } },
    { n: districts.length, l: { ta: "மாவட்டங்கள்", en: "Districts" } },
    { n: schemes.length, l: { ta: "திட்டங்கள்", en: "Schemes" } },
    { n: helplines.length, l: { ta: "உதவி எண்கள்", en: "Helplines" } },
  ];
  return (
    <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-12">
      <Watermark text="அரசு" className="-right-6 bottom-0 text-[12rem] text-info/[0.07] sm:text-[18rem]" />
      <BgIcon name="shield" className="left-[48%] top-4 hidden size-24 text-info/20 md:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal variant="left">
          <Heading kicker={{ ta: "உங்கள் அரசு, உங்கள் தலைவர்கள்", en: "Your government, your leaders" }} title={{ ta: "முதலமைச்சர் முதல் வார்டு கவுன்சிலர் வரை", en: "From the Chief Minister to your ward councillor" }} sub={{ ta: "யார் என்ன பொறுப்பில் இருக்கிறார்கள், எந்தத் துறை என்ன செய்கிறது – ஆதாரத்துடன் மட்டும்.", en: "Who holds which office and what each department does – only with sources." }} />
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l.en} className="border-l-4 border-info bg-info-tint py-2 pl-3">
                <dd className="font-display text-3xl font-semibold text-info sm:text-4xl">
                  <CountUp to={s.n} />
                </dd>
                <dt className="text-base text-ink-soft">
                  <T v={s.l} />
                </dt>
              </div>
            ))}
          </dl>
          <Link href="/leaders" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-info px-6 font-display text-lg font-semibold text-white hover:bg-ink">
            <T v={{ ta: "தமிழ்நாடு அரசை அறிய", en: "Explore the Tamil Nadu government" }} /> <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Reveal variant="right" className="mx-auto w-full max-w-[16rem]">
          <Link href="/leaders" className="group block overflow-hidden rounded-xl border-2 border-ink bg-white hover:border-brand">
            <div className="relative aspect-[4/5] border-b-2 border-ink">
              <Image src="/photos/cm-tn.jpg" alt={tnCm.name.en} fill sizes="256px" className="object-cover object-top" />
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-semibold text-info">
                <T v={{ ta: "முதலமைச்சர்", en: "Chief Minister" }} />
              </p>
              <p className="font-display text-xl leading-snug">
                <T v={tnCm.name} />
              </p>
              <p className="text-sm text-ink-soft">
                <T v={tnCm.party} /> · {tnCm.since}
              </p>
            </div>
          </Link>
          <p className="mt-2 text-center text-xs text-ink-soft">
            <T v={{ ta: `தகவல் ${dataMeta.asOf} நிலவரம் · புகைப்படம்: Wikimedia Commons`, en: `Information as of ${dataMeta.asOf} · Photo: Wikimedia Commons` }} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- trust + final CTA ---------- */
const trust = [
  { t: { ta: "அதிகாரப்பூர்வ இணைப்பு மட்டுமே", en: "Official links only" }, d: { ta: "ஒவ்வொரு பதிலும் அரசுத் துறையின் தளத்துக்கு நேரடி இணைப்புடன். ஏஜெண்ட் தேவையில்லை.", en: "Every answer links straight to the department's own site. No agents needed." } },
  { t: { ta: "சரிபார்ப்பு நிலை தெரியும்", en: "You can see how fresh it is" }, d: { ta: "‘சரிபார்க்கப்பட்டது’ அல்லது ‘சரிபார்ப்பு நிலுவை’ – எதையும் மறைக்க மாட்டோம். பழைய தகவலைத் தெரிவிக்கலாம்.", en: "‘Verified’ or ‘verification pending’ – we hide nothing. You can report anything outdated." } },
  { t: { ta: "உங்கள் தகவல் உங்கள் போனில்", en: "Your data stays on your phone" }, d: { ta: "சுயவிவரம், ஆவணப் பட்டியல், தேடல் வரலாறு உங்கள் சாதனத்திலேயே. ஆதார், பான் எண்களை நாங்கள் கேட்கவே மாட்டோம்.", en: "Profile, document list and history stay on your device. We never ask for Aadhaar or PAN numbers." } },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 pb-12 pt-10 sm:px-6">
      <BgIcon name="heart" className="right-6 top-6 hidden size-24 text-brand/15 md:block" />
      <div className="relative mx-auto max-w-6xl">
        <Heading title={{ ta: "நம்பிக்கைக்கு மூன்று உறுதிகள்", en: "Three promises you can rely on" }} />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {trust.map((x, i) => (
            <Reveal as="li" key={x.t.en} delay={i * 0.08}>
              <div className={`h-full rounded-xl border-2 border-line border-t-4 bg-white p-5 ${["border-t-brand", "border-t-info", "border-t-warn"][i]}`}>
                <h3 className="text-lg sm:text-xl">
                  <T v={x.t} />
                </h3>
                <p className="mt-2 text-base text-ink-soft">
                  <T v={x.d} />
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-8 rounded-xl bg-brand p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl">
                <T v={{ ta: "உங்களுக்கான முதல் படி, இன்றே.", en: "Your first step, today." }} />
              </h2>
              <p className="mt-1 text-white/90">
                <T v={{ ta: "ஆறு கேள்விகள். பதிவு இல்லை. உங்களுக்குப் பொருந்தும் திட்டங்கள் உடனே.", en: "Six questions. No sign-up. Your matching schemes straight away." }} />
              </p>
            </div>
            <Link href="/profile" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-gold px-6 font-display text-lg font-semibold text-ink hover:bg-white">
              <T v={{ ta: "தொடங்குங்கள்", en: "Get started" }} /> <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
