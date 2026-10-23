import { T } from "@/lib/lang";

export function VerifyBadge({ date }: { date: string | null }) {
  if (date) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand bg-tint px-3 py-0.5 font-display text-sm font-semibold text-brand">
        ✓ <T v={{ ta: "சரிபார்க்கப்பட்டது", en: "Verified" }} /> · {date}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3 py-0.5 font-display text-sm font-semibold">
      <T v={{ ta: "சரிபார்ப்பு நிலுவை – அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யுங்கள்", en: "Verification pending – confirm on the official site" }} />
    </span>
  );
}
