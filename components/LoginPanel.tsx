"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { T, useLang } from "@/lib/lang";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { syncDown, syncUp } from "@/lib/sync";

/**
 * Login is optional (only for saving / syncing). Google + email one-time code through Supabase Auth.
 * Without NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY the site runs in "local mode" and says so.
 */
export function LoginPanel() {
  const { lang } = useLang();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="rounded-xl border-2 border-dashed border-brand bg-sun-tint p-5">
        <h2 className="text-xl">
          <T v={{ ta: "தற்போது 'உள்ளூர் முறை'", en: "Running in local mode" }} />
        </h2>
        <p className="mt-2 text-ink-soft">
          <T
            v={{
              ta: "உள்நுழைவு இல்லாமலே எல்லாம் வேலை செய்யும்; உங்கள் சுயவிவரம், சேமிப்புகள், நினைவூட்டல்கள் இந்தச் சாதனத்திலேயே இருக்கும். கிளவுட் காப்புக்கு Supabase விசைகளை (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) அமைத்தால் Google / மின்னஞ்சல் OTP உள்நுழைவு இயங்கும்.",
              en: "Everything works without signing in; your profile, saved items and reminders stay on this device. Set the Supabase keys (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) to enable Google / email-code sign-in and cloud backup.",
            }}
          />
        </p>
      </div>
    );
  }

  const sb = supabase()!;
  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    setMsg(null);
    try {
      setMsg(await fn());
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  };

  if (session) {
    return (
      <div className="space-y-4">
        <p className="text-lg">
          <T v={{ ta: "உள்நுழைந்துள்ளீர்கள்:", en: "Signed in as" }} /> <strong>{session.user.email}</strong>
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={() => run(async () => ((await syncUp()).ok ? (lang === "ta" ? "மேகத்தில் சேமிக்கப்பட்டது ✓" : "Backed up ✓") : lang === "ta" ? "காப்பு தோல்வி" : "Backup failed"))} className="min-h-12 rounded-lg bg-brand px-5 font-display text-base font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            <T v={{ ta: "⬆ என் தகவலை மேகத்தில் சேமி", en: "⬆ Back up my data" }} />
          </button>
          <button type="button" disabled={busy} onClick={() => run(async () => ((await syncDown()).ok ? (lang === "ta" ? "மீட்கப்பட்டது ✓" : "Restored ✓") : lang === "ta" ? "மீட்பு தோல்வி" : "Restore failed"))} className="min-h-12 rounded-lg border-2 border-ink px-5 font-display text-base font-semibold hover:bg-sun/40 disabled:opacity-50">
            <T v={{ ta: "⬇ மேகத்திலிருந்து மீட்டெடு", en: "⬇ Restore from cloud" }} />
          </button>
          <button type="button" onClick={() => sb.auth.signOut()} className="min-h-12 px-3 font-display text-base font-semibold underline underline-offset-4">
            <T v={{ ta: "வெளியேறு", en: "Sign out" }} />
          </button>
        </div>
        {msg && (
          <p role="status" className="text-brand">
            {msg}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        disabled={busy}
        onClick={() => run(async () => { const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/login` } }); return error?.message ?? null; })}
        className="min-h-14 w-full rounded-xl border-2 border-ink bg-paper-2 px-5 font-display text-lg font-semibold hover:bg-sun/40 disabled:opacity-50"
      >
        <T v={{ ta: "Google மூலம் உள்நுழை", en: "Continue with Google" }} />
      </button>
      <div className="flex items-center gap-3 text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        <T v={{ ta: "அல்லது மின்னஞ்சல் குறியீடு", en: "or an email code" }} />
        <span className="h-px flex-1 bg-line" />
      </div>
      {stage === "email" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
              if (error) return error.message;
              setStage("code");
              return lang === "ta" ? "குறியீடு அனுப்பப்பட்டது; மின்னஞ்சலைப் பாருங்கள்." : "Code sent; check your email.";
            });
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="font-display text-base font-semibold"><T v={{ ta: "மின்னஞ்சல்", en: "Email" }} /></span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 min-h-14 w-full rounded-xl border-2 border-ink bg-paper-2 px-4 text-lg" autoComplete="email" />
          </label>
          <button type="submit" disabled={busy} className="min-h-14 rounded-xl bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            <T v={{ ta: "குறியீடு அனுப்பு", en: "Send code" }} />
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              const { error } = await sb.auth.verifyOtp({ email, token: code.trim(), type: "email" });
              return error?.message ?? null;
            });
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="font-display text-base font-semibold"><T v={{ ta: "மின்னஞ்சலில் வந்த குறியீடு", en: "Code from your email" }} /></span>
            <input required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 min-h-14 w-48 rounded-xl border-2 border-ink bg-paper-2 px-4 text-center font-display text-2xl tracking-widest" autoComplete="one-time-code" />
          </label>
          <button type="submit" disabled={busy} className="min-h-14 rounded-xl bg-brand px-6 font-display text-lg font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            <T v={{ ta: "உறுதிசெய்", en: "Verify" }} />
          </button>
        </form>
      )}
      {msg && (
        <p role="status" className="text-ink-soft">
          {msg}
        </p>
      )}
    </div>
  );
}
