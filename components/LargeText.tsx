"use client";

import { useEffect, useSyncExternalStore } from "react";
import { T } from "@/lib/lang";
import { readStore, writeStore } from "@/lib/store";

const KEY = "av-large";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
const read = () => readStore<boolean>(KEY, false);

function apply(on: boolean) {
  document.documentElement.dataset.large = on ? "1" : "0";
}

/** Header toggle: larger text for everyone ("large text" for senior users). Remembered on the device. */
export function LargeTextToggle() {
  const on = useSyncExternalStore(subscribe, read, () => false);
  useEffect(() => apply(on), [on]);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        writeStore(KEY, !on);
        listeners.forEach((f) => f());
      }}
      className={`min-h-9 min-w-9 rounded border-2 border-ink px-2 font-display text-sm font-semibold ${on ? "bg-ink text-white" : "hover:bg-white"}`}
      title="பெரிய எழுத்து / Large text"
    >
      <span aria-hidden="true">A+</span>
      <span className="sr-only">
        <T v={{ ta: "பெரிய எழுத்து", en: "Large text" }} />
      </span>
    </button>
  );
}

/** Forces large text while a page (e.g. the senior-citizen page) is open. */
export function ForceLargeText() {
  useEffect(() => {
    const before = document.documentElement.dataset.large;
    apply(true);
    return () => apply(before === "1");
  }, []);
  return null;
}
