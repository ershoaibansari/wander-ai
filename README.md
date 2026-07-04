# WanderAI

Discover places like a local, not a tourist.

WanderAI is a production-ready AI-powered travel micro-app for PromptWars / Build with AI. It uses the existing Auth.js Credential Provider, existing Firebase Firestore and Storage config, and secure server-side Gemini API routes.

## Highlights

- Demo login with five preloaded hackathon traveler profiles.
- Dashboard, Discover, Destination Details, AI Story, Itinerary, Community Feed, Saved Trips, Trip History, Passport, Badges, Profile, and Settings pages.
- Server-side Gemini endpoints for discovery, storytelling, itineraries, culture, phrases, quizzes, and chat.
- Firestore collection constants use the required `-wander` suffix.
- Accessible UI with semantic headings, labelled controls, skip link, focus states, responsive layout, and light/dark support.
- Vitest + React Testing Library coverage for auth UI, demo login, dashboard, discover validation, community interactions, API fallback, utilities, and accessibility smoke checks.

## Environment

Copy `.env.example` to `.env` and fill in Firebase/Auth/Gemini values:

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

The app degrades gracefully to structured fallback content when Gemini is not configured, so demos remain usable offline.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Branding

Visible GDG, Hack2skill, PromptWars / Build with AI, and Gemini AI branding appears on login, dashboard, and the footer. Footer text: “Built for PromptWars using Google Gemini AI”.
