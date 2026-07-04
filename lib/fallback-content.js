/**
 * Offline fallbacks for every AI route. If the Gemini API is unreachable
 * (no key, network down, quota), the app degrades gracefully instead of
 * erroring — essential for a live hackathon demo.
 */

export function fallbackDiscover(query) {
  const place = query || "your destination";
  return {
    destination: place,
    vibe: `A traveler-friendly take on ${place}, mixing well-loved sights with quieter local corners.`,
    attractions: [
      { name: "Old Town walking loop", description: "Start early and follow the historic core before tour groups arrive.", bestTime: "8–10am" },
      { name: "Main viewpoint at golden hour", description: "The classic panorama — worth it despite the crowds.", bestTime: "Sunset" },
      { name: "Central heritage museum", description: "One focused hour beats a full-day museum marathon.", bestTime: "Weekday mornings" },
    ],
    hiddenGems: [
      { name: "Neighborhood morning market", description: "Where locals actually shop — arrive before 9am and follow the queues." },
      { name: "Family-run corner café", description: "Order whatever the table next to you is having." },
      { name: "The quiet parallel street", description: "One block off the main drag, prices drop and conversations start." },
    ],
    neighborhoods: [
      { name: "The old quarter", knownFor: "Heritage architecture and slow mornings" },
      { name: "The riverside district", knownFor: "Evening food stalls and local hangouts" },
    ],
    viewpoints: [{ name: "City ridge lookout", tip: "Go on foot — the walk up is half the experience." }],
    markets: [{ name: "Weekend artisan market", tip: "Bargain gently and with a smile." }],
    localFood: [
      { name: "The dish locals recommend first", description: "Ask where families eat it, not where tourists photograph it." },
      { name: "Seasonal market snack", description: "Best tried standing at the stall while it is still warm." },
    ],
    festivalsEvents: [
      { name: "Neighborhood cultural evening", description: "Small performances, food stalls, and craft tables often reveal more than headline events." },
    ],
    experiences: [
      { name: "Cook one local dish with a local", why: "Food is the fastest door into any culture." },
      { name: "Take the slowest form of public transport", why: "You see the city the way residents do." },
    ],
  };
}

export function fallbackCulture(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    greetings: `A warm, unhurried greeting goes a long way in ${place}. Learn the local hello and use it everywhere.`,
    customs: "Observe first, act second. Locals forgive honest mistakes made with visible respect.",
    religion: "Sacred sites deserve quiet voices, covered shoulders, and shoes off where indicated.",
    traditions: "Ask about seasonal traditions — most communities have one they're proud to explain.",
    dressCode: "Modest, weather-appropriate clothing works almost everywhere; carry a light scarf or cover-up.",
    photography: "Always ask before photographing people, and look for no-photo signs at religious sites.",
    diningEtiquette: "Wait to be seated or invited, try what is offered, and thank the cook directly.",
    giftEtiquette: "Small gifts from your home country are appreciated; present and receive with both hands where customary.",
    thingsToAvoid: [
      "Raising your voice in public spaces",
      "Photographing people without permission",
      "Comparing everything to your home country",
    ],
    emergencyTips: [
      "Save the local emergency number and your embassy contact offline",
      "Keep a paper copy of your accommodation address in the local language",
    ],
  };
}

export function fallbackStory(destination) {
  const place = destination || "a faraway place";
  return `The first thing you notice about ${place} is not what the guidebooks promised. It is the sound — a rhythm of daily life that has repeated itself, with small variations, for generations.

An old shopkeeper waves you in from a doorway that has watched a century pass. Their family has kept this corner through storms, celebrations, and quiet decades that history books skipped. Over something warm to drink, they tell you how their grandmother described the same street: different faces, same heartbeat.

By evening you find yourself walking slower. The monuments are beautiful, yes — but it is the in-between places that hold ${place} together: the bench where elders trade news, the bakery that sells out by nine, the alley where children invent games with nothing but chalk and imagination.

You came to see a destination. You are leaving with a story that belongs to you now, too. That is the oldest tradition of ${place}: it never lets a stranger leave as one.`;
}

export function fallbackItinerary({ destination, budget, hours } = {}) {
  const place = destination || "your destination";
  return {
    destination: place,
    summary: `A balanced ${hours || 10}-hour day in ${place}, pacing famous sights with local moments.`,
    morning: {
      title: "Local breakfast + old town",
      plan: `Start where the locals eat breakfast, then walk ${place}'s historic core before the crowds.`,
      estimatedCost: budget === "Premium" ? "$40" : budget === "Budget" ? "$8" : "$18",
    },
    afternoon: {
      title: "One great museum + market wander",
      plan: "Pick a single museum or landmark, then get lost (deliberately) in the nearest market district.",
      estimatedCost: budget === "Premium" ? "$60" : budget === "Budget" ? "$12" : "$30",
    },
    evening: {
      title: "Golden-hour viewpoint",
      plan: "Head to the best free viewpoint in town, arriving 45 minutes before sunset.",
      estimatedCost: "Free",
    },
    night: {
      title: "Street-food dinner",
      plan: "Eat where the queue is local, then finish with a slow walk back through lit-up streets.",
      estimatedCost: budget === "Premium" ? "$70" : budget === "Budget" ? "$10" : "$25",
    },
    totalEstimatedBudget: budget === "Premium" ? "$170" : budget === "Budget" ? "$30" : "$75",
    transportSuggestion: "Buy a day pass for public transport and walk everything under 20 minutes.",
  };
}

