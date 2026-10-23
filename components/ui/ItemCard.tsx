"use client";

import Image from "next/image";
import Link from "next/link";
import { T } from "@/lib/lang";
import type { L } from "@/lib/data";
import { useStore } from "@/lib/store";

export type CardLayout = "top" | "split" | "faded";
const KEY = "av-card-layout";
const DEFAULT: CardLayout = "split";

export function useCardLayout() {
  return useStore<CardLayout>(KEY, DEFAULT);
}

const options: { id: CardLayout; label: L; d: string }[] = [
  { id: "split", label: { ta: "பக்கத்தில் படம்", en: "Photo beside" }, d: "M3 5h8v14H3zM14 7h7M14 12h7M14 17h5" },
  { id: "top", label: { ta: "மேலே படம்", en: "Photo on top" }, d: "M3 4h18v9H3zM3 16h18M3 20h12" },
  { id: "faded", label: { ta: "மங்கிய பின்னணி", en: "Faded background" }, d: "M3 4h18v16H3zM8 9h8M8 13h5" },
];

/** Three ways to see the same cards; the choice is remembered on this device. */
export function CardLayoutSwitch() {
  const [layout, setLayout] = useCardLayout();
  return (
    <div role="group" aria-label="Card layout" className="inline-flex overflow-hidden rounded-lg border-2 border-ink">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={layout === o.id}
          onClick={() => setLayout(o.id)}
          title={o.label.en}
          className={`inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold ${layout === o.id ? "bg-ink text-white" : "bg-white hover:bg-tint"}`}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={o.d} />
          </svg>
          <span className="hidden xl:inline">
            <T v={o.label} />
          </span>
          <span className="sr-only xl:hidden">
            <T v={o.label} />
          </span>
        </button>
      ))}
    </div>
  );
}

/** One card, three layouts. Text and photo are never stacked on top of each other except in the optional "faded" layout. */
export function ItemCard({
  href,
  title,
  blurb,
  image,
  color,
  layout,
  rank,
  tag,
  meta,
  footer,
}: {
  href: string;
  title: L;
  blurb: L;
  image: string;
  color: string;
  layout: CardLayout;
  rank?: number;
  tag?: React.ReactNode;
  meta?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const style = { ["--c" as string]: color };
  const rankBadge =
    rank !== undefined ? (
      <span className="grid h-9 min-w-9 place-items-center rounded-md border-l-4 border-[color:var(--c)] bg-white px-2 font-display text-lg font-bold shadow-sm" aria-label={`#${rank}`}>
        {rank}
      </span>
    ) : null;
  const link = (
    <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-xl">
      <T v={title} />
    </Link>
  );
  const base = "group relative overflow-hidden rounded-xl border-2 border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--c)] hover:shadow-[0_16px_34px_-20px_rgb(0_0_0/0.5)]";

  if (layout === "faded") {
    return (
      <article style={style} className={`${base} flex h-full min-h-[13rem] flex-col p-4`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[78%] opacity-30 transition-opacity duration-700 ease-out [mask-image:linear-gradient(to_left,#000_25%,transparent)] group-hover:opacity-70">
          <Image src={image} alt="" fill sizes="(min-width: 1280px) 20vw, 40vw" className="object-cover object-[50%_30%] transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
        </div>
        <div className="relative flex items-center gap-2 text-sm font-semibold">
          {rankBadge}
          {tag}
        </div>
        <p className="relative mt-2 text-sm font-semibold text-ink-soft">{meta}</p>
        <h3 className="relative mt-0.5 text-lg leading-snug">{link}</h3>
        <p className="relative mt-1 line-clamp-2 text-base text-ink-soft">
          <T v={blurb} />
        </p>
        <div className="relative mt-auto pt-3">{footer}</div>
      </article>
    );
  }

  const photo = (
    <div className={`relative overflow-hidden bg-tint ${layout === "top" ? "aspect-[16/9]" : "w-[42%] shrink-0 self-stretch"}`}>
      <Image src={image} alt="" fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw" className="object-cover object-[50%_30%] transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
      {layout === "top" && (
        <>
          <span className="absolute left-3 top-3">{rankBadge}</span>
          <span className="absolute right-3 top-3">{tag}</span>
        </>
      )}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-[color:var(--c)]" />
    </div>
  );

  return (
    <article style={style} className={`${base} flex h-full ${layout === "top" ? "flex-col" : "flex-row"}`}>
      {photo}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {layout === "split" && (
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            {rankBadge}
            {tag}
          </div>
        )}
        <p className="text-sm font-semibold text-ink-soft">{meta}</p>
        <h3 className="mt-0.5 text-lg leading-snug">{link}</h3>
        <p className="mt-1 line-clamp-2 text-base text-ink-soft">
          <T v={blurb} />
        </p>
        <div className="mt-auto pt-3">{footer}</div>
      </div>
    </article>
  );
}
