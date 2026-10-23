"use client";

import Link from "next/link";
import { useMemo } from "react";
import { T } from "@/lib/lang";
import { getDoc, schemes } from "@/lib/data";
import { openMyDocs, useHistory, useMyDocs, useProfile } from "@/lib/hooks";
import { recommend } from "@/lib/history";
import { SchemeRow } from "@/components/scheme/SchemeCard";
import { UrimaiCard } from "./UrimaiCard";

export function ProfileResults({ onEdit }: { onEdit: () => void }) {
  const { profile, reset } = useProfile();
  const { events } = useHistory();
  const my = useMyDocs();

  const top = useMemo(() => recommend(profile, events, schemes.length).filter((r) => r.match.band !== "none").slice(0, 8), [profile, events]);

  // documents still missing across the top matches, most-needed first
  const missing = useMemo(() => {
    const count = new Map<string, number>();
    for (const r of top.slice(0, 5)) for (const d of r.scheme.docs) if (!my.ids.includes(d)) count.set(d, (count.get(d) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]);
  }, [top, my.ids]);

  return (
    <div className="space-y-12">
      <section aria-labelledby="res">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="res" className="text-2xl sm:text-3xl">
              <T v={{ ta: "உங்களுக்குப் பொருந்தும் திட்டங்கள்", en: "Schemes that fit you" }} />
            </h2>
            <p className="text-ink-soft">
              <T v={{ ta: `${top.length} திட்டங்கள் – பொருத்தம் அதிகமானவை முதலில்`, en: `${top.length} schemes – best match first` }} />
            </p>
          </div>
          <button type="button" onClick={onEdit} className="min-h-12 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
            <T v={{ ta: "பதில்களைத் திருத்து", en: "Edit answers" }} />
          </button>
        </div>
        <ul className="mt-4 border-t border-line">
          {top.map((r) => (
            <SchemeRow key={r.scheme.id} scheme={r.scheme} match={r.match} why={r.why} />
          ))}
        </ul>
        <Link href="/schemes" className="link-draw mt-4 inline-block min-h-11 font-display text-lg font-semibold">
          <T v={{ ta: "அனைத்துத் திட்டங்களையும் பார் →", en: "See all schemes →" }} />
        </Link>
      </section>

      <section aria-labelledby="miss" className="print-area">
        <h2 id="miss" className="text-2xl sm:text-3xl">
          <T v={{ ta: "அடுத்த படிகள் – தேவையான ஆவணங்கள்", en: "Next steps – documents you need" }} />
        </h2>
        {missing.length === 0 ? (
          <p className="mt-3 font-display text-lg font-semibold text-brand">
            <T v={{ ta: "முதல் 5 திட்டங்களுக்கான ஆவணங்கள் உங்களிடம் உள்ளன!", en: "You have the documents for your top 5 schemes!" }} />
          </p>
        ) : (
          <ul className="mt-4 border-t border-line">
            {missing.map(([id, n]) => {
              const d = getDoc(id)!;
              return (
                <li key={id} className="flex flex-wrap items-center gap-x-4 border-b border-line py-3">
                  <span className="flex min-h-12 flex-1 items-center gap-3">
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-sun text-sm font-bold">!</span>
                    <span>
                      <T v={d.name} />
                      <span className="block text-sm text-ink-soft">
                        <T v={{ ta: `${n} திட்டங்களுக்குத் தேவை`, en: `needed for ${n} scheme(s)` }} />
                      </span>
                    </span>
                  </span>
                  {d.service ? (
                    <Link href={`/service/${d.service}`} className="font-display text-base font-semibold text-brand underline underline-offset-4">
                      <T v={{ ta: "எப்படிப் பெறுவது →", en: "How to get it →" }} />
                    </Link>
                  ) : d.url ? (
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-display text-base font-semibold text-brand underline underline-offset-4">
                      <T v={{ ta: "அதிகாரப்பூர்வ தளம் ↗", en: "Official site ↗" }} />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <button type="button" onClick={openMyDocs} className="inline-flex min-h-12 items-center rounded-lg bg-brand px-4 font-display text-base font-semibold text-white hover:bg-brand-dark">
            <T v={{ ta: "என் ஆவணங்களைச் சேமி", en: "Save my documents" }} />
          </button>
          <Link href="/documents#reminders" className="inline-flex min-h-12 items-center rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
            <T v={{ ta: "⏰ நினைவூட்டல்கள்", en: "⏰ Reminders" }} />
          </Link>
        </div>
      </section>

      <div className="print:hidden">
        <UrimaiCard profile={profile} items={top} missingDocIds={missing.map(([id]) => id)} />
      </div>

      <section className="rounded-lg border border-line p-4 text-base text-ink-soft print:hidden">
        <p>
          <T
            v={{
              ta: "இந்தப் பரிந்துரைகள் உங்கள் போனிலேயே கணக்கிடப்படுகின்றன. நீங்கள் இங்கே தேடியது, பார்த்ததும் உங்கள் போனில் மட்டுமே சேமிக்கப்படும் (Google தேடல் வரலாற்றை நாங்கள் பார்க்க மாட்டோம்).",
              en: "These recommendations are computed on your device. What you search and view here is stored only on your device (we cannot and do not read your Google history).",
            }}
          />
        </p>
        <button type="button" onClick={() => reset()} className="mt-2 min-h-11 underline underline-offset-4">
          <T v={{ ta: "என் சுயவிவரத்தை அழி", en: "Delete my profile" }} />
        </button>
      </section>
    </div>
  );
}
