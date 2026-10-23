"use client";

import { useState } from "react";
import { T, useLang } from "@/lib/lang";

interface Resume {
  name: string;
  phone: string;
  email: string;
  place: string;
  objective: string;
  education: string;
  skills: string;
  experience: string;
}
const EMPTY: Resume = { name: "", phone: "", email: "", place: "", objective: "", education: "", skills: "", experience: "" };

/** Simple printable résumé. Nothing is saved or sent anywhere: it lives in this page's memory only. */
export function ResumeBuilder() {
  const { lang } = useLang();
  const [r, setR] = useState<Resume>(EMPTY);
  const set = (k: keyof Resume) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setR((p) => ({ ...p, [k]: e.target.value }));
  const field = "mt-1 w-full rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg";
  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-4 print:hidden" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "பெயர்", en: "Full name" }} /></span>
          <input className={`${field} min-h-12`} value={r.name} onChange={set("name")} maxLength={80} autoComplete="off" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-display text-base font-semibold"><T v={{ ta: "தொலைபேசி", en: "Phone" }} /></span>
            <input className={`${field} min-h-12`} inputMode="tel" value={r.phone} onChange={set("phone")} maxLength={20} autoComplete="off" />
          </label>
          <label className="block">
            <span className="font-display text-base font-semibold"><T v={{ ta: "மின்னஞ்சல் (விருப்பம்)", en: "Email (optional)" }} /></span>
            <input className={`${field} min-h-12`} type="email" value={r.email} onChange={set("email")} maxLength={80} autoComplete="off" />
          </label>
        </div>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "ஊர் / மாவட்டம்", en: "Town / district" }} /></span>
          <input className={`${field} min-h-12`} value={r.place} onChange={set("place")} maxLength={80} autoComplete="off" />
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "குறிக்கோள் (1–2 வரி)", en: "Objective (1–2 lines)" }} /></span>
          <textarea className={field} rows={2} value={r.objective} onChange={set("objective")} maxLength={300} />
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "கல்வி (ஒரு வரிக்கு ஒன்று)", en: "Education (one per line)" }} /></span>
          <textarea className={field} rows={3} value={r.education} onChange={set("education")} maxLength={500} placeholder={lang === "ta" ? "B.Sc கணிதம் – அரசு கலைக் கல்லூரி, 2025" : "B.Sc Maths – Govt Arts College, 2025"} />
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "திறன்கள் (ஒரு வரிக்கு ஒன்று)", en: "Skills (one per line)" }} /></span>
          <textarea className={field} rows={3} value={r.skills} onChange={set("skills")} maxLength={500} />
        </label>
        <label className="block">
          <span className="font-display text-base font-semibold"><T v={{ ta: "அனுபவம் (ஒரு வரிக்கு ஒன்று)", en: "Experience (one per line)" }} /></span>
          <textarea className={field} rows={3} value={r.experience} onChange={set("experience")} maxLength={700} />
        </label>
        <p className="text-sm text-ink-soft">
          <T v={{ ta: "இந்தத் தகவல் இங்கே சேமிக்கப்படாது; பக்கத்தை மூடினால் அழிந்துவிடும். ஆதார், பான் எண்களைச் சேர்க்க வேண்டாம்.", en: "Nothing is saved here; closing the page erases it. Do not add Aadhaar or PAN numbers." }} />
        </p>
        <button type="button" onClick={() => window.print()} disabled={!r.name.trim()} className="min-h-12 rounded-lg bg-brand px-5 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-40">
          <T v={{ ta: "🖨 அச்சிடு / PDF-ஆகச் சேமி", en: "🖨 Print / save as PDF" }} />
        </button>
      </form>

      <div className="print-area rounded-xl border-2 border-line bg-white p-6 text-[#111] print:border-0 print:p-0" aria-label={lang === "ta" ? "சுயவிவரக் குறிப்பு முன்னோட்டம்" : "Résumé preview"}>
        <h2 className="font-display text-3xl font-semibold">{r.name || (lang === "ta" ? "உங்கள் பெயர்" : "Your name")}</h2>
        <p className="mt-1 text-base">{[r.phone, r.email, r.place].filter(Boolean).join("  ·  ")}</p>
        {r.objective && (
          <>
            <h3 className="mt-5 border-b border-black/30 pb-1 font-display text-lg font-semibold">{lang === "ta" ? "குறிக்கோள்" : "Objective"}</h3>
            <p className="mt-1">{r.objective}</p>
          </>
        )}
        {[
          { k: "education", ta: "கல்வி", en: "Education", v: lines(r.education) },
          { k: "experience", ta: "அனுபவம்", en: "Experience", v: lines(r.experience) },
          { k: "skills", ta: "திறன்கள்", en: "Skills", v: lines(r.skills) },
        ].map(
          (s) =>
            s.v.length > 0 && (
              <div key={s.k}>
                <h3 className="mt-5 border-b border-black/30 pb-1 font-display text-lg font-semibold">{lang === "ta" ? s.ta : s.en}</h3>
                <ul className="mt-1 list-disc pl-5">
                  {s.v.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
