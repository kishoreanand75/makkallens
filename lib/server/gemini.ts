import type { SearchHit } from "../search";

export const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = 400;
const MAX_CONTEXT_CHARS = 9000; // ≈ 3,000 tokens, within the PDF's 3,000–5,000 budget

export interface GeminiResult {
  text: string;
  tokensIn?: number;
  tokensOut?: number;
}

export const geminiEnabled = () => Boolean(process.env.GEMINI_API_KEY);

/**
 * Asks Gemini Flash to answer ONLY from the supplied context. The key is read from the server environment
 * and is never exposed to the browser. Returns null on any failure so the caller can fall back to rules answers.
 */
export async function geminiAnswer(question: string, lang: "ta" | "en", context: SearchHit[] | string, fetchImpl: typeof fetch = fetch): Promise<GeminiResult | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const ctx = (typeof context === "string" ? context : JSON.stringify(context.map((h) => ({ type: h.type, title: h.title, summary: h.blurb, link: h.href })))).slice(0, MAX_CONTEXT_CHARS);
  const system =
    (lang === "ta"
      ? "நீங்கள் தமிழ்நாட்டு மக்களுக்கான அரசு சேவை வழிகாட்டி உதவியாளர். எளிய, மரியாதையான தமிழில் 6 வரிகளுக்குள் பதில் சொல்லுங்கள். "
      : "You are a government-services guide assistant for people in Tamil Nadu. Answer in plain, polite English in at most 6 lines. ") +
    "Use ONLY the facts in the CONTEXT. If the context does not contain the answer, say you do not have a verified guide for it yet and suggest asking a CSC / e-Sevai centre. " +
    "Never invent fees, dates, amounts or links. Never present your answer as an official government decision. Never ask for Aadhaar, PAN, OTP or passwords.";
  try {
    const res = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: `CONTEXT:\n${ctx}\n\nQUESTION:\n${question.slice(0, 300)}` }] }],
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.2 },
      }),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    if (!text) return null;
    return { text, tokensIn: data.usageMetadata?.promptTokenCount, tokensOut: data.usageMetadata?.candidatesTokenCount };
  } catch {
    return null;
  }
}
