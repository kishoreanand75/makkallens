"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CardLayoutSwitch } from "@/components/ui/ItemCard";
import { Chip, FilterButton, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { T, useLang } from "@/lib/lang";
import { schemeCategories, schemes, type Need, type SchemeCategory } from "@/lib/data";
import { recordQuery, useHistory, useProfile } from "@/lib/hooks";
import { recommend } from "@/lib/history";
import { matchScheme } from "@/lib/match";
import { needOptions, profileProgress } from "@/lib/profile";
import { searchAll } from "@/lib/search";
import { SchemeRow } from "./SchemeCard";

type Sort = "relevance" | "popular";

export function SchemeExplorer({ category, lockCategory = false }: { category?: SchemeCategory; lockCategory?: boolean }) {
  const { lang } = useLang();
  const { profile } = useProfile();
  const { events } = useHistory();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SchemeCategory | "all">(category ?? "all");
  const [level, setLevel] = useState<"all" | "central" | "state">("all");
  const [need, setNeed] = useState<Need | "all">("all");
  const [sort, setSort] = useState<Sort>("relevance");
  const [hideNo, setHideNo] = useState(true);
  const [open, setOpen] = useState(false);

  const known = profileProgress(profile) > 0;

  const rows = useMemo(() => {
    // personalised order = profile match + on-device history + popularity
    const ranked = recommend(profile, events, schemes.length);
    const byId = new Map(ranked.map((r) => [r.scheme.id, r]));
    let list = schemes.map((s) => {
      const r = byId.get(s.id);
      return { scheme: s, match: r?.match ?? matchScheme(profile, s), why: r?.why, score: r?.score ?? -1 };
    });
    if (cat !== "all") list = list.filter((r) => r.scheme.category === cat);
    if (level !== "all") list = list.filter((r) => r.scheme.level === level);
    if (need !== "all") list = list.filter((r) => r.scheme.needs.includes(need));
    if (hideNo && known) list = list.filter((r) => r.match.band !== "none");
    const needle = q.trim();
    if (needle) {
      const order = new Map(searchAll(needle, 60).filter((h) => h.type === "scheme").map((h, i) => [h.id, i]));
      list = list.filter((r) => order.has(r.scheme.id)).sort((a, b) => order.get(a.scheme.id)! - order.get(b.scheme.id)!);
    } else if (sort === "popular") {
      list = list.sort((a, b) => b.scheme.popularity - a.scheme.popularity);
    } else {
      list = list.sort((a, b) => b.score - a.score || b.scheme.popularity - a.scheme.popularity);
    }
    return list;
  }, [profile, events, cat, level, need, hideNo, known, q, sort]);

  const hiddenCount = useMemo(
    () => (known && hideNo ? schemes.filter((s) => (cat === "all" || s.category === cat) && matchScheme(profile, s).band === "none").length : 0),
    [known, hideNo, cat, profile],
  );

  const active: { key: string; label: { ta: string; en: string }; clear: () => void }[] = [];
  if (!lockCategory && cat !== "all") active.push({ key: "cat", label: schemeCategories.find((c) => c.id === cat)!.name, clear: () => setCat("all") });
  if (level !== "all") active.push({ key: "level", label: level === "central" ? { ta: "மத்திய அரசு", en: "Central" } : { ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }, clear: () => setLevel("all") });
  if (need !== "all") active.push({ key: "need", label: needOptions.find((n) => n.id === need)!.name, clear: () => setNeed("all") });
  if (sort === "popular") active.push({ key: "sort", label: { ta: "பலரும் பார்ப்பது", en: "Most popular" }, clear: () => setSort("relevance") });
  if (!hideNo) active.push({ key: "elig", label: { ta: "தகுதி இல்லாதவையும்", en: "Including ineligible" }, clear: () => setHideNo(true) });

  const resetAll = () => {
    if (!lockCategory) setCat("all");
    setLevel("all");
    setNeed("all");
    setSort("relevance");
    setHideNo(true);
  };

  return (
    <div>
      <div className="sticky top-20 z-30 -mx-1 mb-4 flex items-center gap-3 bg-white px-1 py-3">
        <form
          role="search"
          className="min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            recordQuery(q);
          }}
        >
          <label htmlFor={`scheme-search-${category ?? "all"}`} className="sr-only">
            <T v={{ ta: "திட்டத்தைத் தேடுங்கள்", en: "Search schemes" }} />
          </label>
          <input
            id={`scheme-search-${category ?? "all"}`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => recordQuery(q)}
            placeholder={lang === "ta" ? "திட்டம் தேடுங்கள்… (விவசாயி, உதவித்தொகை, வீடு)" : "Search schemes… (farmer, scholarship, house)"}
            className="min-h-12 w-full rounded-lg border-2 border-ink bg-white px-5 text-lg"
          />
        </form>
        <span className="shrink-0"><CardLayoutSwitch /></span>
        <FilterButton onClick={() => setOpen(true)} count={active.length} />
      </div>

      {active.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2" aria-label="Active filters">
          {active.map((a) => (
            <li key={a.key}>
              <button type="button" onClick={a.clear} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent/15 px-4 font-display text-base font-semibold hover:bg-accent/30">
                <T v={a.label} /> <span aria-hidden="true">×</span>
                <span className="sr-only">
                  <T v={{ ta: "நீக்கு", en: "remove" }} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!known && (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border-2 border-dashed border-accent bg-accent/10 p-5">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">
              <T v={{ ta: "30 வினாடியில் உங்களுக்கான திட்டங்களை அறிய", en: "Find your schemes in 30 seconds" }} />
            </p>
            <p className="text-ink-soft">
              <T v={{ ta: "ஆறு எளிய கேள்விகள். பதிவு தேவையில்லை; தகவல் உங்கள் போனிலேயே இருக்கும்.", en: "Six easy questions. No sign-up; your answers stay on your device." }} />
            </p>
          </div>
          <Link href="/profile" className="inline-flex min-h-12 items-center rounded-xl bg-brand px-5 font-display text-lg font-semibold text-white hover:bg-brand-dark">
            <T v={{ ta: "தொடங்குங்கள் →", en: "Start →" }} />
          </Link>
        </div>
      )}

      <p className="text-ink-soft" aria-live="polite">
        <T v={{ ta: `${rows.length} திட்டங்கள்`, en: `${rows.length} schemes` }} />
        {hiddenCount > 0 && (
          <>
            {" · "}
            <button type="button" onClick={() => setHideNo(false)} className="min-h-11 underline underline-offset-4">
              <T v={{ ta: `தகுதி இல்லாத ${hiddenCount}-ஐயும் காட்டு`, en: `show ${hiddenCount} you are not eligible for` }} />
            </button>
          </>
        )}
      </p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <SchemeRow key={r.scheme.id} scheme={r.scheme} match={known ? r.match : undefined} why={r.why} />
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="mt-6 text-ink-soft">
          <T v={{ ta: "பொருத்தமான திட்டம் இல்லை. வடிகட்டிகளைத் தளர்த்திப் பாருங்கள் அல்லது 'கேளுங்கள்' பகுதியில் கேளுங்கள்.", en: "No scheme found. Relax the filters or try the 'Ask' page." }} />
        </p>
      )}

      <FilterDrawer open={open} onClose={() => setOpen(false)} title={{ ta: "திட்டங்களை வடிகட்டு", en: "Filter schemes" }} onReset={resetAll} resultCount={rows.length}>
        {!lockCategory && (
          <FilterGroup label={{ ta: "பிரிவு", en: "Category" }}>
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              <T v={{ ta: "அனைத்தும்", en: "All" }} />
            </Chip>
            {schemeCategories.map((c) => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                <T v={c.name} />
              </Chip>
            ))}
          </FilterGroup>
        )}
        <FilterGroup label={{ ta: "அரசு", en: "Government" }}>
          {(["all", "central", "state"] as const).map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === "all" ? <T v={{ ta: "மத்திய + மாநிலம்", en: "Central + State" }} /> : l === "central" ? <T v={{ ta: "மத்திய அரசு", en: "Central" }} /> : <T v={{ ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }} />}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label={{ ta: "எனக்குத் தேவை", en: "I need" }}>
          <Chip active={need === "all"} onClick={() => setNeed("all")}>
            <T v={{ ta: "எதுவும்", en: "Anything" }} />
          </Chip>
          {needOptions.map((n) => (
            <Chip key={n.id} active={need === n.id} onClick={() => setNeed(n.id)}>
              <T v={n.name} />
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label={{ ta: "வரிசை", en: "Order" }}>
          <Chip active={sort === "relevance"} onClick={() => setSort("relevance")}>
            <T v={{ ta: "எனக்குப் பொருத்தமானது", en: "Most relevant to me" }} />
          </Chip>
          <Chip active={sort === "popular"} onClick={() => setSort("popular")}>
            <T v={{ ta: "பலரும் பார்ப்பது", en: "Most popular" }} />
          </Chip>
        </FilterGroup>
        {known && (
          <FilterGroup label={{ ta: "தகுதி", en: "Eligibility" }}>
            <Chip active={hideNo} onClick={() => setHideNo(true)}>
              <T v={{ ta: "எனக்குத் தகுதியுள்ளவை மட்டும்", en: "Only ones I can get" }} />
            </Chip>
            <Chip active={!hideNo} onClick={() => setHideNo(false)}>
              <T v={{ ta: "அனைத்தும்", en: "Show all" }} />
            </Chip>
          </FilterGroup>
        )}
      </FilterDrawer>
    </div>
  );
}
