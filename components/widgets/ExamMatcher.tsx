"use client";

import Link from "next/link";
import { T, useLang } from "@/lib/lang";
import { eduLevels, exams, type EduLevel } from "@/lib/data";
import { useProfile } from "@/lib/hooks";
import { matchExam } from "@/lib/match";
import { Reveal } from "../Reveal";

const tone = {
  eligible: { cls: "border-brand text-brand", label: { ta: "தகுதி பொருந்தும்", en: "You qualify" } },
  check: { cls: "border-brand text-brand", label: { ta: "சரிபார்க்கவும்", en: "Check details" } },
  no: { cls: "border-ink text-ink", label: { ta: "தகுதி இல்லை", en: "Not eligible" } },
} as const;

export function ExamMatcher() {
  const { lang } = useLang();
  const { profile, update } = useProfile();
  const ranked = exams.map((ex) => ({ ex, m: matchExam(profile, ex) })).sort((a, b) => ["eligible", "check", "no"].indexOf(a.m.status) - ["eligible", "check", "no"].indexOf(b.m.status));

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-display text-base font-semibold">
            <T v={{ ta: "கல்வித் தகுதி", en: "Education" }} />
          </span>
          <select
            value={profile.education ?? ""}
            onChange={(e) => update({ education: (e.target.value || null) as EduLevel | null })}
            className="mt-1 block min-h-12 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg"
          >
            <option value="">{lang === "ta" ? "-- தேர்ந்தெடுங்கள் --" : "-- choose --"}</option>
            {eduLevels.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name[lang]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold">
            <T v={{ ta: "வயது", en: "Age" }} />
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={110}
            value={profile.age ?? ""}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              update({ age: Number.isFinite(n) && n >= 1 && n <= 110 ? n : null });
            }}
            className="mt-1 block min-h-12 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg"
          />
        </label>
      </div>

      <ul className="mt-8 border-t border-line">
        {ranked.map(({ ex, m }, i) => (
          <Reveal as="li" key={ex.id} delay={Math.min(i, 5) * 0.04} className="border-b border-line py-5">
            <div id={ex.id} className="scroll-mt-24">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl sm:text-2xl">
                  <T v={ex.name} />
                </h3>
                <span className={`rounded-full border-2 px-3 py-0.5 font-display text-sm font-semibold ${tone[m.status].cls}`}>
                  <T v={tone[m.status].label} />
                </span>
              </div>
              <p className="text-sm text-ink-soft">
                <T v={ex.body} />
              </p>
              <p className="mt-2">
                <T v={ex.posts} />
              </p>
              <p className="mt-1 text-ink-soft">
                <T v={m.reason} />
              </p>
              <details className="mt-2">
                <summary className="min-h-11 cursor-pointer font-display text-base font-semibold">
                  <T v={{ ta: "வயது விதி & பாடத்திட்டச் சுருக்கம்", en: "Age rule & syllabus summary" }} />
                </summary>
                <p className="mt-1 text-ink-soft">
                  <T v={ex.ageNote} />
                </p>
                <p className="mt-1 text-ink-soft">
                  <T v={ex.syllabus} />
                </p>
              </details>
              <div className="mt-3 flex flex-wrap gap-4">
                <a href={ex.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center font-display text-base font-semibold text-brand underline underline-offset-4">
                  <T v={{ ta: "அறிவிப்பு & விண்ணப்பம் (அதிகாரப்பூர்வ) ↗", en: "Notifications & apply (official) ↗" }} /> {new URL(ex.url).host}
                </a>
                <Link href={`/documents?remind=${encodeURIComponent(ex.name[lang])}#reminders`} className="inline-flex min-h-12 items-center font-display text-base font-semibold underline underline-offset-4">
                  <T v={{ ta: "⏰ தேதி நினைவூட்டு", en: "⏰ Remind me of the date" }} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">
        <T v={{ ta: "தகுதி, வயது, தேதிகள் ஒவ்வொரு ஆண்டும் மாறும். இறுதி முடிவு அந்த ஆண்டின் அதிகாரப்பூர்வ அறிவிப்பின்படியே.", en: "Eligibility, age limits and dates change every year. The final word is that year's official notification." }} />
      </p>
    </div>
  );
}
