"use client";

import { useMemo, useState } from "react";
import { Chip, FilterButton, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { topics, type EmblemId } from "@/lib/categories";
import { imageFor } from "@/lib/topic-icon";
import { CardLayoutSwitch, ItemCard, useCardLayout } from "@/components/ui/ItemCard";
import { T, useLang } from "@/lib/lang";
import { categories, services, type CategoryId } from "@/lib/services";
import { Reveal } from "./Reveal";

const emblemFor = (c: CategoryId): EmblemId => (c === "driving" ? "driving" : c === "identity" ? "identity" : "certificates");

export function ServiceBrowser({ initialCategory }: { initialCategory?: CategoryId }) {
  const { lang } = useLang();
  const [cat, setCat] = useState<CategoryId | "all">(initialCategory ?? "all");
  const [level, setLevel] = useState<"all" | "central" | "state">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [layout] = useCardLayout();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return services.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (level !== "all" && s.level !== level) return false;
      if (!needle) return true;
      return s.name.ta.includes(needle) || s.name.en.toLowerCase().includes(needle) || s.keywords.some((k) => k.toLowerCase().includes(needle));
    });
  }, [cat, level, q]);

  const active = [
    ...(cat !== "all" ? [{ key: "cat", label: categories.find((c) => c.id === cat)!.name, clear: () => setCat("all") }] : []),
    ...(level !== "all" ? [{ key: "lv", label: level === "central" ? { ta: "மத்திய அரசு", en: "Central" } : { ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }, clear: () => setLevel("all") }] : []),
  ];

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-1 mb-4 flex items-center gap-3 bg-white px-1 py-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="svc-search" className="sr-only">
            <T v={{ ta: "சேவையைத் தேடுங்கள்", en: "Search services" }} />
          </label>
          <input
            id="svc-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ta" ? "சேவையைத் தேடுங்கள்… (ஆதார், பிறப்பு, லைசென்ஸ்)" : "Search… (Aadhaar, birth, licence)"}
            className="min-h-12 w-full rounded-lg border-2 border-ink bg-white px-5 text-lg"
          />
        </div>
        <span className="shrink-0"><CardLayoutSwitch /></span>
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
        <T v={{ ta: `${list.length} வழிகாட்டிகள்`, en: `${list.length} guides` }} />
      </p>
      <ul className={`mt-4 grid gap-4 sm:grid-cols-2 ${layout === "split" ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
        {list.map((s) => {
          const tp = topics[emblemFor(s.category)];
          return (
            <Reveal as="li" key={s.slug} className="h-full">
              <ItemCard
                layout={layout}
                href={`/service/${s.slug}`}
                title={s.name}
                blurb={s.short}
                image={imageFor(s.slug, s.name.en)}
                color={tp.color}
                meta={
                  <>
                    <T v={tp.name} /> · <T v={s.scope} />
                  </>
                }
                footer={
                  <span className="font-display text-base font-semibold text-brand">
                    <T v={{ ta: "படிப்படியான வழிகாட்டி →", en: "Step-by-step guide →" }} />
                  </span>
                }
              />
            </Reveal>
          );
        })}
      </ul>
      {list.length === 0 && (
        <p className="mt-6 text-ink-soft">
          <T v={{ ta: "இந்தச் சேவை இன்னும் இல்லை. 'கேளுங்கள்' பகுதியில் கேட்டுப் பாருங்கள்; விரைவில் சேர்க்கிறோம்.", en: "That service is not here yet. Try 'Ask' – we are adding more soon." }} />
        </p>
      )}

      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={{ ta: "சேவைகளை வடிகட்டு", en: "Filter services" }}
        resultCount={list.length}
        onReset={() => {
          setCat("all");
          setLevel("all");
        }}
      >
        <FilterGroup label={{ ta: "வகை", en: "Type" }}>
          <Chip active={cat === "all"} onClick={() => setCat("all")}>
            <T v={{ ta: "அனைத்தும்", en: "All" }} />
          </Chip>
          {categories
            .filter((c) => c.live)
            .map((c) => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                <T v={c.name} />
              </Chip>
            ))}
        </FilterGroup>
        <FilterGroup label={{ ta: "அரசு", en: "Government" }}>
          {(["all", "central", "state"] as const).map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === "all" ? <T v={{ ta: "அனைத்தும்", en: "All" }} /> : l === "central" ? <T v={{ ta: "மத்திய அரசு", en: "Central" }} /> : <T v={{ ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }} />}
            </Chip>
          ))}
        </FilterGroup>
      </FilterDrawer>
    </div>
  );
}
