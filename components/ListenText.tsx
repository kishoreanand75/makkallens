"use client";

import { T, useLang } from "@/lib/lang";
import { useSpeechOutput } from "@/lib/speech";

/** "Listen" button for any bilingual text block. `parts` are read one after the other in the current language. */
export function ListenText({ parts }: { parts: { ta: string; en: string }[] }) {
  const { lang } = useLang();
  const out = useSpeechOutput(lang);
  return (
    <div>
      <button
        type="button"
        onClick={() => (out.speaking ? out.cancel() : out.speak(parts.map((p) => p[lang]).join(". ")))}
        className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-ink bg-sun px-4 font-display text-lg font-semibold hover:bg-brand hover:text-white"
      >
        <span aria-hidden="true">{out.speaking ? "■" : "▶"}</span>
        {out.speaking ? <T v={{ ta: "நிறுத்து", en: "Stop" }} /> : <T v={{ ta: "குரலில் கேளுங்கள்", en: "Listen" }} />}
      </button>
      {out.missingVoice && (
        <p role="status" className="mt-2 text-base text-ink">
          <T v={{ ta: "இந்தச் சாதனத்தில் தமிழ் குரல் இல்லை. Text-to-speech அமைப்பில் தமிழ் குரலை நிறுவவும்.", en: "No Tamil voice on this device. Install one in your text-to-speech settings." }} />
        </p>
      )}
    </div>
  );
}
