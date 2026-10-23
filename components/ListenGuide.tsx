"use client";

import { T, useLang } from "@/lib/lang";
import { useSpeechOutput } from "@/lib/speech";
import type { Service } from "@/lib/services";

/** Reads the whole guide aloud, one step at a time, using the device's speech engine. */
export function ListenGuide({ service }: { service: Service }) {
  const { lang } = useLang();
  const out = useSpeechOutput(lang);

  const script = () => {
    const parts = [
      service.name[lang],
      lang === "ta" ? "தேவையான ஆவணங்கள்." : "Documents needed.",
      ...service.documents.map((d) => d.name[lang]),
      lang === "ta" ? "படிகள்." : "Steps.",
      ...service.steps.map((s, i) => `${i + 1}. ${s.title[lang]}. ${s.detail[lang]}`),
      lang === "ta" ? "கட்டணம்." : "Fees.",
      service.fees[lang],
    ];
    return parts.join(" ");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => (out.speaking ? out.cancel() : out.speak(script()))}
        className="inline-flex min-h-12 items-center gap-2 rounded-lg border-2 border-ink bg-sun px-4 font-display text-lg font-bold hover:bg-brand hover:text-white"
      >
        <span aria-hidden="true">{out.speaking ? "■" : "▶"}</span>
        {out.speaking ? <T v={{ ta: "நிறுத்து", en: "Stop" }} /> : <T v={{ ta: "குரலில் கேளுங்கள்", en: "Listen to this guide" }} />}
      </button>
      {out.missingVoice && (
        <p role="status" className="mt-2 text-base text-ink">
          <T
            v={{
              ta: "இந்தச் சாதனத்தில் தமிழ் குரல் இல்லை. Text-to-speech அமைப்பில் தமிழ் குரலை நிறுவவும்.",
              en: "No Tamil voice on this device. Install one in your text-to-speech settings.",
            }}
          />
        </p>
      )}
    </div>
  );
}
