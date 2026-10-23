"use client";

import Link from "next/link";
import { T } from "@/lib/lang";
import { REMINDERS_KEY, daysUntil, type Reminder } from "@/lib/reminders";
import { useStore } from "@/lib/store";

const NONE: Reminder[] = [];

/** Shows reminders due within 7 days (or overdue). Renders nothing if there are none. */
export function RadarStrip() {
  const [items] = useStore<Reminder[]>(REMINDERS_KEY, NONE);
  const due = items.filter((r) => daysUntil(r.due) <= 7).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
  if (due.length === 0) return null;
  return (
    <section aria-label="Deadline radar" className="border-y-2 border-brand bg-sun-tint">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 sm:px-6">
        <span className="font-display text-base font-semibold">
          <T v={{ ta: "⏰ கடைசித் தேதி எச்சரிக்கை", en: "⏰ Deadline radar" }} />
        </span>
        {due.map((r) => {
          const n = daysUntil(r.due);
          return (
            <span key={r.id} className="text-base">
              {r.title} –{" "}
              <strong className={n < 0 ? "text-ink" : ""}>
                {n < 0 ? <T v={{ ta: "தவறிவிட்டது", en: "overdue" }} /> : n === 0 ? <T v={{ ta: "இன்று", en: "today" }} /> : <T v={{ ta: `${n} நாள்`, en: `${n}d` }} />}
              </strong>
            </span>
          );
        })}
        <Link href="/documents#reminders" className="ml-auto min-h-11 content-center font-display text-base font-semibold underline underline-offset-4">
          <T v={{ ta: "அனைத்தும் →", en: "All →" }} />
        </Link>
      </div>
    </section>
  );
}
