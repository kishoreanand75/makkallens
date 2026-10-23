import Link from "next/link";
import { BgIcon } from "@/components/ui/Watermark";
import { LogoMark } from "@/components/Logo";
import { T } from "@/lib/lang";
import { sections } from "@/lib/sections";

const legal = [
  { href: "/terms", label: { ta: "விதிமுறைகள் & மறுப்பு", en: "Terms & disclaimer" } },
  { href: "/privacy", label: { ta: "தனியுரிமை", en: "Privacy Policy" } },
  { href: "/pricing", label: { ta: "கட்டணத் திட்டங்கள்", en: "Pricing" } },
];

const promises = [
  { l: { ta: "இணைப்புகள்", en: "Links" }, v: { ta: "அதிகாரப்பூர்வ தளத்துக்கு", en: "Official sites only" } },
  { l: { ta: "உங்கள் தகவல்", en: "Your data" }, v: { ta: "உங்கள் சாதனத்தில் மட்டும்", en: "Stays on your device" } },
  { l: { ta: "ஆதார் / பான் / OTP", en: "Aadhaar / PAN / OTP" }, v: { ta: "கேட்கவே மாட்டோம்", en: "Never asked" } },
];

const contacts = [
  {
    k: { ta: "அவசர உதவி", en: "Emergency" },
    v: { ta: "112", en: "112" },
    href: "tel:112",
    tone: "bg-alert",
    d: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z",
    fill: true,
  },
  { k: { ta: "பிழை / பழைய தகவலைத் தெரிவிக்க", en: "Report a mistake or old information" }, v: { ta: "தொடர்பு படிவம்", en: "Contact form" }, href: "/contact", tone: "bg-info", d: "M4 6h16v12H4zM4 7l8 6 8-6", fill: false },
  { k: { ta: "தமிழ்நாடு அரசு (அதிகாரப்பூர்வ)", en: "Tamil Nadu Government (official)" }, v: { ta: "www.tn.gov.in", en: "www.tn.gov.in" }, href: "https://www.tn.gov.in", tone: "bg-warn", d: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", fill: false },
];

const Chevron = () => (
  <svg viewBox="0 0 24 24" className="mt-1.5 size-3 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const LinkList = ({ items, label }: { items: typeof sections; label: string }) => (
  <ul aria-label={label} className="mt-4 space-y-0.5">
    {items.map((s) => (
      <li key={s.href}>
        <Link href={s.href} className="inline-flex min-h-10 items-start gap-2 py-2 text-base leading-snug text-ink-soft hover:text-brand">
          <Chevron />
          <T v={s.name} />
        </Link>
      </li>
    ))}
  </ul>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-2 font-display text-lg font-bold">
    <span aria-hidden="true" className="h-5 w-1 rounded bg-gold" />
    {children}
  </h2>
);

const half = Math.ceil(sections.length / 2);

export function Footer() {
  return (
    <footer className="mt-12 print:hidden">
      <div className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-6 sm:px-6">
          <span aria-hidden="true" className="grid size-14 place-items-center rounded-xl bg-white/15">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19a3 3 0 0 1-3 3h-3" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold sm:text-2xl">
              <T v={{ ta: "எந்த அரசு சேவையிலும் உதவி வேண்டுமா?", en: "Need help with any government service?" }} />
            </p>
            <p className="text-white/85">
              <T v={{ ta: "தமிழில் தட்டச்சு செய்யுங்கள் அல்லது பேசுங்கள் – உடனே வழி சொல்கிறோம்.", en: "Type or speak in Tamil – we show the way right away." }} />
            </p>
          </div>
          <Link href="/ask" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 font-display text-base font-semibold text-ink hover:bg-white">
            <T v={{ ta: "இப்போது கேளுங்கள்", en: "Ask now" }} /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white">
        <BgIcon name="shield" className="right-[8%] top-10 hidden size-24 text-brand/15 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6 lg:pb-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.1fr_1.15fr_1.15fr_1.1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <LogoMark className="size-14 shrink-0" />
                <span className="font-display text-2xl font-bold leading-none text-brand">
                  MakkalLens
                  <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-soft"><T v={{ ta: "அரசு வழிகாட்டி", en: "Government guide" }} /></span>
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-base text-ink-soft">
                <T
                  v={{
                    ta: "அரசுத் திட்டங்கள், சான்றிதழ்கள், வேலை, கல்வி – என்ன கிடைக்கும், என்ன ஆவணம் வேண்டும், எப்படி விண்ணப்பிப்பது என்பதைத் தமிழில் படிப்படியாகச் சொல்லும் தனியார் வழிகாட்டி.",
                    en: "An independent guide that explains, step by step in Tamil, which schemes and certificates you can get, which documents you need and how to apply.",
                  }}
                />
              </p>
            </div>
            <nav aria-label="Sections">
              <Heading>
                <T v={{ ta: "பகுதிகள்", en: "Sections" }} />
              </Heading>
              <LinkList items={sections.slice(0, half)} label="Sections 1" />
            </nav>
            <nav aria-label="More sections">
              <Heading>
                <T v={{ ta: "மேலும்", en: "More" }} />
              </Heading>
              <LinkList items={sections.slice(half)} label="Sections 2" />
            </nav>
            <div>
              <Heading>
                <T v={{ ta: "எங்கள் உறுதி", en: "Our promises" }} />
              </Heading>
              <ul className="mt-4 divide-y divide-line rounded-2xl bg-tint px-4">
                {promises.map((p) => (
                  <li key={p.l.en} className="py-3 text-base">
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-brand" />
                      <T v={p.l} />
                    </span>
                    <span className="mt-0.5 block pl-[1.15rem] font-semibold">
                      <T v={p.v} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Contact">
            {contacts.map((c) => (
              <li key={c.k.en}>
                <a
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-full items-center gap-4 rounded-2xl bg-tint p-4 hover:bg-white hover:outline hover:outline-2 hover:outline-brand"
                >
                  <span aria-hidden="true" className={`grid size-12 shrink-0 place-items-center rounded-xl text-white ${c.tone}`}>
                    <svg viewBox="0 0 24 24" className="size-6" fill={c.fill ? "currentColor" : "none"} stroke={c.fill ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={c.d} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      <T v={c.k} />
                    </span>
                    <span className="block font-display text-lg font-bold [overflow-wrap:anywhere]">
                      <T v={c.v} />
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-4xl border-l-4 border-gold bg-gold-tint p-3 text-sm text-ink-soft">
            <strong className="text-ink">
              <T v={{ ta: "இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல. ", en: "This is not an official government website. " }} />
            </strong>
            <T
              v={{
                ta: "நாங்கள் வழிகாட்டி மட்டுமே. விண்ணப்பம், கட்டணம் எல்லாம் அந்தந்த அரசுத் துறையின் அதிகாரப்பூர்வ தளத்தில்தான். ஆதார், பான் எண்கள், OTP, கடவுச்சொல் எதையும் இங்கே சேமிக்கவோ கேட்கவோ மாட்டோம். AI பதில்கள் அரசின் அதிகாரப்பூர்வ முடிவு அல்ல.",
                en: "We are a guide only. Applications and payments happen on each department's official site. We never store or ask for Aadhaar or PAN numbers, OTPs or passwords. AI answers are not official government decisions.",
              }}
            />
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line pt-4 text-sm text-ink-soft">
            <p>
              © 2026 <strong className="text-ink">MakkalLens</strong>. <T v={{ ta: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.", en: "All rights reserved." }} />
            </p>
            <ul className="flex flex-wrap items-center" aria-label="Legal">
              {legal.map((l, i) => (
                <li key={l.href} className={i > 0 ? "border-l border-line pl-3 pr-3" : "pr-3"}>
                  <Link href={l.href} className="inline-flex min-h-10 items-center text-ink hover:text-brand hover:underline">
                    <T v={l.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p aria-hidden="true" className="pointer-events-none select-none overflow-hidden whitespace-nowrap pb-2 text-center font-display text-[17vw] font-extrabold leading-[0.85] tracking-tight text-brand/[0.08] lg:text-[13rem]">
          MakkalLens
        </p>
      </div>
    </footer>
  );
}
