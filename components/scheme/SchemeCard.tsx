"use client";

import { T } from "@/lib/lang";
import type { Scheme } from "@/lib/data";
import { topics } from "@/lib/categories";
import type { MatchResult } from "@/lib/match";
import { imageFor } from "@/lib/topic-icon";
import { rankOf } from "@/lib/top50";
import { Reveal } from "../Reveal";
import { ItemCard, useCardLayout } from "../ui/ItemCard";
import { MatchBadge } from "./MatchBadge";
import { SaveButton } from "./SaveButton";

const whyText = {
  history: { ta: "நீங்கள் தேடியதன் அடிப்படையில்", en: "Based on what you searched" },
  profile: { ta: "உங்கள் சுயவிவரத்துக்குப் பொருந்தும்", en: "Matches your profile" },
  popular: { ta: "பலரும் பார்ப்பது", en: "Popular" },
} as const;

/** Scheme card: photo beside the text (layout switchable); the whole card is one link, Save stays a separate control. */
export function SchemeRow({ scheme, match, why }: { scheme: Scheme; match?: MatchResult; why?: keyof typeof whyText }) {
  const tp = topics[scheme.category];
  const rank = rankOf("scheme", scheme.id);
  const [layout] = useCardLayout();
  return (
    <Reveal as="li" className="h-full">
      <ItemCard
        layout={layout}
        href={`/schemes/${scheme.id}`}
        title={scheme.title}
        blurb={scheme.benefit}
        image={imageFor(scheme.id, scheme.title.en)}
        color={tp.color}
        rank={rank <= 50 ? rank : undefined}
        tag={
          <span className={`rounded px-2 py-0.5 font-display text-sm font-semibold text-white shadow-sm ${scheme.level === "central" ? "bg-info" : "bg-brand"}`}>
            {scheme.level === "central" ? <T v={{ ta: "மத்திய அரசு", en: "Central" }} /> : <T v={{ ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu" }} />}
          </span>
        }
        meta={<T v={tp.name} />}
        footer={
          <div className="space-y-2">
            {why && (
              <p className="text-sm font-semibold text-brand">
                <T v={whyText[why]} />
              </p>
            )}
            {scheme.note && (
              <p className="inline-block rounded border-2 border-ink bg-gold-tint px-2 py-0.5 text-sm font-semibold">
                <T v={{ ta: "மாற்றம் இருக்கலாம் – உறுதிசெய்யவும்", en: "May have changed – please confirm" }} />
              </p>
            )}
            {match && <MatchBadge match={match} />}
            <div className="flex items-center gap-3">
              <span className="font-display text-base font-semibold text-brand">
                <T v={{ ta: "விவரம் →", en: "Details →" }} />
              </span>
              <span className="relative z-10 ml-auto">
                <SaveButton id={scheme.id} compact />
              </span>
            </div>
          </div>
        }
      />
    </Reveal>
  );
}
