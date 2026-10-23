import type { ChatAnswer } from "./answer";
import { dataMeta, localLinks, pastCms, stateCms, tnCm, tnGovernor, tnMinisters } from "./people";

type Lang = "ta" | "en";

const STOP = new Set([
  "who", "is", "the", "of", "in", "what", "which", "my", "me", "tell", "about", "minister", "ministers", "name", "for", "and",
  "yaar", "யார்", "யாரு", "அமைச்சர்", "அமைச்சரின்", "அமைச்சர்கள்", "பெயர்", "என்ன",
]);

// Short ASCII words must match as whole words ("cm" must not match inside another word).
const has = (q: string, words: string[]) =>
  words.some((w) => (/^[a-z ]+$/.test(w) ? new RegExp(`\\b${w}\\b`).test(q) : q.includes(w)));

const dataNote = (lang: Lang) =>
  lang === "ta"
    ? `(தகவல் ${dataMeta.asOf} நிலவரம்; அரசு இணையதளத்துடன் சரிபார்ப்பு நிலுவை.)`
    : `(Information as of ${dataMeta.asOf}; official verification pending.)`;

const leadersLink = (lang: Lang) => ({ label: lang === "ta" ? "அரசு பக்கம்" : "Government page", href: "/leaders" });

const suggestions: Record<Lang, string[]> = {
  ta: ["முதலமைச்சர் யார்?", "சுகாதார அமைச்சர் யார்?", "ஆளுநர் யார்?", "என் வார்டு கவுன்சிலர் யார்?"],
  en: ["Who is the Chief Minister?", "Who is the health minister?", "Who is the Governor?", "Who is my ward councillor?"],
};

const pastKeys: Record<string, string[]> = {
  "past-k-kamaraj": ["kamaraj", "kamarajar", "காமராஜ்", "காமராசர்"],
  "past-c-n-annadurai": ["annadurai", "அண்ணாதுரை", "அறிஞர் அண்ணா"],
  "past-m-g-ramachandran": ["mgr", "ramachandran", "எம்ஜிஆர்", "எம். ஜி. ஆர்", "ராமச்சந்திரன்"],
  "past-m-karunanidhi": ["karunanidhi", "kalaignar", "கருணாநிதி", "கலைஞர்"],
  "past-j-jayalalithaa": ["jayalalithaa", "jayalalitha", "ஜெயலலிதா"],
  "past-m-k-stalin": ["stalin", "ஸ்டாலின்"],
};

