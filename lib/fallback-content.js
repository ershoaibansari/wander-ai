/**
 * Offline fallbacks for every AI route. If the Gemini API is unreachable
 * (no key, network down, quota), the app degrades gracefully instead of
 * erroring — essential for a live hackathon demo.
 */

/**
 * Offline fallback generator for destination discovery.
 * @param {string} query - The target destination query.
 * @returns {Object} Structured destination details fallback.
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

/**
 * Offline fallback generator for cultural customs guide.
 * @param {string} destination - The target city or country.
 * @returns {Object} Structured cultural customs guide fallback.
 */
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

/**
 * Offline fallback generator for storytelling content.
 * @param {string} destination - The target city or country.
 * @returns {string} Plain-text immersive story fallback.
 */
export function fallbackStory(destination) {
  const place = destination || "a faraway place";
  return `The first thing you notice about ${place} is not what the guidebooks promised. It is the sound — a rhythm of daily life that has repeated itself, with small variations, for generations.

An old shopkeeper waves you in from a doorway that has watched a century pass. Their family has kept this corner through storms, celebrations, and quiet decades that history books skipped. Over something warm to drink, they tell you how their grandmother described the same street: different faces, same heartbeat.

By evening you find yourself walking slower. The monuments are beautiful, yes — but it is the in-between places that hold ${place} together: the bench where elders trade news, the bakery that sells out by nine, the alley where children invent games with nothing but chalk and imagination.

You came to see a destination. You are leaving with a story that belongs to you now, too. That is the oldest tradition of ${place}: it never lets a stranger leave as one.`;
}

/**
 * Offline fallback generator for custom one-day itinerary.
 * @param {Object} [config] - Itinerary options including destination, budget, and hours.
 * @returns {Object} Structured itinerary fallback.
 */
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

/**
 * Offline fallback generator for traditional food recommendations.
 * @param {string} destination - The target destination.
 * @returns {Object} Structured local food options fallback.
 */
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

/**
 * Offline fallback generator for seasonal local events.
 * @param {string} destination - The target destination.
 * @returns {Object} Structured local events fallback.
 */
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

/**
 * Offline fallback generator for local translation phrasebooks.
 * @param {string} destination - The target destination.
 * @returns {Object} Structured basic phrases translation catalog.
 */
