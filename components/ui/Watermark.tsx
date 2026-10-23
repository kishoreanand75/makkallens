/** Decorative background letters / icons: pure ornament, hidden from assistive tech, never intercepts clicks. */
export function Watermark({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute select-none font-display font-bold leading-none ${className}`}>
      {text}
    </span>
  );
}

const paths = {
  doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  rupee: "M7 5h10M7 9h10M7 5c5 0 8 2 8 5s-3 5-8 5l7 5",
  leaf: "M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  home: "M3 11l9-8 9 8v10H3z",
  heart: "M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
};

export type BgIconName = keyof typeof paths;

export function BgIcon({ name, className = "" }: { name: BgIconName; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none absolute ${className}`}>
      <path d={paths[name]} />
    </svg>
  );
}
