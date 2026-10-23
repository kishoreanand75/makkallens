"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { T } from "@/lib/lang";
import { getDoc } from "@/lib/data";
import { openMyDocs, useMyDocs } from "@/lib/hooks";

/** Shows each required document as ready / missing, based on the visitor's saved "My documents" list. Read-only on purpose. */
export function DocWallet({ ids }: { ids: string[] }) {
  const my = useMyDocs();
  const docs = ids.map((id) => getDoc(id)).filter((d) => d !== undefined);
  const have = docs.filter((d) => my.has(d!.id)).length;

  if (docs.length === 0) {
    return (
      <p className="border-l-4 border-brand bg-tint p-4 text-ink-soft">
        <T v={{ ta: "தனி ஆவணம் எதுவும் தேவையில்லை – இது பள்ளி / அரசு மூலமே கிடைக்கும்.", en: "No separate document needed – it is delivered through the school or the government." }} />
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p role="status" className="font-display text-lg font-semibold">
          {have === docs.length ? (
            <span className="text-brand">
              <T v={{ ta: "எல்லா ஆவணங்களும் தயார் ✓", en: "Every document is ready ✓" }} />
            </span>
          ) : (
            <T v={{ ta: `${have} / ${docs.length} தயார்`, en: `${have} of ${docs.length} ready` }} />
          )}
        </p>
        <button type="button" onClick={openMyDocs} className="min-h-11 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun">
          <T v={{ ta: "என் ஆவணங்களைத் திருத்து", en: "Edit my documents" }} />
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d, i) => {
          const on = my.has(d!.id);
          return (
            <Reveal as="li" key={d!.id} delay={i * 0.04}>
              <div className={`flex h-full flex-col rounded-lg border-2 p-4 ${on ? "border-brand bg-tint" : "border-line bg-white"}`}>
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${on ? "border-brand bg-brand text-white" : "border-ink bg-sun text-ink"}`}>
                    {on ? "✓" : "!"}
                  </span>
                  <span className="font-display text-lg font-semibold leading-snug">
                    <T v={d!.name} />
                    <span className="block text-sm font-semibold text-ink-soft">{on ? <T v={{ ta: "உங்களிடம் உள்ளது", en: "You have this" }} /> : <T v={{ ta: "இன்னும் தேவை", en: "Still needed" }} />}</span>
                  </span>
                </div>
                {!on && (
                  <p className="mt-2 text-base text-ink-soft">
                    <T v={d!.tip} />
                    {(d!.service || d!.url) && (
                      <>
                        {" "}
                        {d!.service ? (
                          <Link href={`/service/${d!.service}`} className="font-semibold text-brand underline underline-offset-4">
                            <T v={{ ta: "எப்படிப் பெறுவது →", en: "How to get it →" }} />
                          </Link>
                        ) : (
                          <a href={d!.url!} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-4">
                            <T v={{ ta: "அதிகாரப்பூர்வ தளம் ↗", en: "Official site ↗" }} />
                          </a>
                        )}
                      </>
                    )}
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
