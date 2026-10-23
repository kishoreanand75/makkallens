"use client";

import Link from "next/link";
import { useState } from "react";
import { T, useLang } from "@/lib/lang";
import { documents, getDoc, getScheme, schemes } from "@/lib/data";
import { inferDocId } from "@/lib/doc-match";
import { openMyDocs, useMyDocs, useSavedSchemes } from "@/lib/hooks";
import { rankOf } from "@/lib/top50";
import { services } from "@/lib/services";

const byRank = <T extends { rank: number }>(a: T, b: T) => a.rank - b.rank;

/** Document Doctor: pick what you are applying for and see which of YOUR saved documents are missing. */
export function DocumentDoctor() {
  const { lang } = useLang();
  const my = useMyDocs();
  const saved = useSavedSchemes();
  const [goal, setGoal] = useState<string>("saved");

  const options = [
    ...services.map((s) => ({ key: `service:${s.slug}`, label: s.name[lang], rank: rankOf("service", s.slug) })),
    ...schemes.map((s) => ({ key: `scheme:${s.id}`, label: s.title[lang], rank: rankOf("scheme", s.id) })),
  ].sort(byRank);

  let needed: string[] = [];
  if (goal === "saved") needed = [...new Set(saved.ids.flatMap((id) => getScheme(id)?.docs ?? []))];
  else if (goal.startsWith("scheme:")) needed = getScheme(goal.slice(7))?.docs ?? [];
  else {
    const sv = services.find((s) => s.slug === goal.slice(8));
    needed = [...new Set((sv?.documents ?? []).map((d) => inferDocId(d.name.en)).filter((x): x is string => Boolean(x)))];
  }
  const missing = needed.filter((d) => !my.has(d));
  const ok = needed.filter((d) => my.has(d));

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <div className="rounded-lg border-2 border-ink p-5">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand">
          <T v={{ ta: "என் ஆவணங்கள்", en: "My documents" }} />
        </p>
        <p className="mt-1 font-display text-4xl font-semibold">
          {my.ids.length}
          <span className="text-xl text-ink-soft"> / {documents.length}</span>
        </p>
        <p className="mt-1 text-base text-ink-soft">
          <T v={{ ta: "உங்களிடம் உள்ளவற்றை ஒருமுறை சேமித்தால் எல்லாப் பக்கங்களிலும் தெரியும்.", en: "Save what you have once and every page will show it." }} />
        </p>
        <button type="button" onClick={openMyDocs} className="mt-4 min-h-12 w-full rounded-lg bg-brand px-4 font-display text-base font-semibold text-white hover:bg-brand-dark">
          <T v={{ ta: "தேர்ந்தெடு / திருத்து", en: "Select / edit" }} />
        </button>
      </div>

      <div>
        <label htmlFor="goal" className="font-display text-lg font-semibold">
          <T v={{ ta: "எதற்கு விண்ணப்பிக்கப் போகிறீர்கள்?", en: "What are you applying for?" }} />
        </label>
        <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border-2 border-ink bg-white px-3 text-lg">
          <option value="saved">{lang === "ta" ? `நான் சேமித்த திட்டங்கள் (${saved.ids.length})` : `My saved schemes (${saved.ids.length})`}</option>
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.rank <= 50 ? `${o.rank}. ` : ""}
              {o.label}
            </option>
          ))}
        </select>

        {needed.length === 0 ? (
          <p className="mt-4 text-ink-soft">
            {goal === "saved" ? <T v={{ ta: "இன்னும் திட்டங்களைச் சேமிக்கவில்லை. திட்டப் பக்கத்தில் 'சேமி' அழுத்துங்கள், அல்லது மேலே ஒன்றைத் தேர்ந்தெடுங்கள்.", en: "You have not saved any schemes yet. Press 'Save' on a scheme page, or pick one above." }} /> : <T v={{ ta: "இதற்கு அட்டவணையில் உள்ள ஆவணங்கள் எதுவும் தேவையில்லை.", en: "None of the catalogue documents are needed for this." }} />}
          </p>
        ) : (
          <div className="mt-4" aria-live="polite">
            <p className="font-display text-xl font-semibold">
              {missing.length === 0 ? <span className="text-brand"><T v={{ ta: "தயார்! எல்லா ஆவணங்களும் உள்ளன ✓", en: "Ready! You have every document ✓" }} /></span> : <T v={{ ta: `${missing.length} ஆவணம் குறைகிறது`, en: `${missing.length} document(s) missing` }} />}
            </p>
            {missing.length > 0 && (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {missing.map((id) => {
                  const d = getDoc(id)!;
                  return (
                    <li key={id} className="rounded-lg border-2 border-ink bg-sun-tint p-4">
                      <span className="font-display text-lg font-semibold">
                        ! <T v={d.name} />
                      </span>
                      <span className="mt-1 block text-base text-ink-soft">
                        <T v={d.tip} />{" "}
                        {d.service ? (
                          <Link href={`/service/${d.service}`} className="font-semibold text-brand underline underline-offset-4">
                            <T v={{ ta: "எப்படிப் பெறுவது →", en: "How to get it →" }} />
                          </Link>
                        ) : d.url ? (
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-4">
                            <T v={{ ta: "அதிகாரப்பூர்வ தளம் ↗", en: "Official site ↗" }} />
                          </a>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {ok.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {ok.map((id) => (
                  <li key={id} className="rounded-full border-2 border-brand bg-tint px-3 py-1 text-base font-semibold text-brand">
                    ✓ <T v={getDoc(id)!.name} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
