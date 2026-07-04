import { auth } from "@/session/auth";
import { addPassportStamp, listForUser, awardBadges } from "@/lib/db";

export const POST = auth(async function POST(req) {
  const session = req.auth;
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.destination) return Response.json({ error: "Destination is required" }, { status: 400 });

  const rawDest = body.destination;
  const destination = typeof rawDest === "object" ? (rawDest.name || rawDest.destination || "Unknown Destination") : String(rawDest);

  const stamp = await addPassportStamp(session.user.id, {
    destination,
    country: body.country || "",
    emoji: body.emoji || "📍",
  });

  // Query updated stamp count to award badges
  const stamps = await listForUser("passport", session.user.id);
  const earned = [];
  if (stamps.length >= 1) earned.push("first-stamp");
  if (stamps.length >= 3) earned.push("globe-trotter");
  
  if (earned.length > 0) {
    await awardBadges(session.user.id, earned);
  }

  return Response.json({ success: true, stamp, earnedBadges: earned });
});
