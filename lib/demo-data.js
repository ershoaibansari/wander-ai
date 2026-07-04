/**
 * Predefined hackathon demo travelers with preloaded trips, passport stamps,
 * badges, quiz results and community posts. Seeded into Firestore on first
 * demo login and used as a read fallback so the judge demo never breaks.
 */

export const DEMO_USERS = [
  {
    id: "demo-alex",
    name: "Alex Carter",
    email: "alex@demo.wanderai.app",
    role: "Adventure Traveler",
    country: "Canada",
    travelStyle: "Hiking, mountains, hidden nature spots",
    favoriteDestination: "Nepal",
    description:
      "Loves discovering scenic trails, viewpoints, and offbeat adventure locations.",
    interests: ["Adventure", "Nature", "Photography"],
    budget: "Mid-range",
    avatar: "/avatars/demo-alex.svg",
    savedTrips: [
      {
        id: "demo-alex-trip-1",
        destination: "Annapurna Foothills, Nepal",
        country: "Nepal",
        summary:
          "A five-day teahouse loop through rhododendron forests to the Poon Hill sunrise viewpoint.",
        tags: ["Trekking", "Sunrise", "Teahouses"],
        createdAt: 1748750400000,
      },
      {
        id: "demo-alex-trip-2",
        destination: "Banff Backcountry, Canada",
        country: "Canada",
        summary:
          "Hidden alpine lakes beyond Moraine — quiet trails locals keep to themselves.",
        tags: ["Hiking", "Lakes", "Wildlife"],
        createdAt: 1750824000000,
      },
    ],
    tripHistory: [
      {
        id: "demo-alex-hist-1",
        destination: "Patagonia, Argentina",
        visitedAt: "2025-11-08",
        highlight: "Dawn light on the Fitz Roy massif after a 4am start.",
        createdAt: 1762560000000,
      },
      {
        id: "demo-alex-hist-2",
        destination: "Lauterbrunnen, Switzerland",
        visitedAt: "2025-06-14",
        highlight: "Counted 14 waterfalls in one valley walk.",
        createdAt: 1749859200000,
      },
    ],
    passportStamps: [
      { destination: "Nepal", country: "Nepal", emoji: "🏔️", createdAt: 1741089600000 },
      { destination: "Patagonia", country: "Argentina", emoji: "🗻", createdAt: 1762560000000 },
      { destination: "Lauterbrunnen", country: "Switzerland", emoji: "⛰️", createdAt: 1749859200000 },
    ],
    badges: ["first-stamp", "globe-trotter"],
    quizResults: [
      {
        destination: "Nepal",
        score: 4,
        total: 5,
        createdAt: 1741176000000,
      },
    ],
    communityPosts: [
      {
        id: "demo-post-alex",
        destination: "Poon Hill, Nepal",
        title: "Sunrise above Poon Hill",
        body: "Left the teahouse at 4:30am with a borrowed headlamp. An hour of stone steps, then the Annapurnas caught fire one summit at a time. A local guide told me the quiet ridge 10 minutes east has the same view with none of the crowd — he was right.",
        photoUrl: "/community/mountains.svg",
        tags: ["Hidden gem", "Trekking"],
        likeCount: 24,
        commentCount: 3,
        createdAt: 1741262400000,
      },
    ],
  },
  {
    id: "demo-emily",
    name: "Emily Rose",
    email: "emily@demo.wanderai.app",
    role: "Culture Explorer",
    country: "United Kingdom",
    travelStyle: "Museums, heritage, local traditions",
    favoriteDestination: "Kyoto",
    description:
      "Explores destinations through history, customs, rituals, and storytelling.",
    interests: ["Culture & Heritage", "Art & Museums", "Festivals"],
    budget: "Mid-range",
    avatar: "/avatars/demo-emily.svg",
    savedTrips: [
      {
        id: "demo-emily-trip-1",
        destination: "Kyoto, Japan",
        country: "Japan",
        summary:
          "A slow week of temples, tea ceremonies, and evening walks through Gion's lantern-lit lanes.",
        tags: ["Temples", "Tea ceremony", "Heritage"],
        createdAt: 1747540800000,
      },
      {
        id: "demo-emily-trip-2",
        destination: "Istanbul Old City, Türkiye",
        country: "Türkiye",
        summary:
          "Byzantine mosaics by morning, call to prayer over the Bosphorus by dusk.",
        tags: ["History", "Architecture", "Markets"],
        createdAt: 1750305600000,
      },
    ],
    tripHistory: [
      {
        id: "demo-emily-hist-1",
        destination: "Rome, Italy",
        visitedAt: "2025-09-20",
        highlight: "A near-empty Pantheon at opening time on a rainy Tuesday.",
        createdAt: 1758326400000,
      },
      {
        id: "demo-emily-hist-2",
        destination: "Athens, Greece",
        visitedAt: "2024-05-11",
        highlight: "Reading Herodotus on a bench below the Acropolis.",
        createdAt: 1715385600000,
      },
    ],
    passportStamps: [
      { destination: "Kyoto", country: "Japan", emoji: "⛩️", createdAt: 1730462400000 },
      { destination: "Rome", country: "Italy", emoji: "🏛️", createdAt: 1758326400000 },
      { destination: "Athens", country: "Greece", emoji: "🏺", createdAt: 1715385600000 },
    ],
    badges: ["first-stamp", "curious-mind", "culture-scholar"],
    quizResults: [
      {
        destination: "Kyoto",
        score: 5,
        total: 5,
        createdAt: 1730548800000,
      },
    ],
    communityPosts: [
      {
        id: "demo-post-emily",
        destination: "Gion, Kyoto",
        title: "Tea ceremony in a Gion machiya",
        body: "An 80-year-old tea master corrected my bow three times, then poured the most deliberate cup of matcha I've ever tasted. Etiquette tip she shared: turn the bowl clockwise twice before drinking — the front of the bowl faces you as a courtesy, and you honour it by not drinking from it.",
        photoUrl: "/community/temple.svg",
        tags: ["Culture", "Etiquette"],
        likeCount: 41,
        commentCount: 5,
        createdAt: 1730635200000,
      },
    ],
  },
  {
    id: "demo-rahul",
    name: "Rahul Mehta",
    email: "rahul@demo.wanderai.app",
    role: "Backpacker",
    country: "India",
    travelStyle: "Budget travel, local food, public transport",
    favoriteDestination: "Vietnam",
    description:
      "Finds affordable routes, street food, and authentic local experiences.",
    interests: ["Food & Cuisine", "Adventure", "Nature"],
    budget: "Budget",
    avatar: "/avatars/demo-rahul.svg",
    savedTrips: [
      {
        id: "demo-rahul-trip-1",
        destination: "Hanoi Old Quarter, Vietnam",
        country: "Vietnam",
        summary:
          "A street-food crawl mapped entirely by plastic-stool density — under $10 a day.",
        tags: ["Street food", "Budget", "Markets"],
        createdAt: 1746936000000,
      },
      {
        id: "demo-rahul-trip-2",
        destination: "Da Nang to Hoi An, Vietnam",
        country: "Vietnam",
        summary:
          "The local yellow bus route #1 — 45 minutes, 30,000 dong, and better views than any tour.",
        tags: ["Public transport", "Coast", "Budget"],
        createdAt: 1749787200000,
      },
    ],
    tripHistory: [
      {
        id: "demo-rahul-hist-1",
        destination: "Bangkok, Thailand",
        visitedAt: "2025-01-18",
        highlight: "Boat noodles by the khlong for 20 baht a bowl.",
        createdAt: 1737158400000,
      },
      {
        id: "demo-rahul-hist-2",
        destination: "Ella, Sri Lanka",
        visitedAt: "2024-08-02",
        highlight: "The slow train from Kandy — doors open, tea hills forever.",
        createdAt: 1722556800000,
      },
    ],
    passportStamps: [
      { destination: "Hanoi", country: "Vietnam", emoji: "🍜", createdAt: 1735732800000 },
      { destination: "Bangkok", country: "Thailand", emoji: "🛺", createdAt: 1737158400000 },
      { destination: "Ella", country: "Sri Lanka", emoji: "🌴", createdAt: 1722556800000 },
    ],
    badges: ["first-stamp", "local-foodie"],
    quizResults: [
      {
        destination: "Vietnam",
        score: 4,
        total: 5,
        createdAt: 1735819200000,
      },
    ],
    communityPosts: [
      {
        id: "demo-post-rahul",
        destination: "Hanoi, Vietnam",
        title: "The ₹150 pho that changed my life",
        body: "Skip the places with English menus. Found a family stall behind Dong Xuan market where grandma has been making the same beef pho for 40 years. Sit on the tiny stool, point at what the regulars have, and say 'cảm ơn' when it arrives. Best meal of the entire trip.",
        photoUrl: "/community/streetfood.svg",
        tags: ["Local food", "Budget"],
        likeCount: 38,
        commentCount: 6,
        createdAt: 1736078400000,
      },
    ],
  },
  {
    id: "demo-sophia",
    name: "Sophia Martinez",
    email: "sophia@demo.wanderai.app",
    role: "Luxury Traveler",
    country: "Spain",
    travelStyle: "Premium stays, curated events, fine dining",
    favoriteDestination: "Paris",
    description:
      "Prefers elegant cultural experiences, art, architecture, and premium local events.",
    interests: ["Art & Museums", "Food & Cuisine", "Wellness"],
    budget: "Premium",
    avatar: "/avatars/demo-sophia.svg",
    savedTrips: [
      {
        id: "demo-sophia-trip-1",
        destination: "Paris, France",
        country: "France",
        summary:
          "A gallery weekend: private Marais ateliers, a Musée d'Orsay evening opening, and a cellar dinner in Montmartre.",
        tags: ["Art", "Fine dining", "Events"],
        createdAt: 1748145600000,
      },
      {
        id: "demo-sophia-trip-2",
        destination: "Amalfi Coast, Italy",
        country: "Italy",
        summary:
          "Cliffside suites, lemon-grove lunches, and a chartered evening sail past Positano.",
        tags: ["Luxury", "Coast", "Wellness"],
        createdAt: 1751083200000,
      },
    ],
    tripHistory: [
      {
        id: "demo-sophia-hist-1",
        destination: "Vienna, Austria",
        visitedAt: "2025-12-30",
        highlight: "A New Year's opera gala at the Staatsoper.",
        createdAt: 1767052800000,
      },
      {
        id: "demo-sophia-hist-2",
        destination: "Dubai, UAE",
        visitedAt: "2025-03-05",
        highlight: "Desert dinner under the stars after a falconry display.",
        createdAt: 1741132800000,
      },
    ],
    passportStamps: [
      { destination: "Paris", country: "France", emoji: "🗼", createdAt: 1739448000000 },
      { destination: "Vienna", country: "Austria", emoji: "🎻", createdAt: 1767052800000 },
      { destination: "Dubai", country: "UAE", emoji: "🏙️", createdAt: 1741132800000 },
    ],
    badges: ["first-stamp", "globe-trotter", "curious-mind"],
    quizResults: [
      {
        destination: "Paris",
        score: 5,
        total: 5,
        createdAt: 1739534400000,
      },
    ],
    communityPosts: [
      {
        id: "demo-post-sophia",
        destination: "Montmartre, Paris",
        title: "A private cellar dinner in Montmartre",
        body: "Eight guests, one chef, a 17th-century vaulted cellar the owner's family has kept since the Revolution. Between courses he told stories about the vineyard on the hill above — yes, Paris still has one, and its harvest festival in October is the city's best-kept secret.",
        photoUrl: "/community/paris.svg",
        tags: ["Fine dining", "Hidden gem"],
        likeCount: 52,
        commentCount: 4,
        createdAt: 1739620800000,
      },
    ],
  },
  {
    id: "demo-yuki",
    name: "Yuki Tanaka",
    email: "yuki@demo.wanderai.app",
    role: "Food Explorer",
    country: "Japan",
    travelStyle: "Street food, traditional cuisine, cooking culture",
    favoriteDestination: "Thailand",
    description:
      "Loves discovering local dishes, food markets, and cultural dining etiquette.",
    interests: ["Food & Cuisine", "Culture & Heritage", "Photography"],
    budget: "Mid-range",
    avatar: "/avatars/demo-yuki.svg",
    savedTrips: [
      {
        id: "demo-yuki-trip-1",
        destination: "Bangkok, Thailand",
        country: "Thailand",
        summary:
          "Floating-market mornings and a boat-noodle pilgrimage across three districts.",
        tags: ["Street food", "Markets", "Boats"],
        createdAt: 1747022400000,
      },
      {
        id: "demo-yuki-trip-2",
        destination: "Chiang Mai, Thailand",
        country: "Thailand",
        summary:
          "A cooking-class trail: khao soi with a farm family, then the Sunday walking-street market.",
        tags: ["Cooking class", "Local cuisine"],
        createdAt: 1750392000000,
      },
    ],
    tripHistory: [
      {
        id: "demo-yuki-hist-1",
        destination: "Tainan, Taiwan",
        visitedAt: "2025-10-12",
        highlight: "Milkfish congee at 6am with the temple morning crowd.",
        createdAt: 1760227200000,
      },
      {
        id: "demo-yuki-hist-2",
        destination: "Jeonju, South Korea",
        visitedAt: "2025-04-19",
        highlight: "Learning bibimbap from a hanok grandmother.",
        createdAt: 1745020800000,
      },
    ],
    passportStamps: [
      { destination: "Bangkok", country: "Thailand", emoji: "🥭", createdAt: 1738238400000 },
      { destination: "Tainan", country: "Taiwan", emoji: "🥟", createdAt: 1760227200000 },
      { destination: "Jeonju", country: "South Korea", emoji: "🍲", createdAt: 1745020800000 },
    ],
    badges: ["first-stamp", "local-foodie", "curious-mind"],
    quizResults: [
      {
        destination: "Thailand",
        score: 4,
        total: 5,
        createdAt: 1738324800000,
      },
    ],
    communityPosts: [
      {
        id: "demo-post-yuki",
        destination: "Bangkok, Thailand",
        title: "The aunty who taught me som tam",
        body: "At Or Tor Kor market, the som tam vendor saw me watching and handed me the pestle. Three tries, a lot of laughing, one perfect plate. Dining etiquette I learned: in Thailand the fork never goes in your mouth — it only pushes food onto the spoon.",
        photoUrl: "/community/market.svg",
        tags: ["Local food", "Etiquette"],
        likeCount: 47,
        commentCount: 7,
        createdAt: 1738411200000,
      },
    ],
  },
];

export function getDemoUserById(id) {
  return DEMO_USERS.find((user) => user.id === id) ?? null;
}

export function isDemoUserId(id) {
  return typeof id === "string" && id.startsWith("demo-") && Boolean(getDemoUserById(id));
}

/** Flattened community posts from all demo users, newest first. */
export function getDemoCommunityPosts() {
  return DEMO_USERS.flatMap((user) =>
    user.communityPosts.map((post) => ({
      ...post,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
    }))
  ).sort((a, b) => b.createdAt - a.createdAt);
}
