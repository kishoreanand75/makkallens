"use client";

import { useEffect, useState } from "react";
import { T, useLang } from "@/lib/lang";
import { districts, getDistrict } from "@/lib/data";
import { useProfile } from "@/lib/hooks";

interface Day {
  date: string;
  max: number;
  min: number;
  rainMm: number;
  rainPct: number;
}

async function load(lat: number, lng: number, signal: AbortSignal): Promise<Day[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=5";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(String(res.status));
  const j = (await res.json()) as { daily: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_sum: number[]; precipitation_probability_max: number[] } };
  return j.daily.time.map((t, i) => ({
    date: t,
    max: j.daily.temperature_2m_max[i],
    min: j.daily.temperature_2m_min[i],
    rainMm: j.daily.precipitation_sum[i],
    rainPct: j.daily.precipitation_probability_max[i] ?? 0,
  }));
}

/** 5-day forecast from Open-Meteo (free, no key) with a plain-language farming hint. */
export function WeatherCard() {
  const { lang } = useLang();
  const { profile } = useProfile();
  const [district, setDistrict] = useState(profile.district && getDistrict(profile.district) ? profile.district : "Thanjavur");
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const d = getDistrict(district)!;
    const ctl = new AbortController();
    let alive = true;
    load(d.lat, d.lng, ctl.signal)
      .then((x) => {
        if (alive) {
          setDays(x);
          setError(false);
        }
      })
      .catch((e) => {
        if (alive && e?.name !== "AbortError") setError(true);
      });
    return () => {
      alive = false;
      ctl.abort();
    };
  }, [district]);

  const wet = days?.slice(0, 3).some((d) => d.rainPct >= 60 && d.rainMm >= 5);
  const hot = days?.slice(0, 3).some((d) => d.max >= 38);
  const fmt = new Intl.DateTimeFormat(lang === "ta" ? "ta-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div>
      <label className="block">
        <span className="font-display text-base font-semibold">
          <T v={{ ta: "மாவட்டம்", en: "District" }} />
        </span>
        <select value={district} onChange={(e) => { setDays(null); setError(false); setDistrict(e.target.value); }} className="mt-1 block min-h-12 rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg">
          {districts.map((d) => (
            <option key={d.en} value={d.en}>
              {lang === "ta" ? d.ta : d.en}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-ink">
          <T v={{ ta: "வானிலைத் தகவல் இப்போது கிடைக்கவில்லை.", en: "Weather data is not available right now." }} />
        </p>
      )}
      {!days && !error && (
        <p className="mt-4 text-ink-soft">
          <T v={{ ta: "வானிலையைப் பெறுகிறது…", en: "Loading the forecast…" }} />
        </p>
      )}
      {days && (
        <>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {days.map((d) => (
              <li key={d.date} className="rounded-xl border border-line bg-paper-2 p-3 text-center">
                <p className="text-sm font-bold">{fmt.format(new Date(`${d.date}T00:00:00`))}</p>
                <p className="mt-1 font-display text-xl font-semibold">
                  {Math.round(d.max)}° <span className="text-ink-soft">/ {Math.round(d.min)}°</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  <span aria-hidden="true">🌧 </span>
                  {d.rainPct}% · {d.rainMm.toFixed(0)} mm
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border-2 border-dashed border-brand bg-sun-tint p-3 text-base">
            <p className="font-display font-semibold">
              <T v={{ ta: "பொது ஆலோசனை", en: "General advice" }}/>
            </p>
            <p>
              {wet ? (
                <T v={{ ta: "அடுத்த 3 நாட்களில் மழை வாய்ப்பு அதிகம்: உரம், பூச்சி மருந்து தெளிப்பதைத் தள்ளி வையுங்கள்; அறுவடைப் பயிரைப் பாதுகாப்பாக மூடுங்கள்.", en: "Rain is likely in the next 3 days: postpone fertiliser and spraying; cover harvested produce." }} />
              ) : hot ? (
                <T v={{ ta: "அதிக வெப்பம்: காலை அல்லது மாலையில் நீர் பாய்ச்சுங்கள்.", en: "High heat: irrigate in the early morning or evening." }} />
              ) : (
                <T v={{ ta: "அடுத்த 3 நாட்களில் பெரிய மழை / வெப்ப எச்சரிக்கை இல்லை.", en: "No heavy rain or heat expected in the next 3 days." }} />
              )}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              <T v={{ ta: "பயிர், பூச்சி ஆலோசனைக்கு உங்கள் வட்டார வேளாண் அலுவலர் / கிசான் கால் சென்டர் 1800-180-1551-ஐ அணுகுங்கள். தரவு: Open-Meteo.", en: "For crop and pest advice contact your block agriculture officer or Kisan Call Centre 1800-180-1551. Data: Open-Meteo." }} />
            </p>
          </div>
        </>
      )}
    </div>
  );
}
