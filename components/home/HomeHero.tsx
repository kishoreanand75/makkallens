import Image from "next/image";
import Link from "next/link";
import { AskBox } from "@/components/AskBox";
import { BgIcon, Watermark } from "@/components/ui/Watermark";
import { schemes } from "@/lib/data";
import { T } from "@/lib/lang";

const examples = [
  { ta: "சாதிச் சான்றிதழ் எப்படி எடுப்பது?", en: "How to get a community certificate?" },
  { ta: "மகளிர் உரிமைத் தொகை யாருக்கு?", en: "Who gets Magalir Urimai?" },
  { ta: "பட்டா சிட்டா பார்ப்பது எப்படி?", en: "How to see patta / chitta?" },
  { ta: "முதலமைச்சர் யார்?", en: "Who is the Chief Minister?" },
];

/** Premium landing hero: solid deep-green stage, large photograph with floating fact cards, and a white ask card. */
export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      <Watermark text="அரசு" className="-bottom-10 -left-4 text-[11rem] text-white/[0.06] sm:text-[20rem]" />
      <Watermark text="வழி" className="-top-6 right-2 hidden text-[14rem] text-white/[0.05] lg:block" />
      <BgIcon name="doc" className="left-[46%] top-10 hidden size-28 text-white/15 lg:block" />
      <BgIcon name="rupee" className="bottom-8 left-[44%] hidden size-24 text-white/15 lg:block" />
      <BgIcon name="shield" className="right-10 top-1/2 hidden size-28 text-white/10 xl:block" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-white/90 lg:aspect-[4/5]">
            <Image src="/cats/welfare.webp" alt="நியாய விலைக் கடையில் அரிசிப் பையைப் பெறும் பெண்" fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-[50%_25%]" />
          </div>
          <div className="absolute -right-2 top-5 rounded-xl border-t-4 border-gold bg-white p-3 text-ink shadow-[0_10px_30px_rgb(0_0_0/0.3)] sm:-right-5">
            <p className="font-display text-3xl font-bold leading-none text-brand">50</p>
            <p className="mt-1 text-sm font-semibold">
              <T v={{ ta: "முக்கிய சேவைகள்", en: "Key services" }} />
            </p>
          </div>
          <div className="absolute -left-2 bottom-12 rounded-xl border-t-4 border-gold bg-white p-3 text-ink shadow-[0_10px_30px_rgb(0_0_0/0.3)] sm:-left-5">
            <p className="font-display text-3xl font-bold leading-none text-warn">{schemes.length}</p>
            <p className="mt-1 text-sm font-semibold">
              <T v={{ ta: "அரசுத் திட்டங்கள்", en: "Government schemes" }} />
            </p>
          </div>
          <p className="mt-3 text-xs text-white/80">
            <T v={{ ta: "படம் AI மூலம் உருவாக்கப்பட்ட எடுத்துக்காட்டு.", en: "Picture is an AI-generated illustration." }} />
          </p>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <p className="fade-up mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1 font-display text-sm font-semibold sm:text-base">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-gold" />
            <T v={{ ta: "தமிழ்நாடு முதலில் · பின்னர் இந்தியா முழுவதும்", en: "Tamil Nadu first · then all of India" }} />
          </p>
          <h1 className="text-[2.1rem] leading-[1.2] sm:text-5xl lg:text-[3.2rem]">
            <span className="line-mask">
              <span style={{ ["--d" as string]: "0.1s" }}>
                <T v={{ ta: "அரசு சேவை எதுவானாலும்,", en: "Whatever the government service," }} />
              </span>
            </span>
            <span className="line-mask">
              <span style={{ ["--d" as string]: "0.25s" }} className="text-[#8be0ae]">
                <T v={{ ta: "வழி சொல்கிறோம்.", en: "we show you the way." }} />
              </span>
            </span>
          </h1>
          <p className="fade-up mt-4 max-w-xl text-lg text-white/90" style={{ ["--d" as string]: "0.4s" }}>
            <T v={{ ta: "சான்றிதழ், திட்டம், வேலை, கல்வி – என்ன கிடைக்கும், என்ன ஆவணம் வேண்டும், எப்படி விண்ணப்பிப்பது என்பதைத் தமிழில், குரலுடன், படிப்படியாக.", en: "Certificates, schemes, jobs, education – what you can get, which documents you need and how to apply, in plain Tamil with voice, step by step." }} />
          </p>
          <div className="fade-up mt-6 rounded-2xl bg-white p-4 text-ink shadow-[0_20px_50px_rgb(0_0_0/0.3)] sm:p-5" style={{ ["--d" as string]: "0.5s" }}>
            <p className="mb-3 font-display text-lg font-semibold">
              <T v={{ ta: "உங்கள் கேள்வியைக் கேளுங்கள்", en: "Ask your question" }} />
            </p>
            <AskBox examples={examples} />
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/popular" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-gold px-5 font-display text-base font-semibold text-ink hover:bg-ink hover:text-white">
                <T v={{ ta: "அதிகம் தேவைப்படும் 50", en: "The 50 most needed" }} /> <span aria-hidden="true">→</span>
              </Link>
              <Link href="/profile" className="inline-flex min-h-12 items-center rounded-lg border-2 border-ink px-5 font-display text-base font-semibold hover:bg-tint">
                <T v={{ ta: "எனக்கான திட்டங்கள்", en: "My schemes" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
