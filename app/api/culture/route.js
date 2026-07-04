import { jsonRoute, runCulture } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runCulture);
}
