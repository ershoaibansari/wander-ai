import { jsonRoute, runChat } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runChat);
}
