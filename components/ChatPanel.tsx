"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { T, useLang } from "@/lib/lang";
import { getCachedAnswer, putCachedAnswer } from "@/lib/clientcache";
import { recordQuery } from "@/lib/hooks";
import { useSpeechInput, useSpeechOutput } from "@/lib/speech";
import { defaultSuggestions, type ChatAnswer } from "@/lib/answer";
import { MicButton } from "./MicButton";

type Msg = { id: number; role: "user" | "bot"; text: string; answer?: ChatAnswer };

const Avatar = () => (
  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-display text-base font-bold text-white">
    M
  </span>
);

export function ChatPanel({ initialQuestion }: { initialQuestion?: string }) {
  const { lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(true);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const out = useSpeechOutput(lang);

  const send = useCallback(
    async (q: string, viaVoice = false) => {
      const text = q.trim();
      if (!text) return;
      setMessages((m) => [...m, { id: idRef.current++, role: "user", text }]);
      setInput("");
      recordQuery(text);
      const cached = getCachedAnswer(text, lang);
      if (cached) {
        setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: cached.text, answer: cached }]);
        if (viaVoice && voiceReplies) out.speak(cached.speech);
        return;
      }
      setBusy(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, lang }),
        });
        if (res.status === 429) {
          const wait = lang === "ta" ? "நிறைய கேள்விகள். ஒரு நிமிடம் கழித்து முயலுங்கள்." : "Too many questions. Please wait a minute.";
          setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: wait }]);
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const a: ChatAnswer = await res.json();
        putCachedAnswer(text, lang, a);
        setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: a.text, answer: a }]);
        if (viaVoice && voiceReplies) out.speak(a.speech);
      } catch {
        const err = lang === "ta" ? "இணைப்புப் பிழை. மீண்டும் முயலுங்கள்." : "Connection problem. Please try again.";
        setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: err }]);
      } finally {
        setBusy(false);
      }
    },
    [lang, voiceReplies, out],
  );

  const mic = useSpeechInput(lang, (t) => void send(t, true));

  useEffect(() => {
    if (initialQuestion && !startedRef.current) {
      startedRef.current = true;
      void send(initialQuestion);
    }
  }, [initialQuestion, send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, busy]);

  const lastSuggestions = [...messages].reverse().find((m) => m.answer)?.answer?.suggestions ?? defaultSuggestions[lang];

  return (
    <section aria-label="Chat" className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_70px_-35px_rgb(0_0_0/0.45)]">
      <div className="flex items-center gap-3 bg-brand px-5 py-4 text-white">
        <span aria-hidden="true" className="relative grid size-11 place-items-center rounded-full bg-white font-display text-xl font-bold text-brand">
          M
          <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-brand bg-[#7ee2a4]" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="font-display text-lg font-bold">
            <T v={{ ta: "MakkalLens உதவியாளர்", en: "MakkalLens assistant" }} />
          </h2>
          <p className="text-sm text-white/85">
            <T v={{ ta: "எப்போதும் தயார் · தமிழில் கேளுங்கள்", en: "Always ready · ask in Tamil" }} />
          </p>
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold">
          <span className="relative inline-block h-6 w-11">
            <input
              type="checkbox"
              checked={voiceReplies}
              onChange={(e) => {
                setVoiceReplies(e.target.checked);
                if (!e.target.checked) out.cancel();
              }}
              className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
            />
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-white/30 transition-colors peer-checked:bg-white" />
            <span aria-hidden="true" className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-all peer-checked:left-[1.4rem] peer-checked:bg-brand" />
          </span>
          <T v={{ ta: "குரலில் பதில்", en: "Voice replies" }} />
        </label>
      </div>

      <div className="max-h-[55vh] min-h-72 space-y-5 overflow-y-auto bg-tint/60 px-4 py-5 sm:px-6" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex gap-3">
            <Avatar />
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
              <p className="font-display text-lg font-semibold">
                <T v={{ ta: "வணக்கம்!", en: "Hello!" }} />
              </p>
              <p className="mt-1 text-ink-soft">
                <T
                  v={{
                    ta: "எந்த அரசு சேவை பற்றியும் தமிழில் கேளுங்கள் – தட்டச்சு செய்தோ, மைக்கை அழுத்திப் பேசியோ.",
                    en: "Ask about any government service – type, or press the mic and speak.",
                  }}
                />
              </p>
            </div>
          </div>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-white shadow-sm">{m.text}</p>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <Avatar />
              <div className="min-w-0 max-w-[90%] space-y-2">
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.answer?.links && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.answer.links.map((l) =>
                        l.href.startsWith("/") ? (
                          <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 font-display text-base font-semibold text-white hover:bg-brand-dark">
                            {l.label} →
                          </Link>
                        ) : (
                          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border-2 border-brand px-4 font-display text-base font-semibold text-brand hover:bg-brand hover:text-white">
                            {l.label} ↗
                          </a>
                        ),
                      )}
                    </div>
                  )}
                </div>
                {m.answer && (
                  <button
                    type="button"
                    onClick={() => (out.speaking ? out.cancel() : out.speak(m.answer!.speech))}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-brand hover:bg-white"
                  >
                    {out.speaking ? <T v={{ ta: "■ நிறுத்து", en: "■ Stop" }} /> : <T v={{ ta: "▶ குரலில் கேளுங்கள்", en: "▶ Listen" }} />}
                  </button>
                )}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex items-center gap-3">
            <Avatar />
            <span className="inline-flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm" role="status" aria-label="Checking">
              <span className="size-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-brand" />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {out.missingVoice && (
        <p role="status" className="border-t border-line bg-warn-tint px-4 py-2 text-base text-ink">
          <T
            v={{
              ta: "இந்தச் சாதனத்தில் தமிழ் குரல் நிறுவப்படவில்லை. Android/Chrome-இல் Google Text-to-speech-இல் தமிழ் குரலை நிறுவினால் பேசும்.",
              en: "No Tamil voice is installed on this device. Install the Tamil voice in your text-to-speech settings.",
            }}
          />
        </p>
      )}

      <ul className="flex gap-2 overflow-x-auto bg-white px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Suggestions">
        {lastSuggestions.map((s) => (
          <li key={s} className="shrink-0">
            <button type="button" onClick={() => void send(s)} className="min-h-11 rounded-full border border-brand/40 bg-tint px-4 text-base text-brand-dark transition-colors hover:bg-brand hover:text-white">
              {s}
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2 border-t border-line bg-white p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          <T v={{ ta: "உங்கள் கேள்வி", en: "Your question" }} />
        </label>
        <input
          id="chat-input"
          value={mic.listening ? mic.interim : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "ta" ? "உங்கள் கேள்வியை இங்கே எழுதுங்கள்…" : "Type your question…"}
          className="min-h-12 min-w-0 flex-1 rounded-full border-2 border-line bg-tint/60 px-5 text-lg focus:border-brand"
          autoComplete="off"
        />
        <MicButton size="md" listening={mic.listening} supported={mic.supported} onClick={mic.listening ? mic.stop : mic.start} />
        <button type="submit" disabled={busy} aria-label={lang === "ta" ? "அனுப்பு" : "Send"} className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-white hover:bg-brand-dark disabled:opacity-50">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
          </svg>
        </button>
      </form>
    </section>
  );
}
