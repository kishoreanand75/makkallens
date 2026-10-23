"use client";

import Link from "next/link";
import { useMemo } from "react";
import { T } from "@/lib/lang";
import { useHistory, useProfile } from "@/lib/hooks";
import { recentQueries, recommend } from "@/lib/history";
import { profileProgress } from "@/lib/profile";
import { SchemeRow } from "../scheme/SchemeCard";
import { Reveal } from "../Reveal";

/**
 * Home-page personalisation. Ranking = profile match + what this person searched / opened on this site
 * (kept on the device, 14-day half-life) + popularity. Falls back to popular schemes for a first-time visitor.
 */
export function ForYou() {
  const { profile } = useProfile();
  const { events, clear } = useHistory();
  const recs = useMemo(() => recommend(profile, events, 3), [profile, events]);
  const recent = useMemo(() => recentQueries(events, 4), [events]);
  const known = profileProgress(profile) > 0;
  const personal = events.length > 0 || known;
  const hasHistory = recs.some((r) => r.why === "history");

  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="foryou">
      <div className="mx-auto max-w-8xl">
        <Reveal>
          <p className="font-display text-base font-semibold text-brand">
            {hasHistory ? <T v={{ ta: "நீங்கள் தேடியதன் அடிப்படையில்", en: "Based on what you looked at" }} /> : personal ? <T v={{ ta: "உங்கள் சுயவிவரத்தின் அடிப்படையில்", en: "Based on your profile" }} /> : <T v={{ ta: "பலரும் பார்க்கும் திட்டங்கள்", en: "Popular schemes" }} />}
          </p>
          <h2 id="foryou" className="mt-2 text-3xl sm:text-5xl">
            {personal ? <T v={{ ta: "உங்களுக்காக", en: "For you" }} /> : <T v={{ ta: "இன்று பலரும் பார்ப்பது", en: "What people open most" }} />}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recs.map((r) => (
            <SchemeRow key={r.scheme.id} scheme={r.scheme} match={known ? r.match : undefined} why={r.why} />
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href={known ? "/schemes" : "/profile"} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark">
            {known ? <T v={{ ta: "அனைத்துத் திட்டங்களும்", en: "All schemes" }} /> : <T v={{ ta: "30 வினாடியில் எனக்கான திட்டங்கள்", en: "My schemes in 30 seconds" }} />} <span aria-hidden="true">→</span>
          </Link>
          {recent.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-base text-ink-soft">
              <T v={{ ta: "சமீபத்தில் தேடியவை:", en: "Recent searches:" }} />
              {recent.map((q) => (
                <Link key={q} href={`/ask?q=${encodeURIComponent(q)}`} className="min-h-11 content-center rounded-lg border border-line px-3 hover:border-ink">
                  {q}
                </Link>
              ))}
              <button type="button" onClick={clear} className="min-h-11 underline underline-offset-4">
                <T v={{ ta: "வரலாற்றை அழி", en: "Clear history" }} />
              </button>
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          <T v={{ ta: "இந்தப் பரிந்துரைகள் உங்கள் போனிலேயே தீர்மானிக்கப்படுகின்றன; எந்தத் தகவலும் எங்கள் சர்வருக்குச் செல்லாது.", en: "These picks are decided on your phone; none of this history is sent to our server." }} />
        </p>
      </div>
    </section>
  );
}
