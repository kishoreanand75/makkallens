"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/lang";

/** Sticky tab strip with scroll-spy, so a long guide always shows where you are. */
export function SectionNav({ items }: { items: { id: string; label: { ta: string; en: string } }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Sections" className="sticky top-20 z-30 -mx-4 mb-8 border-b border-line bg-white px-4 sm:-mx-6 sm:px-6">
      <ul className="flex gap-1 overflow-x-auto">
        {items.map((i) => (
          <li key={i.id} className="shrink-0">
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={`inline-flex min-h-12 items-center border-b-4 px-4 font-display text-base font-semibold ${active === i.id ? "border-brand text-brand" : "border-transparent hover:border-sun"}`}
            >
              <T v={i.label} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
