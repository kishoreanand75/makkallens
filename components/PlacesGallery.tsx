import Image from "next/image";
import { T } from "@/lib/lang";
import { places } from "@/lib/places";
import { Reveal } from "./Reveal";

/** Gallery of AI-generated illustrations of Tamil Nadu places (clearly labelled as such). Lives on /tamil-nadu, not the home page. */
export function PlacesGallery() {
  return (
    <section aria-labelledby="places">
      <h2 id="places" className="sr-only">
        <T v={{ ta: "தமிழ்நாட்டின் இடங்கள்", en: "Places of Tamil Nadu" }} />
      </h2>
      <ul className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {places.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.08} variant="clip" className={`group relative overflow-hidden rounded-xl border-2 border-ink bg-white ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
            <div className={`relative ${i === 0 ? "aspect-[3/2] md:aspect-auto md:h-full md:min-h-[28rem]" : "aspect-[3/2]"}`}>
              <Image src={`/places/${p.id}.webp`} alt={p.alt.ta} fill sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="object-cover " />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 border-t-2 border-ink bg-white p-3 sm:p-4">
                <p className="font-display text-sm font-semibold text-brand">
                  <T v={p.where} />
                </p>
                <h3 className={`${i === 0 ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"} leading-snug`}>
                  <T v={p.name} />
                </h3>
                <p className="mt-1 hidden text-base text-ink-soft sm:block">
                  <T v={p.line} />
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft">
        <T
          v={{
            ta: "இந்தப் படங்கள் AI மூலம் உருவாக்கப்பட்ட விளக்கப்படங்கள்; உண்மையான இடங்களால் ஈர்க்கப்பட்டவை; அந்தந்த நினைவுச் சின்னங்களின் துல்லியமான தோற்றம் அல்ல, புகைப்படங்களும் அல்ல.",
            en: "These are AI-generated illustrations inspired by real places – not exact depictions of the monuments, and not photographs.",
          }}
        />
      </p>
    </section>
  );
}