export function fallbackPhrases(destination) {
  const place = (destination || "").toLowerCase().trim();
  
  const dict = {
    thailand: {
      language: "Thai",
      basics: [
        { english: "Hello", local: "Sawatdee", pronunciation: "Sah-wah-dee" },
        { english: "Thank you", local: "Khop khun", pronunciation: "Kob-koon" },
        { english: "Sorry / Excuse me", local: "Khor thoad", pronunciation: "Kor-toad" },
        { english: "Please", local: "Khrap / Ka", pronunciation: "Krup / Kah" },
      ],
      taxi: [{ english: "Please take me to this address", local: "Chouy pha bai tee nee", pronunciation: "Chewy-pah-pai-tee-nee" }],
      restaurant: [
        { english: "The bill, please", local: "Chek bin duay", pronunciation: "Check-bin-duay" },
        { english: "It was delicious", local: "Aroy", pronunciation: "Ah-roy" },
      ],
      shopping: [{ english: "How much is this?", local: "Tao rai", pronunciation: "Tao-rye" }],
      emergency: [
        { english: "Help!", local: "Chuay duay", pronunciation: "Chewy-duay" },
        { english: "I need a doctor", local: "Tong karn mor", pronunciation: "Tong-karn-mor" },
      ],
    },
    japan: {
      language: "Japanese",
      basics: [
        { english: "Hello", local: "Konnichiwa", pronunciation: "Kon-nee-chee-wah" },
        { english: "Thank you", local: "Arigatou gozaimasu", pronunciation: "Ah-ree-gah-toe go-zye-mass" },
        { english: "Sorry / Excuse me", local: "Sumimasen", pronunciation: "Su-mee-mah-sen" },
        { english: "Please", local: "Onegashimasu", pronunciation: "Oh-nay-gaye-she-mass" },
      ],
      taxi: [{ english: "Please take me to this address", local: "Koko made onegaishimasu", pronunciation: "Ko-ko mah-day oh-nay-gaye-she-mass" }],
      restaurant: [
        { english: "The bill, please", local: "Okaikei onegaishimasu", pronunciation: "Oh-kye-kay oh-nay-gaye-she-mass" },
        { english: "It was delicious", local: "Oishikatta desu", pronunciation: "Oy-shee-kat-tah dess" },
      ],
      shopping: [{ english: "How much is this?", local: "Ikura desu ka?", pronunciation: "Ee-koo-rah dess kah?" }],
      emergency: [
        { english: "Help!", local: "Tasukete!", pronunciation: "Tah-soo-kay-tay!" },
        { english: "I need a doctor", local: "Isha ga hitsuyo desu", pronunciation: "Ee-shah gah heet-syo dess" },
      ],
    },
    spain: {
      language: "Spanish",
      basics: [
        { english: "Hello", local: "Hola", pronunciation: "Oh-lah" },
        { english: "Thank you", local: "Gracias", pronunciation: "Grah-syahs" },
        { english: "Sorry / Excuse me", local: "Perdón", pronunciation: "Pair-dohn" },
        { english: "Please", local: "Por favor", pronunciation: "Por fah-vor" },
      ],
      taxi: [{ english: "Please take me to this address", local: "Lléveme a esta dirección", pronunciation: "Yay-veh-meh ah ess-tah dee-rek-syohn" }],
      restaurant: [
        { english: "The bill, please", local: "La cuenta, por favor", pronunciation: "Lah kwen-tah por fah-vor" },
        { english: "It was delicious", local: "Estuvo delicioso", pronunciation: "Ess-too-vo day-lee-syoh-so" },
      ],
      shopping: [{ english: "How much is this?", local: "¿Cuánto cuesta?", pronunciation: "Kwan-toe kwess-tah" }],
      emergency: [
        { english: "Help!", local: "¡Ayuda!", pronunciation: "Ah-yoo-dah!" },
        { english: "I need a doctor", local: "Necesito un médico", pronunciation: "Nay-say-see-toe oon meh-dee-ko" },
      ],
    },
    france: {
      language: "French",
      basics: [
        { english: "Hello", local: "Bonjour", pronunciation: "Bon-zhoor" },
        { english: "Thank you", local: "Merci", pronunciation: "Mair-see" },
        { english: "Sorry / Excuse me", local: "Pardon", pronunciation: "Par-dohn" },
        { english: "Please", local: "S'il vous plaît", pronunciation: "Seel voo play" },
      ],
      taxi: [{ english: "Please take me to this address", local: "À cette adresse, s'il vous plaît", pronunciation: "Ah set ah-dress seel voo play" }],
      restaurant: [
        { english: "The bill, please", local: "L'addition, s'il vous plaît", pronunciation: "Lah-dee-syohn seel voo play" },
        { english: "It was delicious", local: "C'était délicieux", pronunciation: "Say-tay day-lee-syuh" },
      ],
      shopping: [{ english: "How much is this?", local: "C'est combien?", pronunciation: "Say kom-byan?" }],
      emergency: [
        { english: "Help!", local: "Au secours!", pronunciation: "Oh suh-koor!" },
        { english: "I need a doctor", local: "J'ai besoin d'un médecin", pronunciation: "Zhay buh-zwan dun mayd-san" },
      ],
    },
    italy: {
      language: "Italian",
      basics: [
        { english: "Hello", local: "Ciao", pronunciation: "Chow" },
        { english: "Thank you", local: "Grazie", pronunciation: "Graht-see-ay" },
        { english: "Sorry / Excuse me", local: "Scusa", pronunciation: "Skoo-zah" },
        { english: "Please", local: "Per favore", pronunciation: "Pair fah-vor-ay" },
      ],
      taxi: [{ english: "Please take me to this address", local: "A questo indirizzo, per favore", pronunciation: "Ah kwess-toe een-dee-reet-so pair fah-vor-ay" }],
      restaurant: [
        { english: "Il conto, per favore", local: "Il conto, per favore", pronunciation: "Eel kon-toe pair fah-vor-ay" },
        { english: "It was delicious", local: "Era delizioso", pronunciation: "Eh-rah day-leet-tsyo-zo" },
      ],
      shopping: [{ english: "How much is this?", local: "Quanto costa?", pronunciation: "Kwan-toe kos-tah?" }],
      emergency: [
        { english: "Help!", local: "Aiuto!", pronunciation: "Ah-yoo-toe!" },
        { english: "I need a doctor", local: "Ho bisogno di un medico", pronunciation: "Oh bee-zon-yo dee oon meh-dee-ko" },
      ],
    },
    india: {
      language: "Hindi",
      basics: [
        { english: "Hello", local: "Namaste", pronunciation: "Nah-mah-stay" },
        { english: "Thank you", local: "Shukriya", pronunciation: "Shook-ree-yah" },
        { english: "Sorry / Excuse me", local: "Maaf kijiye", pronunciation: "Mahf kee-jee-yay" },
        { english: "Please", local: "Kripya", pronunciation: "Krip-yah" },
      ],
      taxi: [{ english: "Please take me to this address", local: "Mujhe is pate par le chaliye", pronunciation: "Moo-jay ees pat-ay par lay chah-lee-yay" }],
      restaurant: [
        { english: "The bill, please", local: "Bill de dijiye", pronunciation: "Bill day dee-jee-yay" },
        { english: "It was delicious", local: "Swaadist tha", pronunciation: "Swah-disht thah" },
      ],
      shopping: [{ english: "How much is this?", local: "Yeh kitne ka hai?", pronunciation: "Yay kit-nay kah hay?" }],
      emergency: [
        { english: "Help!", local: "Bachao!", pronunciation: "Bah-chow!" },
        { english: "I need a doctor", local: "Mujhe doctor chahiye", pronunciation: "Moo-jay doc-tor chah-hee-yay" },
      ],
    },
    default: {
      language: "English (Universal)",
      basics: [
        { english: "Hello", local: "Hello", pronunciation: "Heh-low" },
        { english: "Thank you", local: "Thank you", pronunciation: "Thank-you" },
        { english: "Sorry / Excuse me", local: "Sorry", pronunciation: "Sah-ree" },
        { english: "Please", local: "Please", pronunciation: "Pleez" },
      ],
      taxi: [{ english: "Please take me to this address", local: "Please take me here", pronunciation: "Pleez take me here" }],
      restaurant: [
        { english: "The bill, please", local: "Check, please", pronunciation: "Chek pleez" },
        { english: "It was delicious", local: "Delicious", pronunciation: "Deh-lish-us" },
      ],
      shopping: [{ english: "How much is this?", local: "How much?", pronunciation: "How much?" }],
      emergency: [
        { english: "Help!", local: "Help!", pronunciation: "Help!" },
        { english: "I need a doctor", local: "I need a doctor", pronunciation: "I need a doctor" },
      ],
    }
  };

  const match = dict[place] || dict.default;
  const defaultDest = destination || "India";
  
  return {
    destination: defaultDest,
    language: match.language,
    note: `Even a mispronounced phrase earns smiles in ${defaultDest}. These transliterations get you close.`,
    basics: match.basics,
    taxi: match.taxi,
    restaurant: match.restaurant,
    shopping: match.shopping,
    emergency: match.emergency,
  };
}

