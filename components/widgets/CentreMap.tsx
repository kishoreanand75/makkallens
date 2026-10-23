"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { T, useLang } from "@/lib/lang";
import { districts, getDistrict } from "@/lib/data";
import { useProfile } from "@/lib/hooks";

type Kind = "hospital" | "police";
interface Place {
  id: number;
  kind: Kind;
  name: string;
  lat: number;
  lng: number;
  phone?: string;
  km: number;
}

const RADIUS_M = 4000;
// public Overpass servers; the second is a fallback when the first is busy (502/504)
const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];

function km(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function fetchPlaces(center: [number, number], signal: AbortSignal): Promise<Place[]> {
  const cacheKey = `av-osm-${center[0].toFixed(2)}-${center[1].toFixed(2)}`;
  try {
    const hit = sessionStorage.getItem(cacheKey);
    if (hit) return JSON.parse(hit) as Place[];
  } catch {
    /* ignore */
  }
  // one regex query, nearest 30 (qt = quick sort); the public Overpass server can still take 30–40 s
  const q = `[out:json][timeout:25];nwr["amenity"~"^(hospital|police)$"](around:${RADIUS_M},${center[0]},${center[1]});out center qt 30;`;
  let res: Response | null = null;
  for (const url of OVERPASS) {
    try {
      // each attempt gets its own 50 s budget but still obeys the caller's abort
      const attempt = new AbortController();
      const stop = () => attempt.abort();
      signal.addEventListener("abort", stop, { once: true });
      const timer = setTimeout(stop, 50000);
      let r: Response;
      try {
        r = await fetch(url, { method: "POST", body: new URLSearchParams({ data: q }), signal: attempt.signal });
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", stop);
      }
      if (r.ok) {
        res = r;
        break;
      }
    } catch (e) {
      if (signal.aborted) throw e; // the user changed district / left the page
    }
  }
  if (!res) throw new Error("overpass unavailable");
  const json = (await res.json()) as { elements: { id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[] };
  const places: Place[] = [];
  for (const e of json.elements) {
    const lat = e.lat ?? e.center?.lat;
    const lng = e.lon ?? e.center?.lon;
    if (lat === undefined || lng === undefined) continue;
    const tags = e.tags ?? {};
    const kind: Kind = tags.amenity === "police" ? "police" : "hospital";
    const name = tags["name:ta"] || tags.name || (kind === "police" ? "Police station" : "Hospital");
    places.push({ id: e.id, kind, name, lat, lng, phone: tags.phone || tags["contact:phone"], km: km(center, [lat, lng]) });
  }
  places.sort((a, b) => a.km - b.km);
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(places));
  } catch {
    /* ignore */
  }
  return places;
}

