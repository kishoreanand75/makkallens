import { Reveal } from "@/components/Reveal";
import { T } from "@/lib/lang";
import type { L } from "@/lib/data";

export interface TimelineStep {
  title: L;
  detail: L;
  action?: React.ReactNode;
}

/** Vertical journey: numbered green nodes joined by a rail that draws itself as each step scrolls into view. */
export function StepTimeline({ steps }: { steps: TimelineStep[]; accent?: string }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={i} className="relative pl-14 sm:pl-16">
          <Reveal className="group pb-8 last:pb-0" delay={0.04} variant="right">
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute -left-[2.2rem] bottom-0 top-11 w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-[1200ms] ease-out group-[.in]:scale-y-100 sm:-left-[2.45rem]" />
            )}
            <span aria-hidden="true" className="absolute -left-14 top-0 grid size-10 place-items-center rounded-full border-2 border-brand bg-brand font-display text-lg font-semibold text-white sm:-left-16 sm:size-12 sm:text-xl">
              {i + 1}
            </span>
            <h3 className="text-xl sm:text-2xl">
              <T v={s.title} />
            </h3>
            <p className="mt-1 max-w-2xl text-ink-soft">
              <T v={s.detail} />
            </p>
            {s.action && <div className="mt-3 flex flex-wrap gap-3">{s.action}</div>}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
