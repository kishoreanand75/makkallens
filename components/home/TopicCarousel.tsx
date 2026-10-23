"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "@/lib/lang";
import type { Topic } from "@/lib/categories";

export interface CarouselItem {
  topic: Topic;
  count?: { ta: string; en: string };
}

/** Horizontal scroll-snap carousel of section cards with prev / next buttons and a "view all" link. */
export function TopicCarousel({ items }: { items: CarouselItem[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? 280;
    el.scrollBy({ left: dir * (card + 20) * 2, behavior: "smooth" });
  };

  const arrow = "grid size-12 place-items-center rounded-full border-2 border-ink bg-white text-xl transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink";

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <button type="button" onClick={() => go(-1)} disabled={edge.start} className={arrow} aria-label="Previous">
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} className={arrow} aria-label="Next">
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul
        ref={track}
        onScroll={measure}
        aria-label="Sections"
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
      >
        {items.map(({ topic, count }, i) => (
          <li key={topic.id} className="w-[15.5rem] shrink-0 snap-start sm:w-[17rem]">
            <Link
              href={topic.href}
              style={{ ["--c" as string]: topic.color }}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-tint shadow-[0_18px_40px_-26px_rgb(0_0_0/0.55)]">
                <Image src={topic.image} alt={topic.imageAlt.ta} fill sizes="17rem" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <span className="absolute left-3 top-3 grid size-10 place-items-center rounded-full bg-white font-display text-sm font-bold shadow-md" style={{ color: topic.color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="absolute bottom-3 right-3 grid size-11 translate-y-2 place-items-center rounded-full bg-white text-xl opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: topic.color }}>
                  →
                </span>
              </div>
              <div className="px-1 pt-3">
                <h3 className="text-lg leading-snug [overflow-wrap:anywhere]">
                  <T v={topic.name} />
                </h3>
                <p className="mt-0.5 line-clamp-2 text-base text-ink-soft">
                  <T v={topic.blurb} />
                </p>
                {count && (
                  <span className="mt-2 inline-block rounded-full px-3 py-0.5 text-sm font-semibold" style={{ background: "color-mix(in srgb, var(--c) 14%, white)" }}>
                    <T v={count} />
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Link href="/explore" className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-ink px-7 font-display text-lg font-semibold hover:bg-gold">
          <T v={{ ta: "அனைத்தையும் பாருங்கள்", en: "View all sections" }} /> <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
