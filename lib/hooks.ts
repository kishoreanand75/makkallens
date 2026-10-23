"use client";

import { useCallback } from "react";
import { HISTORY_KEY, pushEvent, type HistoryEvent } from "./history";
import { emptyProfile, PROFILE_KEY, type Profile } from "./profile";
import { clearStore, readStore, useStore, writeStore } from "./store";

const NO_EVENTS: HistoryEvent[] = [];
const NO_STRINGS: string[] = [];

export function useProfile() {
  const [profile, setProfile] = useStore<Profile>(PROFILE_KEY, emptyProfile);
  // older saved profiles may lack newer fields
  const merged: Profile = { ...emptyProfile, ...profile };
  const update = useCallback((patch: Partial<Profile>) => setProfile((p) => ({ ...emptyProfile, ...p, ...patch })), [setProfile]);
  const reset = useCallback(() => clearStore(PROFILE_KEY), []);
  return { profile: merged, update, reset };
}

export function useHistory() {
  const [events] = useStore<HistoryEvent[]>(HISTORY_KEY, NO_EVENTS);
  const clear = useCallback(() => clearStore(HISTORY_KEY), []);
  return { events, clear };
}

/** Non-hook recorders (safe to call from event handlers / effects). */
export function recordQuery(text: string) {
  const t = text.trim().slice(0, 120);
  if (!t) return;
  writeStore(HISTORY_KEY, pushEvent(readStore<HistoryEvent[]>(HISTORY_KEY, NO_EVENTS), { t: Date.now(), k: "q", text: t }));
}

export function recordView(type: "scheme" | "service" | "exam", id: string, tags: string[]) {
  writeStore(HISTORY_KEY, pushEvent(readStore<HistoryEvent[]>(HISTORY_KEY, NO_EVENTS), { t: Date.now(), k: "view", type, id, tags }));
}

const SAVED_KEY = "av-saved";
const DOCS_KEY = "av-docs";

export function useSavedSchemes() {
  const [ids, setIds] = useStore<string[]>(SAVED_KEY, NO_STRINGS);
  const toggle = useCallback((id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])), [setIds]);
  return { ids, toggle, has: (id: string) => ids.includes(id) };
}

/**
 * Documents the user says they already have (one list for the whole site, edited from the floating "My documents" button).
 * Only document *types* are stored – never numbers or images.
 */
export function useMyDocs() {
  const [ids, setIds] = useStore<string[]>(DOCS_KEY, NO_STRINGS);
  const save = useCallback((next: string[]) => setIds([...new Set(next)]), [setIds]);
  return { ids, save, has: (id: string) => ids.includes(id) };
}

/** Opens the "My documents" popup from anywhere. */
export function openMyDocs() {
  window.dispatchEvent(new CustomEvent("av:open-docs"));
}

export function clearAllLocalData() {
  for (const k of [PROFILE_KEY, HISTORY_KEY, SAVED_KEY, DOCS_KEY, "av-reminders", "av-answers"]) clearStore(k);
}
