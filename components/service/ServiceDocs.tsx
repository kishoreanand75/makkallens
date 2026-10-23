"use client";

import { Reveal } from "@/components/Reveal";
import { T } from "@/lib/lang";
import type { L } from "@/lib/data";
import { inferDocId } from "@/lib/doc-match";
import { openMyDocs, useMyDocs } from "@/lib/hooks";

/** Documents of a service guide. Lines that match the shared catalogue light up from the visitor's saved "My documents". */
export function ServiceDocs({ docs }: { slug?: string; docs: { name: L; note?: L }[] }) {
  const my = useMyDocs();
  const rows = docs.map((d) => ({ d, id: inferDocId(d.name.en) }));
  const known = rows.filter((r) => r.id);
  const have = known.filter((r) => my.has(r.id!)).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {known.length > 0 && (
          <p role="status" className="font-display text-lg font-semibold">
            <T v={{ ta: `${have} / ${known.length} ஆவணங்கள் உங்களிடம் உள்ளன`, en: `You have ${have} of ${known.length} listed documents` }} />
          </p>
        )}
        <button type="button" onClick={openMyDocs} className="min-h-11 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun">
          <T v={{ ta: "என் ஆவணங்களைத் திருத்து", en: "Edit my documents" }} />
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ d, id }, i) => {
          const on = id ? my.has(id) : false;
          return (
            <Reveal as="li" key={i} delay={i * 0.04}>
              <div className={`flex h-full items-start gap-3 rounded-lg border-2 p-4 ${on ? "border-brand bg-tint" : "border-line bg-white"}`}>
                <span aria-hidden="true" className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${on ? "border-brand bg-brand text-white" : "border-ink bg-white text-ink"}`}>
                  {on ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-snug">
                    <T v={d.name} />
                  </span>
                  {d.note && (
                    <span className="mt-1 block text-base text-ink-soft">
                      <T v={d.note} />
                    </span>
                  )}
                  {on && (
                    <span className="mt-1 block text-sm font-semibold text-brand">
                      <T v={{ ta: "உங்களிடம் உள்ளது", en: "You have this" }} />
                    </span>
                  )}
                </span>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
