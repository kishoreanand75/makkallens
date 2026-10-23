"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { T, useLang } from "@/lib/lang";
import { useSpeechInput } from "@/lib/speech";
import { MicButton } from "./MicButton";

export function AskBox({ examples }: { examples: { ta: string; en: string }[] }) {
  const router = useRouter();
  const { lang } = useLang();
  const [value, setValue] = useState("");

  const go = (q: string) => {
    const t = q.trim();
    if (t) router.push(`/ask?q=${encodeURIComponent(t)}`);
  };

  const mic = useSpeechInput(lang, (text) => {
    setValue(text);
    go(text);
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(value);
        }}
        className="flex items-stretch gap-2"
        role="search"
      >
        <label htmlFor="home-ask" className="sr-only">
          <T v={{ ta: "உங்கள் கேள்வி", en: "Your question" }} />
        </label>
        <input
          id="home-ask"
          value={mic.listening ? mic.interim : value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={lang === "ta" ? "எ.கா. பிறப்புச் சான்றிதழ் எப்படி எடுப்பது?" : "e.g. How do I get a birth certificate?"}
          className="min-h-14 min-w-0 flex-1 rounded-lg border-2 border-ink bg-white px-5 text-lg placeholder:text-ink-soft/70"
          autoComplete="off"
        />
        <MicButton listening={mic.listening} supported={mic.supported} onClick={mic.listening ? mic.stop : mic.start} />
        <button
          type="submit"
          className="min-h-14 rounded-lg bg-brand px-7 font-display text-lg font-semibold text-white hover:bg-brand-dark"
        >
          <T v={{ ta: "கேள்", en: "Ask" }} />
        </button>
      </form>
      {mic.error && (
        <p role="status" className="mt-2 border-l-4 border-sun bg-sun-tint p-2 text-base">
          <T
            v={{
              ta: "குரலைப் பிடிக்க முடியவில்லை. மைக் அனுமதியைச் சரிபார்க்கவும் அல்லது தட்டச்சு செய்யவும்.",
              en: "Could not capture voice. Check microphone permission or type instead.",
            }}
          />
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Examples">
        {examples.map((ex) => (
          <li key={ex.en}>
            <button
              type="button"
              onClick={() => go(ex[lang])}
              className="min-h-11 rounded-lg border-2 border-line px-4 text-base transition-colors hover:border-brand hover:bg-tint"
            >
              {ex[lang]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
