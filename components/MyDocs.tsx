"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { T } from "@/lib/lang";
import { documents, getDoc } from "@/lib/data";
import { useMyDocs } from "@/lib/hooks";

const groups: { id: string; name: { ta: string; en: string }; ids: string[] }[] = [
  { id: "identity", name: { ta: "அடையாளம்", en: "Identity" }, ids: ["aadhaar", "voter", "pan", "photo", "mobile"] },
  { id: "family", name: { ta: "குடும்பம் & முகவரி", en: "Family & address" }, ids: ["ration", "birth", "age", "address"] },
  { id: "certs", name: { ta: "சான்றிதழ்கள்", en: "Certificates" }, ids: ["community", "income", "marks", "disability"] },
  { id: "money", name: { ta: "பணம் & நிலம்", en: "Money & land" }, ids: ["bank", "land"] },
];

/**
 * Floating "My documents" button (left edge on desktop, above the tab bar on phones) and its popup.
 * Tick what you have and press Save – the whole site then shows you what is ready and what is missing.
 */
export function MyDocs() {
  const my = useMyDocs();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  const show = useCallback(() => {
    opener.current = document.activeElement;
    setDraft(my.ids);
    setSaved(false);
    setOpen(true);
  }, [my.ids]);

  useEffect(() => {
    window.addEventListener("av:open-docs", show);
    return () => window.removeEventListener("av:open-docs", show);
  }, [show]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter((e) => !e.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, close]);

  const toggle = (id: string) => setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const save = () => {
    my.save(draft);
    setSaved(true);
    setTimeout(() => setOpen(false), 700);
  };
  const total = documents.length;

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-label={`My documents ${my.ids.length}/${total}`}
        className="group fixed bottom-[9rem] left-3 z-30 inline-flex h-12 items-center overflow-hidden rounded-full border-2 border-ink bg-white pl-3 pr-1 text-ink shadow-[0_6px_20px_rgb(0_0_0/0.18)] transition-colors hover:bg-brand hover:text-white focus-visible:bg-brand focus-visible:text-white lg:bottom-auto lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:rounded-l-none lg:border-l-0 print:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-base font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[11rem] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[11rem] group-focus-visible:opacity-100">
          <T v={{ ta: "என் ஆவணங்கள்", en: "My documents" }} />
        </span>
        <span className="ml-2 grid h-9 min-w-9 place-items-center rounded-full bg-gold px-1.5 text-sm font-bold text-ink">
          {my.ids.length}/{total}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-end bg-ink/50 sm:place-items-center" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl border-2 border-ink bg-white sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3 border-b-4 border-brand px-5 py-4">
              <div>
                <h2 id={titleId} className="text-xl sm:text-2xl">
                  <T v={{ ta: "என் ஆவணங்கள்", en: "My documents" }} />
                </h2>
                <p className="text-base text-ink-soft">
                  <T v={{ ta: "உங்களிடம் உள்ளவற்றைத் தேர்ந்தெடுத்துச் சேமியுங்கள். எண்கள், படங்கள் தேவையில்லை.", en: "Tick what you have and save. No numbers or images needed." }} />
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink text-xl hover:bg-sun">
                ×
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              {groups.map((g) => (
                <fieldset key={g.id}>
                  <legend className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-brand">
                    <T v={g.name} />
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {g.ids.map((id) => {
                      const d = getDoc(id);
                      if (!d) return null;
                      const on = draft.includes(id);
                      return (
                        <label key={id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2 ${on ? "border-brand bg-tint" : "border-line hover:border-ink"}`}>
                          <input type="checkbox" checked={on} onChange={() => toggle(id)} className="size-5 shrink-0 accent-[var(--brand)]" />
                          <span className="font-display text-base font-semibold leading-snug">
                            <T v={d.name} />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4">
              <button type="button" onClick={() => setDraft([])} className="min-h-12 px-2 font-display text-base font-semibold underline underline-offset-4">
                <T v={{ ta: "அனைத்தையும் நீக்கு", en: "Clear all" }} />
              </button>
              <button type="button" onClick={() => setDraft(documents.map((d) => d.id))} className="min-h-12 px-2 font-display text-base font-semibold underline underline-offset-4">
                <T v={{ ta: "அனைத்தும் உள்ளன", en: "I have all" }} />
              </button>
              <span role="status" className="min-w-0 flex-1 text-right font-display text-base font-semibold text-brand">
                {saved ? <T v={{ ta: "சேமிக்கப்பட்டது ✓", en: "Saved ✓" }} /> : <T v={{ ta: `${draft.length} தேர்வு`, en: `${draft.length} selected` }} />}
              </span>
              <button type="button" onClick={close} className="min-h-12 rounded-lg border-2 border-ink px-5 font-display text-base font-semibold hover:bg-sun">
                <T v={{ ta: "ரத்து", en: "Cancel" }} />
              </button>
              <button type="button" onClick={save} className="min-h-12 rounded-lg bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark">
                <T v={{ ta: "சேமி", en: "Save" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
