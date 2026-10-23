"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/hooks";

/** Records that this page was opened, so the on-device "for you" ranking can learn. Renders nothing. */
export function TrackView({ type, id, tags }: { type: "scheme" | "service" | "exam"; id: string; tags: string[] }) {
  const key = tags.join("|");
  useEffect(() => {
    recordView(type, id, key ? key.split("|") : []);
  }, [type, id, key]);
  return null;
}
