"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { T } from "@/lib/lang";
import type { L, Scheme } from "@/lib/data";
import { useProfile } from "@/lib/hooks";
import { matchScheme, type CheckState } from "@/lib/match";
import { communityOptions, occupationOptions, profileProgress } from "@/lib/profile";

const icons: Record<string, string> = {
  age: "M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  gender: "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 22v-5a6 6 0 0 1 12 0v5",
  occupation: "M3 8h18v12H3zM8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18",
  income: "M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6",
  community: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M17 11a3 3 0 1 0-1-5.8M21 20v-1a4 4 0 0 0-3-3.9",
  open: "M5 12l5 5L20 7",
};

// green = you meet it, yellow = not sure yet, black = does not fit. Text and a mark always accompany the colour.
const stateStyle: Record<CheckState, { box: string; chip: string; label: L; mark: string }> = {
  met: { box: "border-brand", chip: "bg-brand text-white", label: { ta: "பொருந்துகிறது", en: "You meet this" }, mark: "✓" },
  unknown: { box: "border-warn", chip: "bg-warn-tint text-warn", label: { ta: "உறுதியில்லை", en: "Not sure" }, mark: "?" },
  failed: { box: "border-alert", chip: "bg-alert text-white", label: { ta: "பொருந்தவில்லை", en: "Does not fit" }, mark: "✗" },
};

function Gauge({ score, band }: { score: number; band: "high" | "medium" | "low" | "none" }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const color = band === "high" ? "var(--brand)" : band === "none" ? "var(--alert)" : "var(--warn)";
  return (
    <Reveal variant="scale" className="grid place-items-center">
      <div className="relative size-36">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90" role="img" aria-label={`${score}%`}>
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line)" strokeWidth="12" />
          <circle cx="70" cy="70" r={R} fill="none" stroke={color} strokeWidth="12" strokeLinecap="butt" strokeDasharray={C} strokeDashoffset={C} className="gauge-arc" style={{ ["--off" as string]: C * (1 - score / 100) }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <span className="font-display text-4xl font-semibold">{score}</span>
            <span className="text-xl">%</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** "Who can apply?" as clear tiles, each marked green / yellow / black against the visitor's own profile (computed on the device). */
export function EligibilitySection({ scheme }: { scheme: Scheme }) {
  const { profile } = useProfile();
  const known = profileProgress(profile) > 0;
  const match = matchScheme(profile, scheme);
  const e = scheme.elig;
  const state = (key: string): CheckState | null => (known ? match.checks.find((c) => c.key === key)?.state ?? null : null);

  const tiles: { key: string; label: L; value: React.ReactNode }[] = [];
  if (e.minAge !== null || e.maxAge !== null) {
    const v = e.minAge !== null && e.maxAge !== null ? `${e.minAge}–${e.maxAge}` : e.minAge !== null ? `${e.minAge}+` : `≤ ${e.maxAge}`;
    tiles.push({ key: "age", label: { ta: "வயது", en: "Age" }, value: <span className="text-4xl">{v}</span> });
  }
  if (e.gender !== "any") tiles.push({ key: "gender", label: { ta: "பாலினம்", en: "Gender" }, value: <span className="text-3xl"><T v={e.gender === "female" ? { ta: "பெண்கள்", en: "Women" } : { ta: "ஆண்கள்", en: "Men" }} /></span> });
  if (e.occupations && e.occupations.length < occupationOptions.length - 1) {
    const names = e.occupations.map((o) => occupationOptions.find((x) => x.id === o)!.name);
    tiles.push({ key: "occupation", label: { ta: "யார்", en: "Who" }, value: <span className="text-xl leading-snug">{names.slice(0, 3).map((n, i) => (<span key={i} className="block"><T v={n} /></span>))}{names.length > 3 && "…"}</span> });
  }
  if (e.maxIncome !== null) tiles.push({ key: "income", label: { ta: "குடும்ப ஆண்டு வருமானம்", en: "Family yearly income" }, value: <span className="text-4xl">≤ ₹{e.maxIncome / 100000}<span className="text-xl"> <T v={{ ta: "லட்சம்", en: "lakh" }} /></span></span> });
  if (e.communities && e.communities.length) {
    tiles.push({ key: "community", label: { ta: "சமூகம்", en: "Community" }, value: <span className="text-xl leading-snug">{e.communities.map((c, i) => (<span key={i} className="block"><T v={communityOptions.find((x) => x.id === c)!.name} /></span>))}</span> });
  }
  if (tiles.length === 0) tiles.push({ key: "open", label: { ta: "தகுதி", en: "Eligibility" }, value: <span className="text-3xl"><T v={{ ta: "அனைவருக்கும்", en: "Open to everyone" }} /></span> });

  return (
    <div className="grid gap-6 lg:grid-cols-[12rem_1fr]">
      <div className="text-center lg:text-left">
        {known ? (
          <>
            <Gauge score={match.score} band={match.band} />
            <p className="mt-2 text-center font-display text-lg font-semibold">
              {match.band === "high" && <T v={{ ta: "மிகவும் பொருந்தும்", en: "Strong match" }} />}
              {match.band === "medium" && <T v={{ ta: "ஒருவேளை பொருந்தும்", en: "Possible match" }} />}
              {match.band === "low" && <T v={{ ta: "குறைவாகப் பொருந்தும்", en: "Weak match" }} />}
              {match.band === "none" && <T v={{ ta: "தகுதி இல்லை", en: "Not eligible" }} />}
            </p>
            <Link href="/profile" className="link-draw mt-1 block min-h-11 text-center text-base font-semibold text-brand">
              <T v={{ ta: "சுயவிவரத்தைத் திருத்து", en: "Edit my profile" }} />
            </Link>
          </>
        ) : (
          <div className="rounded-lg border-2 border-warn bg-warn-tint p-4 text-left">
            <p className="font-display text-lg font-semibold">
              <T v={{ ta: "உங்களுக்குத் தகுதியா?", en: "Are you eligible?" }} />
            </p>
            <p className="mt-1 text-base text-ink-soft">
              <T v={{ ta: "ஆறு கேள்விகள் – 30 வினாடி.", en: "Six questions – 30 seconds." }} />
            </p>
            <Link href="/profile" className="mt-3 inline-flex min-h-12 items-center rounded-lg bg-brand px-4 font-display text-base font-semibold text-white hover:bg-brand-dark">
              <T v={{ ta: "தொடங்கு →", en: "Start →" }} />
            </Link>
          </div>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {tiles.map((t, i) => {
          const st = state(t.key);
          return (
            <Reveal as="li" key={t.key} delay={i * 0.05} variant="scale">
              <div className={`relative h-full rounded-lg border-2 bg-white p-4 ${st ? stateStyle[st].box : "border-line"}`}>
                <svg viewBox="0 0 24 24" className="size-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={icons[t.key]} />
                </svg>
                <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  <T v={t.label} />
                </p>
                <div className="mt-1 font-display font-semibold leading-tight">{t.value}</div>
                {st && (
                  <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-sm font-bold ${stateStyle[st].chip}`}>
                    <span aria-hidden="true">{stateStyle[st].mark}</span>
                    <T v={stateStyle[st].label} />
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
        {scheme.eligText && (
          <Reveal as="li" delay={tiles.length * 0.05} className="sm:col-span-2">
            <p className="border-l-4 border-warn bg-warn-tint p-4 text-ink">
              <T v={scheme.eligText} />
            </p>
          </Reveal>
        )}
      </ul>
    </div>
  );
}
