import { jsonRoute, runStory } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runStory);
}
