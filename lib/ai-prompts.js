import {
  fallbackChat,
  fallbackCulture,
  fallbackDiscover,
  fallbackEvents,
  fallbackFood,
  fallbackItinerary,
  fallbackPhrases,
  fallbackQuiz,
  fallbackStory,
} from "@/lib/fallback-content";
import { generateChat, generateJson, generateText } from "@/lib/gemini";
import { validateDestination } from "@/lib/utils";

const system = "You are WanderAI, a culturally respectful travel companion. Prefer authentic local experiences, heritage, etiquette, hidden gems, local food, festivals, safety, and accessibility. Never invent unsafe advice. Return concise, practical responses.";

export async function runDiscover(body) {
  const query = String(body.query || body.destination || "").trim();
  if (!validateDestination(query)) return invalid("Enter a destination or travel mood.");
  const prompt = `For "${query}", return JSON with destination, vibe, attractions, hiddenGems, neighborhoods, viewpoints, markets, experiences, localFood, festivalsEvents. Arrays should contain objects with name and useful details.`;
  return generateJson({ prompt, system }, fallbackDiscover(query));
}

export async function runCulture(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Return JSON cultural companion guidance for ${destination}: greetings, customs, religion, traditions, dressCode, photography, diningEtiquette, giftEtiquette, thingsToAvoid array, emergencyTips array.`;
  return generateJson({ prompt, system }, fallbackCulture(destination));
}

export async function runStory(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Write an immersive cultural story for ${destination}. Make it emotional, historical, sensory, and respectful. Avoid Wikipedia tone.`;
  const result = await generateText({ prompt, system, temperature: 0.95 }, fallbackStory(destination));
  return { data: { destination, story: result.data }, source: result.source };
}

export async function runItinerary(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Return JSON one-day itinerary for ${destination}. Inputs: budget=${body.budget || "Mid-range"}, hours=${body.hours || "10"}, walkingPreference=${body.walkingPreference || "Moderate"}, interests=${body.interests || "culture, food, hidden gems"}. Include summary, morning, afternoon, evening, night, totalEstimatedBudget, transportSuggestion.`;
  return generateJson({ prompt, system }, fallbackItinerary(body));
}

export async function runPhrases(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Return JSON phrasebook for ${destination}: language, note, basics, taxi, restaurant, shopping, emergency. Each phrase object needs english, local, pronunciation.`;
  return generateJson({ prompt, system }, fallbackPhrases(destination));
}

export async function runQuiz(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Return JSON culture quiz for ${destination} with exactly 5 questions. Each question has question, options array of 4, answerIndex, explanation.`;
  return generateJson({ prompt, system }, fallbackQuiz(destination));
}

export async function runChat(body) {
  const messages = Array.isArray(body.messages) ? body.messages : [{ role: "user", content: body.question || "" }];
  const fallbackQuestion = messages[messages.length - 1]?.content || "";
  const result = await generateChat({ system, messages }, fallbackChat(fallbackQuestion));
  return { data: { reply: result.data }, source: result.source };
}

export async function runFoodAndEvents(body) {
  const destination = String(body.destination || "").trim();
  if (!validateDestination(destination)) return invalid("Enter a destination.");
  const prompt = `Return JSON for ${destination} with food and events. Include food traditionalDishes, streetFood, vegetarianOptions, seasonalFoods, desserts, foodEtiquette, foodsToAvoid and events festivals, markets, workshops, musicEvents, artExhibitions, seasonalEvents.`;
  const fallback = { food: fallbackFood(destination), events: fallbackEvents(destination) };
  return generateJson({ prompt, system }, fallback);
}

function invalid(message) {
  return { error: message, status: 400 };
}

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
