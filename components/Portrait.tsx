/* eslint-disable @next/next/no-img-element -- small static portraits from /public/photos, sizes fixed by CSS */
import { photoFor } from "@/lib/people";

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z .]/g, "")
    .split(/[ .]+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Open-licensed portrait when we have one, otherwise a monogram. Never a stand-in photo of someone else. */
export function Portrait({ id, name, className = "" }: { id: string; name: string; className?: string }) {
  const p = photoFor(id);
  if (p) {
    return (
      <img
        src={`/photos/${p.file}`}
        alt={name}
        loading="lazy"
        decoding="async"
        className={`object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={name}
      className={`grid place-items-center bg-brand/10 font-display text-2xl font-semibold text-ink-soft ${className}`}
    >
      {initials(name) || "•"}
    </div>
  );
}
