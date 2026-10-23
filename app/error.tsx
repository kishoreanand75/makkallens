"use client";

import { useEffect } from "react";
import { T } from "@/lib/lang";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Minimal error reporting (message + path only, no user data) until Sentry is configured.
    fetch("/api/log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: error.message, path: location.pathname }) }).catch(() => undefined);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6" role="alert">
      <h1 className="text-3xl sm:text-4xl">
        <T v={{ ta: "மன்னிக்கவும், ஏதோ தவறாகிவிட்டது", en: "Sorry, something went wrong" }} />
      </h1>
      <p className="mt-3 text-xl text-ink-soft">
        <T v={{ ta: "மீண்டும் முயலுங்கள். தொடர்ந்தால் தொடர்புப் பக்கத்தில் தெரிவியுங்கள்.", en: "Please try again. If it keeps happening, tell us on the Contact page." }} />
      </p>
      <button type="button" onClick={reset} className="mt-8 min-h-12 rounded-lg bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark">
        <T v={{ ta: "மீண்டும் முயல்", en: "Try again" }} />
      </button>
    </div>
  );
}
