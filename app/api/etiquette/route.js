import { jsonRoute, runEtiquetteCheck } from "@/lib/ai-prompts";

export async function POST(request) {
  return jsonRoute(request, runEtiquetteCheck);
}
