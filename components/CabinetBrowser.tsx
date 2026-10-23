"use client";

import { useMemo, useState } from "react";
import { Chip, FilterButton, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { T, useLang } from "@/lib/lang";
import { deptGroups, groupOf, type DeptGroup, type Minister } from "@/lib/people";
import { Reveal } from "./Reveal";

/** `portraits` is rendered on the server and passed in keyed by minister id. */
export function CabinetBrowser({ ministers, portraits, withPhoto }: { ministers: Minister[]; portraits: Record<string, React.ReactNode>; withPhoto: string[] }) {
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<DeptGroup | "all">("all");
  const [photoOnly, setPhotoOnly] = useState(false);
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return ministers.filter((m) => {
      if (group !== "all" && groupOf(m) !== group) return false;
      if (photoOnly && !withPhoto.includes(m.id)) return false;
      return !n || `${m.name} ${m.constituency} ${m.dept.en} ${m.dept.ta}`.toLowerCase().includes(n);
    });
  }, [q, group, photoOnly, ministers, withPhoto]);

  const active = [
    ...(group !== "all" ? [{ key: "g", label: deptGroups.find((g) => g.id === group)!.name, clear: () => setGroup("all") }] : []),
    ...(photoOnly ? [{ key: "p", label: { ta: "புகைப்படம் உள்ளவர்", en: "With photo" }, clear: () => setPhotoOnly(false) }] : []),
  ];

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-1 mb-4 flex items-center gap-3 bg-white px-1 py-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="cab-search" className="sr-only">
            <T v={{ ta: "அமைச்சர் அல்லது துறையைத் தேடுங்கள்", en: "Search minister or department" }} />
          </label>
          <input
            id="cab-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ta" ? "அமைச்சர், துறை, தொகுதி… (எ.கா. சுகாதாரம்)" : "Minister, department, constituency… (e.g. health)"}
            className="min-h-12 w-full rounded-lg border-2 border-ink bg-white px-5 text-lg"
          />
        </div>
        <FilterButton onClick={() => setOpen(true)} count={active.length} />
      </div>
      {active.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2" aria-label="Active filters">
          {active.map((a) => (
            <li key={a.key}>
              <button type="button" onClick={a.clear} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent/15 px-4 font-display text-base font-semibold hover:bg-accent/30">
                <T v={a.label} /> <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-ink-soft" aria-live="polite">
        <T v={{ ta: `${list.length} அமைச்சர்கள்`, en: `${list.length} ministers` }} />
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m, i) => (
          <Reveal as="li" key={m.id} delay={Math.min(i % 6, 5) * 0.05} variant="scale">
            <div className="flex h-full items-center gap-4 rounded-xl border-2 border-line bg-paper-2 p-4 transition-colors hover:border-accent">
              <span className="size-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-accent/60">{portraits[m.id]}</span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-semibold leading-snug">{m.name}</span>
                <span className="block text-base leading-snug text-ink-soft">
                  <T v={m.dept} />
                </span>
                <span className="mt-1 block text-sm font-bold text-brand">{m.constituency}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="mt-6 text-ink-soft">
          <T v={{ ta: "பொருத்தமான அமைச்சர் இல்லை.", en: "No matching minister." }} />
        </p>
      )}

      <FilterDrawer open={open} onClose={() => setOpen(false)} title={{ ta: "அமைச்சரவையை வடிகட்டு", en: "Filter the cabinet" }} resultCount={list.length} onReset={() => { setGroup("all"); setPhotoOnly(false); }}>
        <FilterGroup label={{ ta: "துறைத் தொகுப்பு", en: "Department group" }}>
          <Chip active={group === "all"} onClick={() => setGroup("all")}>
            <T v={{ ta: "அனைத்தும்", en: "All" }} />
          </Chip>
          {deptGroups.map((g) => (
            <Chip key={g.id} active={group === g.id} onClick={() => setGroup(g.id)}>
              <T v={g.name} />
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label={{ ta: "புகைப்படம்", en: "Photo" }}>
          <Chip active={!photoOnly} onClick={() => setPhotoOnly(false)}>
            <T v={{ ta: "அனைவரும்", en: "Everyone" }} />
          </Chip>
          <Chip active={photoOnly} onClick={() => setPhotoOnly(true)}>
            <T v={{ ta: "புகைப்படம் உள்ளவர் மட்டும்", en: "Only with a photo" }} />
          </Chip>
        </FilterGroup>
      </FilterDrawer>
    </div>
  );
}
