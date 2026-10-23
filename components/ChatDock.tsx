"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { T, useLang } from "@/lib/lang";
import { useSpeechInput } from "@/lib/speech";
import { LogoMark } from "./Logo";
import { MicButton } from "./MicButton";

const examples = [
  { ta: "சாதிச் சான்றிதழ் எப்படி எடுப்பது?", en: "How to get a community certificate?" },
  { ta: "மகளிர் உரிமைத் தொகை யாருக்கு?", en: "Who gets Magalir Urimai?" },
  { ta: "முதலமைச்சர் யார்?", en: "Who is the Chief Minister?" },
];

/** Round chat button at the bottom-left of every page; opens a small ask panel that hands the question to /ask. */
export function ChatDock() {
  const router = useRouter();
  const path = usePathname();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const go = (q: string) => {
    const t = q.trim();
    if (!t) return;
    setOpen(false);
    setValue("");
    router.push(`/ask?q=${encodeURIComponent(t)}`);
  };
  const mic = useSpeechInput(lang, (text) => go(text));

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  if (path === "/ask") return null;

  return (
    <div className="fixed bottom-[4.75rem] left-3 z-40 print:hidden lg:bottom-5 lg:left-5">
      {open && (
        <section role="dialog" aria-label="Ask" className="absolute bottom-16 left-0 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[0_18px_50px_rgb(0_0_0/0.25)]">
          <header className="flex items-center gap-3 bg-brand px-4 py-3 text-white">
            <span className="grid size-10 place-items-center rounded-full bg-white" aria-hidden="true"><LogoMark className="size-8" /></span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-display text-base font-semibold">
                <T v={{ ta: "MakkalLens உதவியாளர்", en: "MakkalLens assistant" }} />
              </p>
              <p className="text-sm text-white/85">
                <T v={{ ta: "தமிழில் கேளுங்கள் – தட்டச்சு அல்லது குரல்", en: "Ask in Tamil – type or speak" }} />
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full hover:bg-white/15" aria-label="Close">
              <span aria-hidden="true" className="text-xl">×</span>
            </button>
          </header>
          <div className="p-4">
            <p className="max-w-[16rem] rounded-2xl rounded-tl-sm bg-tint p-3 text-base">
              <T v={{ ta: "வணக்கம்! எந்தச் சான்றிதழ் அல்லது திட்டம் பற்றி அறிய வேண்டும்?", en: "Hello! Which certificate or scheme do you want to know about?" }} />
            </p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Examples">
              {examples.map((ex) => (
                <li key={ex.en}>
                  <button type="button" onClick={() => go(ex[lang])} className="min-h-11 rounded-lg border-2 border-line px-3 text-left text-sm hover:border-brand hover:bg-tint">
                    {ex[lang]}
                  </button>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                go(value);
              }}
              className="mt-4 flex items-center gap-2"
            >
              <label htmlFor="dock-q" className="sr-only">
                <T v={{ ta: "உங்கள் கேள்வி", en: "Your question" }} />
              </label>
              <input id="dock-q" ref={input} value={mic.listening ? mic.interim : value} onChange={(e) => setValue(e.target.value)} placeholder={lang === "ta" ? "உங்கள் கேள்வி…" : "Your question…"} autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-lg border-2 border-ink px-3 text-base" />
              <MicButton size="md" listening={mic.listening} supported={mic.supported} onClick={mic.listening ? mic.stop : mic.start} />
              <button type="submit" className="min-h-12 rounded-lg bg-brand px-4 font-display text-base font-semibold text-white hover:bg-brand-dark">
                <T v={{ ta: "கேள்", en: "Ask" }} />
              </button>
            </form>
          </div>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={lang === "ta" ? "உதவியாளரிடம் கேளுங்கள்" : "Ask the assistant"}
        className="relative grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_8px_24px_rgb(10_107_61/0.45)] transition-transform hover:scale-105 hover:bg-brand-dark"
      >
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12zM8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />}
        </svg>
        {!open && <span aria-hidden="true" className="absolute right-0 top-0 size-4 rounded-full border-2 border-white bg-gold" />}
      </button>
    </div>
  );
}
