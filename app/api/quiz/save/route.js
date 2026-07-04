import { auth } from "@/session/auth";
import { saveQuizResult } from "@/lib/db";

export const POST = auth(async function POST(req) {
  const session = req.auth;
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.destination || body.score === undefined) {
    return Response.json({ error: "Destination and score are required" }, { status: 400 });
  }

  const rawDest = body.destination;
  const destination = typeof rawDest === "object" ? (rawDest.name || rawDest.destination || "Unknown Destination") : String(rawDest);

  const { result, earnedBadges } = await saveQuizResult(session.user.id, {
    destination,
    score: Number(body.score),
    total: Number(body.total || 5),
  });

  return Response.json({ success: true, result, earnedBadges });
});