/**
 * Offline fallback generator for 5-question culture quiz.
 * @param {string} destination - The target destination.
 * @returns {Object} Structured quiz catalog with options and explanations.
 */
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

/**
 * Offline fallback generator for the cultural etiquette checker.
 * @param {string} destination - The target city or country.
 * @param {string} action - The action to check.
 * @returns {Object} Structured fallback response containing explanation and status.
 */
export function fallbackEtiquetteCheck(destination, action) {
  const place = destination || "this destination";
  const act = action || "this action";
  return {
    destination: place,
    action: act,
    status: "YELLOW",
    explanation: `Offline check: For "${act}" in ${place}, observe local residents first. When in doubt, ask your host or guide politely. Modesty and respect are always safe.`,
  };
}

/**
 * Offline fallback generator for the local money-saving cheats.
 * @param {string} destination - The target destination.
 * @returns {Object} Structured list of savings cheats.
 */
export function fallbackSavingCheats(destination) {
  const place = destination || "this destination";
  return {
    destination: place,
    cheats: [
      { title: "Look for local queues", hack: "Eat where you see local families and workers lining up. It is always cheaper and more authentic than places with English menus outside." },
      { title: "Use regional transit", hack: "Opt for buses, trains, or shared local transport rather than booking private taxis or hotel shuttles." },
      { title: "Buy at neighborhood markets", hack: "Stock up on fresh fruit, water, and snacks at local grocery stores or morning street markets instead of convenience stores in tourist centers." },
      { title: "Ask about package passes", hack: "Check if the city offers combined transit or museum passes, which can save up to 40% on entrance and travel costs." },
      { title: "Drink like a local", hack: "In places like Italy, drink coffee standing up at the bar; in other countries, drink local tap/filter options where safe instead of expensive imported bottles." }
    ]
  };
}

