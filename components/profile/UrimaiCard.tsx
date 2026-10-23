"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLang, type Lang } from "@/lib/lang";
import { districts, getDoc, type Scheme } from "@/lib/data";
import { occupationOptions, type Profile } from "@/lib/profile";
import type { MatchResult } from "@/lib/match";

export interface CardItem {
  scheme: Scheme;
  match: MatchResult;
}

const W = 1080;
const H = 1350;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const fam = (v: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fallback;

async function draw(canvas: HTMLCanvasElement, profile: Profile, items: CardItem[], missing: string[], lang: Lang) {
  const serif = fam("--font-anek", "serif");
  const sans = fam("--font-mukta", "sans-serif");
  await Promise.all([document.fonts.load(`600 40px ${serif}`), document.fonts.load(`400 30px ${sans}`), document.fonts.load(`700 30px ${sans}`)]).catch(() => undefined);

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const ink = "#111111";
  const turmeric = "#7cc79b";
  const paper = "#ffffff";
  const L = (ta: string, en: string) => (lang === "ta" ? ta : en);

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, 190);
  ctx.fillStyle = turmeric;
  ctx.fillRect(0, 190, W, 10);

  ctx.fillStyle = "#fff";
  ctx.font = `600 64px ${serif}`;
  ctx.fillText(L("உரிமை அட்டை", "Urimai Card"), 60, 95);
  ctx.font = `400 30px ${sans}`;
  ctx.fillStyle = turmeric;
  ctx.fillText(L("MakkalLens – உங்களுக்கான திட்டங்கள்", "MakkalLens – schemes for you"), 60, 150);

  // profile summary
  const district = districts.find((d) => d.en === profile.district);
  const occ = occupationOptions.find((o) => o.id === profile.occupation)?.name[lang];
  const bits = [profile.age !== null ? L(`வயது ${profile.age}`, `Age ${profile.age}`) : "", district ? (lang === "ta" ? district.ta : district.en) : "", occ ?? ""].filter(Boolean);
  ctx.fillStyle = ink;
  ctx.font = `700 34px ${sans}`;
  ctx.fillText(bits.join("  ·  "), 60, 270);

  ctx.font = `600 40px ${serif}`;
  ctx.fillText(L("பொருந்தும் முக்கியத் திட்டங்கள்", "Top matching schemes"), 60, 345);

  let y = 395;
  ctx.font = `400 30px ${sans}`;
  for (const it of items.slice(0, 5)) {
    ctx.fillStyle = ink;
    ctx.font = `700 31px ${sans}`;
    const title = wrap(ctx, it.scheme.title[lang], 800);
    title.slice(0, 2).forEach((ln, k) => ctx.fillText(ln, 60, y + k * 38));
    const pct = `${it.match.score}%`;
    ctx.fillStyle = it.match.band === "high" ? "#0a6b3d" : it.match.band === "medium" ? "#111111" : "#111111";
    ctx.font = `600 40px ${serif}`;
    ctx.fillText(pct, W - 60 - ctx.measureText(pct).width, y + 8);
    // bar
    const by = y + Math.min(title.length, 2) * 38 - 12;
    ctx.fillStyle = "rgba(17,17,17,0.15)";
    ctx.fillRect(60, by, 700, 10);
    ctx.fillStyle = it.match.band === "high" ? "#0a6b3d" : it.match.band === "medium" ? "#7cc79b" : "#111111";
    ctx.fillRect(60, by, (700 * it.match.score) / 100, 10);
    y = by + 52;
  }

  y = Math.max(y + 10, 900);
  ctx.fillStyle = ink;
  ctx.font = `600 40px ${serif}`;
  ctx.fillText(L("இன்னும் தேவையான ஆவணங்கள்", "Documents still needed"), 60, y);
  y += 50;
  ctx.font = `400 31px ${sans}`;
  const docs = missing.length ? missing.slice(0, 6) : [L("எல்லா ஆவணங்களும் தயார் ✓", "All documents ready ✓")];
  for (const d of docs) {
    ctx.fillStyle = turmeric;
    ctx.fillText("▢", 60, y);
    ctx.fillStyle = ink;
    ctx.fillText(d.length > 48 ? `${d.slice(0, 46)}…` : d, 110, y);
    y += 44;
  }

  ctx.fillStyle = ink;
  ctx.fillRect(0, H - 120, W, 120);
  ctx.fillStyle = "#fff";
  ctx.font = `400 26px ${sans}`;
  ctx.fillText(L("இது அதிகாரப்பூர்வ அரசு ஆவணம் அல்ல; விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யவும்.", "Not an official document – confirm on the official site before applying."), 60, H - 70);
  ctx.fillStyle = turmeric;
  ctx.font = `700 28px ${sans}`;
  ctx.fillText(location.host, 60, H - 30);
}