/** Nearest hospitals / police stations from OpenStreetMap (Overpass), drawn with Leaflet. The list below the map is the accessible primary view. */
export function CentreMap({ showKinds = ["hospital", "police"] as Kind[] }: { showKinds?: Kind[] }) {
  const { lang } = useLang();
  const { profile } = useProfile();
  const [district, setDistrict] = useState<string>(profile.district && getDistrict(profile.district) ? profile.district : "Chennai");
  const [custom, setCustom] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [geoMsg, setGeoMsg] = useState<string | null>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  const center = useMemo<[number, number]>(() => custom ?? (() => { const d = getDistrict(district)!; return [d.lat, d.lng] as [number, number]; })(), [custom, district]);
  const shown = useMemo(() => places.filter((p) => showKinds.includes(p.kind)), [places, showKinds]);

  useEffect(() => {
    const ctl = new AbortController();
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for a network fetch that starts with this effect
    setStatus("loading");
    fetchPlaces(center, ctl.signal)
      .then((p) => {
        if (!alive) return;
        setPlaces(p);
        setStatus("idle");
      })
      .catch((e) => {
        if (alive && e?.name !== "AbortError") setStatus("error");
      });
    return () => {
      alive = false;
      ctl.abort();
    };
  }, [center]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(mapEl.current, { scrollWheelZoom: false }).setView(center, 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      mapRef.current.setView(center, 13);
      layerRef.current!.clearLayers();
      L.circleMarker(center, { radius: 8, color: "#111111", fillColor: "#7cc79b", fillOpacity: 1, weight: 3 }).bindTooltip(lang === "ta" ? "நீங்கள் / தேர்ந்த இடம்" : "You / chosen spot").addTo(layerRef.current!);
      for (const p of shown.slice(0, 30)) {
        L.circleMarker([p.lat, p.lng], { radius: 7, color: "#fff", weight: 2, fillColor: p.kind === "police" ? "#111111" : "#0a6b3d", fillOpacity: 1 }).bindTooltip(p.name).addTo(layerRef.current!);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [center, shown, lang]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoMsg(lang === "ta" ? "இந்தச் சாதனத்தில் இருப்பிடம் கிடைக்கவில்லை." : "Location is not available on this device.");
      return;
    }
    setGeoMsg(lang === "ta" ? "இருப்பிடத்தைத் தேடுகிறது…" : "Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustom([pos.coords.latitude, pos.coords.longitude]);
        setGeoMsg(null);
      },
      () => setGeoMsg(lang === "ta" ? "இருப்பிட அனுமதி கிடைக்கவில்லை; மாவட்டத்தைத் தேர்ந்தெடுங்கள்." : "Location permission denied; choose a district instead."),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="font-display text-base font-semibold">
            <T v={{ ta: "மாவட்டம்", en: "District" }} />
          </span>
          <select
            value={district}
            onChange={(e) => {
              setCustom(null);
              setDistrict(e.target.value);
            }}
            className="mt-1 block min-h-12 rounded-lg border-2 border-ink bg-paper-2 px-3 text-lg"
          >
            {districts.map((d) => (
              <option key={d.en} value={d.en}>
                {lang === "ta" ? d.ta : d.en}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={locate} className="min-h-12 rounded-lg border-2 border-ink px-4 font-display text-base font-semibold hover:bg-sun/40">
          <T v={{ ta: "📍 என் இருப்பிடம்", en: "📍 Use my location" }} />
        </button>
      </div>
      {geoMsg && (
        <p role="status" className="mt-2 text-base text-ink-soft">
          {geoMsg}
        </p>
      )}

      <div ref={mapEl} className="mt-4 h-72 w-full rounded-xl border-2 border-ink sm:h-96" role="application" aria-label={lang === "ta" ? "அருகிலுள்ள மையங்களின் வரைபடம்" : "Map of nearby centres"} />

      <p className="mt-4 text-ink-soft" aria-live="polite">
        {status === "loading" && <T v={{ ta: "அருகிலுள்ள இடங்களைத் தேடுகிறது… இலவச வரைபடச் சேவை என்பதால் ஒரு நிமிடம் வரை ஆகலாம்.", en: "Looking for nearby places… this free map service can take up to a minute." }} />}
        {status === "error" && (
          <span className="text-ink">
            <T v={{ ta: "வரைபடத் தரவு இப்போது கிடைக்கவில்லை. சிறிது நேரம் கழித்து முயலுங்கள்; அவசரமெனில் 112-ஐ அழையுங்கள்.", en: "Map data is not available right now. Try again shortly; in an emergency call 112." }} />
          </span>
        )}
        {status === "idle" && <T v={{ ta: `${shown.length} இடங்கள் (${RADIUS_M / 1000} கி.மீ-க்குள்) – தரவு: OpenStreetMap, முழுமையாக இல்லாமல் இருக்கலாம்`, en: `${shown.length} places within ${RADIUS_M / 1000} km – data from OpenStreetMap, may be incomplete` }} />}
      </p>
      <ul className="mt-2 border-t border-line">
        {shown.slice(0, 12).map((p) => (
          <li key={`${p.kind}-${p.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line py-3">
            <span aria-hidden="true" className={`size-3 rounded-full ${p.kind === "police" ? "bg-brand" : "bg-ink"}`} />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold">{p.name}</span>
              <span className="text-sm text-ink-soft">
                {p.kind === "police" ? <T v={{ ta: "காவல் நிலையம்", en: "Police station" }} /> : <T v={{ ta: "மருத்துவமனை", en: "Hospital" }} />} · {p.km.toFixed(1)} {lang === "ta" ? "கி.மீ" : "km"}
              </span>
            </span>
            {p.phone && (
              <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`} className="min-h-12 content-center font-display text-base font-semibold text-brand underline underline-offset-4">
                {p.phone}
              </a>
            )}
            <a href={`https://www.openstreetmap.org/directions?to=${p.lat}%2C${p.lng}`} target="_blank" rel="noopener noreferrer" className="min-h-12 content-center font-display text-base font-semibold underline underline-offset-4">
              <T v={{ ta: "வழி ↗", en: "Directions ↗" }} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
