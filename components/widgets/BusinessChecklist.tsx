"use client";

import { T } from "@/lib/lang";
import { businessItems, getDoc } from "@/lib/data";
import { useStore } from "@/lib/store";

const KEY = "av-biz";
const NONE: string[] = [];

/** Shop / FSSAI / GST / MSME checklist. Ticks are stored on this device only. */
export function BusinessChecklist() {
  const [done, setDone] = useStore<string[]>(KEY, NONE);
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div>
      <ul className="border-t border-line">
        {businessItems.map((b) => (
          <li key={b.id} className="border-b border-line py-4">
            <label className="flex min-h-12 cursor-pointer items-start gap-3">
              <input type="checkbox" checked={done.includes(b.id)} onChange={() => toggle(b.id)} className="mt-1.5 size-6 shrink-0 accent-[var(--brand)]" />
              <span>
                <span className={`block font-display text-xl font-semibold ${done.includes(b.id) ? "text-brand line-through decoration-2" : ""}`}>
                  <T v={b.name} />
                </span>
                <span className="block text-ink-soft">
                  <T v={b.what} />
                </span>
                <span className="mt-1 block text-sm text-ink-soft">
                  <T v={{ ta: "தேவை: ", en: "You need: " }} />
                  {b.need.map((id) => getDoc(id)).filter(Boolean).map((d, i) => (
                    <span key={d!.id}>
                      {i > 0 && ", "}
                      <T v={d!.name} />
                    </span>
                  ))}
                </span>
              </span>
            </label>
            <a href={b.url} target="_blank" rel="noopener noreferrer" className="ml-9 inline-flex min-h-12 items-center font-display text-base font-semibold text-brand underline underline-offset-4">
              <T v={{ ta: "அதிகாரப்பூர்வ தளம்", en: "Official site" }} /> · {new URL(b.url).host} ↗
            </a>
          </li>
        ))}
      </ul>
      <p role="status" className="mt-3 font-display text-lg font-semibold text-brand">
        {done.length} / {businessItems.length} <T v={{ ta: "முடிந்தது", en: "done" }} />
      </p>
    </div>
  );
}
