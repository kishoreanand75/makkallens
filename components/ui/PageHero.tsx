import Image from "next/image";
import Link from "next/link";
import { T } from "@/lib/lang";
import type { L } from "@/lib/data";
import { topics, type EmblemId } from "@/lib/categories";

/**
 * Inner-page heading band: plain light-green wash, title and actions on the left, the topic's photograph on the right
 * in a black frame with a yellow offset block. No overlays, no gradients.
 */
export function PageHero({
  topic,
  title,
  intro,
  kicker,
  badges,
  actions,
  crumb,
  image,
  noImage = false,
}: {
  topic: EmblemId;
  title: L;
  intro?: L;
  kicker?: L;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  crumb?: { href: string; label: L };
  image?: string;
  noImage?: boolean;
}) {
  const tp = topics[topic];
  return (
    <header className="overflow-x-clip border-b border-line" style={{ background: "color-mix(in srgb, " + tp.color + " 9%, white)" }}>
      <div className={`mx-auto grid max-w-6xl items-center gap-6 px-4 py-7 sm:px-6 sm:py-9 ${noImage ? "" : "md:grid-cols-[1fr_21rem]"}`}>
        <div className="min-w-0">
          {crumb && (
            <Link href={crumb.href} className="link-draw mb-3 inline-flex min-h-11 items-center text-base font-semibold text-brand">
              ← <T v={crumb.label} />
            </Link>
          )}
          {kicker && (
            <p className="mb-2 flex items-center gap-2 font-display text-base font-semibold text-brand">
              <span aria-hidden="true" className="h-4 w-1.5" style={{ background: tp.color }} />
              <T v={kicker} />
            </p>
          )}
          <h1 className="fade-up max-w-3xl text-[2rem] leading-[1.2] sm:text-[2.6rem]">
            <T v={title} />
          </h1>
          {intro && (
            <p className="fade-up mt-3 max-w-2xl text-lg text-ink-soft sm:text-xl" style={{ ["--d" as string]: "0.1s" }}>
              <T v={intro} />
            </p>
          )}
          {badges && (
            <div className="fade-up mt-4 flex flex-wrap items-center gap-2" style={{ ["--d" as string]: "0.16s" }}>
              {badges}
            </div>
          )}
          {actions && (
            <div className="fade-up mt-5 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "0.22s" }}>
              {actions}
            </div>
          )}
        </div>
        {!noImage && (
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full rounded-xl" style={{ background: "color-mix(in srgb, " + tp.color + " 35%, white)" }} />
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border-2 border-ink bg-white md:aspect-[4/3]">
              <Image src={image ?? tp.image} alt={tp.imageAlt.ta} fill priority sizes="(min-width: 768px) 21rem, 90vw" className="object-cover object-[50%_25%]" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
