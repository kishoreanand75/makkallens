import type { Metadata } from "next";
import { Portrait } from "@/components/Portrait";
import { StatesBrowser } from "@/components/StatesBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { T } from "@/lib/lang";
import { dataMeta, photoFor, stateCms } from "@/lib/people";

export const metadata: Metadata = { title: "மாநில முதலமைச்சர்கள் | MakkalLens", alternates: { canonical: "/leaders/states" } };

export default function StatesPage() {
  const portraits = Object.fromEntries(stateCms.map((s) => [s.id, <Portrait key={s.id} id={s.id} name={s.cm} className="size-[4.5rem]" />]));
  const credits = stateCms.map((s) => ({ s, c: photoFor(s.id) })).filter((x) => x.c);
  return (
    <div>
      <PageHero
        topic="government"
        crumb={{ href: "/leaders", label: { ta: "தமிழ்நாடு அரசு", en: "Tamil Nadu government" } }}
        title={{ ta: "மாநில முதலமைச்சர்கள்", en: "Chief Ministers of states" }}
        intro={{ ta: `${dataMeta.asOf} நிலவரம். சில மாநிலங்களில் சமீபத்தில் மாற்றம் நடந்துள்ளது; அரசு இணையதளத்துடன் சரிபார்ப்பு நிலுவை.`, en: `As of ${dataMeta.asOf}. Several states changed leadership recently; official verification is pending.` }}
      />
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-2 sm:px-6">
        <StatesBrowser states={stateCms} portraits={portraits} />
        <details className="mt-12 text-sm text-ink-soft">
          <summary className="min-h-11 cursor-pointer font-bold">
            <T v={{ ta: "புகைப்பட உரிமம் & ஆதாரம்", en: "Photo credits & sources" }} />
          </summary>
          <p className="mt-2">{dataMeta.note}</p>
          <ul className="mt-2 space-y-1">
            {credits.map(({ s, c }) => (
              <li key={s.id}>
                {c!.page} – {c!.author || "n/a"} – {c!.license} –{" "}
                <a href={c!.source} className="underline" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}
