"use client";

import { useEffect, useId, useRef } from "react";
import { T } from "@/lib/lang";

/** Opens from the right on desktop and rises as a bottom sheet on phones. Focus-trapped, Esc / backdrop to close, restores focus. */
export function FilterDrawer({
  open,
  onClose,
  title,
  children,
  onReset,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  title: { ta: string; en: string };
  children: React.ReactNode;
  onReset?: () => void;
  resultCount?: number;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter((e) => !e.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        inert={!open}
        className={`absolute flex flex-col border-ink bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,0.8,0.2,1)]
          inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t-4 ${open ? "translate-y-0" : "translate-y-full"}
          sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-none sm:border-l-4 sm:border-t-0 ${open ? "sm:translate-x-0" : "sm:translate-x-full sm:translate-y-0"}`}
      >
        <div className="flex items-center justify-between gap-3 border-b-4 border-brand px-5 py-4">
          <h2 id={id} className="text-xl">
            <T v={title} />
          </h2>
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border-2 border-ink text-xl hover:bg-sun" aria-label="Close">
            ×
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex items-center gap-3 border-t border-line bg-white px-5 py-4">
          {onReset && (
            <button type="button" onClick={onReset} className="min-h-12 whitespace-nowrap rounded-lg px-3 font-display text-base font-semibold underline underline-offset-4">
              <T v={{ ta: "மீட்டமை", en: "Reset" }} />
            </button>
          )}
          <button type="button" onClick={onClose} className="ml-auto min-h-12 whitespace-nowrap rounded-xl bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark">
            {resultCount !== undefined ? <T v={{ ta: `${resultCount} காட்டு`, en: `Show ${resultCount}` }} /> : <T v={{ ta: "முடிந்தது", en: "Done" }} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Pill-shaped button that opens a FilterDrawer; shows how many filters are active. */
export function FilterButton({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-ink bg-paper-2 px-5 font-display text-base font-semibold hover:bg-sun"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M4 6h16M7 12h10M10 18h4" />
      </svg>
      <T v={{ ta: "வடிகட்டி", en: "Filters" }} />
      {count > 0 && <span className="grid size-6 place-items-center rounded-full bg-brand text-sm text-white">{count}</span>}
    </button>
  );
}

export function FilterGroup({ label, children }: { label: { ta: string; en: string }; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">
        <T v={label} />
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 rounded-lg border-2 px-4 font-display text-base font-semibold transition-colors ${active ? "border-brand bg-brand text-white" : "border-line hover:border-ink"}`}
    >
      {children}
    </button>
  );
}
