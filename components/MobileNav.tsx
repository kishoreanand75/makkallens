"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/lang";

const items = [
  { href: "/", label: { ta: "முகப்பு", en: "Home" }, d: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11z" },
  { href: "/popular", label: { ta: "முதல் 50", en: "Top 50" }, d: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" },
  { href: "/ask", label: { ta: "கேளுங்கள்", en: "Ask" }, d: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" },
  { href: "/profile", label: { ta: "எனக்காக", en: "For me" }, d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { href: "/explore", label: { ta: "மேலும்", en: "More" }, d: "M5 12h.01M12 12h.01M19 12h.01" },
];

/** Thumb-reach bottom navigation for phones; the header carries the same links from `lg` up. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t-4 border-brand bg-white pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden">
      {items.map((it) => {
        const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold ${active ? "bg-sun text-ink" : "text-ink-soft"}`}>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={it.d} />
            </svg>
            <T v={it.label} />
          </Link>
        );
      })}
    </nav>
  );
}
