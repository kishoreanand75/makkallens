import { T } from "@/lib/lang";
import type { MatchResult } from "@/lib/match";

const label = {
  high: { ta: "மிகவும் பொருந்தும்", en: "Strong match" },
  medium: { ta: "ஒருவேளை பொருந்தும்", en: "Possible match" },
  low: { ta: "குறைவாகப் பொருந்தும்", en: "Weak match" },
  none: { ta: "தகுதி இல்லை", en: "Not eligible" },
} as const;

// green = go, amber = maybe, red = no. Colour is never the only signal: the percentage and the words are always shown.
const bar = { high: "bg-brand", medium: "bg-warn", low: "bg-warn", none: "bg-alert" } as const;

export function MatchBadge({ match }: { match: MatchResult }) {
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`${match.score}% – ${label[match.band].en}`}>
      <div className="h-2.5 w-24 shrink-0 overflow-hidden rounded-full border border-ink bg-white" aria-hidden="true">
        <div className={`h-full ${bar[match.band]}`} style={{ width: `${Math.max(match.score, 4)}%` }} />
      </div>
      <span className="font-display text-sm font-semibold">
        {match.score}% · <T v={label[match.band]} />
      </span>
    </div>
  );
}
