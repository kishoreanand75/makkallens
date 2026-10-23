"use client";

import { useState } from "react";
import { T, useLang } from "@/lib/lang";
import { districts, eduLevels, type Need } from "@/lib/data";
import { useProfile } from "@/lib/hooks";
import { communityOptions, genderOptions, incomeBands, needOptions, occupationOptions, profileProgress } from "@/lib/profile";

type StepId = "age" | "district" | "gender" | "occupation" | "income" | "need" | "community" | "education";
const CORE: StepId[] = ["age", "district", "gender", "occupation", "income", "need"];
const OPTIONAL: StepId[] = ["community", "education"];

const question: Record<StepId, { ta: string; en: string }> = {
  age: { ta: "உங்கள் வயது என்ன?", en: "How old are you?" },
  district: { ta: "எந்த மாவட்டம்?", en: "Which district?" },
  gender: { ta: "நீங்கள்?", en: "You are?" },
  occupation: { ta: "நீங்கள் என்ன செய்கிறீர்கள்?", en: "What do you do?" },
  income: { ta: "குடும்பத்தின் ஆண்டு வருமானம்?", en: "Your family's yearly income?" },
  need: { ta: "என்ன உதவி தேவை? (ஒன்றுக்கு மேல் தேர்ந்தெடுக்கலாம்)", en: "What help do you need? (pick any)" },
  community: { ta: "சமூகப் பிரிவு (விருப்பம்)", en: "Community (optional)" },
  education: { ta: "கல்வித் தகுதி (விருப்பம்)", en: "Education (optional)" },
};

const big = "min-h-14 w-full rounded-xl border-2 px-4 text-left font-display text-lg font-semibold transition-colors";

