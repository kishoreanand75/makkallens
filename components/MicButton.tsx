"use client";

import { T } from "@/lib/lang";

export function MicButton({
  listening,
  supported,
  onClick,
  size = "lg",
}: {
  listening: boolean;
  supported: boolean;
  onClick: () => void;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "size-14" : "size-12";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!supported}
      aria-pressed={listening}
      className={`${dim} shrink-0 rounded-full border-2 border-ink grid place-items-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        listening ? "mic-live bg-ink text-white" : "bg-tint text-ink hover:bg-brand hover:text-white"
      }`}
      title={supported ? undefined : "இந்த உலாவியில் குரல் உள்ளீடு இல்லை (Chrome பயன்படுத்தவும்)"}
    >
      <span className="sr-only">
        {listening ? <T v={{ ta: "கேட்கிறது – நிறுத்த அழுத்தவும்", en: "Listening – press to stop" }} /> : <T v={{ ta: "பேசிக் கேளுங்கள்", en: "Speak your question" }} />}
      </span>
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="9" y="3" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    </button>
  );
}
