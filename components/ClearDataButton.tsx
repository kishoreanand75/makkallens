"use client";

import { useState } from "react";
import { T } from "@/lib/lang";
import { clearAllLocalData } from "@/lib/hooks";

export function ClearDataButton() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          clearAllLocalData();
          setDone(true);
        }}
        className="min-h-12 rounded-lg border-2 border-ink px-5 font-display text-base font-semibold text-ink hover:bg-sun-tint"
      >
        <T v={{ ta: "இந்தச் சாதனத்தில் உள்ள என் தகவல் அனைத்தையும் அழி", en: "Erase all my data on this device" }} />
      </button>
      {done && (
        <p role="status" className="mt-3 font-display text-lg font-semibold text-brand">
          <T v={{ ta: "அழிக்கப்பட்டது ✓", en: "Erased ✓" }} />
        </p>
      )}
    </div>
  );
}
