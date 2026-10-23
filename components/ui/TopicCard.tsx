import Image from "next/image";
import Link from "next/link";
import { T } from "@/lib/lang";
import type { Topic } from "@/lib/categories";

/** Photograph on top, plain white text panel below – no overlay on the picture. */
export function TopicCard({ topic, index, count, className = "" }: { topic: Topic; index: number; count?: { ta: string; en: string }; className?: string }) {
  return (
    <Link href={topic.href} style={{ ["--c" as string]: topic.color }} className={`photo-card group flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-white transition-colors hover:border-[color:var(--c)] ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink">
        <Image src={topic.image} alt={topic.imageAlt.ta} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 50vw" className="object-cover object-[50%_20%]" />
        <span className="absolute left-0 top-0 grid h-8 min-w-8 place-items-center bg-white px-2 font-display text-sm font-bold" style={{ borderBottom: "3px solid var(--c)" }}>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-base leading-snug [overflow-wrap:anywhere] sm:text-lg">
          <T v={topic.name} />
        </h3>
        <p className="mt-1 hidden text-sm text-ink-soft sm:block">
          <T v={topic.blurb} />
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          {count ? (
            <span className="rounded-full px-2.5 py-0.5 text-sm font-semibold" style={{ background: "color-mix(in srgb, var(--c) 15%, white)" }}>
              <T v={count} />
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex shrink-0 items-center gap-1 font-display text-sm font-semibold text-[color:var(--c)]">
            <T v={{ ta: "பார்க்க", en: "Explore" }} />
            <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
