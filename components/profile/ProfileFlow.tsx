"use client";

import { useState } from "react";
import { useProfile } from "@/lib/hooks";
import { profileProgress } from "@/lib/profile";
import { ProfileResults } from "./ProfileResults";
import { ProfileWizard } from "./ProfileWizard";

export function ProfileFlow() {
  const { profile } = useProfile();
  // Returning visitors with an answered profile land on their results; first-timers start the wizard.
  // Once the user starts answering (or presses edit) the wizard stays until they finish it.
  const [forced, setForced] = useState<"wizard" | "results" | null>(null);
  const mode = forced ?? (profileProgress(profile) < 3 ? "wizard" : "results");
  return mode === "wizard" ? (
    <ProfileWizard onActive={() => setForced("wizard")} onDone={() => setForced("results")} />
  ) : (
    <ProfileResults onEdit={() => setForced("wizard")} />
  );
}
