"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { L } from "./services";

export type Lang = "ta" | "en";

const KEY = "av-lang";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "ta";
  } catch {
    return "ta";
  }
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "ta" as Lang);
  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable – keep working in memory only */
    }
    document.documentElement.lang = l;
    listeners.forEach((f) => f());
  }, []);
  return { lang, setLang };
}

/** Renders the Tamil or English half of a bilingual string. */
export function T({ v }: { v: L }) {
  const { lang } = useLang();
  return <>{v[lang]}</>;
}
