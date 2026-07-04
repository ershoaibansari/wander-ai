import { createUser, getUserByEmail } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { validateEmail, validatePassword } from "@/lib/utils";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();

  if (!name || !validateEmail(email) || !validatePassword(password)) {
    return Response.json({ error: "Invalid registration data" }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) return Response.json({ error: "User already exists" }, { status: 409 });

  const user = await createUser({
    name,
    email,
    passwordHash: hashPassword(password),
    country: String(body.country || "").trim(),
    interests: Array.isArray(body.interests) ? body.interests : [],
    travelStyle: String(body.travelStyle || "").trim(),
    budget: String(body.budget || "").trim(),
    avatar: "/avatars/demo-emily.svg",
  });

  return Response.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
