import Link from "next/link";
import { T } from "@/lib/lang";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-display text-7xl font-semibold text-brand">404</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">
        <T v={{ ta: "இந்தப் பக்கம் கிடைக்கவில்லை", en: "We could not find that page" }} />
      </h1>
      <p className="mt-3 text-xl text-ink-soft">
        <T v={{ ta: "முகவரியைச் சரிபாருங்கள் அல்லது கீழே உள்ளவற்றில் ஒன்றைத் தேர்ந்தெடுங்கள்.", en: "Check the address or pick one of these." }} />
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-lg bg-brand px-5 font-display text-lg font-semibold text-white hover:bg-brand-dark">
          <T v={{ ta: "முகப்பு", en: "Home" }} />
        </Link>
        <Link href="/ask" className="inline-flex min-h-12 items-center rounded-lg border-2 border-ink px-5 font-display text-lg font-semibold hover:bg-sun/40">
          <T v={{ ta: "கேளுங்கள்", en: "Ask" }} />
        </Link>
        <Link href="/explore" className="inline-flex min-h-12 items-center rounded-lg border-2 border-ink px-5 font-display text-lg font-semibold hover:bg-sun/40">
          <T v={{ ta: "அனைத்துப் பகுதிகள்", en: "All sections" }} />
        </Link>
      </div>
    </div>
  );
}
