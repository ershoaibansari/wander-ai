/** Every Firestore collection uses the "-wander" suffix (hackathon requirement). */
export const COLLECTIONS = {
  users: "users-wander",
  trips: "trips-wander",
  savedTrips: "savedTrips-wander",
  tripHistory: "tripHistory-wander",
  communityPosts: "communityPosts-wander",
  likes: "likes-wander",
  comments: "comments-wander",
  bookmarks: "bookmarks-wander",
  notifications: "notifications-wander",
  feedback: "feedback-wander",
  passport: "passport-wander",
  badges: "badges-wander",
  cultureQuiz: "cultureQuiz-wander",
  demoUsers: "demoUsers-wander",
};

export const STORAGE_FOLDERS = ["users", "community", "destinations", "passport", "assets"];

export const APP_NAME = "WanderAI";
export const APP_TAGLINE = "Discover places like a local, not a tourist.";
export const FOOTER_TEXT = "Built for PromptWars using Google Gemini AI";

export const TRAVEL_INTERESTS = [
  "Adventure",
  "Culture & Heritage",
  "Food & Cuisine",
  "Nature",
  "Photography",
  "Festivals",
  "Art & Museums",
  "Nightlife",
  "Wellness",
  "Shopping",
];

export const TRAVEL_STYLES = [
  "Backpacker",
  "Luxury",
  "Family",
  "Solo",
  "Couple",
  "Slow travel",
  "Digital nomad",
];

export const BUDGET_PREFERENCES = ["Budget", "Mid-range", "Premium"];

/** Badge catalog — awarded ids are stored in badges-wander. */
export const BADGE_CATALOG = {
  "first-stamp": {
    id: "first-stamp",
    emoji: "🛬",
    name: "First Landing",
    description: "Earned your first passport stamp.",
  },
  "globe-trotter": {
    id: "globe-trotter",
    emoji: "🌍",
    name: "Globe Trotter",
    description: "Collected 3 or more passport stamps.",
  },
  "curious-mind": {
    id: "curious-mind",
    emoji: "📚",
    name: "Curious Mind",
    description: "Completed your first culture quiz.",
  },
  "culture-scholar": {
    id: "culture-scholar",
    emoji: "🧠",
    name: "Culture Scholar",
    description: "Scored 4 or more on a culture quiz.",
  },
  storyteller: {
    id: "storyteller",
    emoji: "📖",
    name: "Storyteller",
    description: "Generated an immersive AI cultural story.",
  },
  "local-foodie": {
    id: "local-foodie",
    emoji: "🍜",
    name: "Local Foodie",
    description: "Explored local food with the AI food explorer.",
  },
  "community-voice": {
    id: "community-voice",
    emoji: "📸",
    name: "Community Voice",
    description: "Shared your first post with the community.",
  },
};

export const LOADING_MESSAGES = {
  discover: "Gemini is discovering amazing places...",
  story: "Generating immersive cultural story...",
  itinerary: "Preparing your itinerary...",
  hiddenGems: "Finding hidden gems...",
  passport: "Creating your cultural passport...",
  culture: "Learning local customs for you...",
  phrases: "Collecting essential local phrases...",
  quiz: "Crafting your culture quiz...",
};

export const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
