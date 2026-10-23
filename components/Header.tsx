"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, useLang } from "@/lib/lang";
import { LogoMark } from "./Logo";
import { LargeTextToggle } from "./LargeText";

const nav = [
  { href: "/popular", label: { ta: "முதல் 50", en: "Top 50" } },
  { href: "/schemes", label: { ta: "திட்டங்கள்", en: "Schemes" } },
  { href: "/documents", label: { ta: "ஆவணங்கள்", en: "Documents" } },
  { href: "/leaders", label: { ta: "அரசு", en: "Government" } },
  { href: "/ask", label: { ta: "கேளுங்கள்", en: "Ask" } },
  { href: "/explore", label: { ta: "மேலும்", en: "More" } },
];

/** Slim notice strip (scrolls away) + a floating, rounded white header bar: logo, centred links, emergency number, Ask button. */
export function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  return (
    <>
      <div className="bg-tint text-ink print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-1 text-sm sm:px-6">
          <p className="min-w-0 flex-1 truncate font-semibold">
            <T v={{ ta: "இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல – வழிகாட்டி மட்டுமே", en: "Not an official government website – a guide only" }} />
          </p>
          <LargeTextToggle />
          <button
            type="button"
            onClick={() => setLang(lang === "ta" ? "en" : "ta")}
            className="min-h-9 rounded border-2 border-ink px-3 font-display text-sm font-semibold hover:bg-white"
            aria-label={lang === "ta" ? "EN – Switch to English" : "தமிழ் – தமிழுக்கு மாற்றவும்"}
          >
            {lang === "ta" ? "EN" : "தமிழ்"}
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white px-2 py-2 sm:px-4 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-line bg-white py-2 pl-4 pr-2 shadow-[0_8px_30px_rgb(0_0_0/0.10)] sm:pl-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <LogoMark className="size-12 shrink-0" />
            <span className="whitespace-nowrap font-display text-xl font-bold leading-none text-brand">
              MakkalLens
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-soft"><T v={{ ta: "அரசு வழிகாட்டி", en: "Government guide" }} /></span>
              <span className="sr-only"> – {lang === "ta" ? "முகப்பு" : "home"}</span>
            </span>
          </Link>
          <nav aria-label="Main" className="mx-auto hidden items-center gap-1 lg:flex">
            {nav.map((n) => {
              const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href + "/"));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative min-h-11 content-center px-3 font-display text-base font-semibold hover:text-brand ${active ? "text-brand after:absolute after:inset-x-3 after:bottom-1 after:h-1 after:rounded after:bg-gold" : "text-ink/80"}`}
                >
                  <T v={n.label} />
                </Link>
              );
            })}
          </nav>
          <a href="tel:112" className="ml-auto hidden min-h-11 items-center gap-2 whitespace-nowrap px-2 font-display text-base font-semibold text-ink/80 hover:text-brand xl:inline-flex">
            <svg viewBox="0 0 24 24" className="size-5 text-brand" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z" />
            </svg>
            <span className="sr-only">
              <T v={{ ta: "அவசர உதவி", en: "Emergency" }} />{" "}
            </span>
            112
          </a>
          <Link href="/ask" className="ml-auto inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-5 font-display text-base font-semibold text-white shadow-[0_8px_20px_rgb(10_107_61/0.35)] hover:bg-brand-dark xl:ml-0">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
            <T v={{ ta: "கேளுங்கள்", en: "Ask us" }} />
          </Link>
        </div>
      </header>
    </>
  );
}
