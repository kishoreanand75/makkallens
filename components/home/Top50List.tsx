"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { CardLayoutSwitch, ItemCard, useCardLayout, type CardLayout } from "@/components/ui/ItemCard";
import { Chip, FilterButton, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { T, useLang } from "@/lib/lang";
import { useMyDocs } from "@/lib/hooks";
import { top50Entries, type TopEntry } from "@/lib/top50-items";

const ALL = top50Entries();

function Row({ e, ready, layout }: { e: TopEntry; ready: { have: number; total: number } | null; layout: CardLayout }) {
  return (
    <Reveal as="li" className="h-full">
      <ItemCard
        layout={layout}
        href={e.href}
        title={e.title}
        blurb={e.blurb}
        image={e.icon}
        color={e.color}
        rank={e.rank}
        tag={
          <span className={`rounded px-2 py-0.5 font-display text-sm font-semibold shadow-sm ${e.type === "service" ? "border-2 border-ink bg-white" : "bg-ink text-white"}`}>
            {e.type === "service" ? <T v={{ ta: "சேவை", en: "Service" }} /> : <T v={{ ta: "திட்டம்", en: "Scheme" }} />}
          </span>
        }
        meta={<T v={e.groupName} />}
        footer={
          ready ? (
            <span className={`inline-block rounded px-2 py-0.5 text-sm font-semibold ${ready.have === ready.total ? "bg-brand text-white" : "bg-gold-tint text-ink"}`}>
              <T v={{ ta: `ஆவணங்கள் ${ready.have}/${ready.total} தயார்`, en: `Documents ${ready.have}/${ready.total} ready` }} />
            </span>
          ) : null
        }
      />
    </Reveal>
  );
}

/** Ranked list of the Top 50 with a filter drawer; `limit` turns it into the compact home-page version. */
export function Top50List({ limit, showTools = true }: { limit?: number; showTools?: boolean }) {
  const { lang } = useLang();
  const my = useMyDocs();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "service" | "scheme">("all");
  const [group, setGroup] = useState<string>("all");
  const [onlyReady, setOnlyReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [layout] = useCardLayout();

  const groups = useMemo(() => {
    const m = new Map<string, TopEntry["groupName"]>();
    for (const e of ALL) if (type === "all" || e.type === type) m.set(e.group, e.groupName);
    return [...m.entries()];
  }, [type]);

  const readiness = (e: TopEntry) => (e.docIds.length ? { have: e.docIds.filter((d) => my.has(d)).length, total: e.docIds.length } : null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL.filter((e) => {
      if (type !== "all" && e.type !== type) return false;
      if (group !== "all" && e.group !== group) return false;
      if (onlyReady) {
        const r = e.docIds.length ? e.docIds.filter((d) => my.has(d)).length === e.docIds.length : false;
        if (!r) return false;
      }
      return !needle || `${e.title.ta} ${e.title.en} ${e.blurb.en}`.toLowerCase().includes(needle);
    });
  }, [q, type, group, onlyReady, my]);

  const shown = limit ? list.slice(0, limit) : list;
  const active = [
    ...(type !== "all" ? [{ key: "t", label: type === "service" ? { ta: "சேவை வழிகாட்டிகள்", en: "Service guides" } : { ta: "திட்டங்கள்", en: "Schemes" }, clear: () => { setType("all"); setGroup("all"); } }] : []),
    ...(group !== "all" ? [{ key: "g", label: groups.find(([g]) => g === group)?.[1] ?? { ta: group, en: group }, clear: () => setGroup("all") }] : []),
    ...(onlyReady ? [{ key: "r", label: { ta: "ஆவணங்கள் தயார்", en: "Documents ready" }, clear: () => setOnlyReady(false) }] : []),
  ];

  return (
    <div>
      {showTools && (
        <>
          <div className="sticky top-20 z-30 mb-3 flex items-center gap-3 bg-white py-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="top-search" className="sr-only">
                <T v={{ ta: "தேடுங்கள்", en: "Search" }} />
              </label>
              <input id="top-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "ta" ? "50-இல் தேடுங்கள்… (ரேஷன், பட்டா, உதவித்தொகை)" : "Search the 50… (ration, patta, scholarship)"} className="min-h-12 w-full rounded-lg border-2 border-ink bg-white px-4 text-lg" />
            </div>
            <span className="shrink-0"><CardLayoutSwitch /></span>
            <FilterButton onClick={() => setOpen(true)} count={active.length} />
          </div>
          {active.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2" aria-label="Active filters">
              {active.map((a) => (
                <li key={a.key}>
                  <button type="button" onClick={a.clear} className="inline-flex min-h-11 items-center gap-2 rounded bg-sun px-3 font-display text-base font-semibold hover:bg-white hover:outline hover:outline-2">
                    <T v={a.label} /> <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <ol className={`grid gap-4 sm:grid-cols-2 ${layout === "split" ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`} aria-label="Top 50">
        {shown.map((e) => (
          <Row key={`${e.type}-${e.id}`} e={e} ready={readiness(e)} layout={layout} />
        ))}
      </ol>
      {shown.length === 0 && (
        <p className="mt-4 text-ink-soft">
          <T v={{ ta: "பொருத்தமானவை இல்லை. வடிகட்டிகளைத் தளர்த்துங்கள்.", en: "Nothing matches. Relax the filters." }} />
        </p>
      )}

      {showTools && (
        <FilterDrawer open={open} onClose={() => setOpen(false)} title={{ ta: "முதல் 50-ஐ வடிகட்டு", en: "Filter the Top 50" }} resultCount={list.length} onReset={() => { setType("all"); setGroup("all"); setOnlyReady(false); }}>
          <FilterGroup label={{ ta: "வகை", en: "Kind" }}>
            {(["all", "service", "scheme"] as const).map((t) => (
              <Chip key={t} active={type === t} onClick={() => { setType(t); setGroup("all"); }}>
                {t === "all" ? <T v={{ ta: "அனைத்தும்", en: "All" }} /> : t === "service" ? <T v={{ ta: "சேவை வழிகாட்டிகள்", en: "Service guides" }} /> : <T v={{ ta: "திட்டங்கள்", en: "Schemes" }} />}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label={{ ta: "பிரிவு", en: "Category" }}>
            <Chip active={group === "all"} onClick={() => setGroup("all")}>
              <T v={{ ta: "அனைத்தும்", en: "All" }} />
            </Chip>
            {groups.map(([g, name]) => (
              <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
                <T v={name} />
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label={{ ta: "என் ஆவணங்கள்", en: "My documents" }}>
            <Chip active={!onlyReady} onClick={() => setOnlyReady(false)}>
              <T v={{ ta: "அனைத்தும்", en: "Everything" }} />
            </Chip>
            <Chip active={onlyReady} onClick={() => setOnlyReady(true)}>
              <T v={{ ta: "ஆவணங்கள் முழுமையாக உள்ளவை", en: "Where I have every document" }} />
            </Chip>
          </FilterGroup>
        </FilterDrawer>
      )}
    </div>
  );
}
