import { schemeCategories, schemes, type L } from "./data";
import { inferDocId } from "./doc-match";
import { categories, services } from "./services";
import { colorFor, imageFor } from "./topic-icon";
import { top50, type TopType } from "./top50";

export interface TopEntry {
  rank: number;
  type: TopType;
  id: string;
  title: L;
  blurb: L;
  href: string;
  /** filter group: scheme category or service category id */
  group: string;
  groupName: L;
  /** documents from the shared catalogue that this item needs (for "x of y ready") */
  docIds: string[];
  color: string;
  icon: string;
}

/** The curated Top 50, joined with the real service / scheme records. */
export function top50Entries(): TopEntry[] {
  const out: TopEntry[] = [];
  for (const t of top50) {
    if (t.type === "service") {
      const s = services.find((x) => x.slug === t.id);
      if (!s) continue;
      const cat = categories.find((c) => c.id === s.category)!;
      out.push({
        rank: t.rank,
        type: "service",
        id: s.slug,
        title: s.name,
        blurb: s.short,
        href: `/service/${s.slug}`,
        group: `svc-${s.category}`,
        groupName: cat.name,
        color: colorFor(s.category),
        icon: imageFor(s.slug, s.name.en),
        docIds: [...new Set(s.documents.map((d) => inferDocId(d.name.en)).filter((x): x is string => Boolean(x)))],
      });
    } else {
      const s = schemes.find((x) => x.id === t.id);
      if (!s) continue;
      const cat = schemeCategories.find((c) => c.id === s.category)!;
      out.push({ rank: t.rank, type: "scheme", id: s.id, title: s.title, blurb: s.benefit, href: `/schemes/${s.id}`, group: s.category, groupName: cat.name, docIds: s.docs, color: colorFor(s.category), icon: imageFor(s.id, s.title.en) });
    }
  }
  return out;
}
