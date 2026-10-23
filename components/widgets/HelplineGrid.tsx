import { helplines, type Helpline } from "@/lib/data";
import { T } from "@/lib/lang";

/** Tap-to-call helplines. Plain links, so they work without JavaScript. */
export function HelplineGrid({ kinds }: { kinds?: Helpline["kind"][] }) {
  const list = kinds ? helplines.filter((h) => kinds.includes(h.kind)) : helplines;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {list.map((h) => (
        <li key={h.num}>
          <a
            href={`tel:${h.num}`}
            className={`flex min-h-16 items-center gap-4 rounded-xl border-2 px-4 py-3 ${
              h.kind === "emergency" ? "border-ink bg-sun-tint hover:bg-sun-tint" : "border-ink bg-paper-2 hover:bg-sun/30"
            }`}
          >
            <span className={`font-display text-2xl font-semibold tabular-nums sm:text-3xl ${h.kind === "emergency" ? "text-ink" : "text-ink"}`}>{h.num}</span>
            <span className="text-lg leading-snug">
              <T v={h.name} />
              <span className="block text-sm text-ink-soft">
                <T v={{ ta: "அழைக்கத் தட்டவும்", en: "Tap to call" }} />
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
