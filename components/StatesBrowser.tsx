"use client";

import { useMemo, useState } from "react";
import { Chip, FilterButton, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { T, useLang } from "@/lib/lang";
import type { StateCm } from "@/lib/people";
import { Reveal } from "./Reveal";

export function StatesBrowser({ states, portraits }: { states: StateCm[]; portraits: Record<string, React.ReactNode> }) {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [party, setParty] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const parties = useMemo(() => [...new Set(states.map((s) => s.party))].sort(), [states]);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return states.filter((s) => (party === "all" || s.party === party) && (!n || `${s.state.en} ${s.state.ta} ${s.cm}`.toLowerCase().includes(n)));
  }, [q, party, states]);

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-1 mb-4 flex items-center gap-3 bg-white px-1 py-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="st-search" className="sr-only">
            <T v={{ ta: "மாநிலம் அல்லது முதலமைச்சரைத் தேடுங்கள்", en: "Search state or Chief Minister" }} />
          </label>
          <input id="st-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "ta" ? "மாநிலம் அல்லது பெயர்…" : "State or name…"} className="min-h-12 w-full rounded-lg border-2 border-ink bg-white px-5 text-lg" />
        </div>
        <FilterButton onClick={() => setOpen(true)} count={party !== "all" ? 1 : 0} />
      </div>
      <p className="text-ink-soft" aria-live="polite">
        <T v={{ ta: `${list.length} மாநிலங்கள் / ஒன்றியப் பகுதிகள்`, en: `${list.length} states / UTs` }} />
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <Reveal as="li" key={s.code} delay={Math.min(i % 6, 5) * 0.04} variant="scale">
            <div className="flex h-full items-center gap-4 rounded-xl border-2 border-line bg-paper-2 p-4 transition-colors hover:border-accent">
              <span className="size-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-accent/60">{portraits[s.id]}</span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-semibold text-brand">
                  <T v={s.state} />
                </span>
                <span className="block font-display text-lg font-semibold leading-snug">{s.cm}</span>
                <span className="block text-base text-ink-soft">
                  {s.party}
                  {s.since ? ` · ${s.since}` : ""}
                </span>
              </span>
            </div>
          </Reveal>
        ))}
      </ul>

      <FilterDrawer open={open} onClose={() => setOpen(false)} title={{ ta: "மாநிலங்களை வடிகட்டு", en: "Filter states" }} resultCount={list.length} onReset={() => setParty("all")}>
        <FilterGroup label={{ ta: "கட்சி", en: "Party" }}>
          <Chip active={party === "all"} onClick={() => setParty("all")}>
            <T v={{ ta: "அனைத்தும்", en: "All" }} />
          </Chip>
          {parties.map((p) => (
            <Chip key={p} active={party === p} onClick={() => setParty(p)}>
              {p}
            </Chip>
          ))}
        </FilterGroup>
      </FilterDrawer>
    </div>
  );
}
