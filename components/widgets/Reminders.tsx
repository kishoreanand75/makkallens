"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { T, useLang } from "@/lib/lang";
import { REMINDERS_KEY, daysUntil, recurringIdeas, toIcs, urgency, type Reminder } from "@/lib/reminders";
import { useStore } from "@/lib/store";

const NONE: Reminder[] = [];
const tone = { overdue: "border-ink text-ink", soon: "border-brand text-brand", later: "border-brand text-brand" } as const;
const word = {
  overdue: { ta: "தவறிவிட்டது", en: "Overdue" },
  soon: { ta: "விரைவில்", en: "Soon" },
  later: { ta: "பிறகு", en: "Later" },
} as const;

/** Deadline Radar: reminders are kept on this device; export to any calendar app with the .ics file. */
export function Reminders() {
  const { lang } = useLang();
  const params = useSearchParams();
  const [items, setItems] = useStore<Reminder[]>(REMINDERS_KEY, NONE);
  const [title, setTitle] = useState(params.get("remind") ?? "");
  const [due, setDue] = useState("");

  const sorted = [...items].sort((a, b) => a.due.localeCompare(b.due));
  const today = new Date().toISOString().slice(0, 10);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !due) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), title: title.trim().slice(0, 120), due }]);
    setTitle("");
    setDue("");
  };

  const exportIcs = () => {
    const blob = new Blob([toIcs(sorted)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arasu-vazhi-reminders.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="block">
          <span className="font-display text-base font-semibold">
            <T v={{ ta: "எதற்கு நினைவூட்டல்?", en: "Remind me about" }} />
          </span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="mt-1 min-h-12 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg"
            placeholder={lang === "ta" ? "எ.கா. உதவித்தொகை விண்ணப்பக் கடைசி நாள்" : "e.g. scholarship application deadline"}
          />
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold">
            <T v={{ ta: "தேதி", en: "Date" }} />
          </span>
          <input required type="date" min={today} value={due} onChange={(e) => setDue(e.target.value)} className="mt-1 min-h-12 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg" />
        </label>
        <button type="submit" className="min-h-12 rounded-lg bg-brand px-5 font-display text-lg font-semibold text-white hover:bg-brand-dark">
          <T v={{ ta: "சேர்", en: "Add" }} />
        </button>
      </form>

      <ul className="mt-6 border-t border-line" aria-live="polite">
        {sorted.map((r) => {
          const u = urgency(r.due);
          const n = daysUntil(r.due);
          return (
            <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line py-3">
              <span className={`rounded-full border-2 px-3 py-0.5 font-display text-sm font-semibold ${tone[u]}`}>
                <T v={word[u]} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold">{r.title}</span>
                <span className="text-sm text-ink-soft">
                  {new Date(`${r.due}T00:00:00`).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
                  {n === 0 ? <T v={{ ta: "இன்று", en: "today" }} /> : n > 0 ? <T v={{ ta: `${n} நாட்கள் உள்ளன`, en: `${n} day(s) left` }} /> : <T v={{ ta: `${-n} நாட்கள் ஆகிவிட்டன`, en: `${-n} day(s) ago` }} />}
                </span>
              </span>
              <button type="button" onClick={() => setItems((prev) => prev.filter((x) => x.id !== r.id))} className="min-h-12 px-3 font-display text-base font-semibold text-ink underline underline-offset-4">
                <T v={{ ta: "நீக்கு", en: "Remove" }} />
              </button>
            </li>
          );
        })}
      </ul>
      {sorted.length === 0 && (
        <p className="mt-4 text-ink-soft">
          <T v={{ ta: "இன்னும் நினைவூட்டல் இல்லை. மேலே சேருங்கள்.", en: "No reminders yet. Add one above." }} />
        </p>
      )}
      {sorted.length > 0 && (
        <button type="button" onClick={exportIcs} className="mt-4 min-h-12 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "📅 கேலண்டரில் சேர் (.ics)", en: "📅 Add to calendar (.ics)" }} />
        </button>
      )}

      <h3 className="mt-10 text-xl">
        <T v={{ ta: "அடிக்கடி மறந்துவிடும் தேதிகள்", en: "Dates people often forget" }} />
      </h3>
      <ul className="mt-2 space-y-2 text-ink-soft">
        {recurringIdeas.map((r) => (
          <li key={r.title.en} className="border-l-4 border-sun pl-4">
            <button type="button" onClick={() => setTitle(r.title[lang])} className="min-h-11 text-left font-display text-base font-semibold text-ink underline underline-offset-4">
              {r.title[lang]}
            </button>
            <span className="block text-base">{r.hint[lang]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-ink-soft">
        <T v={{ ta: "தேர்வு, உதவித்தொகைத் தேதிகள் ஆண்டுதோறும் மாறும்; அதிகாரப்பூர்வ அறிவிப்பைப் பார்த்துப் பின்னர் நீங்களே தேதியைச் சேருங்கள்.", en: "Exam and scholarship dates change every year; add the date yourself after reading the official notification." }} />
      </p>
    </div>
  );
}
