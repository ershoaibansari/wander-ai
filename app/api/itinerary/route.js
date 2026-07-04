import { jsonRoute, runItinerary } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runItinerary);
}
