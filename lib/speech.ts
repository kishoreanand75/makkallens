"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Lang } from "./lang";

// Minimal typings for the (still prefixed) Web Speech recognition API.
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;

const langTag = (l: Lang) => (l === "ta" ? "ta-IN" : "en-IN");

function getCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Voice input. `onFinal` receives the final transcript when the user stops speaking. */
export function useSpeechInput(lang: Lang, onFinal: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const finalRef = useRef(onFinal);
  useEffect(() => {
    finalRef.current = onFinal;
  });

  // false on the server, real value on the client – avoids a hydration mismatch.
  const supported = useSyncExternalStore(
    () => () => {},
    () => getCtor() !== null,
    () => false,
  );

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) {
      setError("unsupported");
      return;
    }
    setError(null);
    setInterim("");
    const rec = new Ctor();
    rec.lang = langTag(lang);
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let live = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      setInterim(finalText + live);
    };
    rec.onerror = (e) => setError(e.error);
    rec.onend = () => {
      setListening(false);
      setInterim("");
      if (finalText.trim()) finalRef.current(finalText.trim());
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [lang]);

  useEffect(() => () => recRef.current?.stop(), []);

  return { supported, listening, interim, error, start, stop };
}

/** Voice output through the browser's speech synthesis. */
export function useSpeechOutput(lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const [missingVoice, setMissingVoice] = useState(false);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setMissingVoice(true);
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langTag(lang);
      const prefix = lang === "ta" ? "ta" : "en";
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix));
      if (voice) u.voice = voice;
      setMissingVoice(lang === "ta" && !voice);
      u.rate = 0.95;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [lang],
  );

  useEffect(() => cancel, [cancel]);

  return { speaking, missingVoice, speak, cancel };
}
