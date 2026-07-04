import { jsonRoute, runPhrases } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runPhrases);
}
