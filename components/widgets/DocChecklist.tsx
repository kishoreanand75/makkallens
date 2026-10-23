"use client";

import Link from "next/link";
import { T } from "@/lib/lang";
import { getDoc } from "@/lib/data";
import { openMyDocs, useMyDocs } from "@/lib/hooks";

/** Status list for a fixed set of documents (e.g. college admission), driven by the shared "My documents" list. */
export function DocChecklist({ ids }: { ids: string[] }) {
  const my = useMyDocs();
  const have = ids.filter((i) => my.has(i)).length;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <p role="status" className="font-display text-lg font-semibold">
          {have} / {ids.length} <T v={{ ta: "தயார்", en: "ready" }} />
        </p>
        <button type="button" onClick={openMyDocs} className="min-h-11 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun">
          <T v={{ ta: "என் ஆவணங்களைத் திருத்து", en: "Edit my documents" }} />
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ids.map((id) => {
          const d = getDoc(id);
          if (!d) return null;
          const on = my.has(id);
          return (
            <li key={id} className={`flex items-start gap-3 rounded-lg border-2 p-4 ${on ? "border-brand bg-tint" : "border-line"}`}>
              <span aria-hidden="true" className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${on ? "border-brand bg-brand text-white" : "border-ink bg-sun text-ink"}`}>
                {on ? "✓" : "!"}
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-snug">
                  <T v={d.name} />
                </span>
                {!on && (
                  <span className="block text-base text-ink-soft">
                    <T v={d.tip} />{" "}
                    {d.service && (
                      <Link href={`/service/${d.service}`} className="font-semibold text-brand underline underline-offset-4">
                        <T v={{ ta: "எப்படிப் பெறுவது →", en: "How to get it →" }} />
                      </Link>
                    )}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
