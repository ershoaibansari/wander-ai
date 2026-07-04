/**
 * Server-side Gemini client. The API key never leaves the server —
 * all calls happen inside route handlers.
 */
import { parseJsonSafe } from "@/lib/utils";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 45_000;

// Simple in-memory response cache to improve efficiency and reduce API calls
const geminiCache = global._geminiCache || new Map();
global._geminiCache = geminiCache;

export class GeminiError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeminiError";
  }
}

/**
 * Internal helper to send content requests to the Gemini API with optional system instructions and JSON response formatting.
 * Handles in-memory caching and request timeouts.
 * @param {Object} params - Gemini call parameters.
 * @param {Array} params.contents - Array of content objects mapped to model role schemas.
 * @param {string} [params.system] - System developer instructions.
 * @param {boolean} [params.json] - True if requesting JSON MIME output format.
 * @param {number} [params.temperature] - Request temperature parameter (creativity).
 * @param {number} [params.maxOutputTokens] - Maximum output tokens parameter limit.
 * @returns {Promise<string>} The raw text response from the API.
 * @throws {GeminiError} If the API key is not configured or the HTTP request fails.
 */
async function callGemini({ contents, system, json, temperature, maxOutputTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is not configured");

  // Check cache to avoid duplicate API calls
  const cacheKey = JSON.stringify({ contents, system, json, temperature, maxOutputTokens });
  if (geminiCache.has(cacheKey)) {
    return geminiCache.get(cacheKey);
  }

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
  
  // Store in cache before returning
  geminiCache.set(cacheKey, text);
  return text;
}


/**
 * Generates a structured JSON response. If Gemini fails, returns fallback content (offline-first support).
 * @param {Object} config - Gemini output options configuration.
 * @param {string} config.prompt - User input prompt.
 * @param {string} [config.system] - System developer instructions.
 * @param {number} [config.temperature=0.8] - Temperature parameter.
 * @param {number} [config.maxOutputTokens=4096] - Token size limit.
 * @param {Object} [fallback] - Fallback JSON object to return when offline or API fails.
 * @returns {Promise<Object>} Formatted result object containing data and source indicator.
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

/**
 * Generates free-form text response (typically for storytelling).
 * @param {Object} config - Gemini config options.
 * @param {string} config.prompt - User prompt content.
 * @param {string} [config.system] - System developer instructions.
 * @param {number} [config.temperature=0.9] - Temperature parameter.
 * @param {number} [config.maxOutputTokens=4096] - Token size limit.
 * @param {string} [fallback] - Fallback text to return when offline or API fails.
 * @returns {Promise<Object>} Formatted result object containing text data and source.
 */
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

/**
 * Multi-turn chat assistant helper for the floating travel companion widget.
 * @param {Object} config - Chat thread options.
 * @param {string} [config.system] - System developer instructions.
 * @param {Array} config.messages - Thread messages array containing role and content.
 * @param {string} [fallback] - Fallback response to return when offline or API fails.
 * @returns {Promise<Object>} Formatted result object containing reply string and source.
 */
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
