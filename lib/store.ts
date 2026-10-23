"use client";

import { useCallback, useSyncExternalStore } from "react";

// A tiny localStorage-backed store. Snapshots are cached per key so useSyncExternalStore
// gets a stable reference until the underlying string changes.
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return fallback;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeStore<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked – the in-memory cache below still lets this session work */
    cache.set(key, { raw: JSON.stringify(value), value });
  }
  listeners.get(key)?.forEach((f) => f());
}

export function readStore<T>(key: string, fallback: T): T {
  return read(key, fallback);
}

export function clearStore(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  cache.delete(key);
  listeners.get(key)?.forEach((f) => f());
}

/** React hook: [value, set]. `fallback` must be a module-level constant (stable reference). */
export function useStore<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (cb: () => void) => {
      let set = listeners.get(key);
      if (!set) listeners.set(key, (set = new Set()));
      set.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache.delete(key);
          cb();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set!.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(read(key, fallback)) : v;
      writeStore(key, next);
    },
    [key, fallback],
  );
  return [value, set];
}
