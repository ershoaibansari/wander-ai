/**
 * Server-side Gemini client. The API key never leaves the server —
 * all calls happen inside route handlers.
 */
import { parseJsonSafe } from "@/lib/utils";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 45_000;

export class GeminiError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeminiError";
  }
}

async function callGemini({ contents, system, json, temperature, maxOutputTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is not configured");

  const response = await fetch(`${BASE_URL}/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens,
        ...(json ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new GeminiError(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  if (!text.trim()) throw new GeminiError("Gemini returned an empty response");
  return text;
}

/**
 * Generate a structured JSON response. When Gemini is unreachable and a
 * fallback is provided, the fallback is returned with source: "fallback"
 * so the demo experience keeps working offline.
 */
export async function generateJson(
  { prompt, system, temperature = 0.8, maxOutputTokens = 4096 },
  fallback
) {
  try {
    const text = await callGemini({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      system,
      json: true,
      temperature,
      maxOutputTokens,
    });
    const parsed = parseJsonSafe(text);
    if (!parsed) throw new GeminiError("Gemini returned unparseable JSON");
    return { data: parsed, source: "gemini" };
  } catch (error) {
    console.error("[gemini]", error.message);
    if (fallback !== undefined) return { data: fallback, source: "fallback" };
    throw error;
  }
}

/** Generate free-form text (used for storytelling). */
export async function generateText(
  { prompt, system, temperature = 0.9, maxOutputTokens = 4096 },
  fallback
) {
  try {
    const text = await callGemini({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      system,
      json: false,
      temperature,
      maxOutputTokens,
    });
    return { data: text.trim(), source: "gemini" };
  } catch (error) {
    console.error("[gemini]", error.message);
    if (fallback !== undefined) return { data: fallback, source: "fallback" };
    throw error;
  }
}

/** Multi-turn chat for the floating AI travel assistant. */
export async function generateChat({ system, messages }, fallback) {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: String(message.content ?? "").slice(0, 4000) }],
  }));
  try {
    const text = await callGemini({
      contents,
      system,
      json: false,
      temperature: 0.7,
      maxOutputTokens: 1024,
    });
    return { data: text.trim(), source: "gemini" };
  } catch (error) {
    console.error("[gemini]", error.message);
    if (fallback !== undefined) return { data: fallback, source: "fallback" };
    throw error;
  }
}