export function UrimaiCard({ profile, items, missingDocIds }: { profile: Profile; items: CardItem[]; missingDocIds: string[] }) {
  const { lang } = useLang();
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const missing = missingDocIds.map((id) => getDoc(id)?.name[lang]).filter((x): x is string => Boolean(x));
  const key = JSON.stringify([profile, items.map((i) => [i.scheme.id, i.match.score]), missing, lang]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let cancelled = false;
    draw(c, profile, items, missing, lang).then(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const toBlob = useCallback(
    () => new Promise<Blob | null>((res) => ref.current?.toBlob((b) => res(b), "image/png")),
    [],
  );

  const download = async () => {
    const b = await toBlob();
    if (!b) return;
    const url = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urimai-card.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const text = () => {
    const lines = items.slice(0, 5).map((i) => `• ${i.scheme.title[lang]} – ${i.match.score}%`);
    const head = lang === "ta" ? "எனக்குப் பொருந்தும் அரசுத் திட்டங்கள் (MakkalLens):" : "Government schemes that match me (MakkalLens):";
    return `${head}\n${lines.join("\n")}\n\n${location.origin}/profile`;
  };

  const share = async () => {
    const b = await toBlob();
    const file = b ? new File([b], "urimai-card.png", { type: "image/png" }) : null;
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: text() });
        return;
      }
    } catch {
      /* user cancelled or share failed – fall back to a WhatsApp text link */
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text())}`, "_blank", "noopener,noreferrer");
    setMsg(lang === "ta" ? "WhatsApp உரை திறக்கப்பட்டது. படத்தையும் இணைக்க 'பதிவிறக்கு' பயன்படுத்துங்கள்." : "WhatsApp text opened. Use Download to attach the image too.");
  };

  const printChecklist = () => window.print();

  return (
    <section aria-labelledby="urimai" className="rounded-xl border-2 border-ink bg-paper-2 p-4 sm:p-6">
      <h2 id="urimai" className="text-2xl">
        <T v={{ ta: "உங்கள் உரிமை அட்டை", en: "Your Urimai Card" }} />
      </h2>
      <p className="mt-1 text-ink-soft">
        <T v={{ ta: "பெயர், ஆதார் எண் எதுவும் இதில் இல்லை. பாதுகாப்பாகப் பகிரலாம்.", en: "No name or Aadhaar number on it – safe to share." }} />
      </p>
      <canvas ref={ref} className={`mx-auto mt-4 h-auto w-full max-w-sm rounded-lg border border-line ${ready ? "" : "opacity-0"}`} aria-label={lang === "ta" ? "உங்கள் உரிமை அட்டை படம்" : "Your Urimai Card image"} />
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="min-h-12 rounded-lg bg-brand px-5 font-display text-base font-semibold text-white hover:bg-brand-dark">
          <T v={{ ta: "⬇ பதிவிறக்கு", en: "⬇ Download" }} />
        </button>
        <button type="button" onClick={share} className="min-h-12 rounded-lg bg-[#0a6b3d] px-5 font-display text-base font-semibold text-white hover:bg-[#07522e]">
          <T v={{ ta: "WhatsApp-இல் பகிர்", en: "Share on WhatsApp" }} />
        </button>
        <button type="button" onClick={printChecklist} className="min-h-12 rounded-lg border-2 border-ink px-5 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "🖨 சரிபார்ப்புப் பட்டியல் அச்சிடு", en: "🖨 Print checklist" }} />
        </button>
      </div>
      {msg && (
        <p role="status" className="mt-3 text-base text-ink-soft">
          {msg}
        </p>
      )}
    </section>
  );
}
