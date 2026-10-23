import { PageHero } from "./ui/PageHero";
import { Reveal } from "./Reveal";
import { T } from "@/lib/lang";
import type { L } from "@/lib/data";
import { topics, type EmblemId } from "@/lib/categories";

/** Inner-page frame: photo heading band, then the content on white. */
export function TopicShell({ topic, title, intro, children }: { topic: EmblemId; title: L; intro: L; children: React.ReactNode; wide?: boolean }) {
  return (
    <div>
      <PageHero topic={topic} title={title} intro={intro} kicker={topics[topic].name} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 pb-14 pt-8 sm:px-6">{children}</div>
    </div>
  );
}

export function Section({ id, title, hint, children }: { id?: string; title: L; hint?: L; children: React.ReactNode }) {
  return (
    <Reveal as="section">
      <div id={id} className="scroll-mt-28">
        <div className="flex items-center gap-3 border-b-2 border-ink pb-2">
          <span aria-hidden="true" className="h-7 w-2 shrink-0 bg-sun" />
          <h2 className="text-2xl sm:text-3xl">
            <T v={title} />
          </h2>
        </div>
        {hint && (
          <p className="mt-2 max-w-2xl text-ink-soft">
            <T v={hint} />
          </p>
        )}
        <div className="mt-5">{children}</div>
      </div>
    </Reveal>
  );
}

export function LinkList({ items }: { items: { title: L; note?: L; url: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.url + it.title.en}>
          <a href={it.url} target="_blank" rel="noopener noreferrer" className="row-link flex h-full items-center gap-4 rounded-lg border-2 border-line bg-white p-4 transition-colors hover:border-brand">
            <span className="flex-1">
              <span className="block font-display text-lg font-semibold">
                <T v={it.title} />
              </span>
              {it.note && (
                <span className="block text-base text-ink-soft">
                  <T v={it.note} />
                </span>
              )}
              <span className="mt-1 block text-sm font-bold text-brand">{new URL(it.url).host} ↗</span>
            </span>
            <span aria-hidden="true" className="arrow text-2xl text-brand">
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
