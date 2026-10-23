"use client";

import { getScheme } from "./data";
import { PROFILE_KEY, type Profile } from "./profile";
import type { Reminder } from "./reminders";
import { REMINDERS_KEY } from "./reminders";
import { readStore, writeStore } from "./store";
import { supabase } from "./supabase";

/**
 * Optional cloud backup for signed-in users. Only minimal data goes up: age, district, gender, occupation,
 * income band, language, saved scheme ids and reminders. Never Aadhaar/PAN numbers or document images.
 */
export async function syncUp(): Promise<{ ok: boolean; message: string }> {
  const sb = supabase();
  if (!sb) return { ok: false, message: "not-configured" };
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return { ok: false, message: "signed-out" };

  const profile = readStore<Profile | null>(PROFILE_KEY, null);
  const saved = readStore<string[]>("av-saved", []).filter((id) => getScheme(id));
  const reminders = readStore<Reminder[]>(REMINDERS_KEY, []);

  const u = await sb.from("users").upsert({
    id: user.id,
    email: user.email,
    district: profile?.district ?? null,
    age: profile?.age ?? null,
    gender: profile?.gender ?? null,
    occupation: profile?.occupation ?? null,
    income_range: profile?.income ?? null,
    language: document.documentElement.lang === "en" ? "en" : "ta",
  });
  if (u.error) return { ok: false, message: u.error.message };

  if (saved.length) {
    const r = await sb.from("saved_schemes").upsert(saved.map((scheme_id) => ({ user_id: user.id, scheme_id })), { onConflict: "user_id,scheme_id" });
    if (r.error) return { ok: false, message: r.error.message };
  }
  if (reminders.length) {
    const r = await sb.from("reminders").upsert(reminders.map((x) => ({ id: x.id, user_id: user.id, title: x.title, due_date: x.due })));
    if (r.error) return { ok: false, message: r.error.message };
  }
  return { ok: true, message: "synced" };
}

export async function syncDown(): Promise<{ ok: boolean; message: string }> {
  const sb = supabase();
  if (!sb) return { ok: false, message: "not-configured" };
  const { data } = await sb.auth.getUser();
  if (!data.user) return { ok: false, message: "signed-out" };
  const [s, r] = await Promise.all([sb.from("saved_schemes").select("scheme_id"), sb.from("reminders").select("id,title,due_date")]);
  if (s.error || r.error) return { ok: false, message: (s.error ?? r.error)!.message };
  const saved = new Set([...readStore<string[]>("av-saved", []), ...(s.data ?? []).map((x) => x.scheme_id as string)]);
  writeStore("av-saved", [...saved]);
  const have = new Map(readStore<Reminder[]>(REMINDERS_KEY, []).map((x) => [x.id, x]));
  for (const x of r.data ?? []) have.set(x.id as string, { id: x.id as string, title: x.title as string, due: x.due_date as string });
  writeStore(REMINDERS_KEY, [...have.values()]);
  return { ok: true, message: "restored" };
}
