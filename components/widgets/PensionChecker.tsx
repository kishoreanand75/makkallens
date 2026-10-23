"use client";

import { T } from "@/lib/lang";
import { schemes } from "@/lib/data";
import { useProfile } from "@/lib/hooks";
import { matchScheme } from "@/lib/match";
import { incomeBands, type IncomeBand } from "@/lib/profile";
import { SchemeRow } from "../scheme/SchemeCard";

/** Pension checker: two big inputs (age, income) and the pension schemes ranked by match. */
export function PensionChecker() {
  const { profile, update } = useProfile();
  const list = schemes
    .filter((s) => s.needs.includes("pension"))
    .map((s) => ({ scheme: s, match: matchScheme({ ...profile, occupation: profile.occupation === "senior" ? null : profile.occupation }, s) }))
    .sort((a, b) => b.match.score - a.match.score);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-display text-xl font-semibold">
            <T v={{ ta: "உங்கள் வயது", en: "Your age" }} />
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={110}
            value={profile.age ?? ""}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              update({ age: Number.isFinite(n) && n >= 1 && n <= 110 ? n : null });
            }}
            className="mt-2 block min-h-16 w-full rounded-xl border-2 border-ink bg-paper-2 px-4 text-center font-display text-3xl"
          />
        </label>
        <label className="block">
          <span className="font-display text-xl font-semibold">
            <T v={{ ta: "குடும்ப ஆண்டு வருமானம்", en: "Family yearly income" }} />
          </span>
          <select
            value={profile.income ?? ""}
            onChange={(e) => update({ income: (e.target.value || null) as IncomeBand | null })}
            className="mt-2 block min-h-16 w-full rounded-xl border-2 border-ink bg-paper-2 px-4 text-xl"
          >
            <option value="">--</option>
            {incomeBands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name.ta} / {b.name.en}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul className="mt-8 border-t border-line">
        {list.map((r) => (
          <SchemeRow key={r.scheme.id} scheme={r.scheme} match={r.match} />
        ))}
      </ul>
    </div>
  );
}