export function politicalAnswer(raw: string, q: string, lang: Lang): ChatAnswer | null {
  const out = (text: string, speech?: string, links?: ChatAnswer["links"]): ChatAnswer => ({
    text: `${text}\n\n${dataNote(lang)}`,
    speech: speech ?? text,
    links: links ?? [leadersLink(lang)],
    suggestions: suggestions[lang],
  });

  for (const pc of pastCms) {
    if ((pastKeys[pc.id] ?? []).some((k) => q.includes(k))) {
      const lines = pc.work.map((w) => `• ${w[lang]}`).join("\n");
      return out(`${pc.name[lang]} (${pc.years})\n${lines}`, `${pc.name[lang]}. ${pc.work.map((w) => w[lang]).join(". ")}`);
    }
  }

  if (has(q, ["cm", "chief minister", "chiefminister", "முதலமைச்சர்", "முதல்வர்", "mudhalvar", "mudhalamaichar"])) {
    const st = stateCms.find((s) => {
      if (s.code === "TN") return false;
      const en = s.state.en.toLowerCase().replace(/ \(ut\)/, "");
      const ta = s.state.ta.replace(/ \(.*\)/, "");
      return q.includes(en) || raw.includes(ta);
    });
    if (st) {
      const t = lang === "ta" ? `${st.state.ta} முதலமைச்சர்: ${st.cm} (${st.party}).` : `Chief Minister of ${st.state.en}: ${st.cm} (${st.party}).`;
      return out(t, t, [{ label: lang === "ta" ? "மாநில முதலமைச்சர்கள்" : "State Chief Ministers", href: "/leaders/states" }]);
    }
    const t =
      lang === "ta"
        ? `தமிழ்நாடு முதலமைச்சர்: ${tnCm.name.ta} (${tnCm.party.ta}), ${tnCm.constituency.ta} தொகுதி. ${tnCm.since} அன்று பதவியேற்றார்.`
        : `Chief Minister of Tamil Nadu: ${tnCm.name.en} (${tnCm.party.en}), ${tnCm.constituency.en} constituency. Took office on ${tnCm.since}.`;
    return out(t);
  }

  if (has(q, ["governor", "ஆளுநர்", "ஆளுனர்"])) {
    const t = lang === "ta" ? `தமிழ்நாடு ஆளுநர்: ${tnGovernor.name}.` : `Governor of Tamil Nadu: ${tnGovernor.name}.`;
    return out(t);
  }

  if (has(q, ["councillor", "councilor", "ward", "கவுன்சிலர்", "வார்டு", "மாமன்ற"])) {
    const t =
      lang === "ta"
        ? "வார்டு கவுன்சிலர் பெயர்களை அதிகாரப்பூர்வ பட்டியலிலிருந்து தொகுத்து வருகிறோம்; தவறான பெயரைச் சொல்லக் கூடாது என்பதால் இப்போது நேரடி வழி: உங்கள் மாநகராட்சி / நகராட்சி / ஊராட்சி இணையதளம் அல்லது அலுவலகம். சென்னைக்கு chennaicorporation.gov.in-இல் வார்டு, மண்டல விவரம் உள்ளது."
        : "We are compiling ward councillor names from official lists and will not guess one. For now, use your Corporation, Municipality or Panchayat website or office. For Chennai, chennaicorporation.gov.in has ward and zone details.";
    return out(t, t, [{ label: "chennaicorporation.gov.in", href: localLinks.chennai }, leadersLink(lang)]);
  }

  if (has(q, ["mla", "எம்எல்ஏ", "எம்.எல்.ஏ", "சட்டமன்ற உறுப்பினர்", "mp", "எம்பி", "எம்.பி", "member of parliament", "நாடாளுமன்ற உறுப்பினர்"])) {
    const t =
      lang === "ta"
        ? "உங்கள் எம்.எல்.ஏ. / எம்.பி. தொகுதியை வாக்காளர் அடையாள அட்டை மூலம் voters.eci.gov.in-இல் காணலாம். நாடாளுமன்ற உறுப்பினர் விவரம் sansad.in-இல் உள்ளது. பெயர் பட்டியலை விரைவில் சேர்க்கிறோம்."
        : "Find your MLA / MP constituency with your voter ID on voters.eci.gov.in. MP details are on sansad.in. We are adding the name lists soon.";
    return out(t, t, [
      { label: "voters.eci.gov.in", href: localLinks.voters },
      { label: "sansad.in", href: localLinks.sansad },
    ]);
  }

  if (has(q, ["minister", "அமைச்சர்", "அமைச்சரவை", "amaichar", "department", "துறை", "cabinet"])) {
    const tokens = q
      .split(/[\s,?.!]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !STOP.has(t));
    const scored = tnMinisters
      .map((m) => {
        const hay = `${m.name} ${m.dept.en} ${m.dept.ta} ${m.constituency}`.toLowerCase();
        return { m, n: tokens.filter((t) => hay.includes(t)).length };
      })
      .filter((r) => r.n > 0)
      .sort((a, b) => b.n - a.n);
    if (scored.length > 0) {
      const top = scored.filter((r) => r.n === scored[0].n).slice(0, 4);
      const lines = top.map((r) => `• ${r.m.name} – ${r.m.dept[lang]} (${r.m.constituency})`).join("\n");
      const head = lang === "ta" ? "பொருத்தமான அமைச்சர்:" : "Matching minister:";
      return out(`${head}\n${lines}`, top.map((r) => `${r.m.name}. ${r.m.dept[lang]}`).join(". "));
    }
    const t =
      lang === "ta"
        ? `தமிழ்நாட்டில் முதலமைச்சர் உட்பட ${tnMinisters.length + 1} அமைச்சர்கள் உள்ளனர். எந்தத் துறை என்று சொல்லுங்கள் (எ.கா. 'சுகாதார அமைச்சர் யார்?') அல்லது முழுப் பட்டியலைப் பாருங்கள்.`
        : `Tamil Nadu has ${tnMinisters.length + 1} ministers including the Chief Minister. Name a department (e.g. 'who is the health minister?') or open the full list.`;
    return out(t);
  }

  return null;
}
