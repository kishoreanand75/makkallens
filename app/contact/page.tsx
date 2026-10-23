import type { Metadata } from "next";
import { ReportForm } from "@/components/ReportForm";
import { T } from "@/lib/lang";

export const metadata: Metadata = { title: "தொடர்பு & ஆதரவு | MakkalLens", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl sm:text-5xl">
        <T v={{ ta: "தொடர்பு & ஆதரவு", en: "Contact & support" }} />
      </h1>
      <p className="mb-8 mt-3 text-xl text-ink-soft">
        <T v={{ ta: "கேள்வி, பரிந்துரை, தவறான தகவல் புகார், கணக்கு நீக்கக் கோரிக்கை – எழுதுங்கள்.", en: "Questions, suggestions, error reports or account-deletion requests – write to us." }} />
      </p>
      <ReportForm target="page:contact" kind="contact" />
      <p className="mt-8 text-sm text-ink-soft">
        <T v={{ ta: "அரசு சேவை தொடர்பான அவசர உதவிக்கு இ-சேவை உதவி எண் 1800-425-6000 அல்லது 112-ஐ அழையுங்கள். நாங்கள் அரசுத் துறை அல்ல.", en: "For urgent government-service help call the e-Sevai helpline 1800-425-6000, or 112. We are not a government department." }} />
      </p>
    </div>
  );
}
