import { auth } from "@/session/auth";
import { addForUser } from "@/lib/db";

export const POST = auth(async function POST(req) {
  const session = req.auth;
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json().catch(() => ({}));
  if (!body.destination) return Response.json({ error: "Destination is required" }, { status: 400 });

  const rawDest = body.destination;
  const destination = typeof rawDest === "object" ? (rawDest.name || rawDest.destination || "Unknown Destination") : String(rawDest);

  const trip = await addForUser("savedTrips", session.user.id, {
    destination,
    summary: body.summary || "",
    tags: body.tags || [],
  });

  return Response.json({ success: true, trip });
});
