"use client";

import { T } from "@/lib/lang";
import { useSavedSchemes } from "@/lib/hooks";

export function SaveButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { has, toggle } = useSavedSchemes();
  const saved = has(id);
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 font-display text-base font-semibold ${compact ? "min-h-11 text-sm" : "min-h-12"} ${saved ? "border-brand bg-brand text-white" : "border-ink bg-white hover:bg-sun"}`}
    >
      <span aria-hidden="true">{saved ? "★" : "☆"}</span>
      {saved ? <T v={{ ta: "சேமிக்கப்பட்டது", en: "Saved" }} /> : <T v={{ ta: "சேமி", en: "Save" }} />}
    </button>
  );
}
