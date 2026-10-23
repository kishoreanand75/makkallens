"use client";

import { useState } from "react";
import { T, useLang } from "@/lib/lang";

type State = "idle" | "sending" | "done" | "error";

/** "Report outdated information" – goes to the admin review queue; nothing is published automatically. */
export function ReportForm({ target, kind = "outdated" }: { target: string; kind?: "outdated" | "contact" | "waitlist" }) {
  const { lang } = useLang();
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, target, message, contact, website }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setMessage("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-lg border-2 border-brand bg-brand/10 p-4 font-display text-lg font-semibold text-brand">
        {kind === "outdated" ? (
          <T v={{ ta: "நன்றி! எங்கள் குழு சரிபார்த்த பின்பே மாற்றம் வெளியாகும்.", en: "Thank you! Our team verifies before anything is changed." }} />
        ) : (
          <T v={{ ta: "நன்றி! உங்கள் செய்தி கிடைத்தது.", en: "Thank you! We received your message." }} />
        )}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label htmlFor={`rp-${target}`} className="font-display text-base font-semibold">
          {kind === "outdated" ? (
            <T v={{ ta: "என்ன மாறியுள்ளது / தவறாக உள்ளது?", en: "What is outdated or wrong?" }} />
          ) : kind === "waitlist" ? (
            <T v={{ ta: "எந்தத் திட்டம் வேண்டும்?", en: "Which plan do you want?" }} />
          ) : (
            <T v={{ ta: "உங்கள் செய்தி", en: "Your message" }} />
          )}
        </label>
        <textarea
          id={`rp-${target}`}
          required
          minLength={3}
          maxLength={1000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border-2 border-ink bg-paper-2 p-3 text-lg"
          placeholder={lang === "ta" ? "எ.கா. கட்டணம் மாறியுள்ளது; புதிய இணைப்பு இது…" : "e.g. the fee has changed; the new link is…"}
        />
      </div>
      <div>
        <label htmlFor={`rc-${target}`} className="font-display text-base font-semibold">
          <T v={{ ta: "தொடர்புக்கு (விருப்பம்)", en: "Contact (optional)" }} />
        </label>
        <input
          id={`rc-${target}`}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          maxLength={120}
          className="mt-1 min-h-12 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg"
          autoComplete="off"
        />
      </div>
      {/* honeypot – hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input tabIndex={-1} value={website} onChange={(e) => setWebsite(e.target.value)} autoComplete="off" />
        </label>
      </div>
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-lg bg-brand px-5 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {state === "sending" ? <T v={{ ta: "அனுப்புகிறது…", en: "Sending…" }} /> : <T v={{ ta: "அனுப்பு", en: "Send" }} />}
      </button>
      {state === "error" && (
        <p role="alert" className="text-ink">
          <T v={{ ta: "அனுப்ப முடியவில்லை. சிறிது நேரம் கழித்து முயலுங்கள்.", en: "Could not send. Please try again shortly." }} />
        </p>
      )}
    </form>
  );
}
