import { jsonRoute, runQuiz } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runQuiz);
}