export function ProfileWizard({ onDone, onActive }: { onDone: () => void; onActive?: () => void }) {
  const { lang } = useLang();
  const { profile, update: rawUpdate } = useProfile();
  // Tell the parent the user is mid-wizard so it never jumps to the results after the 3rd answer.
  const update: typeof rawUpdate = (patch) => {
    onActive?.();
    rawUpdate(patch);
  };
  const [i, setI] = useState(0);
  const steps = [...CORE, ...OPTIONAL];
  const step = steps[i];
  const isLast = i === steps.length - 1;
  const next = () => (isLast ? onDone() : setI(i + 1));
  const pick = (patch: Parameters<typeof update>[0]) => {
    update(patch);
    setTimeout(next, 150);
  };
  const done = profileProgress(profile);

  return (
    <div>
      <div className="flex items-center justify-between text-base text-ink-soft">
        <span>
          <T v={{ ta: `கேள்வி ${Math.min(i + 1, CORE.length)} / ${CORE.length}`, en: `Question ${Math.min(i + 1, CORE.length)} of ${CORE.length}` }} />
          {i >= CORE.length && <T v={{ ta: " (கூடுதல்)", en: " (extra)" }} />}
        </span>
        <span>{done}/6</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={lang === "ta" ? "கேள்வி முன்னேற்றம்" : "Question progress"} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={i + 1}>
        <div className="h-full rounded-full bg-sun transition-all duration-500" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
      </div>

      <h2 className="mt-8 text-2xl sm:text-3xl" id="q">
        <T v={question[step]} />
      </h2>

      <div className="mt-6" aria-labelledby="q" role="group">
        {step === "age" && (
          <div>
            <label htmlFor="age" className="sr-only">
              <T v={question.age} />
            </label>
            <input
              id="age"
              type="number"
              inputMode="numeric"
              min={1}
              max={110}
              value={profile.age ?? ""}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10);
                update({ age: Number.isFinite(n) && n >= 1 && n <= 110 ? n : null });
              }}
              className="min-h-16 w-40 rounded-xl border-2 border-ink bg-paper-2 px-4 text-center font-display text-3xl"
              placeholder="25"
            />
            <button
              type="button"
              disabled={profile.age === null}
              onClick={next}
              className="ml-3 min-h-16 rounded-xl bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-40"
            >
              <T v={{ ta: "அடுத்து →", en: "Next →" }} />
            </button>
          </div>
        )}

        {step === "district" && (
          <div>
            <label htmlFor="district" className="sr-only">
              <T v={question.district} />
            </label>
            <select
              id="district"
              value={profile.district ?? ""}
              onChange={(e) => update({ district: e.target.value || null })}
              className="min-h-16 w-full max-w-md rounded-xl border-2 border-ink bg-paper-2 px-4 text-xl"
            >
              <option value="">{lang === "ta" ? "-- மாவட்டத்தைத் தேர்ந்தெடுங்கள் --" : "-- choose district --"}</option>
              {districts.map((d) => (
                <option key={d.en} value={d.en}>
                  {lang === "ta" ? d.ta : d.en}
                </option>
              ))}
              <option value="Other">{lang === "ta" ? "தமிழ்நாட்டுக்கு வெளியே" : "Outside Tamil Nadu"}</option>
            </select>
            <button type="button" disabled={!profile.district} onClick={next} className="mt-3 min-h-16 rounded-xl bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-40 sm:ml-3 sm:mt-0">
              <T v={{ ta: "அடுத்து →", en: "Next →" }} />
            </button>
          </div>
        )}

        {step === "gender" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {genderOptions.map((g) => (
              <button key={g.id} type="button" aria-pressed={profile.gender === g.id} onClick={() => pick({ gender: g.id })} className={`${big} ${profile.gender === g.id ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}>
                <T v={g.name} />
              </button>
            ))}
          </div>
        )}

        {step === "occupation" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {occupationOptions.map((o) => (
              <button key={o.id} type="button" aria-pressed={profile.occupation === o.id} onClick={() => pick({ occupation: o.id })} className={`${big} ${profile.occupation === o.id ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}>
                <T v={o.name} />
              </button>
            ))}
          </div>
        )}

        {step === "income" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {incomeBands.map((b) => (
              <button key={b.id} type="button" aria-pressed={profile.income === b.id} onClick={() => pick({ income: b.id })} className={`${big} ${profile.income === b.id ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}>
                <T v={b.name} />
              </button>
            ))}
          </div>
        )}

        {step === "need" && (
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {needOptions.map((n) => {
                const on = profile.needs.includes(n.id);
                return (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => update({ needs: on ? profile.needs.filter((x: Need) => x !== n.id) : [...profile.needs, n.id] })}
                    className={`${big} ${on ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}
                  >
                    <span aria-hidden="true">{on ? "✓ " : ""}</span>
                    <T v={n.name} />
                  </button>
                );
              })}
            </div>
            <button type="button" disabled={profile.needs.length === 0} onClick={next} className="mt-5 min-h-16 rounded-xl bg-brand px-8 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-40">
              <T v={{ ta: "அடுத்து →", en: "Next →" }} />
            </button>
          </div>
        )}

        {step === "community" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {communityOptions.map((c) => (
              <button key={c.id} type="button" aria-pressed={profile.community === c.id} onClick={() => pick({ community: c.id })} className={`${big} ${profile.community === c.id ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}>
                <T v={c.name} />
              </button>
            ))}
          </div>
        )}

        {step === "education" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {eduLevels.map((e) => (
              <button key={e.id} type="button" aria-pressed={profile.education === e.id} onClick={() => pick({ education: e.id })} className={`${big} ${profile.education === e.id ? "border-ink bg-brand text-white" : "border-line bg-paper-2 hover:border-ink"}`}>
                <T v={e.name} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="min-h-12 rounded-lg border-2 border-ink px-5 font-display text-base font-semibold hover:bg-sun/40 disabled:opacity-40">
          <T v={{ ta: "← பின்", en: "← Back" }} />
        </button>
        {i >= CORE.length - 1 && (
          <button type="button" onClick={onDone} className="min-h-12 px-2 font-display text-base font-semibold underline underline-offset-4">
            <T v={{ ta: "முடிவுகளைக் காட்டு", en: "Show my results" }} />
          </button>
        )}
        {i < CORE.length - 1 && (
          <button type="button" onClick={next} className="min-h-12 px-2 text-base text-ink-soft underline underline-offset-4">
            <T v={{ ta: "இதைத் தவிர்", en: "Skip this" }} />
          </button>
        )}
      </div>
    </div>
  );
}
