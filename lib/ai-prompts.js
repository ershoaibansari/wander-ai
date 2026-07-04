import {
  fallbackChat,
  fallbackCulture,
  fallbackDiscover,
  fallbackEtiquetteCheck,
  fallbackEvents,
  fallbackFood,
  fallbackItinerary,
  fallbackPhrases,
  fallbackQuiz,
  fallbackSavingCheats,
  fallbackStory,
} from "@/lib/fallback-content";
import { generateChat, generateJson, generateText } from "@/lib/gemini";
import { validateDestination } from "@/lib/utils";

const system = "You are WanderAI, a culturally respectful travel companion. Prefer authentic local experiences, heritage, etiquette, hidden gems, local food, festivals, safety, and accessibility. Never invent unsafe advice. Return concise, practical responses.";

/**
 * Extracts and validates a destination or travel mood query from the request body.
 * @param {Object} body - The parsed request body.
 * @returns {string|null} The cleaned destination string, or null if validation fails.
 */
function getValidatedDestination(body) {
  const query = String(body.query || body.destination || "").trim();
  return validateDestination(query) ? query : null;
}

/**
 * Generates an error response object.
 * @param {string} message - The error message.
 * @returns {Object} The formatted invalid request response.
 */
function invalid(message) {
  return { error: message, status: 400 };
}

/**
 * AI destination discovery runner.
 * @param {Object} body - Request body containing 'query' or 'destination'.
 * @returns {Promise<Object>} The discovery results.
 */
export async function runDiscover(body) {
  const query = getValidatedDestination(body);
  if (!query) return invalid("Enter a destination or travel mood.");
  const prompt = `For "${query}", return JSON with destination, vibe, attractions, hiddenGems, neighborhoods, viewpoints, markets, experiences, localFood, festivalsEvents. Arrays should contain objects with name and useful details.`;
  return generateJson({ prompt, system }, fallbackDiscover(query));
}

/**
 * AI cultural guide runner.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} The cultural guidelines.
 */
export async function runCulture(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Return JSON cultural companion guidance for ${destination}: greetings, customs, religion, traditions, dressCode, photography, diningEtiquette, giftEtiquette, thingsToAvoid array, emergencyTips array.`;
  return generateJson({ prompt, system }, fallbackCulture(destination));
}

/**
 * AI storytelling runner.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} The immersive cultural story.
 */
export async function runStory(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Write an immersive cultural story for ${destination}. Make it emotional, historical, sensory, and respectful. Avoid Wikipedia tone.`;
  const result = await generateText({ prompt, system, temperature: 0.95 }, fallbackStory(destination));
  return { data: { destination, story: result.data }, source: result.source };
}

/**
 * AI custom itinerary runner.
 * @param {Object} body - Request parameters including budget, hours, and interests.
 * @returns {Promise<Object>} The tailored 1-day itinerary.
 */
export async function runItinerary(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Return JSON one-day itinerary for ${destination}. Inputs: budget=${body.budget || "Mid-range"}, hours=${body.hours || "10"}, walkingPreference=${body.walkingPreference || "Moderate"}, interests=${body.interests || "culture, food, hidden gems"}. Include summary, morning, afternoon, evening, night, totalEstimatedBudget, transportSuggestion.`;
  return generateJson({ prompt, system }, fallbackItinerary(body));
}

/**
 * AI translation phrasebook runner.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} The phrase translation categories.
 */
export async function runPhrases(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Return JSON phrasebook for ${destination}: language, note, basics, taxi, restaurant, shopping, emergency. Each phrase object needs english, local, pronunciation.`;
  return generateJson({ prompt, system }, fallbackPhrases(destination));
}

/**
 * AI culture quiz runner.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} The 5-question multiple choice quiz.
 */
export async function runQuiz(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Return JSON culture quiz for ${destination} with exactly 5 questions. Each question has question, options array of 4, answerIndex, explanation.`;
  return generateJson({ prompt, system }, fallbackQuiz(destination));
}

/**
 * AI multi-turn chat assistant runner.
 * @param {Object} body - Request body containing 'messages' history.
 * @returns {Promise<Object>} The conversational assistant reply.
 */
export async function runChat(body) {
  const messages = Array.isArray(body.messages) ? body.messages : [{ role: "user", content: body.question || "" }];
  const fallbackQuestion = messages[messages.length - 1]?.content || "";
  const result = await generateChat({ system, messages }, fallbackChat(fallbackQuestion));
  return { data: { reply: result.data }, source: result.source };
}

/**
 * AI local traditional food and events explorer runner.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} Food and local event guidelines.
 */
export async function runFoodAndEvents(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Return JSON for ${destination} with food and events. Include food traditionalDishes, streetFood, vegetarianOptions, seasonalFoods, desserts, foodEtiquette, foodsToAvoid and events festivals, markets, workshops, musicEvents, artExhibitions, seasonalEvents.`;
  const fallback = { food: fallbackFood(destination), events: fallbackEvents(destination) };
  return generateJson({ prompt, system }, fallback);
}

/**
 * AI cultural etiquette action checker.
 * @param {Object} body - Request parameters including 'destination' and 'action'.
 * @returns {Promise<Object>} The etiquette check evaluation (GREEN, YELLOW, or RED status).
 */
export async function runEtiquetteCheck(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const action = String(body.action || "").trim();
  if (action.length < 3) return invalid("Enter a planned action to check.");
  const prompt = `Evaluate the cultural appropriateness of this action in ${destination}: "${action}". Return JSON with: destination, action, status (strictly "GREEN" for respectful, "YELLOW" for neutral/caution, "RED" for taboo/rude), and explanation (one simple clear sentence showing local rationale).`;
  return generateJson({ prompt, system }, fallbackEtiquetteCheck(destination, action));
}

/**
 * AI money-saving hacks cheat sheet.
 * @param {Object} body - Request body containing 'destination'.
 * @returns {Promise<Object>} The savings cheat sheet.
 */
export async function runSavingCheats(body) {
  const destination = getValidatedDestination(body);
  if (!destination) return invalid("Enter a destination.");
  const prompt = `Generate a local money-saving cheat sheet for ${destination}. Return JSON with destination, and cheats array containing exactly 5 items. Each item is an object with title (short punchy title) and hack (one clear sentence detailing a specific local savings tip or avoiding a tourist trap).`;
  return generateJson({ prompt, system }, fallbackSavingCheats(destination));
}

/**
 * Wraps routes with standardized error handling and request parsing.
 * @param {Request} request - Next.js HTTP Request object.
 * @param {Function} runner - The designated AI runner function to invoke.
 * @returns {Promise<Response>} The HTTP Response.
 */
export async function jsonRoute(request, runner) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await runner(body);
    if (result.error) return Response.json({ error: result.error }, { status: result.status || 400 });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message || "Request failed" }, { status: 500 });
  }
}