export function fallbackFood(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    traditionalDishes: [
      { name: "The signature staple", description: `Every region of ${place} has its own version — try at least two.` },
      { name: "The festival dish", description: "Ask when it's usually eaten; the answer is a story in itself." },
    ],
    streetFood: [{ name: "The market classic", description: "Follow the longest local queue at lunchtime." }],
    vegetarianOptions: [{ name: "The vegetable specialty", description: "Ask for the local phrase for 'no meat' — it opens menus." }],
    seasonalFoods: [{ name: "What's in season now", description: "Market stalls tell you the season better than any calendar." }],
    desserts: [{ name: "The traditional sweet", description: "Usually paired with tea or coffee and a long conversation." }],
    foodEtiquette: ["Finish what you take", "Compliment the cook directly", "Watch how locals use utensils before you start"],
    foodsToAvoid: ["Anything lukewarm that should be hot", "Peeled fruit you didn't peel yourself (when unsure of water quality)"],
  };
}

export function fallbackEvents(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    festivals: [
      { name: "The main seasonal festival", when: "Check local dates", description: `The biggest celebration in ${place} — book accommodation early.` },
    ],
    markets: [{ name: "Weekly artisan market", when: "Weekend mornings", description: "Handmade goods and street snacks." }],
    workshops: [{ name: "Traditional craft workshop", when: "Most afternoons", description: "Small-group sessions run by local artisans." }],
    musicEvents: [{ name: "Local live-music night", when: "Fridays", description: "Ask your host where residents actually go." }],
    artExhibitions: [{ name: "Contemporary local artists", when: "Ongoing", description: "Smaller galleries beat the blockbuster shows." }],
    seasonalEvents: [{ name: "Season-opening celebration", when: "Seasonal", description: "Harvests, lights, or flowers depending on the month." }],
  };
}

export function fallbackPhrases(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    language: "Local language",
    note: `Even a mispronounced phrase earns smiles in ${place}. These transliterations get you close.`,
    basics: [
      { english: "Hello", local: "(local greeting)", pronunciation: "Ask a local to teach you — it's a great icebreaker" },
      { english: "Thank you", local: "(local thanks)", pronunciation: "The single most useful phrase to master" },
      { english: "Sorry / Excuse me", local: "(local apology)", pronunciation: "Softens every interaction" },
      { english: "Please", local: "(local please)", pronunciation: "Pair with a smile" },
    ],
    taxi: [{ english: "Please take me to this address", local: "(show written address)", pronunciation: "Keep addresses saved in the local script" }],
    restaurant: [
      { english: "The bill, please", local: "(local phrase)", pronunciation: "A universal writing-in-air gesture also works" },
      { english: "It was delicious", local: "(local phrase)", pronunciation: "Cooks remember travelers who say this" },
    ],
    shopping: [{ english: "How much is this?", local: "(local phrase)", pronunciation: "Learn the numbers 1–10 first" }],
    emergency: [
      { english: "Help!", local: "(local phrase)", pronunciation: "Also save the local emergency number" },
      { english: "I need a doctor", local: "(local phrase)", pronunciation: "Keep it written down as backup" },
    ],
  };
}

export function fallbackQuiz(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    questions: [
      {
        question: `What's the most respectful way to greet an elder in ${place}?`,
        options: ["A loud, friendly shout", "The traditional local greeting, unhurried", "A quick nod while walking past", "A handshake with sunglasses on"],
        answerIndex: 1,
        explanation: "Almost every culture rewards a calm, deliberate greeting offered with full attention.",
      },
      {
        question: "Before photographing a person at a local market, you should…",
        options: ["Shoot quickly before they notice", "Ask permission first", "Use a zoom lens from far away", "Photograph only their stall"],
        answerIndex: 1,
        explanation: "Asking first is universal courtesy — and usually leads to better photos and conversations.",
      },
      {
        question: "At a religious site, the safest etiquette is to…",
        options: ["Follow what respectful locals do", "Keep your shoes on for hygiene", "Take a phone call quietly", "Touch artifacts gently"],
        answerIndex: 0,
        explanation: "Observing and mirroring respectful locals works in every tradition.",
      },
      {
        question: "The best place to try authentic local food is usually…",
        options: ["The restaurant with the biggest English sign", "Wherever locals are queuing", "The hotel buffet", "An international chain"],
        answerIndex: 1,
        explanation: "A local queue is the most honest restaurant review in the world.",
      },
      {
        question: "If you accidentally break a local custom, you should…",
        options: ["Pretend it didn't happen", "Apologize sincerely and adjust", "Explain how it's done in your country", "Leave immediately"],
        answerIndex: 1,
        explanation: "A sincere apology plus visible effort to adapt is respected everywhere.",
      },
    ],
  };
}

export function fallbackChat(question) {
  return `I couldn't reach Gemini just now, but here's a reliable rule of thumb: observe what respectful locals do and mirror it. For "${(question || "your question").slice(0, 80)}" — ask your host or accommodation staff too; they love sharing local knowledge. Please try me again in a moment!`;
}
